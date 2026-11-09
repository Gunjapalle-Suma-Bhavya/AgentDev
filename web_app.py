"""
AgentDev: A Collaborative Multi-Agent Generative AI Framework for Autonomous Software Development
Modernized, High-End Presentation Dashboard with Sleek Dark/Glassmorphic Styling
"""

import os
import sys
import time
import zipfile
import io
import shutil
import subprocess
import yaml
from pathlib import Path
import streamlit as st

# ---------------------------------------------------------------------------
# Page Configuration & Modern Theme Styling
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="AgentDev | Autonomous Multi-Agent Software Development",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom High-End Styling (Vercel / Linear inspired Dark Glassmorphism)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Overall Dark Gradient Canvas */
    .stApp {
        background: radial-gradient(circle at 15% 15%, #131b2e 0%, #080c14 100%);
        color: #f1f5f9;
    }

    /* Top Hero Header */
    .hero-container {
        padding: 24px 30px;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.65) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        backdrop-filter: blur(16px);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }
    .hero-container::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
    }
    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 9999px;
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.3);
        color: #38bdf8;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 12px;
    }
    .hero-title {
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 8px 0;
    }
    .hero-subtitle {
        font-size: 1.02rem;
        color: #94a3b8;
        max-width: 850px;
        line-height: 1.5;
        margin: 0;
    }

    /* KPI / Stat Highlights */
    .stat-strip {
        display: flex;
        gap: 16px;
        margin-top: 18px;
        flex-wrap: wrap;
    }
    .stat-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.82rem;
        color: #cbd5e1;
        font-weight: 500;
    }
    .stat-pill strong {
        color: #38bdf8;
    }

    /* Card Panels */
    .glass-card {
        padding: 20px 22px;
        border-radius: 14px;
        background: rgba(17, 24, 39, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(12px);
        margin-bottom: 16px;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .glass-card:hover {
        border-color: rgba(56, 189, 248, 0.3);
    }

    /* Agent Role Cards */
    .role-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 14px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: 8px;
        transition: all 0.2s ease;
    }
    .role-row:hover {
        background: rgba(56, 189, 248, 0.04);
        border-color: rgba(56, 189, 248, 0.2);
    }
    .role-icon {
        font-size: 1.4rem;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
    }
    .role-meta strong {
        font-size: 0.92rem;
        color: #f8fafc;
        display: block;
    }
    .role-meta small {
        color: #94a3b8;
        font-size: 0.78rem;
    }

    /* Pipeline Status Stepper */
    .stepper-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-radius: 14px;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        margin: 16px 0;
    }
    .step-node {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
    }
    .step-node.active {
        color: #38bdf8;
    }
    .step-node.done {
        color: #34d399;
    }

    /* Mac-Style Hacker Terminal */
    .terminal-window {
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #090d16;
        box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6);
        margin-top: 14px;
    }
    .terminal-bar {
        background: #111827;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .term-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .terminal-title {
        color: #94a3b8;
        font-size: 0.75rem;
        font-family: 'JetBrains Mono', monospace;
        margin-left: 8px;
    }
    .terminal-body {
        font-family: 'JetBrains Mono', monospace;
        color: #cbd5e1;
        font-size: 0.82rem;
        padding: 18px 20px;
        max-height: 420px;
        overflow-y: auto;
        white-space: pre-wrap;
        line-height: 1.6;
        background: #06090f;
    }

    /* Sidebar Refinement */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0d131f 0%, #060910 100%) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px 8px 0 0;
        padding: 10px 18px;
        font-weight: 600;
        font-size: 0.92rem;
        color: #94a3b8;
    }
    .stTabs [aria-selected="true"] {
        color: #38bdf8 !important;
        border-bottom: 2px solid #38bdf8 !important;
    }

    /* Buttons */
    .stButton > button {
        border-radius: 10px;
        font-weight: 600;
        padding: 8px 18px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    }
    .stButton > button:hover {
        border-color: #38bdf8;
        box-shadow: 0 0 15px -3px rgba(56, 189, 248, 0.3);
    }
