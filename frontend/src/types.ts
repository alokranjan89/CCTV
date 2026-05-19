export type VideoMeta = {
  durationSeconds: number;
  fps: number;
  frameCount: number;
  width: number;
  height: number;
  sizeBytes: number;
};

export type ResultSummary = {
  input: VideoMeta;
  output: VideoMeta;
  processingSeconds: number;
  timeSavedSeconds: number;
  compressionRatio: number;
  settings: {
    interval: number;
    minDuration: number;
  };
};
