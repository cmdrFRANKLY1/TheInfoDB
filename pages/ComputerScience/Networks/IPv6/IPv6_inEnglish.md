# IPv6

Internet Protocol version 6 (IPv6) is the most recent version of the Internet Protocol. It was designed to replace IPv4 and solve the address exhaustion problem by using 128-bit addresses, enough for every device on Earth to have its own globally unique public address.

# What IPv6 Is

IPv6 is a connectionless, best-effort protocol that routes packets between devices on a network. Unlike IPv4, it uses 128-bit addresses, written in hexadecimal groups separated by colons. Every device can have a globally unique address without the need for NAT.

## The 128-Bit Address

An IPv6 address is 128 bits long, split into eight groups of 16 bits each. Each group is written as four hexadecimal digits, separated by colons.

- Format: `xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`
- Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Total address space: 2^128 ≈ 340 undecillion addresses

## Hexadecimal Notation

IPv6 uses base-16 (hexadecimal) digits 0-9 and a-f. Each group is four hex digits, so it can represent values from `0000` to `ffff` (0 to 65535 in decimal).

## Address Compression

Long runs of zeros can be compressed. Consecutive all-zero groups are replaced with a double colon `::`. This can appear only once per address.

- Full: `2001:0db8:0000:0000:0000:0000:0000:0001`
- Compressed: `2001:db8::1`

Leading zeros within each group can also be dropped: `0db8` becomes `db8`.

# Address Types

IPv6 has several address types, each serving a different purpose.

## Unicast

A unicast address identifies a single interface. Packets sent to a unicast address are delivered to that one interface.

## Multicast

A multicast address identifies a group of interfaces. Packets sent to a multicast address are delivered to all members of the group. IPv6 has no broadcast — it uses multicast instead.

## Anycast

An anycast address is assigned to multiple interfaces, usually on different devices. Packets sent to an anycast address are delivered to the nearest one, as determined by routing.

| Type | Prefix | Purpose |
| :--- | :--- | :--- |
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

- **Version** — 6 for IPv6.
- **Traffic Class** — similar to IPv4's ToS, used for QoS.
- **Flow Label** — identifies packets belonging to the same flow.
- **Payload Length** — size of the payload, excluding the header.
- **Next Header** — identifies the next header (e.g. TCP, UDP, or an extension header).
- **Hop Limit** — same as IPv4's TTL.
- **Source Address** — 128-bit sender address.
- **Destination Address** — 128-bit receiver address.

## No Header Checksum

Unlike IPv4, IPv6 has no header checksum. This saves routers the work of verifying it at every hop; link-layer and transport-layer checksums catch most errors.

## No Router Fragmentation

IPv6 routers do not fragment packets. The sender must determine the path MTU and send packets that fit. Fragmentation, if needed, is done by the source using an extension header.

## Extension Headers

Options that were part of the IPv4 header are now separate extension headers, chained after the main header. Common ones include Hop-by-Hop Options, Routing, Fragment, and Destination Options.

# IPv6 vs IPv4

| Feature | IPv4 | IPv6 |
| :--- | :--- | :--- |
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

- **Dual Stack** — a device runs both protocols.
- **Tunneling** — IPv6 packets carried inside IPv4 packets (or vice versa).
- **Translation** — NAT64 and DNS64 translate between the two.

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

- `ip -6 addr` — show IPv6 addresses on interfaces.
- `ip -6 route` — show the IPv6 routing table.
- `ping6 2001:4860:4860::8888` — check reachability (Google's public DNS).
- `traceroute6 2001:4860:4860::8888` — trace the path to a host.
- `dig example.com AAAA` — resolve an IPv6 address.

On Windows, use `ipconfig /all` to see IPv6 configuration, and `ping -6` for IPv6 pings.

# Summary

IPv6 is the long-term replacement for IPv4. Its 128-bit address space removes the scarcity that drove the creation of NAT, and its simpler header improves router efficiency. Transition is gradual — most networks today run dual-stack IPv4 and IPv6 — but IPv6 adoption continues to grow as IPv4 addresses become harder to obtain.

---
