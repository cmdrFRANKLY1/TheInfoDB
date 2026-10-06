# IPv4

Internet Protocol version 4 (IPv4) is the fourth version of the Internet Protocol and the first one to be widely deployed. It is the addressing system that most of the internet still runs on today, using 32-bit addresses to identify every device on a network.

# What IPv4 Is

IPv4 is a connectionless, best-effort protocol used to route packets between devices on a network. Every device that communicates over IPv4 needs a unique 32-bit address, usually written in dotted-decimal notation like `192.168.1.1`.

## The 32-Bit Address

An IPv4 address is 32 bits long. It is split into four 8-bit groups called octets, each ranging from 0 to 255.

* Format: `A.B.C.D`

* Example: `192.168.1.10`

* Total address space: 2^32 = 4,294,967,296 addresses

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
| ----- | ----- | ----- | ----- | 
| A | 0 | 1.0.0.0 – 126.255.255.255 | Large networks | 
| B | 10 | 128.0.0.0 – 191.255.255.255 | Medium networks | 
| C | 110 | 192.0.0.0 – 223.255.255.255 | Small networks | 
| D | 1110 | 224.0.0.0 – 239.255.255.255 | Multicast | 
| E | 1111 | 240.0.0.0 – 255.255.255.255 | Reserved | 

# Private and Public Addresses

Not every IPv4 address is routable on the public internet. RFC 1918 reserves three ranges for private networks, which are used inside homes, offices, and data centers and are translated to a public address by NAT when they need to reach the internet.

## Private Ranges

* `10.0.0.0/8` — 16,777,216 addresses

* `172.16.0.0/12` — 1,048,576 addresses

* `192.168.0.0/16` — 65,536 addresses

## Public Addresses

Everything else is public, though some blocks are reserved for special purposes (loopback, link-local, documentation, multicast). A public IPv4 address is globally unique and routable.

## Special Addresses

| Range | Purpose | 
| ----- | ----- | 
| `127.0.0.0/8` | Loopback (e.g. `127.0.0.1` = localhost) | 
| `169.254.0.0/16` | Link-local (APIPA) | 
| `224.0.0.0/4` | Multicast | 
| `240.0.0.0/4` | Reserved | 
| `255.255.255.255` | Limited broadcast | 

# Subnetting and CIDR

IPv4 addresses are split into a network portion and a host portion. The boundary is defined by a subnet mask, or in modern notation by a CIDR prefix like `/24`.

## Subnet Masks

A subnet mask is a 32-bit number where the 1s mark the network bits and the 0s mark the host bits.

* `/24` = `255.255.255.0`

* `/16` = `255.255.0.0`

* `/8`  = `255.0.0.0`

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

* **Version** — 4 for IPv4.

* **IHL** — Internet Header Length, in 32-bit words.

* **Total Length** — size of the packet including header and payload.

* **TTL** — Time To Live, decremented at each hop; when it reaches 0, the packet is dropped.

* **Protocol** — the payload protocol (TCP = 6, UDP = 17, ICMP = 1).

* **Source Address** — 32-bit sender address.

* **Destination Address** — 32-bit receiver address.

## Fragmentation

If a packet is larger than the MTU of the next link, IPv4 routers can fragment it into smaller pieces. The `Identification`, `Flags`, and `Fragment Offset` fields let the receiver reassemble them.

# IPv4 vs IPv6

IPv4 has run out of addresses. IPv6 was designed to replace it, but both protocols are still in use today.

## Address Size

* IPv4: 32 bits, \~4.3 billion addresses.

* IPv6: 128 bits, \~340 undecillion addresses.

## Header Differences

IPv6 headers are simpler and fixed-size (40 bytes), with no fragmentation done by routers, no header checksum, and no options field (extensions are separate headers).

## Coexistence

Dual-stack hosts run IPv4 and IPv6 side by side. Tunnels and translation mechanisms (like NAT64 and 464XLAT) allow IPv6-only networks to reach IPv4-only destinations.

# Common Commands

These commands are commonly used when working with IPv4 on Linux and macOS:

* `ip addr` — show IPv4 addresses on interfaces.

* `ip route` — show the routing table.

* `ping 8.8.8.8` — check reachability.

* `traceroute 8.8.8.8` — trace the path to a host.

* `dig example.com A` — resolve an IPv4 address.

On Windows, use `ipconfig` instead of `ip addr`.

# Summary

IPv4 is a 32-bit addressing protocol that has powered the internet for decades. Its limits — most notably the exhaustion of available addresses — drove the creation of NAT for short-term relief and IPv6 for the long term. Understanding IPv4 addressing, subnetting, and the header layout remains essential for anyone working with networks.

# Tags

* network

* computer science

* networking

* ipv4

* ip-addressing

* subnetting

* cidr

* routing

