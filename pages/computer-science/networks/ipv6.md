# IPv6

Internet Protocol version 6 (IPv6) is the most recent version of the Internet Protocol. It was designed to replace IPv4 and solve the address exhaustion problem by using 128-bit addresses, enough for every device on Earth to have its own globally unique public address.

# What IPv6 Is

IPv6 is a connectionless, best-effort protocol that routes packets between devices on a network. Unlike IPv4, it uses 128-bit addresses, written in hexadecimal groups separated by colons. Every device can have a globally unique address without the need for NAT.

## The 128-Bit Address

An IPv6 address is 128 bits long, split into eight groups of 16 bits each. Each group is written as four hexadecimal digits, separated by colons.

* Format: `xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`

* Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

* Total address space: 2^128 ≈ 340 undecillion addresses

## Hexadecimal Notation

IPv6 uses base-16 (hexadecimal) digits 0-9 and a-f. Each group is four hex digits, so it can represent values from `0000` to `ffff` (0 to 65535 in decimal).

## Address Compression

Long runs of zeros can be compressed. Consecutive all-zero groups are replaced with a double colon `::`. This can appear only once per address.

* Full: `2001:0db8:0000:0000:0000:0000:0000:0001`

* Compressed: `2001:db8::1`

Leading zeros within each group can also be dropped: `0db8` becomes `db8`.

# Address Types

IPv6 has several address types, each serving a different purpose.

## Unicast

A unicast address identifies a single interface. Packets sent to a unicast address are delivered to that one interface.

## Multicast

A multicast address identifies a group of interfaces. Packets sent to a multicast address are delivered to all members of the group. IPv6 has no broadcast — it uses multicast instead.

## Anycast

An anycast address is assigned to multiple interfaces, usually on different devices. Packets sent to an anycast address are delivered to the nearest one, as determined by routing.

| 

| **Type** | **Prefix** | **Purpose** | 
| Global Unicast | `2000::/3` | Public, routable addresses | 
| Link-Local | `fe80::/10` | Automatic, non-routable, per-link | 
| Unique Local | `fc00::/7` | Private addresses, like IPv4 RFC 1918 | 
| Multicast | `ff00::/8` | Group communication | 
| Loopback | `::1/128` | Localhost | 
| Unspecified | `::/128` | No address (used during setup) | 

# Address Structure

Every IPv6 unicast address is split into two parts: a network prefix and an interface identifier.

## Network Prefix

The first 64 bits are the network prefix, assigned by the ISP or the local network administrator. This is the equivalent of the network portion in IPv4.

## Interface Identifier

The last 64 bits are the interface identifier, unique to each device on the link. It can be derived from the MAC address (EUI-64) or generated randomly (privacy extensions).

## Subnetting

Because the interface identifier is fixed at 64 bits, the subnet portion of the network prefix is commonly the 16 bits between the /48 ISP allocation and the /64 subnet. This gives 65,536 subnets per /48 — vastly more than any home or business needs.

# IPv6 Header

The IPv6 header is simpler than IPv4's. It has a fixed size of 40 bytes and only eight fields.

## Key Fields

* **Version** — 6 for IPv6.

* **Traffic Class** — similar to IPv4's ToS, used for QoS.

* **Flow Label** — identifies packets belonging to the same flow.

* **Payload Length** — size of the payload, excluding the header.

* **Next Header** — identifies the next header (e.g. TCP, UDP, or an extension header).

* **Hop Limit** — same as IPv4's TTL.

* **Source Address** — 128-bit sender address.

* **Destination Address** — 128-bit receiver address.

## No Header Checksum

Unlike IPv4, IPv6 has no header checksum. This saves routers the work of verifying it at every hop; link-layer and transport-layer checksums catch most errors.

## No Router Fragmentation

IPv6 routers do not fragment packets. The sender must determine the path MTU and send packets that fit. Fragmentation, if needed, is done by the source using an extension header.

## Extension Headers

Options that were part of the IPv4 header are now separate extension headers, chained after the main header. Common ones include Hop-by-Hop Options, Routing, Fragment, and Destination Options.

# IPv6 vs IPv4

| **Feature** | **IPv4** | **IPv6** | 
| Address size | 32 bits | 128 bits | 
| Notation | Dotted decimal | Hexadecimal with colons | 
| Header size | 20–60 bytes | 40 bytes fixed | 
| Header checksum | Yes | No | 
| Router fragmentation | Yes | No | 
| Broadcast | Yes | No (multicast instead) | 
| NAT | Common | Not needed | 
| Configuration | DHCP or manual | SLAAC, DHCPv6, or manual | 

## Address Exhaustion

The main driver for IPv6 was the exhaustion of IPv4 addresses. With 128-bit addresses, IPv6 will not run out in any foreseeable future.

## End-to-End Connectivity

Because every device can have a globally unique address, IPv6 restores end-to-end connectivity that NAT broke in IPv4. This simplifies peer-to-peer applications, VoIP, and gaming.

