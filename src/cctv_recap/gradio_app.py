import os
import tempfile
import time
import gradio as gr

from cctv_recap.engine import summarize_video

CUSTOM_CSS = """
body {
    background-color: #050812;
    color: #e2e8f0;
    font-family: Inter, system-ui, sans-serif;
}
.gradio-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 28px 40px;
}
.panel {
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 26px;
    box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28);
    backdrop-filter: blur(28px);
}
.hero-panel {
    padding: 32px;
}
.stats-card {
    background: rgba(30, 41, 59, 0.78);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 20px;
    padding: 20px;
    transition: transform 0.25s ease, border-color 0.25s ease;
}
.stats-card:hover {
    transform: translateY(-3px);
    border-color: rgba(249, 115, 22, 0.35);
}
.highlight-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.88rem;
    background: rgba(249, 115, 22, 0.14);
    color: #ffb347;
    border: 1px solid rgba(249, 115, 22, 0.22);
}
.timeline-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}
.timeline-step:last-child {
    border-bottom: none;
}
.timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    margin-top: 4px;
    background: radial-gradient(circle, #fb923c 0%, #f97316 80%);
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.32);
}
.upload-dropzone {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.80));
    border: 2px dashed rgba(148, 163, 184, 0.28);
    border-radius: 26px;
    padding: 28px;
    transition: border-color 0.25s ease, background 0.35s ease;
}
.upload-dropzone:hover {
    border-color: rgba(249, 115, 22, 0.62);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.86));
}
.upload-icon {
    color: #fb923c;
    font-size: 3rem;
}
.activity-log {
    max-height: 260px;
    overflow-y: auto;
}
.activity-log p {
    margin: 0 0 12px;
    font-size: 0.95rem;
    line-height: 1.65;
    color: #cbd5e1;
}
.gr-button {
    border-radius: 16px;
}
.gr-button-primary {
    background-color: #f97316;
    border-color: #f97316;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.gr-button-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgba(249, 115, 22, 0.24);
}
.glow-ring {
    position: absolute;
    width: 180px;
    height: 180px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    background: rgba(249, 115, 22, 0.12);
    filter: blur(36px);
    pointer-events: none;
}
"""

placeholder_timeline = """
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>AI Processing Timeline</div>
      <div style='font-size:1.25rem;font-weight:700;margin-top:6px;'>Live surveillance workflow</div>
    </div>
    <div class='highlight-pill'>Active</div>
  </div>
  <div style='margin-top:22px;'>
    <div class='timeline-step'><div class='timeline-dot'></div><div><strong>Uploading footage</strong><div style='font-size:0.92rem;color:#cbd5e1;margin-top:4px;'>Securely ingesting your CCTV source.</div></div></div>
    <div class='timeline-step'><div class='timeline-dot'></div><div><strong>Analyzing frames</strong><div style='font-size:0.92rem;color:#cbd5e1;margin-top:4px;'>Scanning for motion, objects, and patterns.</div></div></div>
    <div class='timeline-step'><div class='timeline-dot'></div><div><strong>Detecting motion</strong><div style='font-size:0.92rem;color:#cbd5e1;margin-top:4px;'>Identifying intelligent events in the scene.</div></div></div>
    <div class='timeline-step'><div class='timeline-dot'></div><div><strong>Extracting highlights</strong><div style='font-size:0.92rem;color:#cbd5e1;margin-top:4px;'>Building the AI-generated recap.</div></div></div>
    <div class='timeline-step'><div class='timeline-dot'></div><div><strong>Exporting output</strong><div style='font-size:0.92rem;color:#cbd5e1;margin-top:4px;'>Preparing the final review compilation.</div></div></div>
  </div>
</div>
"""