* multicast

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| IPv4 | https://datatracker.ietf.org/doc/html/rfc791 | 
| RFC 1918 | https://datatracker.ietf.org/doc/html/rfc1918 | 
| TCP | https://datatracker.ietf.org/doc/html/rfc9293 | 
| UDP | https://datatracker.ietf.org/doc/html/rfc768 | 
| ICMP | https://datatracker.ietf.org/doc/html/rfc792 | 
| IPv6 | https://datatracker.ietf.org/doc/html/rfc8200 | 
| NAT | https://datatracker.ietf.org/doc/html/rfc3022 | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| 32-bit | A piece of data consisting of 32 binary digits (1s and 0s). | 
| 464XLAT | An IPv6 transition mechanism that allows IPv4-only applications to operate on an IPv6-only network. | 
| address space | The total range of valid IP addresses available for use. | 
| APIPA | Automatic Private IP Addressing; automatically assigns a link-local address when a server is unavailable. | 
| best-effort | A network design where the system attempts to deliver data but does not guarantee successful delivery. | 
| binary | A base-2 numbering system using only 0s and 1s, which computers use natively. | 
| broadcast | Transmitting a packet that will be received by every device within a specific network segment. | 
| bytes | Units of digital information, where one byte consists of 8 bits. | 
| CIDR | Classless Inter-Domain Routing; a flexible method for allocating IP addresses and routing packets. | 
| connectionless | A type of protocol where data is sent without establishing a dedicated, persistent connection first. | 
| data centers | Physical facilities used to house enterprise computer systems and associated networking components. | 
| decimal | The standard base-10 numbering system typically used by humans. | 
| dig | Domain Information Groper; a command-line tool used to query Domain Name System (DNS) servers. | 
| domain | A human-readable name identifying an administrative space on the internet, such as example.com. | 
| dotted-decimal notation | Writing numerical data separated by dots, commonly used to make 32-bit IPv4 addresses readable. | 
| dual-stack | A networking configuration where devices or networks run both IPv4 and IPv6 protocols simultaneously. | 
| Fragment Offset | A field in the IPv4 header used to reassemble fragmented packets in the correct order. | 
| fragmentation | Breaking a large data packet into smaller pieces so it can travel over a network link with a smaller MTU. | 
| header | Supplemental data placed at the start of a packet, containing necessary control and routing information. | 
| hop | A single step or router-to-router segment along the path a packet takes through a network. | 
| host | Any computer, server, or device connected to a network. | 
| ICMP | Internet Control Message Protocol; used for network diagnostics and error reporting, like the ping command. | 
| IHL | Internet Header Length; a specific field in the IPv4 header that specifies the size of the header itself. | 
| interface | The physical or virtual network connection point on a computer, server, or router. | 
| Internet Protocol | The fundamental communications protocol used for routing datagrams across network boundaries. | 
| IP | An abbreviation for Internet Protocol. | 
| IPv4 | Internet Protocol version 4; the widely deployed fourth version of the protocol using 32-bit addresses. | 
| IPv6 | Internet Protocol version 6; the newer standard using 128-bit addresses, designed to replace IPv4. | 
| link-local | IP addresses intended only for communications within the local network segment or broadcast domain. | 
| Linux | A popular open-source operating system kernel heavily used in servers and networking hardware. | 
| loopback | A special internal network address (like 127.0.0.1) that routes data back to the same device for testing. | 
| macOS | The proprietary Unix-based operating system developed by Apple for Mac computers. | 
| MTU | Maximum Transmission Unit; the largest size packet that a given network connection can transmit. | 
| multicast | A communication method where data is delivered to a specific group of interested receivers simultaneously. | 
| NAT | Network Address Translation; a method routers use to translate private local IP addresses to a public IP. | 
| NAT64 | A transition mechanism that allows communication between IPv6 and IPv4 networks. | 
| network | A group of connected devices that can communicate, route packets, and share data with one another. | 
| octets | Groups of 8 bits; an IPv4 address is divided into four of these octets. | 
| packets | Small, formatted blocks of data traveling over a network. | 
| payload | The actual intended message or data inside a packet, excluding the routing and header information. | 
| ping | A network utility used to test whether a specific device or IP address is reachable over the network. | 
| prefix | The first portion of an IP address that identifies the network, usually followed by a slash (e.g., /24). | 
| private networks | Local networks using reserved IP addresses that are not directly reachable from the public internet. | 
| protocol | An agreed-upon set of rules and guidelines for formatting and processing network data. | 
| public internet | The global network of interconnected devices that are reachable via unique, public IP addresses. | 
| resolve | The process of translating a human-readable domain name (like example.com) into an IP address. | 
| routable | Capable of being forwarded by a router across different networks or out to the internet. | 
| route | The specific path that network traffic takes from its origin source to its final destination. | 
| routing table | A database stored in a router or computer listing the known paths to different network destinations. | 
| subnet mask | A 32-bit number used to mathematically separate the network portion from the host portion of an IP address. | 
| subnetting | The process of logically dividing a large network into smaller, more manageable sub-networks. | 
| TCP | Transmission Control Protocol; a reliable, connection-oriented protocol that ensures data delivery. | 
| traceroute | A diagnostic network tool that maps the entire path (all the hops) packets take to reach a destination. | 
| TTL | Time To Live; a counter in a packet that drops the packet if it bounces around the network too long. | 
| tunnels | A networking method of wrapping one protocol inside another to traverse an incompatible network. | 
| UDP | User Datagram Protocol; a faster, connectionless protocol that does not guarantee successful data delivery. | 
| Windows | A widely used proprietary graphical operating system developed by Microsoft. | 