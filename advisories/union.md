# Union

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 union.htb         
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-19 14:44 EDT
Nmap scan report for union.htb (10.10.11.128)
Host is up (0.14s latency).
Not shown: 999 filtered tcp ports (no-response)
PORT   STATE SERVICE
80/tcp open  http
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
```

We have a page that checks for user eligibility. It reflects the name of the user and gives a link to continue to a new page

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FC9kC1fbvHbtTagrC1c31%2Fimage.png?alt=media&#x26;token=65340395-6158-4a5d-9271-bc8741de7627" alt=""><figcaption></figcaption></figure>

We can see that we don’t get any error while looking for SQL injection

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FEoN3TFe84iXGbK2XeTIn%2Fimage.png?alt=media&#x26;token=408fa10c-6ce3-4724-abb9-ddd51ec4245d" alt=""><figcaption></figcaption></figure>

But if we use union select 1, we only see 1 being reflected, which means our query was interpreted

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FZlbepZP7QrjMwccDDSpB%2Fimage.png?alt=media&#x26;token=e3ec5a33-84b9-4fc1-9ee4-caca99ecaa57" alt=""><figcaption></figcaption></figure>

The query only returns 1 column as our injection doesn’t get interpreted if we give 2 columns

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FYMrsWjy9IjDgNFLeSnhJ%2Fimage.png?alt=media&#x26;token=95ff8052-5786-4452-86dc-cb0e619054a7" alt=""><figcaption></figcaption></figure>

We see that we can inject. Here we get our user

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FKtjgl8pZTjkAYWcpL8sA%2Fimage.png?alt=media&#x26;token=3656dbf0-5cef-4093-90a9-e37370471e86" alt=""><figcaption></figcaption></figure>

Trying to enumerate the DB, we see that we only have the first row reflected

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FEi1KTBw1LL9lp4Xf0fIz%2Fimage.png?alt=media&#x26;token=50575397-8655-4456-a7d7-4c03c539e7f5" alt=""><figcaption></figcaption></figure>

We can use the group\_concat() function to retreive all DB in one query

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FFFPgGdACbMCI6DLDeiRd%2Fimage.png?alt=media&#x26;token=6fd93887-25e0-4a2c-88be-fb3c81023796" alt=""><figcaption></figcaption></figure>

Next we enumerate the tables inside the DB november

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FXwATsgxXz6ZGy6mJTsFM%2Fimage.png?alt=media&#x26;token=6c2bf545-84cb-4b52-b282-19de8624cf73" alt=""><figcaption></figcaption></figure>

Get columns in the table flag

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FZb1wVHgBza3L5PdeDyeH%2Fimage.png?alt=media&#x26;token=634e4440-bfc2-48c5-98fb-53721eafec82" alt=""><figcaption></figcaption></figure>

Dump content of the flag table

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F3kv1HLaRYAu3SrAaaWXs%2Fimage.png?alt=media&#x26;token=45ee9853-306c-4442-8e3d-5aa04bc88d28" alt=""><figcaption></figcaption></figure>

Same for players content

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FkjKSj6QIbdwkeehVKoBg%2Fimage.png?alt=media&#x26;token=73f87889-e82f-431f-81db-170f43fd0e5c" alt=""><figcaption></figcaption></figure>

If we enter the flag we found in the challenge

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FG1786phvPbidSQU9JOmg%2Fimage.png?alt=media&#x26;token=bd584a46-a956-4de9-815c-7ce7ad8b485b" alt=""><figcaption></figcaption></figure>

We get redirected to the firewall.php page, saying our IP is whitelisted

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FJb1dYXi3MuwAFkBwBPN2%2Fimage.png?alt=media&#x26;token=a9a0f2dd-451d-4d24-b3e6-ae4e00e765fa" alt=""><figcaption></figcaption></figure>

Running nmap again, we can detect port 22

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -sC -T4 -p22 union.htb                                                               
[sudo] password for kali: 
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-10-19 16:16 EDT
Nmap scan report for union.htb (10.10.11.128)
Host is up (0.22s latency).

PORT   STATE SERVICE
22/tcp open  ssh
| ssh-hostkey: 
|   3072 ea:84:21:a3:22:4a:7d:f9:b5:25:51:79:83:a4:f5:f2 (RSA)
|   256 b8:39:9e:f4:88:be:aa:01:73:2d:10:fb:44:7f:84:61 (ECDSA)
|_  256 22:21:e9:f4:85:90:87:45:16:1f:73:36:41:ee:3b:32 (ED25519)
```

We can read the content of the source code for challenge.php

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F6wSb603GhQc6fpQib4KA%2Fimage.png?alt=media&#x26;token=59950162-312f-4653-8bf3-1b808833d2ee" alt=""><figcaption></figcaption></figure>

For config.php

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMFYd0s9ANfcpR3Ys4uCI%2Fimage.png?alt=media&#x26;token=53a2a551-7121-4b73-9b5c-67e423510deb" alt=""><figcaption></figcaption></figure>

And firewall.php

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fw5kKqmFDU1kpy6Svfvrw%2Fimage.png?alt=media&#x26;token=dacdae32-61b1-41d5-9283-9b887914f470" alt=""><figcaption></figcaption></figure>

It looks like we have command injection if we set the content of the X-Forwarded-For header, as it is passed without filtering to a system command

We confirm it. Here we try to get a callback to our server

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMJDEtoJBmWr39fHuLkHO%2Fimage.png?alt=media&#x26;token=814bf215-a641-4859-a028-a6e374d3e5b2" alt=""><figcaption></figcaption></figure>

It is successful, so we indeed have command execution

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 -m http.server          
Serving HTTP on 0.0.0.0 port 8000 (<http://0.0.0.0:8000/>) ...
10.10.11.128 - - [20/Oct/2025 11:52:01] "GET / HTTP/1.1" 200 -
10.10.11.128 - - [20/Oct/2025 11:53:24] "GET / HTTP/1.1" 200 -
```

We enter a reverse shell payload and get a connection

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FbEgxzEEgF4TWy8bdjNon%2Fimage.png?alt=media&#x26;token=13a8dca5-702b-4adb-aa1c-7a1077cad807" alt=""><figcaption></figcaption></figure>

```bash
www-data@union:/home/uhc$ sudo -l 
Matching Defaults entries for www-data on union:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin

User www-data may run the following commands on union:
    (ALL : ALL) NOPASSWD: ALL
```

We can sudo su
