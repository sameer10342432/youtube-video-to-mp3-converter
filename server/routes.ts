import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { existsSync, unlinkSync, statSync, mkdirSync, createReadStream, copyFileSync, readdirSync } from "fs";
import path from "path";
import { insertConversionJobSchema, youtubeUrlSchema, type AudioQuality } from "@shared/schema";

const YTDLP_PATH = path.join(process.cwd(), process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");

const TEMP_DIR = path.join(process.cwd(), "temp");
const CACHE_DIR = path.join(TEMP_DIR, "cache");
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true });
}

function getCachedFilePath(videoId: string, quality: AudioQuality): string {
  return path.join(CACHE_DIR, videoId, `${quality}.mp3`);
}

function isCached(videoId: string, quality: AudioQuality): boolean {
  const cachePath = getCachedFilePath(videoId, quality);
  if (!existsSync(cachePath)) {
    return false;
  }
  try {
    const stats = statSync(cachePath);
    const age = Date.now() - stats.mtimeMs;
    if (age > CACHE_MAX_AGE_MS) {
      try {
        unlinkSync(cachePath);
      } catch { }
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function cacheFile(videoId: string, quality: AudioQuality, sourcePath: string): boolean {
  try {
    const videoDir = path.join(CACHE_DIR, videoId);
    if (!existsSync(videoDir)) {
      mkdirSync(videoDir, { recursive: true });
    }
    const cachePath = getCachedFilePath(videoId, quality);
    copyFileSync(sourcePath, cachePath);
    return true;
  } catch (err) {
    console.error("Cache file error:", err);
    return false;
  }
}

function cleanupOldCacheEntries(): void {
  try {
    if (!existsSync(CACHE_DIR)) return;

    const videoDirs = readdirSync(CACHE_DIR);
    for (const videoId of videoDirs) {
      const videoDir = path.join(CACHE_DIR, videoId);
      try {
        const stats = statSync(videoDir);
        if (!stats.isDirectory()) continue;

        const files = readdirSync(videoDir);
        let hasValidFiles = false;

        for (const file of files) {
          const filePath = path.join(videoDir, file);
          try {
            const fileStats = statSync(filePath);
            const age = Date.now() - fileStats.mtimeMs;
            if (age > CACHE_MAX_AGE_MS) {
              unlinkSync(filePath);
            } else {
              hasValidFiles = true;
            }
          } catch { }
        }

        if (!hasValidFiles) {
          try {
            const remainingFiles = readdirSync(videoDir);
            if (remainingFiles.length === 0) {
              require("fs").rmdirSync(videoDir);
            }
          } catch { }
        }
      } catch { }
    }
  } catch (err) {
    console.error("Cache cleanup error:", err);
  }
}

setInterval(cleanupOldCacheEntries, 60 * 60 * 1000);
cleanupOldCacheEntries();

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
    const ytdlp = spawn(YTDLP_PATH, [
      "--print", "%(title)s",
      "--print", "%(duration)s",
      "--no-playlist",
      "--no-warnings",
      "--ignore-errors",
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

    const ytdlpArgs = [
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", audioQuality,
      "-o", outputPath,
      "--no-playlist",
      "--progress",
      "--no-warnings",
      url
    ];

    if (process.platform === "win32") {
      const ffmpegPath = path.join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin");
      if (existsSync(path.join(ffmpegPath, "ffmpeg.exe"))) {
        ytdlpArgs.splice(ytdlpArgs.length - 1, 0, "--ffmpeg-location", ffmpegPath);
      }
    }

    const ytdlp = spawn(YTDLP_PATH, ytdlpArgs);

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

interface QueuedJob {
  jobId: string;
  callback: () => Promise<void>;
}

class ConversionQueue {
  private static readonly MAX_CONCURRENT = 3;
  private static readonly ESTIMATED_CONVERSION_TIME_SECONDS = 30;

  private activeJobs: Set<string> = new Set();
  private waitingQueue: QueuedJob[] = [];

  enqueue(jobId: string, callback: () => Promise<void>): { queued: boolean; position: number; estimatedWait: string } {
    if (this.activeJobs.size < ConversionQueue.MAX_CONCURRENT) {
      this.activeJobs.add(jobId);
      callback().finally(() => this.dequeue(jobId));
      return { queued: false, position: 0, estimatedWait: "" };
    }

    this.waitingQueue.push({ jobId, callback });
    const position = this.waitingQueue.length;
    const estimatedWait = this.getEstimatedWait(position);

    return { queued: true, position, estimatedWait };
  }

  private dequeue(jobId: string): void {
    this.activeJobs.delete(jobId);

    if (this.waitingQueue.length > 0) {
      const next = this.waitingQueue.shift()!;
      this.activeJobs.add(next.jobId);

      this.updateQueuePositions();

      next.callback().finally(() => this.dequeue(next.jobId));
    }
  }

  private async updateQueuePositions(): Promise<void> {
    for (let i = 0; i < this.waitingQueue.length; i++) {
      const queuedJob = this.waitingQueue[i];
      const position = i + 1;
      const estimatedWait = this.getEstimatedWait(position);

      await storage.updateConversionJob(queuedJob.jobId, {
        queuePosition: position,
        estimatedWaitTime: estimatedWait,
      });
    }
  }

  getQueuePosition(jobId: string): number {
    if (this.activeJobs.has(jobId)) {
      return 0;
    }

    const index = this.waitingQueue.findIndex(job => job.jobId === jobId);
    return index >= 0 ? index + 1 : -1;
  }

  getEstimatedWait(position: number): string {
    if (position <= 0) return "";

    const totalSeconds = position * ConversionQueue.ESTIMATED_CONVERSION_TIME_SECONDS;

    if (totalSeconds < 60) {
      return `~${totalSeconds} seconds`;
    } else if (totalSeconds < 120) {
      return "~1 minute";
    } else {
      const minutes = Math.ceil(totalSeconds / 60);
      return `~${minutes} minutes`;
    }
  }

  getActiveCount(): number {
    return this.activeJobs.size;
  }

  getQueueLength(): number {
    return this.waitingQueue.length;
  }
}

const conversionQueue = new ConversionQueue();

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

      if (isCached(videoId, quality)) {
        const cachePath = getCachedFilePath(videoId, quality);
        const stats = statSync(cachePath);

        const videoInfo = await getVideoInfo(youtubeUrl);
        const videoTitle = videoInfo?.title || `Video_${videoId}`;
        const sanitizedTitle = sanitizeFilename(videoTitle);
        const fileName = `${sanitizedTitle}.mp3`;
        const duration = videoInfo?.duration ? formatDuration(videoInfo.duration) : undefined;

        const job = await storage.createConversionJob({ youtubeUrl, quality });
        await storage.updateConversionJob(job.id, {
          status: "ready",
          progress: 100,
          videoTitle,
          videoDuration: duration,
          fileName,
          fileSize: formatFileSize(stats.size),
          downloadPath: cachePath,
          cached: true,
        });

        console.log(`Serving from cache: ${videoId}/${quality}.mp3`);
        return res.json({ id: job.id, status: "ready", cached: true });
      }

      const job = await storage.createConversionJob({ youtubeUrl, quality });

      const conversionTask = async () => {
        try {
          await storage.updateConversionJob(job.id, {
            status: "validating",
            queuePosition: 0,
            estimatedWaitTime: undefined,
          });

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

            const cached = cacheFile(videoId, quality, outputPath);
            if (cached) {
              console.log(`Cached file: ${videoId}/${quality}.mp3`);
            }

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
      };

      const queueResult = conversionQueue.enqueue(job.id, conversionTask);

      if (queueResult.queued) {
        await storage.updateConversionJob(job.id, {
          status: "queued",
          queuePosition: queueResult.position,
          estimatedWaitTime: queueResult.estimatedWait,
        });

        console.log(`Job ${job.id} queued at position ${queueResult.position}. Active: ${conversionQueue.getActiveCount()}, Waiting: ${conversionQueue.getQueueLength()}`);
        return res.json({
          id: job.id,
          status: "queued",
          queuePosition: queueResult.position,
          estimatedWaitTime: queueResult.estimatedWait,
        });
      }

      console.log(`Job ${job.id} started immediately. Active: ${conversionQueue.getActiveCount()}, Waiting: ${conversionQueue.getQueueLength()}`);
      res.json({ id: job.id, status: "validating" });
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

  app.get("/api/preview/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await storage.getConversionJob(id);

      if (!job) {
        return res.status(404).json({ error: "Conversion job not found" });
      }

      if (job.status !== "ready") {
        return res.status(400).json({ error: "File is not ready for preview" });
      }

      if (!job.downloadPath) {
        return res.status(404).json({ error: "File path not available." });
      }

      if (!existsSync(job.downloadPath)) {
        return res.status(404).json({ error: "File not found. It may have expired." });
      }

      const filePath = job.downloadPath;
      const stat = statSync(filePath);
      const fileSize = stat.size;

      const PREVIEW_DURATION_SECONDS = 30;
      const estimatedBitrate = 128 * 1024 / 8;
      const previewBytes = Math.min(fileSize, PREVIEW_DURATION_SECONDS * estimatedBitrate);

      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? Math.min(parseInt(parts[1], 10), previewBytes - 1) : Math.min(start + 1024 * 1024, previewBytes - 1);

        if (start >= previewBytes) {
          res.status(416).json({ error: "Requested range not satisfiable" });
          return;
        }

        const chunkSize = (end - start) + 1;
        const stream = createReadStream(filePath, { start, end });

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${previewBytes}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "audio/mpeg",
        });

        stream.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": previewBytes,
          "Content-Type": "audio/mpeg",
          "Accept-Ranges": "bytes",
        });

        const stream = createReadStream(filePath, { start: 0, end: previewBytes - 1 });
        stream.pipe(res);
      }
    } catch (err) {
      console.error("Preview endpoint error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
