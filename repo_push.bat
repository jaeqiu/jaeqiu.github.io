@echo on
color 0a
git status
git add .
git commit -m "autosave"
git push
timeout /t 2 /nobreak >nul
exit