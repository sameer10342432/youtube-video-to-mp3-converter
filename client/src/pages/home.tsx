import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Seo } from "@/components/seo";
import { apiRequest } from "@/lib/queryClient";
import { youtubeUrlSchema, type ConversionJob, type AudioQuality } from "@shared/schema";
import {
  Zap,
  Shield,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  HardDrive,
  History,
  RotateCcw,
  Trash2,
  Play,
  Pause,
  Users,
  Music,
  Settings,
  Headphones,
  Star,
  HelpCircle,
  BookOpen,
  Smartphone,
  Monitor,
  FileAudio,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ConversionState = "idle" | "processing" | "ready" | "error";

interface ConversionResult {
  job: ConversionJob;
  downloadUrl?: string;
}

interface HistoryEntry {
  id: string;
  videoTitle: string;
  videoDuration: string;
  fileSize: string;
  quality: AudioQuality;
  timestamp: number;
  youtubeUrl: string;
}

const HISTORY_STORAGE_KEY = "yt2mp3_conversion_history";
const MAX_HISTORY_ITEMS = 10;

function getHistoryFromStorage(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
  }
  return [];
}

function saveHistoryToStorage(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
}

function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

interface HistorySectionProps {
  history: HistoryEntry[];
  onConvertAgain: (url: string, quality: AudioQuality) => void;
  onClearHistory: () => void;
}

