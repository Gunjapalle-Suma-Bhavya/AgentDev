@echo off
title AgentDev - React Vite Dev Server (HMR)
echo =====================================================================
echo  Starting Vite React Development Server with Hot-Module-Reload
echo  Proxies /api requests to FastAPI on http://localhost:8000
echo =====================================================================
echo.

cd /d "%~dp0\frontend"
npm run dev
pause
