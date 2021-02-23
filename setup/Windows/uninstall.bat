@echo off

setlocal

:: These must be the same in install.bat and uninstall.bat
set APPNAME=DeCo2Me
set EXE_NAME=deco2me.exe
set SVC_NAME=ServiceRunner.exe

:: This command sets errorLevel to a nonzero value if the shell doesn't have admin rights
net session >nul 2>&1

if %errorLevel% == 0 (
    echo Uninstalling %APPNAME%...

    echo Uninstalling service...
    sc stop %APPNAME%
    sc delete %APPNAME%

    echo Deleting shortcut...
    del "%USERPROFILE%\Desktop\%APPNAME%.lnk"

    echo %APPNAME% uninstalled successfully.
) else (
    echo Please execute uninstall.bat as administrator to install the app.
)

pause

endlocal