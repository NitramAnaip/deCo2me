
import time
import json
from datetime import date

from data_gatherer import get_pc_name, fetch_rt_data_usage, fetch_battery_cons, folder_creation



print(time.time())

period = 300



def test() -> int:
    return "patate"


test()

while True:
    today = str(date.today())
    json_folder = "/home/martin/Desktop/deCo2me/deCo2me/"
    json_file_path = json_folder + today + ".json"

    folder_creation(json_file_path)# If someone leaves the computer on during the night we still need the program to create a new file as 
                                    # the date xhanges. Thus we must leave this function call in the while 
    with open (json_file_path, "r") as f:
        json_file = json.load(f)

    json_file["timestamps"].append(int(time.time()))

    net_wired = fetch_rt_data_usage(str(today), "eno1")
    net_wireless = fetch_rt_data_usage(str(today), "wlo1")
    json_file["netUpWired"].append(net_wired[1])
    json_file["netDownWired"].append(net_wired[0])
    json_file["netUpWireless"].append(net_wireless[1])
    json_file["netDownWireless"].append(net_wireless[0])

    battery_power = fetch_battery_cons()
    json_file["power"].append(battery_power)
    

    print(json_file)
    with open (json_file_path, "w") as f:
        json.dump(json_file, f)

    time.sleep(period)