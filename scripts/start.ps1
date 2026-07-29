$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
$nodeVersion = (& node -p "process.versions.node").Trim()
if (-not $nodeVersion) { throw "Node.js 22.5 or newer is required." }
$major = [int]($nodeVersion.Split('.')[0])
if ($major -lt 22) { throw "Node.js 22.5 or newer is required; found $nodeVersion." }
$whisperEnv = Join-Path $Root ".taurus-whisper.ps1"
if (Test-Path $whisperEnv) { . $whisperEnv }
& node (Join-Path $Root "apps/forge/server.mjs")
