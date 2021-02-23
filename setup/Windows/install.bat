@echo off

setlocal

:: These must be the same in install.bat and uninstall.bat
set APPNAME=DeCo2Me
set EXE_NAME=deco2me.exe
set SVC_NAME=ServiceRunner.exe

:: This command sets errorLevel to a nonzero value if the shell doesn't have admin rights
net session >nul 2>&1

if %errorLevel% == 0 (
    echo Installing %APPNAME%...

    echo Installing service...
    sc create %APPNAME% binpath="%CD%\%SVC_NAME%" start=auto
    sc start %APPNAME%

    echo Creating shortcut...
    powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\%APPNAME%.lnk');$s.TargetPath='%CD%\%EXE_NAME%';$s.WorkingDirectory='%CD%';$s.Save()"

    echo %APPNAME% installed successfully !
    pause
) else (
    echo Please execute install.bat as administrator to install the app.
)

endlocal