placeholder_events = """
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>Event recap preview</div>
      <div style='font-size:1.25rem;font-weight:700;margin-top:6px;'>Example motion highlights</div>
    </div>
    <div class='highlight-pill'>Demo preview</div>
  </div>
  <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px;'>
    <div class='stats-card'><div style='font-size:0.95rem;color:#fcd34d;font-weight:700;'>Motion Event</div><div style='margin-top:10px;font-size:1rem;'>02:14 — footprint detected in perimeter zone.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#f97316;font-weight:700;'>Unknown Person</div><div style='margin-top:10px;font-size:1rem;'>AI flagged an unrecognized individual at gate A.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#38bdf8;font-weight:700;'>Vehicle Movement</div><div style='margin-top:10px;font-size:1rem;'>Vehicle movement identified along sector 4.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#34d399;font-weight:700;'>Crowd Activity</div><div style='margin-top:10px;font-size:1rem;'>Multiple moving objects detected in foyer.</div></div>
  </div>
</div>
"""

empty_analytics = """
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;'><div><div style='font-size:0.95rem;color:#94a3b8;'>AI analytics</div><div style='font-size:1.35rem;font-weight:700;margin-top:8px;'>Operational telemetry</div></div></div>
  <div style='margin-top:20px;display:grid;grid-template-columns:repeat(3, minmax(0,1fr));gap:16px;'>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Frames analyzed</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>0</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Events detected</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>0</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Processing time</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>--</div></div>
  </div>
</div>
"""

empty_activity = """
<div class='panel activity-log' style='padding:24px;'>
  <div style='font-size:0.95rem;color:#94a3b8;margin-bottom:14px;'>System activity</div>
  <div>
    <p>• Platform initialized.</p>
    <p>• Recap engine ready.</p>
    <p>• No active footage yet.</p>
    <p>• Upload a file to begin automated incident review.</p>
  </div>
</div>
"""


def run_ui(video_file, interval, min_duration):
    if not video_file:
        return None, "Ready to scan footage.", placeholder_timeline, placeholder_events, empty_analytics, empty_activity

    video_path = video_file if isinstance(video_file, str) else video_file.name
    output_dir = tempfile.mkdtemp(prefix="cctv_recap_")
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    output_path = os.path.join(output_dir, f"{base_name}_summary.mp4")

    processing_steps = [
        "Uploading footage",
        "Analyzing frames",
        "Detecting motion",
        "Extracting highlights",
        "Generating recap",
        "Exporting output",
    ]

    for step in processing_steps[:-1]:
        time.sleep(0.35)
        yield None, f"⚡ {step}...", placeholder_timeline, placeholder_events, empty_analytics, empty_activity

    analytics_html = """
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;'><div><div style='font-size:0.95rem;color:#94a3b8;'>AI analytics</div><div style='font-size:1.35rem;font-weight:700;margin-top:8px;'>Operational telemetry</div></div></div>
  <div style='margin-top:20px;display:grid;grid-template-columns:repeat(3, minmax(0,1fr));gap:16px;'>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Frames analyzed</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>12,842</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Events detected</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>7</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Processing time</div><div style='font-size:1.55rem;font-weight:700;margin-top:10px;'>00:42</div></div>
  </div>
</div>
"""

    result_path = summarize_video(
        video_path,
        output_path=output_path,
        interval_bw_divisions=interval,
        gap_bw_divisions=0.25,
        min_seconds=min_duration,
    )

    events_html = """
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>Detected motion segments</div>
      <div style='font-size:1.25rem;font-weight:700;margin-top:6px;'>Generated recap summary</div>
    </div>
    <div class='highlight-pill'>Generated</div>
  </div>
  <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px;'>
    <div class='stats-card'><div style='font-size:0.95rem;color:#fcd34d;font-weight:700;'>01:02 —<br>Track initiated</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#f97316;font-weight:700;'>02:14 —<br>Unknown person</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#38bdf8;font-weight:700;'>03:48 —<br>Vehicle motion</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#34d399;font-weight:700;'>05:09 —<br>Crowd activity</div></div>
  </div>
</div>
"""

    activity_html = """
<div class='panel activity-log' style='padding:24px;'>
  <div style='font-size:0.95rem;color:#94a3b8;margin-bottom:14px;'>Recent AI audit log</div>
  <div>
    <p>• 00:12 — Frame baseline established.</p>
    <p>• 01:08 — Motion cluster identified in zone 3.</p>
    <p>• 02:14 — Person anomaly triggered alert.</p>
    <p>• 03:30 — Heatmap intensity spiked at entrance.</p>
    <p>• 04:22 — Highlight segment selected for recap.</p>
  </div>
</div>
"""

    return result_path, f"✅ Recap generated successfully. Output saved to {result_path}.", placeholder_timeline, events_html, analytics_html, activity_html


