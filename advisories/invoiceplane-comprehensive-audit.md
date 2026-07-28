# Security Audit of InvoicePlane: Discovering 5 Zero-Day Vulnerabilities

**Target:** InvoicePlane
**Vulnerabilities Found:** CSRF, IDOR, Log Injection, Type Juggling
**GHSAs:** GHSA-346c-gqqq-mrm2, GHSA-g53q-v2pv-xr83, GHSA-x38q-xhjj-jr8w, GHSA-9372-vj68-hmc3, GHSA-qf9q-2hxm-4wh9

---

## 1. Executive Summary

During a comprehensive deep-code security audit of **InvoicePlane**, a popular open-source invoicing application built on CodeIgniter, I discovered 5 zero-day vulnerabilities. These ranged from a High-Severity CSRF vulnerability that could silently halt business operations, to Medium-Severity IDORs leading to horizontal privilege escalation. 

This post breaks down my methodology, the root causes of the vulnerabilities, and how they were patched.

---

## 2. Finding #1: Recurring Invoice Stop via GET Without CSRF Protection (High)

### The Vulnerability
The `Recurring::stop()` method is designed to halt future automated billing. However, the application failed to require a POST request and failed to validate CSRF tokens for this specific endpoint. 

Because the `Base_Controller` only blocked GET requests if the URL contained the word `"delete"`, the `/recurring/stop/` endpoint bypassed all standard CSRF protections.

### The Exploit
An attacker could embed a simple, invisible image tag in an email or forum post targeted at the administrator:
```html
<img src="http://target.invoiceplane.com/invoices/recurring/stop/1" width="0" height="0" />
```
When the admin viewed the image, the browser executed the GET request. The recurring invoice was silently stopped, potentially costing the business months of lost revenue before being noticed.

### The Fix
The maintainers added `ensure_valid_post_request()` to the endpoint, forcing it to accept only POST requests containing a valid, user-specific CSRF token.

---

## 3. Finding #2: Missing CSRF Validation on Multiple Delete Endpoints (Medium)

### The Vulnerability
While standard GET requests to `delete` endpoints were correctly blocked by `Base_Controller`, several specific delete methods across 7 different controllers forgot to call `ensure_valid_post_request()`. 

This meant that if an attacker crafted a cross-origin POST form, the application would accept the deletion request because it was a POST request, completely ignoring the missing CSRF token.

### The Impact
This allowed attackers to blindly delete financial records (payments), product families, and user-client associations using standard CSRF form-submission techniques.

---

## 4. Finding #3: IDOR in User Password Change (Medium)

### The Vulnerability
The `change_password($user_id)` method in the `Users` controller successfully verified that the requester was *an* administrator, but it completely failed to verify if the administrator was authorized to change *that specific user's* password.

```php
public function change_password(string $user_id)
{
    if ($this->mdl_users->run_validation('validation_rules_change_password')) {
        // VULNERABLE: No authorization check here!
        $this->mdl_users->save_change_password($user_id, $this->input->post('user_password'));
    }
}
```

### The Impact (Horizontal Privilege Escalation)
In multi-admin environments, a low-level admin could change the password of the primary super-admin (`user_id=1`), log in as the super-admin, and take over the entire instance. Furthermore, it required no verification of the old password, leaving no audit trail.

---

## 5. Finding #4: Log Injection via Unsanitized Cron Key (Low)

### The Vulnerability
When a cron job was triggered with an invalid `cron_key`, the application logged the failure. However, it logged the user-supplied string directly without sanitization:

```php
log_message('error', '[Cron] Wrong cron key provided! ' . $cron_key);
```

### The Exploit
By injecting CRLF (`%0A`, `%0D`) characters into the URL payload, an attacker could inject completely fake log entries into the server logs to cover their tracks or trigger false-positive alerts in SIEMs.

---

## 6. Finding #5: Loose Type Comparison in Authentication (Low)

### The Vulnerability
The core authentication controller used PHP's loose comparison operator (`!=`) instead of the strict comparison operator (`!==`):
```php
if ($this->session->userdata($required_key) != $required_val) {
```

### The Impact
While not directly exploitable under standard CodeIgniter session handling, this violates defense-in-depth principles. If session storage was ever updated to return boolean values or complex types, type juggling (`true != 1` -> `false`) could allow complete authentication bypasses for guest users. It was patched to use strict comparison `!==`.

---
*If you found this technical breakdown helpful, consider starring the repositories I contribute to or following me on [GitHub](https://github.com/Char0n1507).*
