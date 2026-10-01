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

- networking
- nat
- ipv4
- ipv6
- address-translation
- pat
- port-forwarding
- cgnat
