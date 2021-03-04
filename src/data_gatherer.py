"""
Author: Martin PIANA
Date: December 2020

Notes: when using vnstat and powerstat the computer, and the software have to have been running for 300 seconds or so
Maybe worth putting a little note when downloading software: "Careful, must wait 300 seconds for it to be operational"
"""


"""
Todo:
 - Gather datasetfor computers manufacturing and electricity co2 cost
 - code same thing for mac and windows. Be careful to have same output from the code whatever the os

"""

import os
import platform
import subprocess
import json
from datetime import date




def folder_creation(json_file_path):
    
    if not os.path.isfile(json_file_path):
        #period in seconds
        json_file = {
            "timestamps": [],
            "netUpWired": [],
            "netDownWired": [],
            "netUpWireless": [],
            "netDownWireless": [],
            "power": []
        }

        with open (json_file_path, "w") as f:
            json.dump(json_file, f)

    return 0




units = {"MiB" : 10e5, "GiB" : 10e8, "KiB": 10e2}# not sure about KiB (maybe a lowercase)

data_center = 7.2*10e-11 # kwh per byte due to servers
network = {"wired": 4.29*10e-11, "wifi": 1.52*10e-11, "mobile": 8.84*10e-11} #kwh per byte due to network
# source : https://theshiftproject.org/wp-content/uploads/2019/10/Lean-ICT-Materials-Liens-%C3%A0-t%C3%A9l%C3%A9charger-r%C3%A9par%C3%A9-le-29-10-2019.pdf
# Seems to correspond more or less with IEA and GreenIT values
energetic_mix = {"France": 80,"USA":350} #g of Co2 per Kwh


def sub(command1, command2, command3='', command4='', command5=''):
    command = [command1, command2, command3, command4, command5]
    p = subprocess.Popen(command, stdout=subprocess.PIPE)

    bytes_data = p.stdout.read()

    retcode = p.wait()
    return str(bytes_data,'utf-8').replace('\r', '') #Convert CRLF to LF. Useful so that the rest of the code doesn't need to handle CRLF, which seems to be Windows specific


def fetch_rt_data_usage(date, wired):
    """
    ARGS: date must be entered as a float of format "2012-12-21", 
    network is the network interface we are focusing on. In my case its wlo1 but it depends whether its (wifi/network) or ethernet
    In order to get the total consumption I'll need to run it on all different types of networks 

    OUTPUTS: a list with [received, sent ] all in Bytes
    """

    """
    #***********With linux commands:
    command = ['vnstat', '-i', network, '-d']
    # run vnstat -i wlo1 -d to see what the value of p is
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    bytes_data = p.stdout.read()
    retcode = p.wait()


    # retrieves data and transforms it
    s=str(bytes_data,'utf-8')


    a = s.split("\n")
    #print(a)
    interesting = None
    try:
        for i in range (len(a)):
            if date in a[i]:
                interesting = a[i]
        a = interesting.split('|')

        #print(a)
        #Note: this might be something leading to mistakes(I visually saw that nbr 2 was where my interesting info was)
        tot = a[2]
        sent = a[1]
        net_data = [tot, sent]
        for i,d in enumerate (net_data):
            unit = ''.join(x for x in d if x.isalpha())
            quantity = ''.join(x for x in d if not x.isalpha())
            quantity = quantity.replace(',', '.')
            net_data[i] = float(quantity) * units[unit]

        net_data[0] = net_data[0] - net_data[1]

    
    except:
        net_data = [0.0, 0.0]
    # With call to cross platform method:
    """

    #***************** Calling on Sami's programs
    if wired:
        s = sub('./Measure', 'netWired')

    else: 
        s = sub('./Measure', 'netWireless')


    # retrieves data and transforms it
    a = s.split("\n")
    a.remove('')
    received = ''.join(x for x in a[1] if not x.isalpha())
    sent = ''.join(x for x in a[0] if not x.isalpha())

    net_data = [received, sent]
    return net_data






def fetch_hourly_data_usage(network):
    if(platform.system() != 'Linux'):
        raise Exception("This function can only be called from Linux")

    """
    ARGS: the network we're using
    Output: a dictionary of the form {"22": 157, ....} the key is the hour and the value is the quantity of data consumed
    """
    command = ['vnstat', '-i', network, '-h']
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    bytes_data = p.stdout.read()
    retcode = p.wait()

    # retrieves data and transforms it
    s=str(bytes_data,'utf-8', errors='ignore')
    a=s.split("\n")
    hourly = {}
    interesting =""
    for i in range (len(a)):
        if len(a[i])>0:
            if a[i][0]=="0" or a[i][0]=="1" or a[i][0]=="2":
                a[i] = a[i].replace(",", ".")
                interesting+=a[i]+"][ "


    
    interesting = interesting.replace("][ ", " \n")
    interesting = interesting.split("\n")

    for i in range (len(interesting)):

        if len(interesting[i])>0:
            print(interesting[i][2:18], interesting[i][18:])
            hourly[interesting[i][:2]] = float(interesting[i][2:18]) + float(interesting[i][18:])
  

    return hourly