</style>
""", unsafe_allow_html=True)

WORKSPACE_DIR = Path(__file__).parent.resolve()
CONFIG_PATH = WORKSPACE_DIR / "config" / "config2.yaml"
WORKSPACE_OUTPUT_DIR = WORKSPACE_DIR / "workspace"
VENV_PYTHON = WORKSPACE_DIR / ".venv" / "Scripts" / "python.exe"
if not VENV_PYTHON.exists():
    VENV_PYTHON = Path(sys.executable)

# ---------------------------------------------------------------------------
# Helper Functions: Config & Files
# ---------------------------------------------------------------------------
def load_config():
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                return data or {}
        except Exception:
            return {}
    return {}

def save_config(api_type, model, api_key, base_url=""):
    config_data = {
        "llm": {
            "api_type": api_type,
            "model": model,
            "api_key": api_key,
        }
    }
    if base_url and base_url.strip():
        config_data["llm"]["base_url"] = base_url.strip()
    elif api_type == "openai":
        config_data["llm"]["base_url"] = "https://api.openai.com/v1"

    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        yaml.dump(config_data, f, default_flow_style=False)

def get_workspace_projects():
    if not WORKSPACE_OUTPUT_DIR.exists():
        return []
    projects = [p for p in WORKSPACE_OUTPUT_DIR.iterdir() if p.is_dir() and not p.name.startswith(".")]
    return sorted(projects, key=lambda p: p.stat().st_mtime, reverse=True)

def create_project_zip(project_path: Path):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file in project_path.rglob("*"):
            if file.is_file() and not any(part.startswith(".") for part in file.parts):
                arcname = file.relative_to(project_path)
                zip_file.write(file, arcname)
    zip_buffer.seek(0)
    return zip_buffer

# ---------------------------------------------------------------------------
# Persistent Sidebar: Controls & Settings
# ---------------------------------------------------------------------------
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <span style="font-size: 1.8rem;">⚡</span>
        <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff;">AgentDev</h3>
            <span style="font-size: 0.72rem; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">System Control</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    current_config = load_config().get("llm", {})
    current_api_key = current_config.get("api_key", "")
    is_configured = current_api_key and current_api_key != "YOUR_API_KEY"

    if is_configured:
        st.markdown("""
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></div>
            <span style="color: #6ee7b7; font-size: 0.8rem; font-weight: 600;">System Ready • API Connected</span>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></div>
            <span style="color: #fcd34d; font-size: 0.8rem; font-weight: 600;">Action Required • Set API Key</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<p style='font-size: 0.82rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;'>AI Model Engine</p>", unsafe_allow_html=True)
    provider_options = ["openai", "gemini", "ollama", "groq", "anthropic", "azure"]
    current_provider = current_config.get("api_type", "openai")
    provider_idx = provider_options.index(current_provider) if current_provider in provider_options else 0
    selected_provider = st.selectbox("LLM Provider", provider_options, index=provider_idx, label_visibility="collapsed")

    default_models = {
        "openai": "gpt-4o",
        "gemini": "gemini-1.5-flash",
        "ollama": "llama3",
        "groq": "llama-3.3-70b-versatile",
        "anthropic": "claude-3-5-sonnet-20241022",
        "azure": "gpt-4",
    }
    model_input = st.text_input(
        "Model Name",
        value=current_config.get("model", default_models.get(selected_provider, "gpt-4o")),
        placeholder="e.g. gpt-4o or gemini-1.5-flash"
    )

    api_key_input = st.text_input(
        "API Key",
        type="password",
        value="" if current_api_key == "YOUR_API_KEY" else current_api_key,
        placeholder="sk-...",
        help="Saved locally in config/config2.yaml and never shared."
    )

    base_url_input = st.text_input(
        "Base URL (Optional)",
        value=current_config.get("base_url", "https://api.openai.com/v1" if selected_provider == "openai" else ""),
        placeholder="e.g. http://localhost:11434/v1"
    )

    if st.button("💾 Save & Verify Config", use_container_width=True):
        if not api_key_input and selected_provider != "ollama":
            st.error("Please enter a valid API key!")
        else:
            key_to_save = api_key_input if api_key_input else "sk-ollama-local"
            save_config(selected_provider, model_input, key_to_save, base_url_input)
            st.success("Configuration successfully saved!")
            time.sleep(0.8)
            st.rerun()

    st.markdown("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.06); margin: 20px 0;'>", unsafe_allow_html=True)
    st.markdown("<p style='font-size: 0.82rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;'>Team Knobs & Budget</p>", unsafe_allow_html=True)
    investment_val = st.slider("Investment Budget ($)", min_value=1.0, max_value=10.0, value=3.0, step=0.5)
    n_rounds_val = st.slider("Simulation Rounds", min_value=1, max_value=10, value=5, step=1)
    code_review_toggle = st.toggle("Autonomous Peer Code Review", value=True)
    run_tests_toggle = st.toggle("QA Automated Unit Tests", value=False)

