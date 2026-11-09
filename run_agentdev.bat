@echo off
title AgentDev Full-Stack AI Platform
echo =====================================================================
echo  Starting AgentDev Autonomous Software Engineering Platform
echo  FastAPI REST Server + React TypeScript Vite Frontend
echo =====================================================================
echo.

cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
    set "PYTHON_EXE=.venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo Starting FastAPI server on http://localhost:8000 ...
start http://localhost:8000
"%PYTHON_EXE%" -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload

pause
