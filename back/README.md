# Backend

This directory is for the back end of the application.

- The `Measure` program is used to get:
    - The computer's name (on every OS)
    - The amount of uploaded / downloaded data (on every OS)
    - The computer's model (on Windows)
    - The computer's estimated power consumption (on Windows)
- The `ServiceRunner` program is used to run the Python backend as a background service on Windows. When started, it runs `./WinService.cmd` in the background

For each program, a `build-*` (Unix) or `build-*.bat` (Windows) script is available to build it. Building C# programs requires the .NET CLI: https://dotnet.microsoft.com/download/dotnet/5.0

The global `build-*` (Unix) and `build-*.bat` (Windows) scripts can be used to build all programs at once

When building a program, the result in saved in `/bin/Publish`.

<u>Remark</u>: `ServiceRunner` can only be built on Windows