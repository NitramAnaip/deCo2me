@echo off

del /S /Q %~dp0\back\Measure\LibreHardwareMonitorLib\bin >nul
del /S /Q %~dp0\back\Measure\LibreHardwareMonitorLib\obj >nul

del /S /Q %~dp0\back\Measure\Measure.Common\bin >nul
del /S /Q %~dp0\back\Measure\Measure.Common\obj >nul

del /S /Q %~dp0\back\Measure\Measure.Unix\bin >nul
del /S /Q %~dp0\back\Measure\Measure.Unix\obj >nul

del /S /Q %~dp0\back\Measure\Measure.Win\bin >nul
del /S /Q %~dp0\back\Measure\Measure.Win\obj >nul

del /S /Q %~dp0\back\ServiceRunner\bin >nul
del /S /Q %~dp0\back\ServiceRunner\obj >nul

del /S /Q %~dp0\front\out

del /S /Q %~dp0\publish