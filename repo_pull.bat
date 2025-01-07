@echo on
color 0a
git fetch
git pull
git status
timeout /t 2 /nobreak >nul
exit