#!/bin/bash

touch ~/Library/LaunchAgents/deCo2me.plist
chmod a+x ~/Library/LaunchAgents/deCo2me.plist  
sudo echo "
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
   <key>Label</key>
   <string>user.loginscript</string>
   <key>ProgramArguments</key>
   <array><string>/Users/adri/Desktop/deCo2me/publish/mac/deCo2me/back/main.py</string></array>
   <key>RunAtLoad</key>
   <true/>
</dict>
</plist>
"

#to check gui to bqsh: https://stackoverflow.com/questions/3016337/mac-os-x-run-shell-script-from-the-desktop-gui

