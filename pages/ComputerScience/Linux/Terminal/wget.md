# 🌐 The `wget` Command

### ❓ What is it?

`wget` (World Wide Web Get) is a classic, non-interactive command-line utility for retrieving content from web servers. Unlike `curl`, which is designed for data transfer and API interaction, `wget` is optimized for downloading files, large datasets, and even entire websites. It is highly robust, supporting features like automatic retries, resuming interrupted downloads, and recursive mirroring of directory trees.

---

### 🏳️ Options & Flags

`wget [options] [URL]`

|Flag|Description|
|---|---|
|`-c`, `--continue`|Resumes a partially downloaded file (essential for large files).|
|`-O`, `--output-document`|Saves the downloaded file with a specific filename.|
|`-P`, `--directory-prefix`|Specifies the directory where files will be saved.|
|`-b`, `--background`|Runs the process in the background immediately after startup.|
|`-r`, `--recursive`|Follows links on a page to download entire directory trees or sites.|
|`-np`, `--no-parent`|Prevents `wget` from climbing above the specified directory level when recursive.|
|`-k`, `--convert-links`|Rewrites links in downloaded HTML so they point to local files.|
|`-i`, `--input-file`|Downloads all URLs listed in a local text file.|
|`-q`, `--quiet`|Suppresses output; useful for cron jobs or scripts.|
|`-U`, `--user-agent`|Sets the User-Agent header (useful if a server blocks default `wget` requests).|
|`--limit-rate`|Limits the download speed (e.g., `--limit-rate=1M`).|
|`--no-check-certificate`|Ignores SSL certificate errors (use with caution).|