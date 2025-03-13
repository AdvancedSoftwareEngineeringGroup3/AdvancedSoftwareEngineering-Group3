@echo off
setlocal enabledelayedexpansion

:: Get the IPv4 address
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set ip=%%A
    set ip=!ip:~1!
)

:: Check if IP was found
if not defined ip (
    echo Could not find IPv4 address.
    exit /b 1
)

:: Read the .env file and update the first line
(for /f "tokens=*" %%L in (.env) do (
    if not defined firstline (
        echo EXPO_PUBLIC_API_URL=http://!ip!:8000
        set firstline=1
    ) else (
        echo %%L
    )
)) > .env.tmp

:: Replace original .env with updated one
move /y .env.tmp .env > nul

echo Updated .env with IP !ip!
