# ⚙️ The `systemctl` Command

### ❓ What is it?

`systemctl` is the command-line interface for controlling the **systemd** system and service manager. It is the core utility used on most modern Linux distributions (like Ubuntu, Debian, CentOS, Fedora, Arch) to manage services (daemons), sockets, devices, and mount points. It allows you to inspect the system state, start/stop services, and configure services to launch automatically at boot.

---

### 🛠️ Common Commands (Operations)

`systemctl [command] [service_name]`

|Command|Description|
|---|---|
|`start`|Starts a service immediately.|
|`stop`|Stops a service immediately.|
|`restart`|Stops and then starts a service.|
|`reload`|Reloads the configuration of a service without restarting it (if supported).|
|`status`|Shows the current status of a service (running/stopped, logs, process ID).|
|`enable`|Enables a service to start automatically at boot.|
|`disable`|Disables a service from starting at boot.|
|`is-active`|Checks if a service is currently running.|
|`mask`|Prevents a service from being started (even manually).|
|`unmask`|Reverses a mask command.|

---

### 🏳️ Useful Flags

|Flag|Description|
|---|---|
|`--user`|Target a service instance for the current user rather than the system.|
|`--type`|Filter by unit type (e.g., `--type=service`, `--type=socket`).|
|`--state`|Filter by state (e.g., `--state=failed`, `--state=running`).|
|`-l`, `--full`|Do not truncate output (useful for reading full log lines).|
|`--failed`|List all units that have failed.|
|`--help`|Display help message and exit.|