$body = @{
    action = "navigate"
    params = @{
        url = "https://www.google.com/search?q=BTCUSD+news"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8765/execute" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json