## Transition Mechanisms

IPv4 and IPv6 are not directly compatible. Transition mechanisms include:

* **Dual Stack** — a device runs both protocols.

* **Tunneling** — IPv6 packets carried inside IPv4 packets (or vice versa).

* **Translation** — NAT64 and DNS64 translate between the two.

# Autoconfiguration

IPv6 devices can configure themselves without a DHCP server, using Stateless Address Autoconfiguration (SLAAC).

## SLAAC

The device forms an address by combining a network prefix (learned from Router Advertisements) with an interface identifier (derived from its MAC or a random value).

## Router Advertisements

Routers send Router Advertisement (RA) messages periodically to announce the network prefix, default gateway, and other parameters.

## DHCPv6

For deployments that need central management, DHCPv6 can provide addresses, DNS servers, and other options, much like DHCP does for IPv4.

## Privacy Extensions

Because the EUI-64 interface identifier is derived from the MAC address, it can be used to track a device across networks. RFC 4941 defines privacy extensions that generate random interface identifiers that change periodically.

# Common Commands

These commands are commonly used when working with IPv6 on Linux and macOS:

* `ip -6 addr` — show IPv6 addresses on interfaces.

* `ip -6 route` — show the IPv6 routing table.

* `ping6 2001:4860:4860::8888` — check reachability (Google's public DNS).

* `traceroute6 2001:4860:4860::8888` — trace the path to a host.

* `dig example.com AAAA` — resolve an IPv6 address.

On Windows, use `ipconfig /all` to see IPv6 configuration, and `ping -6` for IPv6 pings.

# Summary

IPv6 is the long-term replacement for IPv4. Its 128-bit address space removes the scarcity that drove the creation of NAT, and its simpler header improves router efficiency. Transition is gradual — most networks today run dual-stack IPv4 and IPv6 — but IPv6 adoption continues to grow as IPv4 addresses become harder to obtain.

# Tags

* network

* computer science

* networking

* ipv6

* ip-addressing

* subnetting

* routing

* multicast

* nat64

* dns64

# Hyperlinks

| **Word in Document** | **Official Source** | 
| IPv6 | https://datatracker.ietf.org/doc/html/rfc8200 | 
| RFC 1918 | https://datatracker.ietf.org/doc/html/rfc1918 | 
| RFC 4941 | https://datatracker.ietf.org/doc/html/rfc4941 | 
| SLAAC | https://datatracker.ietf.org/doc/html/rfc4862 | 
| DHCPv6 | https://datatracker.ietf.org/doc/html/rfc8415 | 
| NAT64 | https://datatracker.ietf.org/doc/html/rfc6146 | 
| DNS64 | https://datatracker.ietf.org/doc/html/rfc6147 | 
| TCP | https://datatracker.ietf.org/doc/html/rfc9293 | 
| UDP | https://datatracker.ietf.org/doc/html/rfc768 | 

# Mouse Over

| **Word in Document** | **Mouse Over Information** | 
| 128-bit | A piece of data consisting of 128 binary digits (1s and 0s). | 
| AAAA | A DNS record type that maps a domain name to an IPv6 address. | 
| address exhaustion | The depletion of the pool of unallocated IP addresses available for assignment. | 
| address space | The total range of valid IP addresses available for use. | 
| anycast | A routing methodology where datagrams are sent to the nearest interface in a group. | 
| base-16 | Another term for the hexadecimal numeral system. | 
| best-effort | A network design where the system attempts to deliver data but does not guarantee successful delivery. | 
| broadcast | Transmitting a packet to every device in a network segment; IPv6 replaces this entirely with multicast. | 
| bytes | Units of digital information, where one byte consists of 8 bits. | 
| connectionless | A type of protocol where data is sent without establishing a dedicated, persistent connection first. | 
| decimal | The standard base-10 numbering system typically used by humans. | 
| default gateway | The node in a computer network that serves as the forwarding host to other networks. | 
| DHCP | Dynamic Host Configuration Protocol; used to automatically assign IP addresses in IPv4. | 
| DHCPv6 | Dynamic Host Configuration Protocol for IPv6; used for centralized management of IPv6 addresses. | 
| dig | Domain Information Groper; a command-line tool used to query Domain Name System (DNS) servers. | 
| DNS | Domain Name System; the hierarchical system used to identify computers and resolve names to IPs. | 
| DNS64 | A mechanism that synthesizes AAAA records to allow IPv6-only clients to communicate with IPv4 servers. | 
| Dual Stack | A networking configuration where devices or networks run both IPv4 and IPv6 protocols simultaneously. | 
| EUI-64 | Extended Unique Identifier; a method to automatically create a 64-bit interface identifier from a MAC address. | 
| extension header | Optional headers in IPv6 that follow the main header to provide extra functionality. | 
| Flow Label | A field in the IPv6 header used to maintain the sequential flow of packets for a specific communication. | 
| fragmentation | Breaking a large data packet into smaller pieces so it can travel over a link with a smaller MTU. | 
| Global Unicast | An IPv6 address that is globally unique and routable on the public internet. | 
| globally unique | An address that is unique across the entire public internet, ensuring no two devices share it. | 
| header | Supplemental data placed at the start of a packet, containing necessary control and routing information. | 
| header checksum | A calculated value used in IPv4 to verify header integrity; removed in IPv6 for efficiency. | 
| hexadecimal | A base-16 numbering system using digits 0-9 and letters a-f, used to write IPv6 addresses. | 
| hop | A single step or router-to-router segment along the path a packet takes through a network. | 
| Hop Limit | An IPv6 header field that decreases by one at each router; the packet drops when it reaches zero. | 
| Hop-by-Hop Options | An IPv6 extension header used to carry information that must be examined by every node on the path. | 
| interface | The physical or virtual network connection point on a computer, server, or router. | 
| interface identifier | The second half (64 bits) of an IPv6 address, uniquely identifying a specific interface on a local link. | 
| Internet Protocol | The fundamental communications protocol used for routing datagrams across network boundaries. | 
| IPv4 | Internet Protocol version 4; the older standard using 32-bit addresses. | 
| IPv6 | Internet Protocol version 6; the current standard using 128-bit addresses to solve address exhaustion. | 
| ISP | Internet Service Provider; a company that provides access to the internet. | 
| link-layer | The lowest layer in the IP suite, handling communication on the immediate local network segment. | 
| Link-Local | IP addresses intended only for communications within the local network segment; not globally routable. | 
| Linux | A popular open-source operating system kernel heavily used in servers and networking hardware. | 
| Localhost | A hostname meaning "this computer", which resolves to the loopback address (::1 in IPv6). | 
| Loopback | A special internal network address that routes data back to the same device for testing purposes. | 
| MAC address | Media Access Control address; a unique hardware identifier assigned to a network interface. | 
| MTU | Maximum Transmission Unit; the largest size packet that a given network connection can transmit. | 
| multicast | A communication method where data is delivered to a specific group of interested receivers simultaneously. | 
| NAT | Network Address Translation; a method to map multiple local private addresses to a public one. | 
| NAT64 | A transition mechanism that translates IPv6 packets to IPv4 packets and vice versa. | 
| network prefix | The first part of an IP address that identifies the specific network the device belongs to. | 
| Next Header | An IPv6 header field that identifies the type of header immediately following the main IPv6 header. | 
| packets | Small, formatted blocks of data traveling over a network. | 
| payload | The actual intended message or data inside a packet, excluding the routing and header information. | 
| Payload Length | A field in the IPv6 header that specifies the size of the rest of the packet. | 
| peer-to-peer | A network model where devices communicate directly with each other without a centralized server. | 
| ping6 | A network utility used to test whether a specific IPv6 address is reachable. | 
| privacy extensions | A feature in IPv6 that generates random, temporary interface identifiers to prevent user tracking. | 
| QoS | Quality of Service; mechanisms used to ensure certain types of network traffic are prioritized. | 
| resolve | The process of translating a human-readable domain name (like example.com) into an IP address. | 
| route | The specific path that network traffic takes from its origin source to its final destination. | 
| Router Advertisements | ICMPv6 messages sent by routers to announce their presence and network parameters to local hosts. | 
| routing table | A database stored in a router or computer listing the known paths to different network destinations. | 
| SLAAC | Stateless Address Autoconfiguration; allows IPv6 devices to automatically configure their own IP addresses. | 
| Source Address | The IP address of the device sending a packet. | 
| subnet | A logical subdivision of an IP network. | 
| subnetting | The process of logically dividing a large network into smaller, more manageable sub-networks. | 
| TCP | Transmission Control Protocol; a reliable, connection-oriented protocol that ensures data delivery. | 
| ToS | Type of Service; an older IPv4 field used for prioritizing traffic. | 
| traceroute6 | A diagnostic tool that maps the entire path packets take to reach an IPv6 destination. | 
| Traffic Class | An IPv6 header field used for packet prioritization and Quality of Service (QoS). | 
| Translation | A transition mechanism that actively converts packets from one protocol version to another. | 
| transport-layer | The network layer responsible for end-to-end communication and data delivery (e.g., TCP or UDP). | 
| TTL | Time To Live; the IPv4 equivalent of the IPv6 Hop Limit. | 
| Tunneling | A networking method of wrapping one protocol inside another to traverse an incompatible network. | 
| UDP | User Datagram Protocol; a faster, connectionless protocol that does not guarantee successful data delivery. | 
| unicast | A communication method where data is sent from one specific sender to one specific receiver. | 
| Unique Local | IPv6 addresses meant for local communications within a site, functionally similar to IPv4 private addresses. | 
| VoIP | Voice over IP; technology that allows voice calls to be made over internet connections. | 
| Windows | A widely used proprietary graphical operating system developed by Microsoft. | 
