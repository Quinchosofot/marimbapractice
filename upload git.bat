@echo off
echo ====== Subiendo cambios a GitHub ======
git add .
git commit -m "adding persistence in backend"
git push
echo ====== Listo. Cambios subidos a GitHub. ======
pause