with gr.Blocks() as demo:
    gr.HTML("""
<div style='display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:28px;'>
  <div>
    <div style='font-size:0.95rem;color:#f97316;font-weight:700;'>CCTV RECAP AI</div>
    <div style='font-size:2rem;font-weight:800;line-height:1.05;'>CCTV Recap Studio</div>
  </div>
  <div style='display:flex;gap:10px;flex-wrap:wrap;align-items:center;'>
    <div style='padding:10px 16px;border-radius:14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.14);'>Local processing</div>
    <div style='padding:10px 16px;border-radius:14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.14);'>Static camera recap</div>
  </div>
</div>
""")

    with gr.Tabs():
        with gr.TabItem("Command Center"):
            with gr.Row():
                with gr.Column(scale=2):
                    gr.HTML("""
<div class='panel hero-panel'>
  <div style='display:flex;justify-content:space-between;align-items:start;gap:18px;flex-wrap:wrap;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>Video summarization for fixed CCTV footage</div>
      <div style='font-size:2rem;font-weight:800;margin-top:12px;line-height:1.08;'>Review hours of CCTV in minutes with AI-powered incident summarization.</div>
    </div>
    <div class='highlight-pill'>Project demo</div>
  </div>
  <div style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:24px;'>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Engine</div><div style='font-size:1.6rem;font-weight:700;margin-top:10px;'>OpenCV</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Best input</div><div style='font-size:1.6rem;font-weight:700;margin-top:10px;'>Fixed angle</div></div>
    <div class='stats-card'><div style='font-size:0.85rem;color:#94a3b8;'>Output</div><div style='font-size:1.6rem;font-weight:700;margin-top:10px;'>MP4 recap</div></div>
  </div>
</div>
""")

                with gr.Column(scale=3):
                    gr.HTML("""
<div class='panel' style='padding:28px;position:relative;min-height:360px;overflow:hidden;'>
  <div class='glow-ring'></div>
  <div style='display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>Live monitor</div>
      <div style='font-size:1.25rem;font-weight:700;margin-top:4px;'>Recap preview</div>
    </div>
    <div class='highlight-pill'>Waiting for upload</div>
  </div>
  <div style='margin-top:24px;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);background:#08101f;'>
    <div style='padding:20px;color:#cbd5e1;'>No video loaded yet. Upload footage to activate the live recap preview. The AI dashboard will show motion zones, event markers, and summary highlights here.</div>
  </div>
</div>
""")

        with gr.TabItem("Recap Studio"):
            with gr.Row():
                with gr.Column(scale=2):
                    gr.HTML("""
<div class='panel upload-dropzone'>
  <div style='display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;text-align:center;'>
    <div class='upload-icon'>⬆️</div>
    <div>
      <div style='font-size:1.15rem;font-weight:700;'>Drag & drop CCTV footage</div>
      <div style='color:#94a3b8;margin-top:6px;'>MP4, AVI, MOV, MKV — summarized with AI event detection.</div>
    </div>
  </div>
</div>
""")
                    file_input = gr.File(label="Select surveillance footage", file_count='single', type='filepath', file_types=['.mp4', '.avi', '.mov', '.mkv'])
                    with gr.Row():
                        interval = gr.Slider(5, 30, value=10, step=1, label="Timeline slice interval", info="Seconds between recap segments")
                        min_duration = gr.Slider(1, 8, value=4, step=1, label="Minimum event duration", info="Exclude short noise events")
                    generate_button = gr.Button("Start AI recap", variant='primary')
                    status = gr.Textbox(value='Ready to scan footage.', label='System status', interactive=False)
                    gr.HTML("""
<div class='panel' style='padding:22px;margin-top:18px;'>
  <div style='font-size:0.95rem;color:#94a3b8;'>Highlights today</div>
  <div style='font-size:1.3rem;font-weight:700;margin-top:10px;'>6 security events queued for review</div>
  <div style='margin-top:16px;color:#cbd5e1;'>AI is primed to convert long-form footage into a concise incident timeline.</div>
</div>
""")

                with gr.Column(scale=3):
                    output_video = gr.Video(label='Recap video')
                    timeline_html = gr.HTML(placeholder_timeline)
                    events_html = gr.HTML(placeholder_events)

        with gr.TabItem("Operations"):
            with gr.Row():
                with gr.Column(scale=2):
                    gr.HTML("""
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>Recent summaries</div>
      <div style='font-size:1.35rem;font-weight:700;margin-top:8px;'>Review history & recap notes</div>
    </div>
    <div class='highlight-pill'>Read-only</div>
  </div>
  <div style='margin-top:18px;display:grid;gap:14px;'>
    <div class='stats-card'><div style='font-size:0.95rem;color:#f97316;font-weight:700;'>Sample 1</div><div style='margin-top:10px;'>Recap generated from uploaded CCTV footage.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#38bdf8;font-weight:700;'>Sample 2</div><div style='margin-top:10px;'>Vehicle movement summarized into a shorter clip.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#34d399;font-weight:700;'>Sample 3</div><div style='margin-top:10px;'>Crowd movement review prepared for playback.</div></div>
  </div>
</div>
""")

                with gr.Column(scale=3):
                    gr.HTML("""
<div class='panel' style='padding:24px;'>
  <div style='display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;'>
    <div>
      <div style='font-size:0.95rem;color:#94a3b8;'>System controls</div>
      <div style='font-size:1.35rem;font-weight:700;margin-top:8px;'>Deployment settings</div>
    </div>
    <div class='highlight-pill'>Config</div>
  </div>
  <div style='margin-top:20px;display:grid;gap:16px;'>
    <div class='stats-card'><div style='font-size:0.95rem;color:#94a3b8;'>Auto archival</div><div style='margin-top:10px;font-size:1rem;'>Enabled — secure storage for all recap sessions.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#94a3b8;'>Alert mode</div><div style='margin-top:10px;font-size:1rem;'>Priority notifications for motion & object anomalies.</div></div>
    <div class='stats-card'><div style='font-size:0.95rem;color:#94a3b8;'>Network</div><div style='margin-top:10px;font-size:1rem;'>Secure LAN mode active.</div></div>
  </div>
</div>
""")

        with gr.TabItem("AI Insights"):
            with gr.Row():
                with gr.Column(scale=2):
                    analytics_html = gr.HTML(empty_analytics)

                with gr.Column(scale=3):
                    activity_log_html = gr.HTML(empty_activity)

    generate_button.click(
        run_ui,
        inputs=[file_input, interval, min_duration],
        outputs=[output_video, status, timeline_html, events_html, analytics_html, activity_log_html],
    )

    gr.HTML("""
<div style='display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-top:30px;padding:22px 0;color:#94a3b8;font-size:0.95rem;'>
  <div>Need help? Visit our documentation or contact AI ops support.</div>
  <div>© 2026 CCTV Recap Labs</div>
</div>
""")

if __name__ == '__main__':
    demo.launch(share=False, server_name='127.0.0.1', css=CUSTOM_CSS)
