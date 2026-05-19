#!/usr/bin/env python
# coding: utf-8

import os
import numpy as np
import cv2
import time as tm
import argparse
import progressbar
from typing import Callable, Optional


class Box:
    def __init__(self, coords, time):
        self.coords = coords
        self.time = time


class MovingObject:
    def __init__(self, starting_box):
        self.boxes = [starting_box]

    def add_box(self, box):
        self.boxes.append(box)

    def last_coords(self):
        return self.boxes[-1].coords

    def age(self, curr_time):
        return curr_time - self.boxes[-1].time


def get_centres(p1):
    return np.transpose(np.array([p1[:, 0] + p1[:, 2] / 2, p1[:, 1] + p1[:, 3] / 2]))


def distance(p1, p2):
    p1 = np.expand_dims(p1, 0)
    if p2.ndim == 1:
        p2 = np.expand_dims(p2, 0)
    c1 = get_centres(p1)
    c2 = get_centres(p2)
    return np.linalg.norm(c1 - c2, axis=1)


def get_nearest(p1, points):
    return np.argmin(distance(p1, points))


def _report_progress(progress_callback: Optional[Callable[[int, str], None]], progress: int, message: str = ''):
    if progress_callback is None:
        return
    try:
        progress_callback(progress, message)
    except Exception:
        pass


