@echo off
call %~dp0\back\build-win.bat
call %~dp0\front\build-win.bat

mkdir %~dp0\publish\windows
mkdir %~dp0\publish\windows\back
mkdir %~dp0\publish\windows\front

xcopy /S /Q /Y %~dp0\back\Measure\Measure.Win\bin\Publish\*.exe %~dp0\publish\windows\back
xcopy /S /Q /Y %~dp0\back\Measure\Measure.Win\bin\Publish\*.dll %~dp0\publish\windows\back
xcopy /S /Q /Y %~dp0\back\Measure\Measure.Win\bin\Publish\*.sys %~dp0\publish\windows\back

xcopy /S /Q /Y %~dp0\back\ServiceRunner\bin\Publish\*.exe %~dp0\publish\windows\back
xcopy /S /Q /Y %~dp0\back\ServiceRunner\bin\Publish\*.dll %~dp0\publish\windows\back
xcopy /S /Q /Y %~dp0\back\ServiceRunner\bin\Publish\*.cmd %~dp0\publish\windows\back

xcopy /S /Q /Y %~dp0\src\* %~dp0\publish\windows\back

xcopy /S /Q /Y %~dp0\front\out\deco2me-win32-x64\* %~dp0\publish\windows\front

xcopy /S /Q /Y %~dp0\setup\windows\* %~dp0\publish\windows

move %~dp0\publish\windows\back\Measure.Win.exe %~dp0\publish\windows\back\Measure.exe