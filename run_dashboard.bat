@echo off
title Multi-Agent Software Engineering Dashboard
echo Starting Streamlit Dashboard...
cd /d "%~dp0"
call .venv\Scripts\activate.bat
streamlit run web_app.py
pause
