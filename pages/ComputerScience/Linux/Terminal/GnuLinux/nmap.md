# 🛡️ The `nmap` Command

### ❓ What is it?

`nmap` (Network Mapper) is an open-source tool used for network discovery and security auditing. It is widely used by system administrators and security professionals to scan networks to determine which hosts are available, what services (application name and version) those hosts are offering, what operating systems they are running, and what packet filters/firewalls are in use.

---

### 🏳️ Options & Flags

`nmap [options] [target]`

| Flag              | Description                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `-sS`             | TCP SYN scan (stealthy scan, default for privileged users).                                         |
| `-sV`             | Service version detection.                                                                          |
| `-O`              | Enable OS detection.                                                                                |
| `-p <port_range>` | Specify ports (e.g., `-p 22,80,443` or `-p 1-1000`).                                                |
| `-A`              | Aggressive scan options (enables OS detection, version detection, script scanning, and traceroute). |
| `-T<0-5>`         | Set timing template (higher is faster; `-T4` is standard for modern networks).                      |
| `-Pn`             | Treat all hosts as online (skip host discovery/ping).                                               |
| `-v`              | Increase verbosity.                                                                                 |
| `-oN <file>`      | Output results to a normal text file.                                                               |
| `-iL <file>`      | Input targets from a list file.                                                                     |