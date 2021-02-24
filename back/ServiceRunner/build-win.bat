@echo off
dotnet publish %~dp0 -c Release -o %~dp0\bin\Publish -f net5.0-windows -r win-x64 --self-contained true -p%:PublishSingleFile=true -p%:PublishTrimmed=true