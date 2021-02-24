@echo off
call %~dp0\back\build-linux.bat
call %~dp0\front\build-linux.bat

mkdir %~dp0\publish\linux

xcopy /S /Q /Y %~dp0\back\Measure\Measure.Unix\bin\Publish\Linux64\Measure.Unix %~dp0\publish\linux\

xcopy /S /Q /Y %~dp0\src\* %~dp0\publish\linux

xcopy /S /Q /Y %~dp0\front\out\deco2me-linux-x64\* %~dp0\publish\linux

xcopy /S /Q /Y %~dp0\setup\linux\* %~dp0\publish\linux

move %~dp0\publish\linux\Measure.Unix %~dp0\publish\linux\Measure