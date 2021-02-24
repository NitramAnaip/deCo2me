@echo off
del /S /Q %~dp0\Measure.Common\bin\Release >nul
del /S /Q %~dp0\Measure.Unix\bin\Release >nul
dotnet publish %~dp0\Measure.Unix -c Release -o %~dp0\Measure.Unix\bin\Publish\Linux64 -f net5.0 -r linux-x64 --self-contained true -p%:PublishSingleFile=true -p%:PublishTrimmed=true