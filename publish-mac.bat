@echo off
call %~dp0\back\build-mac.bat
call %~dp0\front\build-mac.bat

mkdir %~dp0\publish\mac

xcopy /S /Q /Y %~dp0\back\Measure\Measure.Unix\bin\Publish\*.exe %~dp0\publish\mac
xcopy /S /Q /Y %~dp0\back\Measure\Measure.Unix\bin\Publish\*.dll %~dp0\publish\mac

xcopy /S /Q /Y %~dp0\src\* %~dp0\publish\mac

xcopy /S /Q /Y %~dp0\front\out\deco2me-darwin-x64\* %~dp0\publish\mac

xcopy /S /Q /Y %~dp0\setup\mac\* %~dp0\publish\mac

move %~dp0\publish\mac\Measure.Unix.exe %~dp0\publish\mac\Measure.exe