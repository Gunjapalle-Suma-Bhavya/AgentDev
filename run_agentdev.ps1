# AgentDev Launcher for Windows PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Starting AgentDev Autonomous Software Engineering Platform" -ForegroundColor Cyan
Write-Host " FastAPI REST Server + Modern Multi-Agent Web IDE" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan

$VenvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    $VenvPython = "python"
}

Write-Host "`nLaunching web browser at http://localhost:8000..." -ForegroundColor Green
Start-Process "http://localhost:8000"

Write-Host "Starting Uvicorn server on http://0.0.0.0:8000 ...`n" -ForegroundColor Yellow
& $VenvPython -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
