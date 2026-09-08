@echo off
echo Starting EquiGrade FastAPI Backend...
cd /d "%~dp0Backend"
uvicorn main:app --reload --port 5000
pause
