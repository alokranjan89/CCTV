import shutil
import uuid
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Dict

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from cctv_recap.engine import summarize_video


ROOT_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = ROOT_DIR / 'uploads'
RESULTS_DIR = ROOT_DIR / 'results'
UPLOAD_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)

app = FastAPI(
    title='CCTV Recap API',
    description='Backend service for CCTV Recap video upload and summarization (background jobs).',
    version='1.1.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.mount('/results', StaticFiles(directory=str(RESULTS_DIR)), name='results')

ALLOWED_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv'}

# Simple in-memory job store. For production replace with persistent store + worker.
JOBS: Dict[str, Dict] = {}
EXECUTOR = ThreadPoolExecutor(max_workers=2)


@app.get('/api/health')
async def health_check():
    return {'status': 'ok', 'message': 'CCTV Recap backend is running.'}


def _process_video_job(job_id: str, input_path: str, output_path: str, interval: int, min_duration: int):
    JOBS[job_id]['status'] = 'processing'
    JOBS[job_id]['progress'] = 10
    JOBS[job_id]['message'] = 'Analyzing uploaded footage...'

    try:
        result_path = summarize_video(
            input_path,
            output_path=output_path,
            interval_bw_divisions=interval,
            gap_bw_divisions=0.25,
            min_seconds=min_duration,
        )

        JOBS[job_id]['progress'] = 70
        JOBS[job_id]['status'] = 'writing'
        JOBS[job_id]['message'] = 'Generating video recap...'
        JOBS[job_id]['videoUrl'] = f'/results/{Path(result_path).name}'
        JOBS[job_id]['progress'] = 100
        JOBS[job_id]['status'] = 'completed'
        JOBS[job_id]['message'] = 'Recap ready from uploaded footage.'
    except Exception as exc:
        JOBS[job_id]['status'] = 'failed'
        JOBS[job_id]['error'] = str(exc)
        JOBS[job_id]['message'] = 'Processing failed.'
        JOBS[job_id]['progress'] = 0


@app.post('/api/upload')
async def upload_video(
    file: UploadFile = File(...),
    interval: int = Form(10),
    min_duration: int = Form(4),
):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail='Unsupported file type. Use MP4, AVI, MOV, or MKV.')

    upload_id = uuid.uuid4().hex
    input_path = UPLOAD_DIR / f'{upload_id}{suffix}'
    output_path = RESULTS_DIR / f'{upload_id}_summary.mp4'

    try:
        with input_path.open('wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Failed to save upload: {exc}')
    finally:
        await file.close()

    # Initialize job
    JOBS[upload_id] = {
        'status': 'queued',
        'progress': 1,
        'filename': file.filename,
        'videoUrl': None,
        'message': 'Queued for processing',
    }

    # Submit background task
    EXECUTOR.submit(_process_video_job, upload_id, str(input_path), str(output_path), interval, min_duration)

    status_url = f'/api/status/{upload_id}'
    return JSONResponse({
        'jobId': upload_id,
        'statusUrl': status_url,
        'status': JOBS[upload_id]['status'],
        'progress': JOBS[upload_id]['progress'],
        'message': JOBS[upload_id]['message'],
    })


@app.get('/api/status/{job_id}')
async def job_status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return job
