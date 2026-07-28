---
description: >-
  Puppet is a small active directory scenario in which you start with an already
  running Sliver C2 beacon on an internal system. It is designed to practice
  operating through a C2 framework in a modern,
---

# Puppet

Enumeration with nmap

```
nmap -sV -sC -O -A -T4 -p- --open -oN scan_results.txt 10.13.38.33
Starting Nmap 7.98 ( https://nmap.org ) at 2026-03-07 17:08 -0500
Nmap scan report for 10.13.38.33
Host is up (0.13s latency).
Not shown: 65530 closed tcp ports (reset)
PORT      STATE SERVICE        VERSION
21/tcp    open  ftp            vsftpd 3.0.5
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw----r--    1 0        0            2119 Oct 11  2024 red_127.0.0.1.cfg
|_-rwxr-xr-x    1 0        0        36515304 Oct 12  2024 sliver-client_linux
22/tcp    open  ssh            OpenSSH 8.9p1 Ubuntu 3ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 e2:70:df:74:8c:ed:e9:81:46:16:e4:88:bc:7f:69:32 (ECDSA)
|_  256 bf:f0:f1:8f:5b:66:93:9b:cb:8b:bc:78:37:b8:b8:3a (ED25519)
8140/tcp  open  ssl/http       WEBrick httpd 1.7.0 (Ruby 3.0.2 (2021-07-07); OpenSSL 3.0.2)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=puppet.puppet.vl
| Subject Alternative Name: DNS:puppet, DNS:puppet.puppet.vl
| Not valid before: 2024-10-11T18:01:13
|_Not valid after:  2029-10-11T18:01:13
8443/tcp  open  ssl/https-alt?
| ssl-cert: Subject: commonName=0.0.0.0
| Subject Alternative Name: IP Address:0.0.0.0
| Not valid before: 2024-12-24T14:49:26
|_Not valid after:  2027-12-24T14:49:26
|_ssl-date: TLS randomness does not represent time
31337/tcp open  ssl/Elite?
| ssl-cert: Subject: commonName=multiplayer
| Subject Alternative Name: DNS:multiplayer
| Not valid before: 2024-05-11T12:31:48
|_Not valid after:  2027-05-11T12:31:48
|_ssl-date: TLS randomness does not represent time
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 2 hops
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT       ADDRESS
1   215.64 ms 10.10.14.1
2   215.82 ms 10.13.38.33

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 131.19 seconds
```

