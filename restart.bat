@echo off
echo Stopping existing server processes...
taskkill /im node.exe /F

echo Installing dependencies...
cd backend
npm install
cd ..

echo Starting server...
cd backend
node index.js