def extract_background_and_boxes(
    video_path,
    min_contour_area=8000,
    progress_callback: Optional[Callable[[int, str], None]] = None,
):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError(f"Unable to open video: {video_path}")

    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fgbg = cv2.createBackgroundSubtractorKNN()

    ret, frame = cap.read()
    if not ret:
        cap.release()
        raise ValueError("Unable to read the first frame from the video.")

    avg2 = np.float32(frame)
    all_conts = []
    fcount = -1

    print("Extracting bounding boxes and background...")
    with progressbar.ProgressBar(max_value=total_frames) as bar:
        while ret:
            fcount += 1
            bar.update(fcount)

            if total_frames > 0:
                _report_progress(
                    progress_callback,
                    min(30, 5 + int(25 * ((fcount + 1) / total_frames))),
                    f'Scanning frame {fcount + 1}/{total_frames}',
                )

            try:
                cv2.accumulateWeighted(frame, avg2, 0.01)
            except Exception:
                break

            ret, frame = cap.read()
            if not ret:
                break

            fgmask = fgbg.apply(frame)
            contours, _ = cv2.findContours(fgmask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            contours = np.array([np.array(cv2.boundingRect(c)) for c in contours if cv2.contourArea(c) >= min_contour_area])
            all_conts.append(contours)

    _report_progress(progress_callback, 30, 'Background extraction complete.')

    cap.release()
    background = cv2.convertScaleAbs(avg2)
    return background, all_conts, fps, total_frames


def associate_boxes_into_objects(all_conts, fps, continuity_threshold, min_seconds):
    moving_objs = []
    for curr_time, new_boxes in enumerate(all_conts):
        if len(new_boxes) != 0:
            new_assocs = [None] * len(new_boxes)
            obj_coords = np.array([obj.last_coords() for obj in moving_objs if obj.age(curr_time) < continuity_threshold])
            unexp_idx = -1
            for obj_idx, obj in enumerate(moving_objs):
                if obj.age(curr_time) < continuity_threshold:
                    unexp_idx += 1
                    if len(obj_coords) == 0 or len(new_boxes) == 0:
                        continue
                    nearest_new = get_nearest(obj.last_coords(), new_boxes)
                    nearest_obj = get_nearest(new_boxes[nearest_new], obj_coords)
                    if nearest_obj == unexp_idx:
                        new_assocs[nearest_new] = obj_idx

            for new_idx, new_coords in enumerate(new_boxes):
                new_assoc = new_assocs[new_idx]
                new_box = Box(new_coords, curr_time)
                if new_assoc is not None:
                    moving_objs[new_assoc].add_box(new_box)
                else:
                    moving_objs.append(MovingObject(new_box))

    min_frames = min_seconds * fps
    return [obj for obj in moving_objs if (obj.boxes[-1].time - obj.boxes[0].time) > min_frames]


def cut(image, coords):
    x, y, w, h = coords
    return image[y:y+h, x:x+w]


def overlay(frame, image, coords):
    x, y, w, h = coords
    frame[y:y+h, x:x+w] = cv2.addWeighted(frame[y:y+h, x:x+w], 0.5, cut(image, coords), 0.5, 0)


def sec2HMS(seconds):
    return tm.strftime('%M:%S', tm.gmtime(seconds))


def frame2HMS(n_frame, fps):
    return sec2HMS(float(n_frame) / float(fps))


def summarize_video(
    video_path,
    output_path=None,
    interval_bw_divisions=10,
    gap_bw_divisions=0.25,
    min_seconds=4,
    min_contour_area=8000,
    progress_callback: Optional[Callable[[int, str], None]] = None,
):
    if output_path is None:
        filename = os.path.basename(video_path).split('.')[0]
        output_path = os.path.join(os.path.dirname(video_path), f"{filename}_summary.mp4")

    background, all_conts, fps, total_frames = extract_background_and_boxes(
        video_path,
        min_contour_area,
        progress_callback=progress_callback,
    )
    moving_objs = associate_boxes_into_objects(all_conts, fps, fps, min_seconds)

    if not moving_objs:
        raise ValueError("No moving objects were detected in the input video.")

    _report_progress(progress_callback, 35, 'Found moving objects and preparing recap.')

    max_orig_len = max(obj.boxes[-1].time for obj in moving_objs)
    max_duration = max(obj.boxes[-1].time - obj.boxes[0].time for obj in moving_objs)
    start_times = [obj.boxes[0].time for obj in moving_objs]
    n_divisions = int(max_orig_len / interval_bw_divisions)
    final_video = [background.copy() for _ in range(max_duration + int(n_divisions * gap_bw_divisions) + 10)]

    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    vid_time = -1
    all_texts = []

    print("Cropping moving objects and building the recap video...")
    with progressbar.ProgressBar(max_value=total_frames) as bar:
        while ret:
            vid_time += 1
            bar.update(vid_time)
            ret, frame = cap.read()
            if not ret:
                break

            if total_frames > 0:
                _report_progress(
                    progress_callback,
                    35 + int(40 * min(1.0, vid_time / max(1, total_frames - 1))),
                    f'Building recap timeline: frame {vid_time}/{total_frames}',
                )

            for obj_idx, moving_obj in enumerate(moving_objs):
                if not moving_obj.boxes:
                    continue
                first_box = moving_obj.boxes[0]
                if first_box.time == vid_time:
                    final_time = int(
                        first_box.time
                        - start_times[obj_idx]
                        + (start_times[obj_idx] // (interval_bw_divisions * fps)) * gap_bw_divisions * fps
                    )
                    final_time = max(0, min(final_time, len(final_video) - 1))
                    overlay(final_video[final_time], frame, first_box.coords)
                    x, y, w, h = first_box.coords
                    all_texts.append((final_time, frame2HMS(first_box.time, fps), (x + int(w / 2), y + int(h / 2))))
                    del moving_obj.boxes[0]

    cap.release()

    for t, text, org in all_texts:
        cv2.putText(final_video[t], text, org, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (252, 240, 3), 2)

    print(f"Writing recap video to {output_path}...")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(output_path, fourcc, fps, (background.shape[1], background.shape[0]))
    total_final = len(final_video)
    for idx, frame in enumerate(final_video):
        writer.write(frame)
        if total_final > 0 and idx % max(1, total_final // 20) == 0:
            _report_progress(
                progress_callback,
                75 + int(20 * (idx / max(1, total_final - 1))),
                'Rendering final recap clip...',
            )
    writer.release()

    _report_progress(progress_callback, 100, 'Recap generation completed.')
    print("Done!!")
    return output_path


def parse_args():
    parser = argparse.ArgumentParser(description="CCTV Recap: generate a short summary from static CCTV footage")
    parser.add_argument("VID_PATH", help="Path to the video to be summarized")
    parser.add_argument("--interval", type=int, default=10, help="Interval between divisions for the final summary (seconds)")
    parser.add_argument("--min-duration", type=int, default=4, help="Minimum duration for a moving object to be included (seconds)")
    parser.add_argument("--output", default=None, help="Output path for the summary video")
    return parser.parse_args()


def main():
    args = parse_args()
    output_path = summarize_video(
        args.VID_PATH,
        output_path=args.output,
        interval_bw_divisions=args.interval,
        gap_bw_divisions=0.25,
        min_seconds=args.min_duration,
    )
    print(f"Summary video is available at {output_path}")


if __name__ == "__main__":
    main()
