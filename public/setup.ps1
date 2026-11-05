<#
================================================================================
   BitLocker Administrator Pro - Windows Desktop Setup & Build Script (.NET 8)
================================================================================
   Script ini otomatis mengunduh / mengompilasi BitLocker Administrator Pro 
   menjadi file BitLockerAdminPro.exe di laptop Windows Anda.
#>

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   BitLocker Administrator Pro - Kompilasi Windows Asli" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Periksa hak akses Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "PERINGATAN: PowerShell belum dijalankan sebagai Administrator."
    Write-Host "Disarankan klik kanan PowerShell -> Run as Administrator agar dapat mengelola BitLocker." -ForegroundColor Yellow
}

# 2. Periksa .NET 8 SDK
try {
    $dotnetVer = & dotnet --version 2>$null
    Write-Host "[OK] .NET SDK terdeteksi: v$dotnetVer" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Mengunduh & Memasang .NET 8 Desktop Runtime/SDK..." -ForegroundColor Yellow
    Write-Host "Silakan install .NET 8 SDK dari: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Red
}

$workDir = Join-Path $PWD "BitLockerAdminPro_Windows"
if (-not (Test-Path $workDir)) {
    New-Item -ItemType Directory -Path $workDir | Out-Null
}

Write-Host "Menyiapkan file proyek di: $workDir" -ForegroundColor White
Set-Location $workDir

# Perintah build
Write-Host "Menjalankan build single-file .EXE..." -ForegroundColor Cyan
& dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "   [SUKSES] BitLockerAdminPro.exe berhasil dibuat!" -ForegroundColor Green
    Write-Host "   Lokasi File: $workDir\publish\BitLockerAdminPro.exe" -ForegroundColor Green
    Write-Host "   Silakan klik kanan file .exe tersebut dan pilih:" -ForegroundColor White
    Write-Host "   -> 'Run as administrator'" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Kompilasi gagal. Pastikan .NET 8 SDK telah terpasang di komputer Anda." -ForegroundColor Red
}
