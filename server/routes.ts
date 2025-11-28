import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { existsSync, unlinkSync, statSync, mkdirSync } from "fs";
import path from "path";
import { insertConversionJobSchema, youtubeUrlSchema, type AudioQuality } from "@shared/schema";

const TEMP_DIR = path.join(process.cwd(), "temp");

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100);
}

async function getVideoInfo(url: string): Promise<{ title: string; duration: number } | null> {
  return new Promise((resolve) => {
    const ytdlp = spawn("yt-dlp", [
      "--print", "%(title)s",
      "--print", "%(duration)s",
      "--no-playlist",
      url
    ]);

    let output = "";
    let errorOutput = "";

    ytdlp.stdout.on("data", (data) => {
      output += data.toString();
    });

    ytdlp.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        console.error("yt-dlp info error:", errorOutput);
        resolve(null);
        return;
      }

      const lines = output.trim().split("\n");
      if (lines.length >= 2) {
        const title = lines[0].trim();
        const duration = parseFloat(lines[1]) || 0;
        resolve({ title, duration });
      } else {
        resolve(null);
      }
    });
  });
}

function getYtdlpAudioQuality(quality: AudioQuality): string {
  switch (quality) {
    case "320":
      return "0";
    case "192":
      return "2";
    case "128":
    default:
      return "5";
  }
}

async function downloadAndConvert(
  url: string, 
  outputPath: string, 
  quality: AudioQuality,
  onProgress: (progress: number, stage: string) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    onProgress(10, "extracting");

    const audioQuality = getYtdlpAudioQuality(quality);
    
    const ytdlp = spawn("yt-dlp", [
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", audioQuality,
      "-o", outputPath,
      "--no-playlist",
      "--progress",
      url
    ]);

    ytdlp.stdout.on("data", (data) => {
      const output = data.toString();
      const progressMatch = output.match(/(\d+\.?\d*)%/);
      if (progressMatch) {
        const downloadProgress = parseFloat(progressMatch[1]);
        const overallProgress = 10 + (downloadProgress * 0.7);
        onProgress(Math.min(80, overallProgress), "extracting");
      }
    });

    ytdlp.stderr.on("data", (data) => {
      const output = data.toString();
      const progressMatch = output.match(/(\d+\.?\d*)%/);
      if (progressMatch) {
        const downloadProgress = parseFloat(progressMatch[1]);
        const overallProgress = 10 + (downloadProgress * 0.7);
        onProgress(Math.min(80, overallProgress), "extracting");
      }
      
      if (output.includes("Destination:") || output.includes("Post-process")) {
        onProgress(85, "converting");
      }
    });

    ytdlp.on("close", (code) => {
      if (code === 0) {
        onProgress(100, "ready");
        resolve(true);
      } else {
        resolve(false);
      }
    });

    ytdlp.on("error", () => {
      resolve(false);
    });
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/convert", async (req: Request, res: Response) => {
    try {
      const parseResult = insertConversionJobSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request body",
          details: parseResult.error.errors 
        });
      }

      const { youtubeUrl, quality } = parseResult.data;

      const urlValidation = youtubeUrlSchema.safeParse(youtubeUrl);
      if (!urlValidation.success) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }

      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        return res.status(400).json({ error: "Could not extract video ID from URL" });
      }

      const job = await storage.createConversionJob({ youtubeUrl, quality });

      (async () => {
        try {
          const videoInfo = await getVideoInfo(youtubeUrl);
          
          if (!videoInfo) {
            await storage.updateConversionJob(job.id, {
              status: "error",
              error: "Could not fetch video information. The video might be unavailable or private."
            });
            return;
          }

          const sanitizedTitle = sanitizeFilename(videoInfo.title);
          const fileName = `${sanitizedTitle}.mp3`;
          const outputPath = path.join(TEMP_DIR, `${job.id}.mp3`);

          await storage.updateConversionJob(job.id, {
            videoTitle: videoInfo.title,
            videoDuration: formatDuration(videoInfo.duration),
            fileName,
            progress: 5,
          });

          const success = await downloadAndConvert(
            youtubeUrl,
            outputPath,
            quality,
            async (progress, stage) => {
              await storage.updateConversionJob(job.id, {
                progress,
                status: stage as any,
              });
            }
          );

          if (success && existsSync(outputPath)) {
            const stats = statSync(outputPath);
            await storage.updateConversionJob(job.id, {
              status: "ready",
              progress: 100,
              fileSize: formatFileSize(stats.size),
              downloadPath: outputPath,
            });

            setTimeout(() => {
              try {
                if (existsSync(outputPath)) {
                  unlinkSync(outputPath);
                }
                storage.deleteConversionJob(job.id);
              } catch (err) {
                console.error("Cleanup error:", err);
              }
            }, 30 * 60 * 1000);
          } else {
            await storage.updateConversionJob(job.id, {
              status: "error",
              error: "Conversion failed. Please try again."
            });
          }
        } catch (err) {
          console.error("Conversion error:", err);
          await storage.updateConversionJob(job.id, {
            status: "error",
            error: "An unexpected error occurred during conversion."
          });
        }
      })();

      res.json({ id: job.id, status: job.status });
    } catch (err) {
      console.error("Convert endpoint error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/convert/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await storage.getConversionJob(id);

      if (!job) {
        return res.status(404).json({ error: "Conversion job not found" });
      }

      res.json(job);
    } catch (err) {
      console.error("Status endpoint error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/download/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await storage.getConversionJob(id);

      if (!job) {
        return res.status(404).json({ error: "Conversion job not found" });
      }

      if (job.status !== "ready") {
        return res.status(400).json({ error: "File is not ready for download" });
      }

      if (!job.downloadPath) {
        return res.status(404).json({ error: "File path not available." });
      }

      if (!existsSync(job.downloadPath)) {
        return res.status(404).json({ error: "File not found. It may have expired." });
      }

      const fileName = job.fileName || "audio.mp3";
      const filePath = job.downloadPath;
      
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
      
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("File send error:", err);
        }
      });
    } catch (err) {
      console.error("Download endpoint error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
