@echo off
echo ============================================================
echo EquiGrade - Installing All Backend & Frontend Dependencies
echo ============================================================

echo.
echo [1/2] Installing Python Backend Dependencies...
cd /d "%~dp0Backend"
python -m pip install -r requirements.txt

echo.
echo [2/2] Installing React Frontend Dependencies...
cd /d "%~dp0react-app"
npm install

echo.
echo ============================================================
echo All dependencies installed successfully!
echo ============================================================
pause
