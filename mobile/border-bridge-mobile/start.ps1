# Auto-detect local IP and update .env before starting Expo
# Uses a UDP socket trick to find the IP your machine would use to reach the internet
$udp = New-Object System.Net.Sockets.UdpClient
$udp.Connect("8.8.8.8", 53)
$ip = ($udp.Client.LocalEndPoint).Address.ToString()
$udp.Close()

if (-not $ip -or $ip -eq '0.0.0.0') {
    Write-Host "Could not detect local IP. Falling back to localhost." -ForegroundColor Yellow
    $ip = "localhost"
}

Write-Host "Detected IP: $ip" -ForegroundColor Green

$envContent = @"
EXPO_PUBLIC_API_URL=http://${ip}:5000/api
EXPO_PUBLIC_WEB_URL=http://${ip}:5173
"@

Set-Content -Path "$PSScriptRoot\.env" -Value $envContent
Write-Host "Updated .env with API URL: http://${ip}:5000/api" -ForegroundColor Cyan

npx expo start --tunnel
