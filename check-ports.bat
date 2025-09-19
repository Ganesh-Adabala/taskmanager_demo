@echo off
echo ===========================================
echo   TASK MANAGER - PORT VERIFICATION
echo ===========================================
echo.

echo [1] Checking Current Port Usage...
echo.
echo Checking if port 3000 (React Frontend) is in use:
netstat -ano | findstr ":3000" && echo "   ✓ Port 3000 is in use" || echo "   ✗ Port 3000 is free"

echo.
echo Checking if port 5001 (API Backend) is in use:
netstat -ano | findstr ":5001" && echo "   ✓ Port 5001 is in use" || echo "   ✗ Port 5001 is free"

echo.
echo Checking if old port 5000 is still occupied:
netstat -ano | findstr ":5000" && echo "   ⚠ Port 5000 is still occupied" || echo "   ✓ Port 5000 is free"

echo.
echo ===========================================
echo   EXPECTED CONFIGURATION:
echo ===========================================
echo Frontend (React):     http://localhost:3000
echo Backend (API):        http://localhost:5001
echo API Endpoints:        http://localhost:5001/api/*
echo ===========================================
echo.

echo [2] Testing API Endpoint Availability...
echo.
echo Testing if API is responding on port 5001:
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:5001/api/users/check-username/test 2>nul || echo "   ✗ API not responding on port 5001"

echo.
echo ===========================================
echo   TO START APPLICATIONS:
echo ===========================================
echo.
echo 1. Start API Backend:
echo    cd "c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\TaskManager.Api\TaskManager.Api"
echo    dotnet run
echo.
echo 2. Start React Frontend:
echo    cd "c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\task-manager-ui"
echo    npm start
echo.
echo ===========================================
pause