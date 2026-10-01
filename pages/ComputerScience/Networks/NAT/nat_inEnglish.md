# Network Address Translation (NAT)

**Network Address Translation (NAT)** is a method used by routers to translate one set of IP addresses into another. It is most commonly used to allow devices on a private, local network (like a home Wi-Fi) to communicate with the public internet using a single public IP address.

## Why is NAT used?

The primary reason NAT exists is the **IPv4 address shortage**.

IPv4 addresses are 32-bit numbers, providing roughly 4.3 billion unique addresses. As the internet grew, these addresses ran out. NAT solves this by allowing an entire private network (which can have thousands of devices) to share just **one** public IPv4 address.

## How it works (The Basics)

When a device on a local network (like a laptop) wants to access a website:

1. **Outbound Request:** The laptop sends a request to the router. The request has a **private source IP** (e.g., `192.168.1.10`) and a **source port** (e.g., `54321`).
2. **Translation:** The router intercepts this packet. It replaces the private source IP with its own **public IP** (e.g., `203.0.113.5`). It also assigns a new, unique source port (e.g., `60001`) and records this mapping in a table.
3. **Internet Request:** The packet now travels across the internet looking like it came from `203.0.113.5:60001`.
4. **Inbound Response:** The web server replies to `203.0.113.5:60001`.
5. **Reverse Translation:** The router receives the reply, looks up its mapping table, sees that port `60001` belongs to the laptop, and forwards the packet back to `192.168.1.10:54321`.

## Types of NAT

There are a few different ways NAT is implemented:

### 1. Static NAT (SNAT)

A one-to-one mapping between a private IP address and a public IP address. This is often used for web servers that need a consistent public IP.

- `192.168.1.10` ⇄ `203.0.113.5`

### 2. Dynamic NAT

A pool of public IP addresses is shared among a larger group of private devices. The router assigns a public IP to a private device on a first-come, first-served basis.

### 3. PAT (Port Address Translation) / NAT Overload

This is the most common type of NAT used in homes and small businesses. It is what is described in the "How it works" section above. It allows **many** private devices to share a **single** public IP address by using different port numbers to keep track of the connections.

- This is technically a subset of Dynamic NAT, but it is so common that people usually just call it "NAT."

## The Pros and Cons

| Pros | Cons |
| :--- | :--- |
| **Conserves IPv4 addresses:** Slows down the exhaustion of public IPs. | **Breaks end-to-end connectivity:** Devices behind NAT cannot be directly reached from the internet without port forwarding. |
| **Security:** Hides internal network structure from the outside world. | **Performance overhead:** Routers have to do extra work to modify packet headers. |
| **Flexibility:** You can change your internal IP scheme without notifying your ISP. | **Complicates protocols:** Some protocols (like VoIP or certain games) embed IP addresses in the data payload, which NAT cannot easily translate. |

## NAT and IPv6

With the introduction of **IPv6**, the address space is so massive (340 undecillion addresses) that every device can have its own unique public IP address.

Because of this, **NAT is generally not needed for IPv6**. However, some network administrators still use a variation of it (NAT66) for security or network management reasons, though this is less common.
