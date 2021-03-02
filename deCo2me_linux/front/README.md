# Frontend

This directory is for the front end of the application.

The frontend uses Electron to run on multiple platforms as a web app

## Installation

To install and run the application, one needs to:

- Clone the repository
- Install the application's dependencies with npm: `npm install`
- Run the application with npm: `npm start`

## Publishing

To build and publish the app, simply use npm with `npm run publish-platform` where `platform` is either `win`, `linux` or `mac`

To package the app without creating an installer on Windows, use `npm run package`