@echo off
echo Starting Code Vibes (backend :8000 + frontend :5173)
echo Demo admin : admin@thecodevibe.io / admin123
echo Demo member: builder@thecodevibe.io / builder123
echo.

start "CodeVibes-Backend" cmd /k "cd /d %~dp0backend && python main.py"
timeout /t 2 /nobreak >nul
start "CodeVibes-Frontend" cmd /k "cd /d %~dp0frontend && if not exist node_modules npm install && npm run dev"
echo Both windows opened. Close them to stop the servers.
