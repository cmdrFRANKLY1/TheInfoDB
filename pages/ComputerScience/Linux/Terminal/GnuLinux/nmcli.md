# 🌐 The `nmcli` Command

### ❓ What is it?

`nmcli` (Network Manager Command Line Interface) is the primary utility for controlling **NetworkManager** on Linux systems. It is the standard tool for managing network devices, configuring network connections (profiles), and troubleshooting network issues in headless environments (servers) or via terminal.

Unlike simple utilities, `nmcli` is **object-oriented**, meaning you act upon specific "objects" like devices or connections.

---

### 🧱 Core Objects

To use `nmcli`, you typically specify an object followed by a command. The command structure is: `nmcli [object] [command] [parameters]`

|Object|Description|
|---|---|
|`device`|Manage physical/virtual network interfaces (e.g., `eth0`, `wlan0`).|
|`connection`|Manage network profiles (the settings like IP, gateway, DNS).|
|`general`|View global NetworkManager status and logs.|
|`networking`|Toggle overall network connectivity on or off.|
|`radio`|Toggle Wi-Fi or WWAN radios.|

Export to Sheets

---

### 🏳️ Useful Flags

|Flag|Description|
|---|---|
|`-a`, `--ask`|Prompt for missing passwords/secrets instead of failing.|
|`-p`, `--pretty`|Pretty-print output (makes large lists easier to read).|
|`-t`, `--terse`|Output in a machine-readable format (useful for scripts).|
|`-g`, `--get-values`|Get the value of specific fields (useful for `grep` and scripting).|
|`-h`, `--help`|Display help for the command or specific objects.|