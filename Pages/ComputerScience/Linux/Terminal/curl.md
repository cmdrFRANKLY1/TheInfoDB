# 🌐 The `curl` Command

### ❓ What is it?

`curl` (Client URL) is a versatile command-line tool designed for transferring data to and from a server. It supports over 25 protocols, including HTTP, HTTPS, FTP, SFTP, LDAP, and SCP. It is widely considered the "Swiss Army knife" of network transfers, frequently used by developers to test APIs, download files, and troubleshoot connectivity issues directly from the terminal.

---

### 🏳️ Options & Flags

`curl [options] [URL]`

|Flag|Description|
|---|---|
|`-X`, `--request`|Specifies the request method (e.g., `GET`, `POST`, `PUT`, `DELETE`).|
|`-d`, `--data`|Sends data in a POST request (key-value pairs or JSON).|
|`-H`, `--header`|Adds an HTTP header to the request (e.g., `Content-Type: application/json`).|
|`-I`, `--head`|Fetches only the HTTP headers (useful to check server response codes).|
|`-L`, `--location`|Follows HTTP redirects (3xx status codes).|
|`-v`, `--verbose`|Output the full request and response headers (essential for debugging).|
|`-O`, `--remote-name`|Downloads a file and saves it with its original remote filename.|
|`-o`, `--output`|Saves the downloaded file to a specific local path.|
|`-u`, `--user`|Provides basic authentication credentials (`user:password`).|
|`-k`, `--insecure`|Skips SSL certificate validation (use with caution).|
|`-s`, `--silent`|Silent mode; hides the progress bar and error messages.|