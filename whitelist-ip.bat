@echo off
echo ===============================
echo MongoDB Atlas IP Whitelist Helper
echo ===============================
echo.
echo This script will help you add your current IP address to MongoDB Atlas whitelist.
echo.
echo Step 1: Getting your current public IP address...

curl -s https://api.ipify.org > ip.txt
if %errorlevel% neq 0 (
    echo Failed to get your IP address.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

set /p CURRENT_IP=<ip.txt
del ip.txt

echo Your current public IP address is: %CURRENT_IP%
echo.
echo Step 2: Follow these instructions to add your IP to MongoDB Atlas:
echo.
echo 1. Log in to MongoDB Atlas at: https://cloud.mongodb.com
echo 2. Select your cluster (e.g., "Cluster0")
echo 3. Click on "Network Access" in the left sidebar
echo 4. Click "Add IP Address"
echo 5. Enter your IP address: %CURRENT_IP%
echo 6. Add a comment like "My development machine"
echo 7. Click "Confirm"
echo.
echo Step 3: After adding your IP to the whitelist, wait about 1-2 minutes
echo         for the changes to propagate, then restart your server.
echo.
echo Would you like to copy your IP address to clipboard? (Y/N)
set /p COPY_CHOICE=

if /i "%COPY_CHOICE%"=="Y" (
    echo %CURRENT_IP% | clip
    echo IP address copied to clipboard!
)

echo.
echo After whitelisting your IP, restart your server with:
echo npm start
echo.
pause
