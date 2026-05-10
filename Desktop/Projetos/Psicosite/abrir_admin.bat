@echo off
setlocal
title Admin Panel - Psicosite

echo ==================================================
echo       INICIANDO PAINEL ADMINISTRATIVO
echo ==================================================
echo.
echo 1. Certifique-se de que o servidor principal esta rodando (npm run dev)
echo 2. O painel sera aberto em: http://localhost:3001/keystatic
echo.
echo Pressione qualquer tecla para abrir o painel no navegador...
pause > nul

start http://localhost:3001/keystatic

echo.
echo Painel aberto! Continue com o terminal do 'npm run dev' aberto.
echo.
pause
