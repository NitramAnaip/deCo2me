
import time
import json
from datetime import date
import subprocess

#from pynput.keyboard import Key, Controller
from data_gatherer import get_pc_name, fetch_rt_data_usage, fetch_battery_cons, folder_creation

product, manufacturer = get_pc_name()

json_folder = "/usr/bin/deCo2me/front/data/"
global_json_path = json_folder + "global.json"
global_json = {
    "computerManufacturer": manufacturer,
    "computerModel": product
}

with open (global_json_path, "w+") as f:
    json.dump(global_json, f)


period = 10

"""

def test():
    keyboard = Controller()
    command = ['./NetMonTest']
    # run vnstat -i wlo1 -d to see what the value of p is
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    print("here")
    keyboard.press('.')
    keyboard.release('.')

    bytes_data = p.stdout.read()


    
    print("now")
    retcode = p.wait()
    print("dai")

    # retrieves data and transforms it
    s=str(bytes_data,'utf-8')
    a = s.split("\n")
    print(a)


test()
"""




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

    











