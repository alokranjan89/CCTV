# Project Structure

```text
.
|-- src/cctv_recap/       # Python package: recap engine, FastAPI API, Gradio UI
|-- frontend/             # React + Vite dashboard
|-- docs/assets/          # README and documentation images/GIFs
|-- notebooks/            # Research and experimentation notebooks
|-- samples/              # Small demo and codec sample videos
|-- uploads/              # Runtime upload directory, ignored by Git
|-- results/              # Runtime output directory, ignored by Git
|-- requirements.txt      # Python runtime dependencies
|-- pyproject.toml        # Python package metadata and console script
`-- README.md             # Setup and usage guide
```

Runtime files such as virtual environments, frontend builds, uploads, and generated results are intentionally ignored.
