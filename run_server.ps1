# AgentDev FastAPI Backend Server Launcher
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
& "$ScriptDir\.venv\Scripts\uvicorn.exe" server:app --host 0.0.0.0 --port 8000 --reload
