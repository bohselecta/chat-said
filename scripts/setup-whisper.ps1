param([string]$ModelName = "base.en")
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Vendor = Join-Path $Root ".local\whisper.cpp"
New-Item -ItemType Directory -Force (Join-Path $Root ".local") | Out-Null
if (-not (Test-Path (Join-Path $Vendor ".git"))) {
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp $Vendor
} else {
  git -C $Vendor pull --ff-only
}
cmake -S $Vendor -B (Join-Path $Vendor "build") -DCMAKE_BUILD_TYPE=Release
cmake --build (Join-Path $Vendor "build") --config Release --parallel
$ModelDir = Join-Path $Vendor "models"
$ModelPath = Join-Path $ModelDir "ggml-$ModelName.bin"
$ModelUrl = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-$ModelName.bin"
Invoke-WebRequest -Uri $ModelUrl -OutFile $ModelPath
$Bin = Join-Path $Vendor "build\bin\Release\whisper-cli.exe"
if (-not (Test-Path $Bin)) { $Bin = Join-Path $Vendor "build\bin\whisper-cli.exe" }
$Command = "$Bin -m $ModelPath -f {input} -otxt -of {output}"
"`$env:TAURUS_WHISPER_COMMAND = '$Command'" | Set-Content (Join-Path $Root ".taurus-whisper.ps1")
Write-Host "Local whisper.cpp configured. Start with .\scripts\start.ps1"