def fetch_daily_data_usage(network):
    if(platform.system() != 'Linux'):
        raise Exception("This function can only be called from Linux")
    """
    oututs a dictionary with dates as keys and the consumption per day in bytes as values
    """
    command = ['vnstat', '-i', network, '-d']
    p = subprocess.Popen(command, stdout=subprocess.PIPE)
    bytes_data = p.stdout.read()
    retcode = p.wait()

    # retrieves data and transforms it
    s=str(bytes_data,'utf-8', errors='ignore')
    a=s.split("\n")
    a = a[5:-3]

    data = {}
    for i in range (len(a)):
        a[i] = a[i][5:]
        a[i] = a[i].replace("|", "")
        a[i] = a[i].split("  ")

        a[i] = [y for y in a[i] if y!='']
        unit = ''.join(x for x in a[i][3] if x.isalpha())
        quantity = ''.join(x for x in a[i][3] if not x.isalpha())
        quantity = quantity.replace(',', '.')

        date = a[i][0]
        data[date] = float(quantity) * units[unit]


    #print(data)
    return data


def fetch_battery_cons():
    if(platform.system() == 'Darwin'):
        return 0
    if(platform.system() == 'Linux'):
        """
        Returns the Wh consumption (refreshed every 120s) due to terminal consumption
        """
        #refreshed every 120s
        command = ['upower', '-i', '/org/freedesktop/UPower/devices/battery_BAT0']
        p = subprocess.Popen(command, stdout=subprocess.PIPE)
        bytes_data = p.stdout.read()
        retcode = p.wait()

        # retrieves data and transforms it
        s=str(bytes_data,'utf-8')
        a=s.split("\n")
        interesting = ""
        for i in range (len(a)):
            if "energy-rate" in a[i]:
                interesting = a[i]
        #print(interesting)
        interesting = interesting.replace("energy-rate:", "")
        interesting = interesting.replace("W", "")
        interesting = interesting.replace(",", ".")
        power = float(interesting)

        return power 
    elif(platform.system() == 'Windows'):
        return float(sub('./Measure', 'power'))
    else:
        raise Exception("Unsupported OS")



def get_pc_name():
    if(platform.system() == 'Linux'):
        """
        returns product name and the manufacturer
        """

        s = sub('sudo', 'dmidecode', '|', 'grep', '"Product Name"')

        # retrieves data and transforms it
        start_product = s.find("Product Name:")
        end_product = start_product + s[start_product:].find("by")
        product = s[start_product:end_product]
        product = product.replace("Product Name: ", "")

        start_manufacturer = s.find("Manufacturer: ")
        end_manufacturer = start_manufacturer + s[start_manufacturer:].find("\n")
        manufacturer = s[start_manufacturer:end_manufacturer]
        manufacturer = manufacturer.replace("Manufacturer: ", "")

        return product, manufacturer
    elif(platform.system() == 'Windows'):
        s = sub('./Measure', 'model')
        a = s.split("\n")
        a.remove('')
        manufacturer = a[0]
        product = a[1]

        return product, manufacturer
    else:
        raise Exception("Unsupported OS")



def get_manufacturing_cost(manufacturing_data):
    """
    If the pc name isn't in the database we'll use the ADEME's value by default
    It is a very coarse approximation (that is even very low when compared to other values given by manufacturers for whatever reason)
    https://www.bilans-ges.ademe.fr/documentation/UPLOAD_DOC_FR/index.htm?ordinateurs_et_equuipements_pe.htm
    """
    pc_name = get_pc_name()
    cost = 169 # default value given by ADEME
    return cost



"""


a = fetch_rt_data_usage("2021-02-08", "wlo1")


print("IN THE US with wifi")
print("Youve consumed this CO2 g due to servers: ", a * (data_center) * energetic_mix["USA"]) #Note: I don't know whre the data center actually is ==> the energetic mix might
                                                    # not be the same
print("Youve consumed this CO2 g due to networks: ",a *  network["wifi"] * energetic_mix["USA"])
print("\nbattery consumption in the US")
#print(fetch_battery_cons(), " KWh")
print(fetch_battery_cons() * energetic_mix["USA"] * 240, "g Co2 today due to battery usage")


print("\n******* \n \nIN FRANCE WITH WIFI")
print("Youve consumed this CO2 g due to servers: ", a * (data_center) * energetic_mix["France"]) #Note: I don't know whre the data center actually is ==> the energetic mix might
                                                    # not be the same
print("Youve consumed this CO2 g due to networks: ",a *  network["wifi"] * energetic_mix["France"])
print("\nbattery consumption in France")
print(fetch_battery_cons(), " KWh")
print(fetch_battery_cons() * energetic_mix["France"] *240, "g Co2 today due to battery usage")

# this would probably do a good job of it

import schedule
import time

def job():
    print("I'm working...")

schedule.every(10).minutes.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)

while 1:
    schedule.run_pending()
    time.sleep(1)
"""



"""
from multiprocessing import Process
import time

def doWork():
    while True:
        print "working...."
        time.sleep(10)



if __name__ == "__main__":
    p = Process(target=doWork)
    p.start()

    while True:
        time.sleep(60)
"""
