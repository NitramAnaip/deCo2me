
import time
import json
from datetime import date
import os
import subprocess

#from pynput.keyboard import Key, Controller
from data_gatherer import get_pc_name, fetch_rt_data_usage, fetch_battery_cons, folder_creation

product, manufacturer = get_pc_name()

# Ensure the working directory is the script's directory
os.chdir(os.path.dirname(os.path.realpath(__file__)))

json_folder = "./data/"

if(not os.path.exists(json_folder)):
    os.makedirs(json_folder)

global_json_path = json_folder + "global.json"
global_json = {
    "computerManufacturer": manufacturer,
    "computerModel": product
}

with open (global_json_path, "w+") as f:
    json.dump(global_json, f)


period = 60





while True:
    today = str(date.today())
    
    json_file_path = json_folder + today + ".json"

    folder_creation(json_file_path)# If someone leaves the computer on during the night we still need the program to create a new file as 
                                    # the date xhanges. Thus we must leave this function call in the while 
    with open (json_file_path, "r") as f:
        json_file = json.load(f)

    json_file["timestamps"].append(int(time.time()))

    net_wired = fetch_rt_data_usage(str(today), True)
    net_wireless = fetch_rt_data_usage(str(today), False)
    time.sleep(period)
    next_wired = fetch_rt_data_usage(str(today), True)
    next_wireless = fetch_rt_data_usage(str(today), False)
    for i in range (2):
        net_wired[i] = float(next_wired[i]) - float(net_wired[i])
        net_wireless[i] = float(next_wireless[i]) - float(net_wireless[i])
    json_file["netUpWired"].append(net_wired[1])
    json_file["netDownWired"].append(net_wired[0])
    json_file["netUpWireless"].append(net_wireless[1])
    json_file["netDownWireless"].append(net_wireless[0])

    battery_power = fetch_battery_cons()
    json_file["power"].append(battery_power)
    

    print(json_file)
    with open (json_file_path, "w") as f:
        json.dump(json_file, f)

    












