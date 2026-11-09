# Multi-Agent Software Engineering Dashboard Launcher
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
& "$ScriptDir\.venv\Scripts\streamlit.exe" run "$ScriptDir\web_app.py"
