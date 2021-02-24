@echo off

del /S /Q %~dp0\LibreHardwareMonitorLib\bin\Release >nul
del /S /Q %~dp0\Measure.Common\bin\Release >nul
del /S /Q %~dp0\Measure.Win\bin\Release >nul
dotnet publish %~dp0\Measure.Win -c Release -o %~dp0\Measure.Win\bin\Publish -f net5.0-windows -r win-x64 --self-contained true -p%:PublishSingleFile=true -p%:PublishTrimmed=true