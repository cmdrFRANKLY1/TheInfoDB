# PAT (Port Address Translation)

PAT, also known as NAT Overload, is a variant of NAT in which multiple private IP addresses communicate through a single public IP address. Differentiation is achieved through unique port numbers. An introduction to the fundamentals can be found under [Related Concepts](#related-concepts).

## Fundamentals of PAT

PAT is the most practically significant form of NAT. While classic NAT only translates IP addresses, PAT also includes port numbers in the translation. This allows thousands of devices to communicate simultaneously through a single public IPv4 address.

### Why PAT?

| Problem | Solution via PAT |
| :--- | :--- |
| **IPv4 address scarcity** | Thousands of devices share a single public IP address. |
| **Cost savings** | ISPs need to provide fewer public addresses per customer. |
| **Security** | Inbound connections are only allowed when a mapping exists. |

### PAT vs. NAT

- **NAT (static/dynamic):** Translates only IP addresses, 1:1 or n:m mapping without port consideration.
- **PAT:** Additionally translates port numbers and enables n:1 mapping (many private IPs → one public IP).
- **Together:** In practice, PAT is almost always used together with NAT, which is why the terms are often used synonymously.

## How It Works

PAT uses a translation table that combines IP address and port number. Each outbound connection receives a unique source port so that return traffic can be correctly mapped.

### Connection Flow

1. Client A (192.168.1.10:12345) sends a request to a web server (93.184.216.34:80).
2. The PAT router replaces the source IP with its public IP (203.0.113.5) and the source port with a free port (e.g., 50001).
3. The router stores: 192.168.1.10:12345 ↔ 203.0.113.5:50001.
4. Client B (192.168.1.11:12345) also sends a request – same source port but different private IP.
5. The router assigns a different public port (e.g., 50002) and stores: 192.168.1.11:12345 ↔ 203.0.113.5:50002.
6. Replies to 203.0.113.5:50001 go to Client A, replies to port 50002 go to Client B.

### The Translation Table

- **Internal IP:Port** – the original source in the private network.
- **External IP:Port** – the translated source in the public network.
- **Destination IP:Port** – the remote communication partner.
- **Timeout:** Entries are removed after inactivity (typically 24 h for TCP, 30–120 s for UDP).

## Port Ranges and Limits

PAT is limited by the available port numbers. Understanding port ranges helps assess scaling limits.

### Port Numbers Overview

| Range | Size | Usage |
| :--- | :--- | :--- |
| **0 – 1023** | 1,024 | Well-known ports (system services, bindable only with root privileges). |
| **1024 – 49151** | 48,128 | Registered ports (applications, services). |
| **49152 – 65535** | 16,384 | Ephemeral / dynamic ports – PAT typically assigns its translation ports here. |

### Scaling Limits

| Aspect | Details |
| :--- | :--- |
| **Theoretical maximum** | Approx. 65,535 simultaneous connections per public IP address (limited by 16-bit port field). |
| **Practical maximum** | Significantly lower, as ports must be reused and the operating system makes reservations. |
| **Extension** | Multiple public IPs or CGNAT (Carrier-Grade NAT) at ISPs. |

## Related Concepts

PAT builds directly on [NAT](#nat) and is closely related to firewalls, CGNAT, and port forwarding. With IPv6, PAT is largely eliminated, as every device can receive its own global address.

## Summary

PAT is the technique that keeps the modern internet running: millions of devices share a limited number of public IPv4 addresses. Without PAT, the address shortage would have become critical long ago. Go to the [top](#top) for a fresh start.

## TLDR

**1. What is PAT?**
PAT (NAT Overload) translates IP addresses AND port numbers so many devices can share one public IP.

**2. How does it work?**
Each outbound connection receives a unique source port. The router stores the mapping in a table.

**3. Limits**
Max. ~65,535 simultaneous connections per public IP – often less in practice. CGNAT extends capacity.

**4. Why important?**
PAT is the reason the IPv4 internet still works today despite the address shortage.