function HistorySection({ history, onConvertAgain, onClearHistory }: HistorySectionProps) {
  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="p-6 rounded-xl" data-testid="section-history-empty">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Conversions</h2>
          </div>
          <p className="text-muted-foreground text-center py-4" data-testid="text-empty-history">
            No conversion history yet
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <Accordion type="single" collapsible defaultValue="history">
        <AccordionItem value="history" className="border-none">
          <Card className="rounded-xl overflow-visible" data-testid="section-history">
            <AccordionTrigger
              className="px-6 py-4 hover:no-underline"
              data-testid="button-toggle-history"
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-semibold">Recent Conversions</span>
                <Badge variant="secondary" className="ml-2" data-testid="badge-history-count">
                  {history.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  className="text-muted-foreground gap-1"
                  data-testid="button-clear-history"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              </div>
              <div className="space-y-3">
                {history.map((entry) => (
                  <Card
                    key={entry.id}
                    className="p-4 rounded-lg bg-muted/30"
                    data-testid={`card-history-item-${entry.id}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <p
                          className="font-medium truncate"
                          title={entry.videoTitle}
                          data-testid={`text-history-title-${entry.id}`}
                        >
                          {entry.videoTitle || "Unknown Title"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {entry.videoDuration && (
                            <span className="flex items-center gap-1" data-testid={`text-history-duration-${entry.id}`}>
                              <Clock className="w-3 h-3" />
                              {entry.videoDuration}
                            </span>
                          )}
                          {entry.fileSize && (
                            <span className="flex items-center gap-1" data-testid={`text-history-size-${entry.id}`}>
                              <HardDrive className="w-3 h-3" />
                              {entry.fileSize}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs" data-testid={`badge-history-quality-${entry.id}`}>
                            {entry.quality} kbps
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground" data-testid={`text-history-timestamp-${entry.id}`}>
                          {formatRelativeTime(entry.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConvertAgain(entry.youtubeUrl, entry.quality)}
                        className="gap-1 shrink-0"
                        data-testid={`button-convert-again-${entry.id}`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Convert Again
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<AudioQuality>("128");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>("idle");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentConversionUrl, setCurrentConversionUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isQueued, setIsQueued] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setHistory(getHistoryFromStorage());
  }, []);

  const saveToHistory = useCallback((job: ConversionJob, youtubeUrl: string, quality: AudioQuality) => {
    const newEntry: HistoryEntry = {
      id: job.id,
      videoTitle: job.videoTitle || "Unknown Title",
      videoDuration: job.videoDuration || "",
      fileSize: job.fileSize || "",
      quality,
      timestamp: Date.now(),
      youtubeUrl,
    };

    setHistory((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === job.id);
      let updated: HistoryEntry[];
      
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = newEntry;
      } else {
        updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ITEMS);
      }
      
      saveHistoryToStorage(updated);
      return updated;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistoryToStorage([]);
  }, []);

  const handleConvertAgain = useCallback((youtubeUrl: string, newQuality: AudioQuality) => {
    setUrl(youtubeUrl);
    setQuality(newQuality);
    setUrlError(null);
    setConversionState("idle");
    setProgress(0);
    setProgressMessage("");
    setConversionResult(null);
    setErrorMessage(null);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateUrl = useCallback((value: string) => {
    if (!value.trim()) {
      setUrlError(null);
      return false;
    }
    const result = youtubeUrlSchema.safeParse(value);
    if (!result.success) {
      setUrlError("Please enter a valid YouTube URL");
      return false;
    }
    setUrlError(null);
    return true;
  }, []);

  const conversionMutation = useMutation({
    mutationFn: async ({ youtubeUrl, quality }: { youtubeUrl: string; quality: AudioQuality }) => {
      setConversionState("processing");
      setProgress(0);
      setProgressMessage("Validating YouTube link...");
      setErrorMessage(null);
      setCurrentConversionUrl(youtubeUrl);

      const response = await apiRequest("POST", "/api/convert", { youtubeUrl, quality });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      const jobId = data.id;

      return new Promise<ConversionResult>((resolve, reject) => {
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/convert/${jobId}`);
            
            if (!statusResponse.ok) {
              clearInterval(pollInterval);
              const errorData = await statusResponse.json().catch(() => ({}));
              reject(new Error(errorData.error || "Failed to check conversion status"));
              return;
            }
            
            const job: ConversionJob = await statusResponse.json();

            setProgress(job.progress);

            switch (job.status) {
              case "queued":
                const position = job.queuePosition || 1;
                const waitTime = job.estimatedWaitTime || "~30 seconds";
                setIsQueued(true);
                setQueuePosition(position);
                setProgressMessage(`You are #${position} in queue. Estimated wait: ${waitTime}`);
                setProgress(0);
                break;
              case "validating":
                setIsQueued(false);
                setQueuePosition(0);
                setProgressMessage("Validating YouTube link...");
                break;
              case "extracting":
                setProgressMessage("Extracting audio from video...");
                break;
              case "converting":
                setProgressMessage("Converting to MP3...");
                break;
              case "ready":
                clearInterval(pollInterval);
                setConversionState("ready");
                resolve({
                  job,
                  downloadUrl: `/api/download/${jobId}`,
                });
                break;
              case "error":
                clearInterval(pollInterval);
                reject(new Error(job.error || "Conversion failed"));
                break;
            }
          } catch (err) {
            clearInterval(pollInterval);
            reject(err);
          }
        }, 500);
      });
    },
    onSuccess: (result) => {
      setConversionResult(result);
      setConversionState("ready");
      saveToHistory(result.job, currentConversionUrl, quality);
    },
    onError: (error: Error) => {
      setConversionState("error");
      setErrorMessage(error.message);
    },
  });

  const handleConvert = () => {
    if (!validateUrl(url)) return;
    conversionMutation.mutate({ youtubeUrl: url, quality });
  };

  const handleClearUrl = () => {
    setUrl("");
    setUrlError(null);
  };

  const handleConvertAnother = () => {
    setUrl("");
    setQuality("128");
    setUrlError(null);
    setConversionState("idle");
    setProgress(0);
    setProgressMessage("");
    setConversionResult(null);
    setErrorMessage(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsQueued(false);
    setQueuePosition(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setConversionState("idle");
    setErrorMessage(null);
    setProgress(0);
  };

  const handleDownload = () => {
    if (conversionResult?.downloadUrl) {
      window.location.href = conversionResult.downloadUrl;
    }
  };

  const isValidUrl = url.trim() && !urlError;

  return (
    <>
      <Seo
        title="YouTube to MP3 Converter - Fast, Free, No Registration"
        description="Convert YouTube videos to MP3 audio files instantly. Free, fast, and no registration required. High-quality 128kbps to 320kbps audio extraction with secure downloads."
        keywords="youtube to mp3, mp3 converter, audio download"
      />
      
      <main className="py-8 pb-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12 space-y-4">
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                data-testid="text-hero-title"
              >
                YouTube to MP3 Converter
              </h1>
              <p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                data-testid="text-hero-subtitle"
              >
                Convert any YouTube video to high-quality MP3 audio.
                <span className="font-medium text-foreground"> Fast, Free, No Registration.</span>
              </p>
            </div>

            <Card className="p-6 md:p-8 shadow-xl rounded-2xl" data-testid="card-converter">
              {conversionState === "idle" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="youtube-url" className="sr-only">
                      YouTube URL
                    </label>
                    <div className="relative">
                      <Input
                        id="youtube-url"
                        type="text"
                        placeholder="Paste YouTube link here..."
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (urlError) validateUrl(e.target.value);
                        }}
                        onBlur={() => url && validateUrl(url)}
                        onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                        className={`h-14 text-lg px-4 pr-10 rounded-xl border-2 transition-colors ${
                          urlError
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-input focus-visible:ring-primary"
                        }`}
                        data-testid="input-youtube-url"
                        aria-invalid={!!urlError}
                        aria-describedby={urlError ? "url-error" : undefined}
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={handleClearUrl}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover-elevate active-elevate-2 transition-colors"
                          aria-label="Clear input"
                          data-testid="button-clear-url"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {urlError && (
                      <p
                        id="url-error"
                        className="text-sm text-destructive flex items-center gap-1"
                        role="alert"
                        data-testid="text-url-error"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {urlError}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <Select value={quality} onValueChange={(v) => setQuality(v as AudioQuality)}>
                      <SelectTrigger
                        className="h-14 rounded-xl border-2 border-input text-base md:w-40"
                        data-testid="select-quality"
                      >
                        <SelectValue placeholder="Quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="128">128 kbps</SelectItem>
                        <SelectItem value="192">192 kbps</SelectItem>
                        <SelectItem value="320">320 kbps</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleConvert}
                      disabled={!isValidUrl}
                      className="flex-1 md:flex-none md:px-12 h-14 text-lg font-semibold rounded-full"
                      data-testid="button-convert"
                    >
                      Convert to MP3
                    </Button>
                  </div>
                </div>
              )}

              {conversionState === "processing" && (
                <div className="space-y-6" data-testid="section-processing">
                  <div className="flex items-center gap-3">
                    {isQueued ? (
                      <Users className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    )}
                    <span className="text-lg font-medium" data-testid="text-progress-message">
                      {progressMessage}
                    </span>
                  </div>
                  {isQueued ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4" data-testid="section-queue-info">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-queue-position">
                            #{queuePosition}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-amber-700 dark:text-amber-300" data-testid="text-queue-status">
                            Waiting in queue
                          </p>
                          <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                            Your conversion will start automatically when a slot becomes available.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-3 rounded-full" data-testid="progress-bar" />
                      <p className="text-sm text-muted-foreground text-center" data-testid="text-progress-percent">
                        {progress}% complete
                      </p>
                    </div>
                  )}
                  {conversionResult?.job?.videoTitle && (
                    <p className="text-sm text-muted-foreground truncate" data-testid="text-video-title">
                      {conversionResult.job.videoTitle}
                    </p>
                  )}
                </div>
              )}

              {conversionState === "ready" && conversionResult && (
                <div className="space-y-6" data-testid="section-ready">
                  <div className="flex items-center gap-3 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-lg font-medium">Conversion Complete!</span>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <p
                      className="font-mono text-sm truncate"
                      data-testid="text-filename"
                      title={conversionResult.job.fileName}
                    >
                      {conversionResult.job.fileName || "audio.mp3"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {conversionResult.job.videoDuration && (
                        <span className="flex items-center gap-1" data-testid="text-duration">
                          <Clock className="w-4 h-4" />
                          {conversionResult.job.videoDuration}
                        </span>
                      )}
                      {conversionResult.job.fileSize && (
                        <span className="flex items-center gap-1" data-testid="text-filesize">
                          <HardDrive className="w-4 h-4" />
                          {conversionResult.job.fileSize}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                    <audio
                      ref={audioRef}
                      src={`/api/preview/${conversionResult.job.id}`}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onEnded={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      data-testid="audio-preview"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handlePlayPause}
                      data-testid="button-preview-play"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "0:30"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Preview (30s)
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 h-14 text-lg font-semibold rounded-full gap-2"
                      data-testid="button-download"
                    >
                      <Download className="w-5 h-5" />
                      Download MP3
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleConvertAnother}
                      className="h-14 px-8 text-lg rounded-full"
                      data-testid="button-convert-another"
                    >
                      Convert Another
                    </Button>
                  </div>
                </div>
              )}

              {conversionState === "error" && (
                <div className="space-y-6" data-testid="section-error">
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="text-base" data-testid="text-error-message">
                      {errorMessage || "Something went wrong. Please try again."}
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleRetry}
                      className="flex-1 h-12 text-base font-semibold rounded-full"
                      data-testid="button-retry"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleConvertAnother}
                      className="h-12 px-6 text-base rounded-full"
                      data-testid="button-start-over"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        <HistorySection
          history={history}
          onConvertAgain={handleConvertAgain}
          onClearHistory={handleClearHistory}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 rounded-xl hover-elevate transition-all" data-testid="card-feature-fast">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Convert videos in seconds with our optimized processing pipeline. No waiting, no delays.
              </p>
            </Card>

            <Card className="p-6 rounded-xl hover-elevate transition-all" data-testid="card-feature-quality">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Audio</h3>
              <p className="text-muted-foreground">
                Get crystal clear 128kbps+ MP3 files. Best audio stream extraction guaranteed.
              </p>
            </Card>

            <Card className="p-6 rounded-xl hover-elevate transition-all" data-testid="card-feature-secure">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                No registration required. No malware. Files are auto-deleted after download.
              </p>
            </Card>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12" data-testid="article-guide">
          <section data-testid="section-what-is">
            <Card className="p-6 md:p-8" data-testid="card-what-is">
              <div className="flex items-start gap-4">
                <Play className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-what-is">What is a YouTube to MP3 Converter?</h2>
                  <p className="text-muted-foreground mb-4">
                    A YouTube to MP3 converter is an online tool that extracts the audio track from YouTube videos and saves it as an MP3 file. MP3 is the most widely supported audio format, compatible with virtually every device, music player, and operating system.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    These converters work by downloading the video from YouTube, separating the audio stream from the video stream, and then encoding that audio into the MP3 format. The result is a standalone audio file that you can listen to offline, on any device, without needing an internet connection.
                  </p>
                  <h3 className="text-xl font-semibold mb-3">Key Benefits of YouTube to MP3 Conversion</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Offline Listening:</strong> Listen to your favorite content without an internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Reduced Data Usage:</strong> Audio files are much smaller than video, saving mobile data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Universal Compatibility:</strong> MP3 files work on any device or player</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Background Playback:</strong> Listen while using other apps on your phone</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-how-it-works">
            <Card className="p-6 md:p-8" data-testid="card-how-it-works">
              <div className="flex items-start gap-4">
                <Settings className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-how-it-works">How Does YouTube to MP3 Conversion Work?</h2>
                  <p className="text-muted-foreground mb-4">
                    Understanding the technical process behind YouTube to MP3 conversion helps you appreciate what happens when you use our converter:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">Step 1: URL Processing</h3>
                      <p className="text-muted-foreground">
                        When you submit a YouTube URL, our server validates the link format and extracts the unique video identifier.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">Step 2: Video Information Retrieval</h3>
                      <p className="text-muted-foreground">
                        Our system fetches metadata about the video, including title, duration, and available quality options.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">Step 3: Audio Stream Extraction</h3>
                      <p className="text-muted-foreground">
                        The converter identifies and downloads the audio stream from the video, extracting only the audio portion.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">Step 4: MP3 Encoding</h3>
                      <p className="text-muted-foreground">
                        The extracted audio is encoded into MP3 format at your selected quality (128kbps, 192kbps, or 320kbps).
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">Step 5: File Delivery</h3>
                      <p className="text-muted-foreground">
                        Once conversion is complete, a download link is generated. The file is available for 30 minutes before automatic cleanup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-audio-quality">
            <Card className="p-6 md:p-8" data-testid="card-audio-quality">
              <div className="flex items-start gap-4">
                <Headphones className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-audio-quality">Understanding Audio Quality Settings</h2>
                  <p className="text-muted-foreground mb-6">
                    Choosing the right audio quality depends on your listening preferences and storage constraints:
                  </p>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold">128 kbps</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Standard Quality</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Smallest file size</li>
                        <li>• Good for speech/podcasts</li>
                        <li>• Suitable for casual listening</li>
                        <li>• ~1 MB per minute</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-primary bg-primary/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-primary" />
                        <Star className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">192 kbps</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">High Quality (Recommended)</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Balanced size/quality</li>
                        <li>• Great for music</li>
                        <li>• Most popular choice</li>
                        <li>• ~1.5 MB per minute</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-amber-500" />
                        <Star className="w-5 h-5 text-amber-500" />
                        <Star className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold">320 kbps</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Best Quality</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Highest MP3 quality</li>
                        <li>• Audiophile grade</li>
                        <li>• Best for music lovers</li>
                        <li>• ~2.5 MB per minute</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-use-cases">
            <Card className="p-6 md:p-8" data-testid="card-use-cases">
              <div className="flex items-start gap-4">
                <FileAudio className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-use-cases">Common Use Cases for YouTube to MP3 Conversion</h2>
                  <p className="text-muted-foreground mb-6">
                    There are many legitimate reasons why people convert YouTube videos to MP3:
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Headphones className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Podcast Listening</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Download podcasts for offline listening during commutes, workouts, or travel.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Educational Content</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Convert lectures, tutorials, and educational videos for studying on the go.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Personal Music Library</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Save your own music or royalty-free tracks for personal playlists.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Mobile Convenience</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reduce data usage and battery consumption by listening to audio-only.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Background Audio</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Play audio in the background while using other apps or working.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Offline Access</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Save content for areas with limited internet connectivity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-legal">
            <Card className="p-6 md:p-8 border-amber-500/30" data-testid="card-legal">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-legal">Legal Considerations</h2>
                  <p className="text-muted-foreground mb-4">
                    Understanding the legal landscape around YouTube to MP3 conversion is important for responsible use:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-700 dark:text-green-400">When Conversion is Generally Acceptable</h3>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Content you created or own</li>
                          <li>• Videos under Creative Commons license</li>
                          <li>• Content with explicit permission from the creator</li>
                          <li>• Public domain content</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-700 dark:text-amber-400">When to Be Cautious</h3>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Copyrighted music and videos</li>
                          <li>• Content from record labels or media companies</li>
                          <li>• Commercial use of any converted content</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <strong>Important:</strong> Copyright laws vary by country. Users are responsible for ensuring they comply with applicable laws in their jurisdiction.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-troubleshooting">
            <Card className="p-6 md:p-8" data-testid="card-troubleshooting">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-troubleshooting">Troubleshooting Common Issues</h2>
                  <p className="text-muted-foreground mb-6">
                    Encountering problems? Here are solutions to the most common issues:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">"Could not fetch video information"</h3>
                      <p className="text-sm text-muted-foreground mb-2">This error usually means:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• The video is private or unlisted</li>
                        <li>• The video is age-restricted</li>
                        <li>• The video is not available in your region</li>
                        <li>• The URL is incorrect or malformed</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Solution:</strong> Verify the video is publicly accessible and try copying the URL directly from YouTube.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Conversion is taking too long</h3>
                      <p className="text-sm text-muted-foreground mb-2">Possible reasons:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Long videos take more time to process</li>
                        <li>• High server load during peak hours</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Solution:</strong> For videos under 10 minutes, conversion typically takes 30-60 seconds. Longer videos may take several minutes.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Download link expired</h3>
                      <p className="text-sm text-muted-foreground">
                        Files are only available for 30 minutes after conversion. If your link has expired, simply run the conversion again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section data-testid="section-faq">
            <Card className="p-6 md:p-8" data-testid="card-faq">
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-faq">Frequently Asked Questions</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Is YT2MP3 free to use?</h3>
                      <p className="text-muted-foreground">
                        Yes, YT2MP3 is completely free. There are no hidden fees, subscription requirements, or premium tiers.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                      <p className="text-muted-foreground">
                        No, we never require registration. Simply paste your URL and convert - no account, email, or personal information needed.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">What is the maximum video length supported?</h3>
                      <p className="text-muted-foreground">
                        We support videos up to 2 hours in length. This covers most music, podcasts, lectures, and other content types.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Can I use YT2MP3 on my phone?</h3>
                      <p className="text-muted-foreground">
                        Yes! Our website is fully responsive and works perfectly on smartphones and tablets.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Is my privacy protected?</h3>
                      <p className="text-muted-foreground">
                        Absolutely. We don't store your converted files permanently, we don't track what you convert, and we don't require any personal information.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">What if my conversion fails?</h3>
                      <p className="text-muted-foreground">
                        If a conversion fails, check that the video is publicly available and try again. Some videos may have restrictions that prevent conversion.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Can I convert playlists?</h3>
                      <p className="text-muted-foreground">
                        Currently, we process one video at a time. To convert multiple videos, simply convert them individually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </article>
      </main>
    </>
  );
}
