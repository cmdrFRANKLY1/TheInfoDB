# NAT

Network Address Translation (NAT) is a method used by routers to translate one set of IP addresses into another. It is most commonly used to allow devices on a private, local network (like a home Wi-Fi) to communicate with the public internet using a single public IP address.

# Why NAT Exists

The primary reason NAT exists is the **IPv4 address shortage**. IPv4 addresses are 32-bit numbers, providing roughly 4.3 billion unique addresses. As the internet grew, these addresses ran out. NAT solves this by allowing an entire private network (which can have thousands of devices) to share just **one** public IPv4 address.

## IPv4 Address Shortage

IPv4 provides roughly 4.3 billion unique addresses. When the internet was designed, this seemed like more than enough, but the explosive growth of connected devices exhausted the available pool of public IPv4 addresses far sooner than expected.

## The Role of NAT

NAT stretches a single public IP address across many private devices. A home router, for example, typically has one public IP from the ISP but can support dozens of devices on the local network, all sharing that same address.

# How NAT Works

When a device on a local network (like a laptop) wants to access a website, the router performs a translation on the way out and on the way back. The process is transparent to both the device and the remote server.

## Outbound Request

The laptop sends a request to the router. The request has a **private source IP** (e.g., `192.168.1.10`) and a **source port** (e.g., `54321`).

## Translation

The router intercepts this packet. It replaces the private source IP with its own **public IP** (e.g., `203.0.113.5`). It also assigns a new, unique source port (e.g., `60001`) and records this mapping in a table.

## Internet Request

The packet now travels across the internet looking like it came from `203.0.113.5:60001`.

## Inbound Response

The web server replies to `203.0.113.5:60001`. The router receives the reply, looks up its mapping table, sees that port `60001` belongs to the laptop, and forwards the packet back to `192.168.1.10:54321`.

# Types of NAT

There are a few different ways NAT is implemented, each suited to different needs.

## Static NAT (SNAT)

A one-to-one mapping between a private IP address and a public IP address. This is often used for web servers that need a consistent public IP.

- `192.168.1.10` ⇄ `203.0.113.5`

## Dynamic NAT

A pool of public IP addresses is shared among a larger group of private devices. The router assigns a public IP to a private device on a first-come, first-served basis.

## PAT (Port Address Translation) / NAT Overload

This is the most common type of NAT used in homes and small businesses. It allows **many** private devices to share a **single** public IP address by using different port numbers to keep track of the connections.

- This is technically a subset of Dynamic NAT, but it is so common that people usually just call it "NAT."

# The Pros and Cons

| Pros | Cons |
| :--- | :--- |
| **Conserves IPv4 addresses:** Slows down the exhaustion of public IPs. | **Breaks end-to-end connectivity:** Devices behind NAT cannot be directly reached from the internet without port forwarding. |
| **Security:** Hides internal network structure from the outside world. | **Performance overhead:** Routers have to do extra work to modify packet headers. |
| **Flexibility:** You can change your internal IP scheme without notifying your ISP. | **Complicates protocols:** Some protocols (like VoIP or certain games) embed IP addresses in the data payload, which NAT cannot easily translate. |

# NAT and IPv6

With the introduction of **IPv6**, the address space is so massive (340 undecillion addresses) that every device can have its own unique public IP address.

## Why NAT Isn't Needed

Because every device can have its own public IPv6 address, the primary motivation for NAT (conserving addresses) disappears.

## NAT66

Some network administrators still use a variation called NAT66 for security or network management reasons, though this is less common.

# Tags

* networking
* nat
* ipv4
* ipv6
* address-translation
* pat
* port-forwarding
* cgnat

# Hyperlinks

| **Word in Document** | **Official Source** |
| :--- | :--- |
| NAT | https://datatracker.ietf.org/doc/html/rfc3022 |
| IPv4 | https://datatracker.ietf.org/doc/html/rfc791 |
| IPv6 | https://datatracker.ietf.org/doc/html/rfc8200 |
| NAT66 | https://datatracker.ietf.org/doc/html/rfc6296 |
| PAT | https://datatracker.ietf.org/doc/html/rfc2663 |

# Mouse Over

| **Word in Document** | **Mouse Over Information** |
| :--- | :--- |
| 32-bit | A piece of data consisting of 32 binary digits (1s and 0s). |
| CGNAT | Carrier-Grade NAT; a large-scale NAT implementation used by ISPs to share public addresses among many customers. |
| data payload | The actual intended message or data inside a packet, excluding the routing and header information. |
| Dynamic NAT | A type of NAT where a pool of public IP addresses is shared among a group of private devices on a first-come, first-served basis. |
| end-to-end connectivity | The principle that any two network nodes should be able to communicate directly without intermediary translation. |
| IP address | A unique string of numbers separated by periods (IPv4) or colons (IPv6) that identifies each computer using the Internet Protocol. |
| IPv4 | Internet Protocol version 4; the widely deployed fourth version of the protocol using 32-bit addresses. |
| IPv4 address shortage | The depletion of the pool of unallocated public IPv4 addresses available for assignment. |
| IPv6 | Internet Protocol version 6; the newer standard using 128-bit addresses, designed to replace IPv4. |
| ISP | Internet Service Provider; a company that provides access to the internet. |
| local network | A computer network that interconnects computers within a limited area such as a residence, school, or office building. |
| mapping table | A database maintained by a NAT router that keeps track of the translations between private and public IP addresses and ports. |
| NAT | Network Address Translation; a method routers use to translate private local IP addresses to a public IP. |
| NAT Overload | Another term for PAT (Port Address Translation), where many private IPs share one public IP using different port numbers. |
| NAT66 | A translation mechanism for IPv6 networks, often used for network management or prefix translation rather than address conservation. |
| packet | Small, formatted blocks of data traveling over a network. |
| packet headers | Supplemental data placed at the start of a packet, containing necessary control and routing information. |
| PAT | Port Address Translation; an extension to NAT that permits multiple devices on a LAN to be mapped to a single public IP address. |
| port | A virtual point where network connections start and end, associated with a specific process or service. |
| port forwarding | A router configuration that directs inbound traffic from the internet on a specific port to a specific device on the local network. |
| private network | A local network using reserved IP addresses that are not directly reachable from the public internet. |
| public internet | The global network of interconnected devices that are reachable via unique, public IP addresses. |
| public IP | An IP address that is globally unique and can be routed across the internet. |
| router | A networking device that forwards data packets between computer networks. |
| SNAT | Source Network Address Translation, or Static NAT depending on context; modifies the source address of IP packets. |
| source IP | The IP address of the device sending a packet. |
| source port | The port number on the sending device from which a packet originates. |
| Static NAT | A type of NAT that creates a permanent one-to-one mapping between a private IP address and a public IP address. |
| VoIP | Voice over IP; technology that allows voice calls to be made over internet connections. |
| web server | A computer system that processes requests via HTTP to distribute web content. |
| Wi-Fi | A common wireless networking technology that allows devices to interface with a local network and the internet. |