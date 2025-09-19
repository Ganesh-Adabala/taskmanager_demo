@echo off
echo Starting Task Manager Demo Application...
echo.

echo [1/2] Starting .NET API Backend...
start "TaskManager API" cmd /k "cd /d \"c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\TaskManager.Api\TaskManager.Api\" && dotnet run"

echo [2/2] Starting React Frontend...
timeout /t 5 /nobreak >nul
start "TaskManager UI" cmd /k "cd /d \"c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\task-manager-ui\" && npm start"

echo.
echo Both applications are starting...
echo API will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul