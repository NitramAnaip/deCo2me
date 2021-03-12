@echo off

setlocal

:: These must be the same in install.bat and uninstall.bat
set APPNAME=DeCo2Me
set EXE_NAME=deco2me.exe
set SVC_NAME=ServiceRunner.exe

:: This command sets errorLevel to a nonzero value if the shell doesn't have admin rights
net session >nul 2>&1

if %errorLevel% == 0 (
    echo Downloading Python...
    powershell -Command "Invoke-WebRequest https://www.python.org/ftp/python/3.9.2/python-3.9.2-amd64.exe -OutFile '%~dp0\python-setup.exe'"

    echo Installing Python...
    start /W %~dp0\python-setup.exe /passive InstallAllUsers=1 PrependPath=1
    del /Q %~dp0\python-setup.exe

    echo Installing %APPNAME%...

    echo Installing service...
    sc create %APPNAME% binpath="%~dp0\back\%SVC_NAME%" start=auto
    sc start %APPNAME%

    echo Creating shortcuts...
    powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\%APPNAME%.lnk');$s.TargetPath='%~dp0\front\%EXE_NAME%';$s.WorkingDirectory='%~dp0\front';$s.Save()"
    powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('C:\ProgramData\Microsoft\Windows\Start Menu\Programs\%APPNAME%.lnk');$s.TargetPath='%~dp0\front\%EXE_NAME%';$s.WorkingDirectory='%~dp0\front';$s.Save()"

    echo %APPNAME% installed successfully !
) else (
    echo Please execute install.bat as administrator to install the app.
)

pause

endlocal