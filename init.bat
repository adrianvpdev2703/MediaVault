@echo off
echo Iniciando Personal DB...
:: El comando /d asegura que cambie de disco (de C: a D:) si es necesario
cd /d "D:\Program Files\VideosApp\app"
npm run dev
pause