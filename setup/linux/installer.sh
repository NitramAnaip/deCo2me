#!/bin/bash


# this supposes the files I'm talking about are in the in the same directory as the bash
sudo touch /lib/systemd/system/deCo2me.service
sudo chmod 666 /lib/systemd/system/deCo2me.service
sudo echo "[Unit]
Description=deCo2me Service
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/python3 /usr/bin/deCo2me/back/main.py


[Install]
WantedBy=multi-user.target
" > /lib/systemd/system/deCo2me.service

#Now the unit file has been defined we can tell systemd to start it during the boot sequence :
sudo systemctl daemon-reload
sudo systemctl enable deCo2me.service



sudo mv deCo2me /usr/bin/


sudo touch /usr/share/applications/deCo2me.desktop
sudo chmod 666 /usr/share/applications/deCo2me.desktop
sudo echo "
#!/usr/bin/env 
[Desktop Entry]
Version=1.0
Name=deCo2me
Comment=Monitors eqCo2
Keywords=monitor;
Exec=gnome-terminal -e \"bash -c '. /usr/bin/deCo2me/front/resources/app/starter.sh;$SHELL'\"
Icon=/usr/bin/deCo2me/front/logo.jpeg
Terminal=true
Type=Application
StartupNotify=true
" > /usr/share/applications/deCo2me.desktop


#The permission on the unit file needs to be set to 644 :
sudo chmod 644 /lib/systemd/system/deCo2me.service
