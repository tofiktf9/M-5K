@echo off
chcp 65001 >nul
cd /d "%~dp0backend"
if not exist .env copy .env.example .env >nul
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo فشل تثبيت الحزم. تأكد من تثبيت Node.js ومن الاتصال بالانترنت.
    pause
    exit /b 1
  )
)
call npm start
pause