# ---------------------------------------------------------------------------
# Main Canvas: Hero Section & Tabs
# ---------------------------------------------------------------------------
st.markdown("""
<div class="hero-container">
    <div class="hero-badge">✨ Autonomous Software Engineering Framework</div>
    <h1 class="hero-title">AgentDev: Multi-Agent Software Development</h1>
    <p class="hero-subtitle">
        An end-to-end generative AI software company simulating specialized engineering roles 
        (Product Manager, Architect, Project Manager, Engineer, QA) driven by formal Standard Operating Procedures (SOPs).
    </p>
    <div class="stat-strip">
        <div class="stat-pill">👥 <strong>5 Autonomous Roles</strong></div>
        <div class="stat-pill">⚙️ <strong>Code = SOP(Team)</strong></div>
        <div class="stat-pill">⚡ <strong>Multi-LLM Integration</strong></div>
        <div class="stat-pill">📦 <strong>Instant ZIP Export</strong></div>
    </div>
</div>
""", unsafe_allow_html=True)

tab_launch, tab_explorer, tab_arch, tab_diag = st.tabs([
    "🚀 Project Launchpad",
    "📂 Project Code Explorer",
    "🎓 Architecture & Viva Presentation",
    "⚙️ System Diagnostics",
])

# ---------------------------------------------------------------------------
# TAB 1: Project Launchpad
# ---------------------------------------------------------------------------
with tab_launch:
    col_input, col_team = st.columns([1.8, 1.2], gap="large")

    with col_input:
        st.markdown("<h3 style='margin-top:0; font-weight: 700;'>💡 Software Specification</h3>", unsafe_allow_html=True)
        st.caption("Select a quick-start presentation preset or type your custom software requirement:")

        # Modern Preset Buttons (Pill grid)
        st.markdown("<p style='font-size: 0.82rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px;'>Preset Demos (Click to populate):</p>", unsafe_allow_html=True)
        pcol1, pcol2, pcol3, pcol4 = st.columns(4)

        preset_idea = ""
        preset_name = ""
        if pcol1.button("🎮 2048 Game", use_container_width=True):
            preset_idea = "Write a complete 2048 game in Python with a graphical interface and score tracking."
            preset_name = "game_2048"
        if pcol2.button("🐍 Snake Game", use_container_width=True):
            preset_idea = "Build a classic Snake Game in Python with smooth controls, sound effects, and high score display."
            preset_name = "snake_game"
        if pcol3.button("🧮 Calculator GUI", use_container_width=True):
            preset_idea = "Create a modern scientific calculator desktop application in Python with Tkinter."
            preset_name = "calc_app"
        if pcol4.button("📝 Markdown Tool", use_container_width=True):
            preset_idea = "Develop a Python desktop tool to live-preview Markdown and export documents to formatted HTML."
            preset_name = "markdown_viewer"

        if preset_idea:
            st.session_state["project_idea"] = preset_idea
            st.session_state["project_name"] = preset_name

        idea_text = st.text_area(
            "Software Requirement Prompt",
            value=st.session_state.get("project_idea", "Create a modern 2048 puzzle game in Python with smooth animations and high-score saving."),
            height=125,
            placeholder="Describe what application or tool you want the agent team to build...",
            label_visibility="collapsed"
        )

        n_col1, n_col2 = st.columns([2, 1])
        with n_col1:
            name_text = st.text_input(
                "Target Repository Folder Name",
                value=st.session_state.get("project_name", "game_2048"),
                help="The project will be created in workspace/<name>/"
            )
        with n_col2:
            st.write("")
            st.write("")
            launch_btn = st.button("🚀 Launch Agent Team", type="primary", use_container_width=True)

    with col_team:
        st.markdown("<h3 style='margin-top:0; font-weight: 700;'>👥 Active AI Engineering Team</h3>", unsafe_allow_html=True)
        st.caption("Specialized roles collaborating via asynchronous message bus:")
        st.markdown("""
        <div class="role-row">
            <div class="role-icon">📋</div>
            <div class="role-meta">
                <strong>Alice • Product Manager</strong>
                <small>Elicits requirements, conducts competitive analysis, outputs PRD.</small>
            </div>
        </div>
        <div class="role-row">
            <div class="role-icon">🏗️</div>
            <div class="role-meta">
                <strong>Bob • Software Architect</strong>
                <small>Designs system architecture, data models, and API interfaces.</small>
            </div>
        </div>
        <div class="role-row">
            <div class="role-icon">📊</div>
            <div class="role-meta">
                <strong>Eve • Project Manager</strong>
                <small>Decomposes architecture into dependency-mapped file tasks.</small>
            </div>
        </div>
        <div class="role-row">
            <div class="role-icon">💻</div>
            <div class="role-meta">
                <strong>Alex • Software Engineer</strong>
                <small>Implements complete, modular, executable Python code.</small>
            </div>
        </div>
        <div class="role-row">
            <div class="role-icon">🧪</div>
            <div class="role-meta">
                <strong>David • QA Engineer</strong>
                <small>Conducts peer code reviews, verifies imports, and runs test suites.</small>
            </div>
        </div>
        """, unsafe_allow_html=True)

    # Execution Progress & Live Stream Area
    if launch_btn:
        if not is_configured and selected_provider != "ollama":
            st.error("⚠️ Please configure your API Key in the left sidebar first before launching the team!")
        elif not idea_text.strip():
            st.error("⚠️ Please enter a project description!")
        else:
            st.markdown("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;'>", unsafe_allow_html=True)
            st.markdown(f"#### ⚡ Orchestrating Project: <span style='color: #38bdf8;'>{name_text}</span>", unsafe_allow_html=True)

            # Modern Stepper Container
            stepper_placeholder = st.empty()
            stepper_placeholder.markdown("""
            <div class="stepper-container">
                <div class="step-node active"><span>⏳</span> 1. Requirements (PRD)</div>
                <div class="step-node"><span>⚪</span> 2. Architecture</div>
                <div class="step-node"><span>⚪</span> 3. Task Allocation</div>
                <div class="step-node"><span>⚪</span> 4. Source Coding</div>
                <div class="step-node"><span>⚪</span> 5. QA Verification</div>
            </div>
            """, unsafe_allow_html=True)

            progress_bar = st.progress(0.1)

            # Hacker Terminal Box Placeholder
            log_placeholder = st.empty()
            log_placeholder.markdown("""
            <div class="terminal-window">
                <div class="terminal-bar">
                    <div class="term-dot dot-red"></div>
                    <div class="term-dot dot-yellow"></div>
                    <div class="term-dot dot-green"></div>
                    <span class="terminal-title">agentdev@orchestrator ~ live-execution-stream</span>
                </div>
                <div class="terminal-body">Initiating multi-agent software company event loop...</div>
            </div>
            """, unsafe_allow_html=True)

            cmd = [
                str(VENV_PYTHON),
                "-m", "metagpt.software_company",
                idea_text.strip(),
                "--project-name", name_text.strip(),
                "--investment", str(investment_val),
                "--n-round", str(n_rounds_val),
            ]
            if code_review_toggle:
                cmd.append("--code-review")
            else:
                cmd.append("--no-code-review")

            if run_tests_toggle:
                cmd.append("--run-tests")
            else:
                cmd.append("--no-run-tests")

            process = subprocess.Popen(
                cmd,
                cwd=str(WORKSPACE_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
            )

            accumulated_logs = []
            start_time = time.time()

            while True:
                line = process.stdout.readline()
                if not line and process.poll() is not None:
                    break
                if line:
                    accumulated_logs.append(line)
                    display_text = "".join(accumulated_logs[-80:])
                    
                    log_placeholder.markdown(f"""
                    <div class="terminal-window">
                        <div class="terminal-bar">
                            <div class="term-dot dot-red"></div>
                            <div class="term-dot dot-yellow"></div>
                            <div class="term-dot dot-green"></div>
                            <span class="terminal-title">agentdev@orchestrator ~ live-execution-stream</span>
                        </div>
                        <div class="terminal-body">{display_text}</div>
                    </div>
                    """, unsafe_allow_html=True)

                    lower_line = line.lower()
                    if "productmanager" in lower_line or "prd" in lower_line:
                        stepper_placeholder.markdown("""
                        <div class="stepper-container">
                            <div class="step-node done"><span>✅</span> 1. Requirements (Done)</div>
                            <div class="step-node active"><span>⏳</span> 2. Architecture</div>
                            <div class="step-node"><span>⚪</span> 3. Task Allocation</div>
                            <div class="step-node"><span>⚪</span> 4. Source Coding</div>
                            <div class="step-node"><span>⚪</span> 5. QA Verification</div>
                        </div>
                        """, unsafe_allow_html=True)
                        progress_bar.progress(0.35)
                    elif "architect" in lower_line or "system design" in lower_line:
                        stepper_placeholder.markdown("""
                        <div class="stepper-container">
                            <div class="step-node done"><span>✅</span> 1. Requirements (Done)</div>
                            <div class="step-node done"><span>✅</span> 2. Architecture (Done)</div>
                            <div class="step-node active"><span>⏳</span> 3. Task Allocation</div>
                            <div class="step-node"><span>⚪</span> 4. Source Coding</div>
                            <div class="step-node"><span>⚪</span> 5. QA Verification</div>
                        </div>
                        """, unsafe_allow_html=True)
                        progress_bar.progress(0.55)
                    elif "projectmanager" in lower_line or "task" in lower_line:
                        stepper_placeholder.markdown("""
                        <div class="stepper-container">
                            <div class="step-node done"><span>✅</span> 1. Requirements (Done)</div>
                            <div class="step-node done"><span>✅</span> 2. Architecture (Done)</div>
                            <div class="step-node done"><span>✅</span> 3. Task Allocation (Done)</div>
                            <div class="step-node active"><span>⏳</span> 4. Source Coding</div>
                            <div class="step-node"><span>⚪</span> 5. QA Verification</div>
                        </div>
                        """, unsafe_allow_html=True)
                        progress_bar.progress(0.75)
                    elif "engineer" in lower_line or "write" in lower_line:
                        progress_bar.progress(0.9)

            return_code = process.wait()
            elapsed_time = round(time.time() - start_time, 1)

            if return_code == 0:
                progress_bar.progress(1.0)
                stepper_placeholder.markdown("""
                <div class="stepper-container">
                    <div class="step-node done"><span>✅</span> 1. Requirements (Done)</div>
                    <div class="step-node done"><span>✅</span> 2. Architecture (Done)</div>
                    <div class="step-node done"><span>✅</span> 3. Task Allocation (Done)</div>
                    <div class="step-node done"><span>✅</span> 4. Source Coding (Done)</div>
                    <div class="step-node done"><span>✅</span> 5. QA Verification (Complete)</div>
                </div>
                """, unsafe_allow_html=True)
                st.balloons()
                st.success(f"🎉 Codebase successfully synthesized and verified in {elapsed_time}s! Navigate to the 'Project Code Explorer' tab to view your software.")
            else:
                st.warning(f"Process completed with exit code {return_code} ({elapsed_time}s). Check the execution stream above for details.")

# ---------------------------------------------------------------------------
# TAB 2: Project Code Explorer
# ---------------------------------------------------------------------------
with tab_explorer:
    st.markdown("<h3 style='margin-top:0; font-weight: 700;'>📂 Generated Codebases & Artifacts</h3>", unsafe_allow_html=True)
    projects = get_workspace_projects()

    if not projects:
        st.info("No projects generated in workspace/ yet. Return to the **'Project Launchpad'** tab to generate your first software repository!")
    else:
        project_names = [p.name for p in projects]
        selected_project_name = st.selectbox("Select Project Repository", project_names)
        selected_project_path = WORKSPACE_OUTPUT_DIR / selected_project_name

        if selected_project_path.exists():
            col_tree, col_view = st.columns([1, 2.5], gap="large")

            all_files = [f for f in selected_project_path.rglob("*") if f.is_file() and not any(p.startswith(".") for p in f.parts)]

            with col_tree:
                st.markdown(f"**Project File Tree ({len(all_files)} files)**")
                file_rel_paths = [str(f.relative_to(selected_project_path)) for f in all_files]

                if file_rel_paths:
                    selected_rel_file = st.selectbox("Choose File to Inspect", file_rel_paths)
                    selected_file_path = selected_project_path / selected_rel_file

                    st.markdown("---")
                    zip_data = create_project_zip(selected_project_path)
                    st.download_button(
                        label="📦 Download Complete Project (.zip)",
                        data=zip_data,
                        file_name=f"{selected_project_name}.zip",
                        mime="application/zip",
                        type="primary",
                        use_container_width=True
                    )
                else:
                    st.write("No files in this project directory.")
                    selected_file_path = None

            with col_view:
                if selected_file_path and selected_file_path.exists():
                    st.markdown(f"#### 📄 `{selected_rel_file}`")
                    file_ext = selected_file_path.suffix.lstrip(".").lower()
                    
                    lang_map = {
                        "py": "python",
                        "js": "javascript",
                        "ts": "typescript",
                        "html": "html",
                        "css": "css",
                        "json": "json",
                        "md": "markdown",
                        "yaml": "yaml",
                        "yml": "yaml",
                        "txt": "text",
                    }
                    lang = lang_map.get(file_ext, "text")

                    try:
                        content = selected_file_path.read_text(encoding="utf-8", errors="replace")
                        if file_ext == "md":
                            tab_rendered, tab_raw = st.tabs(["👁️ Rendered Document View", "📝 Raw Markdown Source"])
                            with tab_rendered:
                                st.markdown(content)
                            with tab_raw:
                                st.code(content, language="markdown", line_numbers=True)
                        else:
                            st.code(content, language=lang, line_numbers=True)
                    except Exception as e:
                        st.error(f"Error loading file content: {e}")

# ---------------------------------------------------------------------------
# TAB 3: Architecture & Viva Presentation Guide
# ---------------------------------------------------------------------------
with tab_arch:
    st.markdown("<h3 style='margin-top:0; font-weight: 700;'>🎓 Academic Presentation & Viva Guide</h3>", unsafe_allow_html=True)
    st.caption("Reference slides and talking points for project viva, seminar evaluations, and evaluator defense:")

    st.markdown("""
    #### 1. Core Engineering Principle: `Code = SOP(Team)`
    Unlike traditional code generation tools that rely on a single large prompt, **AgentDev** implements **Standard Operating Procedures (SOPs)**:
    * **Role Decomposition:** Complex engineering challenges are divided across dedicated specialized agents.
    * **Context Isolation:** Each agent receives only its required context, eliminating context saturation and hallucinations.
    * **Iterative Peer Review:** Every module is verified by QA before the codebase is finalized.
    """)

    st.markdown("#### 2. Multi-Agent SDLC Sequence Flow")
    st.markdown("""
    ```mermaid
    sequenceDiagram
        autonumber
        actor User as 👤 Human Stakeholder
        participant PM as 📋 Product Manager
        participant ARCH as 🏗️ Software Architect
        participant EVE as 📊 Project Manager
        participant ENG as 💻 Software Engineer
        participant QA as 🧪 QA Engineer

        User->>PM: Natural Language Software Requirement
        Note over PM: Elicits requirements & user stories
        PM->>ARCH: Product Requirement Document (PRD)
        Note over ARCH: Defines System Architecture & APIs
        ARCH->>EVE: System Design & Class Diagrams
        Note over EVE: Maps dependencies into task list
        EVE->>ENG: Task Specifications & File List
        Note over ENG: Writes clean Python implementation
        ENG->>QA: Generated Source Code
        Note over QA: Performs static analysis & peer review
        QA-->>ENG: Verification Approval & Code Review
        ENG->>User: Complete Executable Repository
    ```
    """)

    vcol1, vcol2 = st.columns(2, gap="large")
    with vcol1:
        st.markdown("""
        #### 3. Agent Responsibilities Matrix
        | Role | Key Output Artifact | Primary Focus |
        | :--- | :--- | :--- |
        | **Product Manager** | `prd.md` | User stories, competitive analysis |
        | **Architect** | `system_design.md` | Data structures, sequence diagrams |
        | **Project Manager** | `tasks.md` | File dependency graph, task breakdown |
        | **Engineer** | Source code (`*.py`) | Clean implementation, docstrings |
        | **QA Engineer** | Review report | Verification, code review |
        """)
    with vcol2:
        st.markdown("""
        #### 4. Typical Viva Questions & Answers
        * **Q: Why multi-agent instead of a single prompt to ChatGPT?**
          * **A:** Single-prompt generation suffers from context saturation and attention dilution. Multi-agent SOPs enforce strict division of cognitive labor, reducing hallucinations and guaranteeing multi-file coherence.
        * **Q: How do agents coordinate?**
          * **A:** Via an asynchronous publish-subscribe message pool and shared environment memory, adhering strictly to structured Pydantic schemas.
        """)

# ---------------------------------------------------------------------------
# TAB 4: System Diagnostics
# ---------------------------------------------------------------------------
with tab_diag:
    st.markdown("<h3 style='margin-top:0; font-weight: 700;'>⚙️ System Environment & Diagnostics</h3>", unsafe_allow_html=True)
    dcol1, dcol2 = st.columns(2, gap="large")

    with dcol1:
        st.markdown("#### Python Runtime Environment")
        st.write(f"**Python Executable:** `{sys.executable}`")
        st.write(f"**Python Version:** `{sys.version.split()[0]}`")
        st.write(f"**Virtual Env Active:** `{'Yes (.venv)' if '.venv' in sys.executable else 'System'}`")
        st.write(f"**Workspace Root:** `{WORKSPACE_DIR}`")

    with dcol2:
        st.markdown("#### Storage & Workspace Status")
        st.write(f"**Output Directory:** `{WORKSPACE_OUTPUT_DIR}`")
        st.write(f"**Config File:** `{CONFIG_PATH}` (`{'Found' if CONFIG_PATH.exists() else 'Missing'}`)")
        total_projects = len(get_workspace_projects())
        st.write(f"**Projects Generated:** `{total_projects}`")

    st.markdown("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;'>", unsafe_allow_html=True)
    st.markdown("#### Quick Launch Tip for Presentations")
    st.code("agentdev \"Create a 2048 game in Python with Tkinter\" --project-name \"game_2048\"", language="powershell")
