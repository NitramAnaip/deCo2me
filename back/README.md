# Backend

This directory is for the back end of the application.

- The `Measure` program is used to get:
    - The computer's name (on every OS)
    - The amount of uploaded / downloaded data (on every OS)
    - The computer's model (on Windows)
    - The computer's estimated power consumption (on Windows)
- The `ServiceRunner` program is used to run the Python backend as a background service on Windows. When started, it runs `./WinService.cmd` in the background