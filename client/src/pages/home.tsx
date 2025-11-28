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
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest } from "@/lib/queryClient";
import { youtubeUrlSchema, type ConversionJob, type AudioQuality } from "@shared/schema";
import {
  Music,
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
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Music className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg" data-testid="text-logo">
                YT2MP3
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
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
      </main>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Music className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm" data-testid="text-footer-logo">YT2MP3</span>
            </div>
            <p className="text-sm text-muted-foreground text-center" data-testid="text-disclaimer">
              For personal use only. Respect copyright laws in your country.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
