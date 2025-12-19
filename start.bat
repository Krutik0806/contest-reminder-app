@echo off
echo ========================================
echo  Contest Reminder App - Quick Start
echo ========================================
echo.

echo Checking if MongoDB is running...
net start | findstr /i "MongoDB" >nul
if errorlevel 1 (
    echo [!] MongoDB is not running
    echo Starting MongoDB...
    net start MongoDB
) else (
    echo [✓] MongoDB is running
)

echo.
echo ========================================
echo  Starting Backend Server
echo ========================================
cd backend
start cmd /k "npm run dev"

timeout /t 3 >nul

echo.
echo ========================================
echo  Starting Frontend Server
echo ========================================
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo [✓] Both servers are starting!
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo ========================================
echo.
pause
