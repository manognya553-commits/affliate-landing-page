$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\Sree sisters\.gemini\antigravity-ide\brain\801d1ad7-9413-42df-9894-c62d6828d2aa"
$userDir = "$env:TEMP\edge_profile_capture2"

if (-not (Test-Path $userDir)) {
    New-Item -ItemType Directory -Path $userDir -Force | Out-Null
}

$shotPath = Join-Path $outDir "stage1_telugu_hero_1440.png"

$args = @(
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--user-data-dir=$userDir",
    "--screenshot=$shotPath",
    "--window-size=1440,900",
    "--virtual-time-budget=2000",
    "http://localhost:5173/"
)

$p = Start-Process -FilePath $edge -ArgumentList $args -Wait -PassThru
Write-Host "ExitCode: $($p.ExitCode)"
Write-Host "Screenshot exists: $(Test-Path $shotPath)"
