# CCTV Recap Dashboard

A premium AI surveillance frontend built with React, Tailwind CSS, Framer Motion, and Lucide Icons.

## Run locally

1. Start the Python backend in the project root:
   ```bash
   pip install -r requirements.txt
   python -m uvicorn backend:app --reload --host 127.0.0.1 --port 8000
   ```
2. Open a new terminal in `frontend`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 4173
   ```

Then open the local dashboard in your browser, for example:

```text
http://localhost:4174/
```

## API wiring

The frontend forwards `/api` and `/results` to the Python backend, so uploaded video files are processed by the `backend.py` service and the generated recap is returned as a playable clip in the UI.
