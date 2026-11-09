@echo off
title AgentDev FastAPI Backend Server
echo Starting AgentDev Backend REST API on port 8000...
cd /d "%~dp0"
call .venv\Scripts\activate.bat
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
pause
