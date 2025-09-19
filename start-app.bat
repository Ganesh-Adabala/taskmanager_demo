@echo off
echo Starting TaskManager Demo Application...
echo.

echo Starting .NET API Server...
start "TaskManager API" powershell -Command "cd 'c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\TaskManager.Api\TaskManager.Api'; dotnet run"

echo Waiting for API to start...
timeout /t 5 /nobreak >nul

echo Starting React UI...
start "TaskManager UI" powershell -Command "cd 'c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\task-manager-ui'; npm start"

echo.
echo Both applications are starting...
echo - API will be available at: http://localhost:5000
echo - React UI will be available at: http://localhost:3000
echo.
echo Press any key to stop both applications...
pause >nul

echo Stopping applications...
taskkill /f /im "dotnet.exe" 2>nul
taskkill /f /im "node.exe" 2>nul
echo Applications stopped.