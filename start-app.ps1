# TaskManager Demo Startup Script
Write-Host "Starting TaskManager Demo Application..." -ForegroundColor Green
Write-Host ""

# Start API in background
Write-Host "Starting .NET API Server..." -ForegroundColor Yellow
$apiPath = "c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\TaskManager.Api\TaskManager.Api"
Start-Process powershell -ArgumentList "-Command", "cd '$apiPath'; dotnet run" -WindowStyle Normal

# Wait a bit for API to start
Write-Host "Waiting for API to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start React UI
Write-Host "Starting React UI..." -ForegroundColor Yellow
$uiPath = "c:\Users\jatinderpal.singh\source\repos\GreatLearning\DemoProjectDay7\taskmanager_demo\task-manager-ui"
Start-Process powershell -ArgumentList "-Command", "cd '$uiPath'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Both applications are starting..." -ForegroundColor Green
Write-Host "- API will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- React UI will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop this script. You may need to manually stop the applications." -ForegroundColor Red

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "Stopping script..." -ForegroundColor Red
}