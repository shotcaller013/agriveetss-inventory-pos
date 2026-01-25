@echo off
title Agriveetss POS System Loader
color 0b

echo ==========================================
echo   STARTING AGRIVEETSS POS SYSTEM
echo ==========================================

:: 1. START XAMPP MYSQL (Required for Database)
echo [1/3] Starting MySQL...
cd /d "C:\xampp"
start "" "mysql_start.exe"

:: 2. START FRONTEND (Assumes npm/Node.js)
echo [2/3] Starting Frontend Server...
cd /d "C:\Users\bonto\Desktop\Agriveetss-inventory-POS\inventory-frontend"
start cmd /k "npm start"

:: 3. START POS BACKEND
echo [3/3] Starting POS Backend...
cd /d "C:\Users\bonto\Desktop\Agriveetss-inventory-POS\inventory-pos"
:: If this is also a Node project, use npm start. 
:: If it's PHP/Laravel, use: start cmd /k "php artisan serve"
start cmd /k "npm start"

echo ==========================================
echo   SYSTEM BOOTING - PLEASE WAIT...
echo ==========================================
timeout /t 5

:: 4. OPEN BROWSER
start "" "http://localhost:5173/"

exit