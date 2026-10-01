# IPv4

Internet Protocol version 4 (IPv4) is the fourth version of the Internet Protocol and the first one to be widely deployed. It is the addressing system that most of the internet still runs on today, using 32-bit addresses to identify every device on a network.

# What IPv4 Is

IPv4 is a connectionless, best-effort protocol used to route packets between devices on a network. Every device that communicates over IPv4 needs a unique 32-bit address, usually written in dotted-decimal notation like `192.168.1.1`.

## The 32-Bit Address

An IPv4 address is 32 bits long. It is split into four 8-bit groups called octets, each ranging from 0 to 255.

- Format: `A.B.C.D`
- Example: `192.168.1.10`
- Total address space: 2^32 = 4,294,967,296 addresses 

## Dotted-Decimal Notation

Because binary is hard to read, IPv4 addresses are shown in decimal with dots between octets. The address `11000000.10101000.00000001.00001010` is written as `192.168.1.10`.

# Address Classes

Historically, IPv4 addresses were divided into classes to make allocation simpler. Classes are largely obsolete today, but you still see the terminology in older documentation.

## Class A

The first bit is `0`. Range: `1.0.0.0` to `126.255.255.255`. Each Class A network can hold over 16 million hosts.

## Class B

The first two bits are `10`. Range: `128.0.0.0` to `191.255.255.255`. Each Class B network supports up to 65,534 hosts.

## Class C

The first three bits are `110`. Range: `192.0.0.0` to `223.255.255.255`. Each Class C network supports up to 254 hosts.

## Class D and Class E

Class D (first four bits `1110`) is used for multicast. Class E (first four bits `1111`) is reserved for experimental use.

| Class | First Bits | Range | Purpose |
| :--- | :--- | :--- | :--- |
| A | 0 | 1.0.0.0 – 126.255.255.255 | Large networks |
| B | 10 | 128.0.0.0 – 191.255.255.255 | Medium networks |
| C | 110 | 192.0.0.0 – 223.255.255.255 | Small networks |
| D | 1110 | 224.0.0.0 – 239.255.255.255 | Multicast |
| E | 1111 | 240.0.0.0 – 255.255.255.255 | Reserved |

# Private and Public Addresses

Not every IPv4 address is routable on the public internet. RFC 1918 reserves three ranges for private networks, which are used inside homes, offices, and data centers and are translated to a public address by NAT when they need to reach the internet.

## Private Ranges

- `10.0.0.0/8` — 16,777,216 addresses
- `172.16.0.0/12` — 1,048,576 addresses
- `192.168.0.0/16` — 65,536 addresses

## Public Addresses

Everything else is public, though some blocks are reserved for special purposes (loopback, link-local, documentation, multicast). A public IPv4 address is globally unique and routable.

## Special Addresses

| Range | Purpose |
| :--- | :--- |
| `127.0.0.0/8` | Loopback (e.g. `127.0.0.1` = localhost) |
| `169.254.0.0/16` | Link-local (APIPA) |
| `224.0.0.0/4` | Multicast |
| `240.0.0.0/4` | Reserved |
| `255.255.255.255` | Limited broadcast |

# Subnetting and CIDR

IPv4 addresses are split into a network portion and a host portion. The boundary is defined by a subnet mask, or in modern notation by a CIDR prefix like `/24`.

## Subnet Masks

A subnet mask is a 32-bit number where the 1s mark the network bits and the 0s mark the host bits.

- `/24` = `255.255.255.0`
- `/16` = `255.255.0.0`
- `/8`  = `255.0.0.0`

## CIDR Notation

Classless Inter-Domain Routing (CIDR) writes the prefix length directly after the address: `192.168.1.0/24`. The number after the slash is how many leading bits belong to the network.

## An Example

Given `192.168.1.10/24`:

1. The `/24` means the first 24 bits are the network: `192.168.1`.
2. The last 8 bits are the host: `10`.
3. The network address is `192.168.1.0`.
4. The broadcast address is `192.168.1.255`.
5. Usable hosts: `192.168.1.1` through `192.168.1.254`.

# IPv4 Header

Every IPv4 packet begins with a header that carries the information routers need to deliver it. The header is at least 20 bytes long, and up to 60 bytes if options are used.

## Key Fields

- **Version** — 4 for IPv4.
- **IHL** — Internet Header Length, in 32-bit words.
- **Total Length** — size of the packet including header and payload.
- **TTL** — Time To Live, decremented at each hop; when it reaches 0, the packet is dropped.
- **Protocol** — the payload protocol (TCP = 6, UDP = 17, ICMP = 1).
- **Source Address** — 32-bit sender address.
- **Destination Address** — 32-bit receiver address.

## Fragmentation

If a packet is larger than the MTU of the next link, IPv4 routers can fragment it into smaller pieces. The `Identification`, `Flags`, and `Fragment Offset` fields let the receiver reassemble them.

# IPv4 vs IPv6

IPv4 has run out of addresses. IPv6 was designed to replace it, but both protocols are still in use today.

## Address Size

- IPv4: 32 bits, ~4.3 billion addresses.
- IPv6: 128 bits, ~340 undecillion addresses.

## Header Differences

IPv6 headers are simpler and fixed-size (40 bytes), with no fragmentation done by routers, no header checksum, and no options field (extensions are separate headers).

## Coexistence

Dual-stack hosts run IPv4 and IPv6 side by side. Tunnels and translation mechanisms (like NAT64 and 464XLAT) allow IPv6-only networks to reach IPv4-only destinations.

# Common Commands

These commands are commonly used when working with IPv4 on Linux and macOS:

- `ip addr` — show IPv4 addresses on interfaces.
- `ip route` — show the routing table.
- `ping 8.8.8.8` — check reachability.
- `traceroute 8.8.8.8` — trace the path to a host.
- `dig example.com A` — resolve an IPv4 address.

On Windows, use `ipconfig` instead of `ip addr`.

# Summary

IPv4 is a 32-bit addressing protocol that has powered the internet for decades. Its limits — most notably the exhaustion of available addresses — drove the creation of NAT for short-term relief and IPv6 for the long term. Understanding IPv4 addressing, subnetting, and the header layout remains essential for anyone working with networks.

---

# Tags

- networking
- ipv4
- ip-addressing
- subnetting
- cidr
- routing
- multicast
