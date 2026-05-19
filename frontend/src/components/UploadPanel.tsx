import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CloudUpload,
  FileText,
  PlayCircle,
  Loader2,
  Link2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/* =========================
   Constants
========================= */

const SUPPORTED_TYPES = [
  'video/mp4',
  'video/avi',
  'video/x-msvideo',
  'video/quicktime',
  'video/x-matroska',
  ''
];

const SUPPORTED_EXTENSIONS = [
  '.mp4',
  '.avi',
  '.mov',
  '.mkv'
];

const MAX_PROGRESS = 94;

/* =========================
   Types
========================= */

type UploadState =
  | 'idle'
  | 'ready'
  | 'uploading'
  | 'success'
  | 'error';

/* =========================
   Components
========================= */

function StatusBadge({
  state
}: {
  state: UploadState;
}) {
  const config = {
    idle: {
      label: 'Awaiting upload',
      className:
        'bg-slate-900/70 text-slate-300 border-white/10'
    },
    ready: {
      label: 'Ready to process',
      className:
        'bg-sky-400/10 text-sky-300 border-sky-400/20'
    },
    uploading: {
      label: 'AI processing',
      className:
        'bg-orange-400/10 text-orange-300 border-orange-400/20'
    },
    success: {
      label: 'Recap generated',
      className:
        'bg-emerald-400/10 text-emerald-300 border-emerald-400/20'
    },
    error: {
      label: 'Upload failed',
      className:
        'bg-red-400/10 text-red-300 border-red-400/20'
    }
  };

  const item = config[state];

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full
        border px-4 py-2 text-xs uppercase
        tracking-[0.22em]
        ${item.className}
      `}
    >
      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />

      {item.label}
    </div>
  );
}

function ProgressBar({
  progress
}: {
  progress: number;
}) {
  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
        className="
          h-full rounded-full
          bg-gradient-to-r
          from-orange-500 to-sky-400
        "
      />
    </div>
  );
}

/* =========================
   Main Component
========================= */

export default function UploadPanel() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [videoUrl, setVideoUrl] =
    useState<string | null>(null);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobMessage, setJobMessage] =
    useState<string>('');

  const [progress, setProgress] = useState(0);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [interval, setInterval] = useState(10);

  const [minDuration, setMinDuration] =
    useState(4);

  /* =========================
     Derived State
  ========================= */

  const uploadState: UploadState = useMemo(() => {
    if (error) return 'error';

    if (processing) return 'uploading';

    if (videoUrl) return 'success';

    if (selectedFile) return 'ready';

    return 'idle';
  }, [error, processing, videoUrl, selectedFile]);

  const statusText = useMemo(() => {
    switch (uploadState) {
      case 'ready':
        return 'Footage validated and ready.';
      case 'uploading':
        return jobMessage || 'AI engine is analyzing footage.';
      case 'success':
        return 'Recap successfully generated.';
      case 'error':
        return error || 'Unexpected upload error.';
      default:
        return 'Secure ingest chamber awaiting footage.';
    }
  }, [uploadState, error, jobMessage]);

  /* =========================
     Job Status Polling
  ========================= */

  useEffect(() => {
    if (!jobId) return;

    let isActive = true;
    let intervalId: number;

    async function pollStatus() {
      try {
        const response = await fetch(`/api/status/${jobId}`);

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ||
              'Unable to retrieve job status.'
          );
        }

        const data = await response.json();

        if (!isActive) return;

        setProgress(data.progress ?? 20);
        setJobMessage(data.message ?? 'Processing footage...');

        if (data.status === 'completed') {
          setVideoUrl(data.videoUrl);
          setProcessing(false);
          setProgress(100);
          setJobId(null);
          return;
        }

        if (data.status === 'failed') {
          setError(data.error || 'Processing failed.');
          setProcessing(false);
          setProgress(0);
          setJobId(null);
          return;
        }

        setProcessing(true);
      } catch (err) {
        if (!isActive) return;
        setJobMessage('Waiting for job status...');
      }
    }

    pollStatus();
    intervalId = window.setInterval(pollStatus, 1500);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [jobId]);

  /* =========================
     File Selection
  ========================= */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;
    const extension = file?.name
      .slice(file.name.lastIndexOf('.'))
      .toLowerCase();

    if (
      file &&
      !SUPPORTED_TYPES.includes(file.type) &&
      !SUPPORTED_EXTENSIONS.includes(extension ?? '')
    ) {
      setError(
        'Unsupported video type. Use MP4, AVI, MOV, or MKV.'
      );

      setSelectedFile(null);

      return;
    }

    setError(null);
    setVideoUrl(null);
    setSelectedFile(file);

    setProgress(file ? 10 : 0);
  }

  /* =========================
     Upload Logic
  ========================= */

  async function handleUpload() {
    if (!selectedFile) {
      setError('Please select a video file.');

      return;
    }

    try {
      setError(null);
      setVideoUrl(null);
      setProcessing(true);
      setProgress(18);

      const formData = new FormData();

      formData.append('file', selectedFile);
      formData.append('interval', String(interval));
      formData.append(
        'min_duration',
        String(minDuration)
      );

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.detail || 'Upload failed.'
        );
      }

      const data = await response.json();

      setJobId(data.jobId ?? null);
      setJobMessage(
        data.message ||
          'Footage queued for background processing.'
      );
      setProgress(data.progress ?? 15);
      setProcessing(true);

      if (data.status === 'completed') {
        setVideoUrl(data.videoUrl);
        setProgress(100);
        setProcessing(false);
        setJobId(null);
      }
    } catch (err) {
      setProgress(0);
      setProcessing(false);

      setError(
        err instanceof Error
          ? err.message
          : 'Unexpected upload error.'
      );
    }
  }

  return (
    <section
      aria-labelledby="upload-heading"
      className="
        overflow-hidden rounded-2xl border border-white/10
        bg-[#090d16]/90 p-5
        shadow-2xl shadow-black/25 backdrop-blur-xl
      "
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase text-cyan-200">
            Recap generator
          </p>

          <h2
            id="upload-heading"
            className="mt-2 text-3xl font-semibold text-white"
          >
            Upload footage and generate a compressed incident review.
          </h2>
        </div>

        <StatusBadge state={uploadState} />
      </div>

      <div
        className="
          rounded-2xl border border-white/10
          bg-black/24 p-4
        "
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div
              className="
                inline-flex items-center gap-2 rounded-xl
                border border-amber-300/20 bg-amber-300/10 px-3 py-2
                text-xs uppercase text-amber-100
              "
            >
              <BadgeCheck className="h-4 w-4" />
              End-to-end upload pipeline
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Pick a video, tune the summary settings, and let the backend render a playable recap clip with timestamps.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs uppercase text-slate-500">
              Pipeline status
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {statusText}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <label
            className="
              group relative flex min-h-[300px] cursor-pointer flex-col
              items-center justify-center overflow-hidden rounded-2xl
              border border-dashed border-cyan-200/20
              bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(15,23,42,0.36))]
              p-8 text-center transition hover:border-cyan-200/50
            "
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
            <input
              type="file"
              hidden
              accept="video/mp4,video/avi,video/x-msvideo,video/quicktime,video/x-matroska,.mp4,.avi,.mov,.mkv"
              onChange={handleFileChange}
            />

            <motion.div
              whileHover={{ scale: 1.04 }}
              className="
                relative z-10 mb-5 grid h-16 w-16 place-items-center
                rounded-2xl bg-cyan-200 text-slate-950
                shadow-xl shadow-cyan-200/20
              "
            >
              <CloudUpload className="h-7 w-7" />
            </motion.div>

            <h3 className="relative z-10 text-xl font-semibold text-white">
              Select or drop footage
            </h3>

            <p className="relative z-10 mt-2 text-sm text-slate-400">
              MP4, AVI, MOV, MKV supported
            </p>

            <span
              className="
                relative z-10 mt-5 rounded-xl border border-white/10
                bg-white/10 px-4 py-2 text-xs uppercase text-slate-200
              "
            >
              Browse files
            </span>
          </label>

          <div
            className="
              rounded-2xl border border-white/10
              bg-[#070b13]/88 p-5
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Footage preview
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white break-all">
                  {selectedFile?.name ||
                    'No file selected'}
                </h3>
              </div>

              <div
                className="
                  grid h-11 w-11 place-items-center
                  rounded-xl bg-white/[0.06] text-cyan-200
                "
              >
                <PlayCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-xs uppercase text-slate-500">
                  Interval ({interval}s)
                </label>

                <input
                  type="range"
                  min="5"
                  max="30"
                  value={interval}
                  onChange={(e) =>
                    setInterval(Number(e.target.value))
                  }
                  className="mt-3 w-full accent-orange-400"
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-500">
                  Min event duration ({minDuration}s)
                </label>

                <input
                  type="range"
                  min="1"
                  max="8"
                  value={minDuration}
                  onChange={(e) =>
                    setMinDuration(Number(e.target.value))
                  }
                  className="mt-3 w-full accent-sky-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || processing}
              className="
                mt-8 inline-flex w-full items-center
                justify-center gap-2 rounded-xl
                bg-amber-300 px-6 py-3 text-sm
                font-semibold text-slate-950
                shadow-xl shadow-amber-300/15
                transition hover:bg-amber-200
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CloudUpload className="h-4 w-4" />
              )}

              {processing
                ? 'Processing footage...'
                : 'Run AI recap'}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        <div
          className="
            mt-4 rounded-2xl
            border border-white/10
            bg-[#070b13]/88 p-5
          "
        >
          <div className="flex items-center justify-between text-xs uppercase text-slate-500">
            <span>Progress</span>

            <span className="text-slate-300">
              {progress}%
            </span>
          </div>

          <ProgressBar progress={progress} />

          {/* Result */}
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mt-6 rounded-2xl
                border border-white/10
                bg-white/[0.04] p-4
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Generated recap
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />

                    Ready to preview
                  </div>

                  <p className="mt-2 text-sm text-slate-400 break-all">
                    Direct result URL: 
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 underline"
                    >
                      {videoUrl}
                    </a>
                  </p>
                </div>

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-2
                    rounded-full bg-white/5
                    px-4 py-2 text-xs uppercase
                    tracking-[0.22em] text-slate-200
                    transition hover:bg-white/10
                  "
                >
                  <Link2 className="h-4 w-4" />
                  Open clip
                </a>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl bg-slate-950">
                <video
                  controls
                  src={videoUrl}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
