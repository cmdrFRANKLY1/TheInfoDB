# 🌐 The `ip` Command

### ❓ What is it?

The `ip` command is the modern, powerful utility for managing network interfaces, routing tables, and IP addresses in Linux. It is part of the `iproute2` package and has largely replaced the legacy `ifconfig` and `route` commands. Unlike most commands, `ip` functions as a dispatcher for various "objects" (subcommands) that handle different aspects of networking.

---

### 🛠️ Common Objects (Subcommands)

`ip [object] [command] [parameters]`

|Object|Description|
|---|---|
|`link`|Network device management (e.g., set link up/down, view MAC addresses).|
|`addr`|Address management (assign, delete, or list IP addresses on interfaces).|
|`route`|Manage the kernel routing table (add/remove gateways, routes).|
|`neigh`|Manage the ARP or NDISC cache (neighboring devices).|
|`tunnel`|Tunnel configuration over IP.|
|`rule`|Manage policy routing rules.|
|`maddr`|Multicast address management.|
