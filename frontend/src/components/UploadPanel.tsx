import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  CheckCircle2,
  CloudUpload,
  Download,
  FileVideo,
  Link2,
  Loader2,
  MonitorDot,
  Settings2,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { ResultSummary } from '../types';
import { Panel, SectionHeader, StatusBadge, Waveform } from './DashboardPrimitives';

const SUPPORTED_TYPES = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', ''];
const SUPPORTED_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv'];

type UploadState = 'idle' | 'ready' | 'uploading' | 'success' | 'error';

const cameras = ['North Gate', 'Parking Lane', 'Warehouse East'];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-200 shadow-[0_0_22px_rgba(103,232,249,0.42)]"
      />
    </div>
  );
}

function StageRow({
  label,
  detail,
  active,
  complete
}: {
  label: string;
  detail: string;
  active?: boolean;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
          complete
            ? 'bg-emerald-300/12 text-emerald-200'
            : active
              ? 'bg-cyan-300/12 text-cyan-200'
              : 'bg-white/[0.055] text-slate-500'
        }`}
      >
        {complete ? <CheckCircle2 className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

export default function UploadPanel({ onResult }: { onResult?: (summary: ResultSummary | null) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobMessage, setJobMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState(10);
  const [minDuration, setMinDuration] = useState(4);
  const [camera, setCamera] = useState(cameras[0]);

  function setValidatedFile(file: File | null) {
    const extension = file?.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (file && !SUPPORTED_TYPES.includes(file.type) && !SUPPORTED_EXTENSIONS.includes(extension ?? '')) {
      setError('Unsupported video type. Use MP4, AVI, MOV, or MKV.');
      setSelectedFile(null);
      return;
    }

    setError(null);
    setVideoUrl(null);
    onResult?.(null);
    setSelectedFile(file);
    setProgress(file ? 10 : 0);
  }

  const uploadState: UploadState = useMemo(() => {
    if (error) return 'error';
    if (processing) return 'uploading';
    if (videoUrl) return 'success';
    if (selectedFile) return 'ready';
    return 'idle';
  }, [error, processing, videoUrl, selectedFile]);

  const statusTone = uploadState === 'success' ? 'emerald' : uploadState === 'error' ? 'rose' : uploadState === 'uploading' ? 'cyan' : 'slate';
  const statusLabel = {
    idle: 'Awaiting upload',
    ready: 'Ready to process',
    uploading: 'AI processing',
    success: 'Recap generated',
    error: 'Needs attention'
  }[uploadState];

  const statusText = useMemo(() => {
    switch (uploadState) {
      case 'ready':
        return 'Footage validated and ready for processing.';
      case 'uploading':
        return jobMessage || 'AI engine is analyzing footage.';
      case 'success':
        return 'Recap successfully generated and ready to export.';
      case 'error':
        return error || 'Unexpected upload error.';
      default:
        return 'Choose a CCTV file to start the recap workflow.';
    }
  }, [uploadState, error, jobMessage]);

  useEffect(() => {
    if (!jobId) return;

    let isActive = true;
    let intervalId: number;

    async function pollStatus() {
      try {
        const response = await fetch(`/api/status/${jobId}`);

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.detail || 'Unable to retrieve job status.');
        }

        const data = await response.json();
        if (!isActive) return;

        setProgress(data.progress ?? 20);
        setJobMessage(data.message ?? 'Processing footage...');

        if (data.status === 'completed') {
          setVideoUrl(data.videoUrl);
          onResult?.(data.summary ?? null);
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
      } catch {
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
  }, [jobId, onResult]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setValidatedFile(event.target.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError('Please select a video file.');
      return;
    }

    try {
      setError(null);
      setVideoUrl(null);
      onResult?.(null);
      setProcessing(true);
      setProgress(18);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('interval', String(interval));
      formData.append('min_duration', String(minDuration));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || 'Upload failed.');
      }

      const data = await response.json();
      setJobId(data.jobId ?? null);
      setJobMessage(data.message || 'Footage queued for background processing.');
      setProgress(data.progress ?? 15);
      setProcessing(true);

      if (data.status === 'completed') {
        setVideoUrl(data.videoUrl);
        onResult?.(data.summary ?? null);
        setProgress(100);
        setProcessing(false);
        setJobId(null);
      }
    } catch (err) {
      setProgress(0);
      setProcessing(false);
      setError(err instanceof Error ? err.message : 'Unexpected upload error.');
    }
  }

  return (
    <Panel className="p-5 lg:p-6">
      <SectionHeader
        eyebrow="Upload pipeline"
        title="Generate an intelligent recap"
        action={<StatusBadge label={statusLabel} tone={statusTone} pulse={uploadState === 'uploading'} />}
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setValidatedFile(event.dataTransfer.files?.[0] ?? null);
          }}
          className="group relative flex min-h-[380px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-cyan-200/20 bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(20,14,45,0.28),rgba(3,7,18,0.7))] p-6 transition duration-300 hover:border-cyan-200/45"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] opacity-45" />
          <input
            type="file"
            hidden
            accept="video/mp4,video/avi,video/x-msvideo,video/quicktime,video/x-matroska,.mp4,.avi,.mov,.mkv"
            onChange={handleFileChange}
          />

          <div className="relative z-10 flex items-center justify-between">
            <StatusBadge label={camera} tone="cyan" />
            <CloudUpload className="h-5 w-5 text-cyan-200" />
          </div>

          <div className="relative z-10 mx-auto max-w-sm text-center">
            <motion.div
              whileHover={{ scale: 1.04, rotate: -1 }}
              className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-white text-slate-950 shadow-[0_22px_70px_rgba(255,255,255,0.14)]"
            >
              <FileVideo className="h-8 w-8" />
            </motion.div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">Drop footage here</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Upload MP4, AVI, MOV, or MKV footage from a fixed CCTV camera.
            </p>
            <span className="mt-5 inline-flex rounded-xl border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200">
              Browse files
            </span>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-black/25 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Selected source</p>
                <p className="mt-1 truncate text-sm font-medium text-white">{selectedFile?.name || 'No file selected'}</p>
              </div>
              <MonitorDot className="h-5 w-5 shrink-0 text-cyan-200" />
            </div>
          </div>
        </label>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Camera selector</p>
                <p className="mt-1 text-sm font-medium text-white">{camera}</p>
              </div>
              <Camera className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
              {cameras.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCamera(item)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                    camera === item
                      ? 'border-cyan-200/30 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/[0.08] bg-white/[0.035] text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">AI model settings</p>
                <p className="mt-1 text-sm font-medium text-white">Motion recap v1</p>
              </div>
              <Settings2 className="h-5 w-5 text-violet-200" />
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500">
                  <span>Sampling interval</span>
                  <span className="text-slate-300">{interval}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={interval}
                  onChange={(event) => setInterval(Number(event.target.value))}
                  className="mt-3 w-full accent-cyan-300"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500">
                  <span>Minimum event</span>
                  <span className="text-slate-300">{minDuration}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={minDuration}
                  onChange={(event) => setMinDuration(Number(event.target.value))}
                  className="mt-3 w-full accent-violet-300"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Pipeline status</p>
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-sm font-medium leading-6 text-white" aria-live="polite">
              {statusText}
            </p>
            <ProgressBar progress={progress} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
            <BadgeCheck className="h-4 w-4 text-emerald-200" />
            Processing stages
          </div>
          <div className="grid gap-3">
            <StageRow label="Validate source" detail="Codec, frame size, and duration scan" complete={!!selectedFile || progress > 10} />
            <StageRow label="Extract motion fields" detail="Background subtraction and contour grouping" active={processing && progress < 70} complete={progress >= 70} />
            <StageRow label="Render recap" detail="Timestamp compositor and final MP4 export" active={processing && progress >= 70} complete={progress === 100} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Signal preview</p>
              <p className="mt-1 text-sm font-medium text-white">Motion density waveform</p>
            </div>
            <Sparkles className="h-4 w-4 text-violet-200" />
          </div>
          <Waveform active={uploadState === 'uploading' || uploadState === 'ready'} />
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || processing}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 shadow-[0_20px_70px_rgba(255,255,255,0.13)] transition hover:scale-[1.006] hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
        {processing ? 'Processing footage...' : 'Run AI recap'}
      </button>

      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Generated recap ready</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Preview the clip or export it for incident review.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-200 transition hover:bg-white/[0.12]">
                <Link2 className="h-4 w-4" />
                Open
              </a>
              <a href={videoUrl} download className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-100">
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl bg-slate-950">
            <video controls src={videoUrl} className="w-full" />
          </div>
        </motion.div>
      )}
    </Panel>
  );
}
