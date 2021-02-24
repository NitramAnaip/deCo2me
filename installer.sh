#!/bin/bash

# this supposes the files I'm talking about are in the in the same directory as the bash
sudo touch /lib/systemd/system/deCo2me.service
sudo chmod 666 /lib/systemd/system/deCo2me.service
sudo echo "[Unit]
Description=deCo2me Service
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/python3 /usr/local/bin/main.py


[Install]
WantedBy=multi-user.target
" > /lib/systemd/system/deCo2me.service

#The permission on the unit file needs to be set to 644 :
sudo chmod 644 /lib/systemd/system/deCo2me.service

mv back /usr/local/bin/

#Now the unit file has been defined we can tell systemd to start it during the boot sequence :
sudo systemctl daemon-reload
sudo systemctl enable myscript.service