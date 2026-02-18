$body = @{
    action = "getHtml"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8765/execute" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json
