# DHCP

The Dynamic Host Configuration Protocol (DHCP) is a client/server protocol that automatically provides an Internet Protocol (IP) host with its IP address and other related configuration information such as the subnet mask and default gateway.

# What DHCP Is

In the early days of networking, every computer needed to have its IP address, subnet mask, and DNS servers typed in manually by a network administrator. As networks grew, this became impossible to manage. DHCP was created to automate this process. 

When a device connects to a network, it acts as a DHCP client, reaching out to a DHCP server to request an IP address. The server leases an address to the client from a predefined pool of available addresses.

## Dynamic Allocation

DHCP's most common method of operation is dynamic allocation. The server assigns an IP address to a client for a limited period of time (a lease) or until the client explicitly relinquishes the address.

## Static Allocation (Reservations)

Network administrators can also configure a DHCP server to always assign the same specific IP address to a specific device, based on that device's unique MAC address. This is known as a DHCP reservation, combining the predictability of static IP addresses with the centralized management of DHCP.

# The DORA Process

When a new device connects to an IPv4 network, it obtains an IP address using a four-step process commonly referred to by the acronym **DORA**. DHCP operates over UDP, using port 67 for the server and port 68 for the client.

## 1. Discover

Because the client doesn't have an IP address and doesn't know who the DHCP server is, it sends a DHCPDISCOVER message as a broadcast to the entire local network. It essentially shouts, "Is there a DHCP server out there that can give me an IP address?"

## 2. Offer

Any DHCP server that receives the Discover message will check its address pool. It reserves an available IP address and replies with a DHCPOFFER message. This message contains the offered IP address, the subnet mask, the lease duration, and the IP address of the DHCP server making the offer.

## 3. Request

The client might receive multiple offers if there are multiple DHCP servers on the network. It chooses one (usually the first one it receives) and broadcasts a DHCPREQUEST message. This message tells all servers which offer it accepted, formally requesting the IP from the chosen server and implicitly declining any others.

## 4. Acknowledge

The chosen DHCP server receives the Request, finalizes the lease in its database, and sends a DHCPACK (Acknowledge) message back to the client. This packet contains all the final configuration data (like DNS servers and the default gateway). The client applies these settings and can now communicate on the network.

# DHCP Leases

IP addresses are not given out permanently; they are leased. This ensures that if a device leaves the network (like a smartphone leaving a coffee shop Wi-Fi), its IP address is eventually returned to the pool for another device to use.

## Lease Time

The network administrator sets the lease time. It could be 8 hours for a busy public Wi-Fi network, or 8 days for a stable corporate office network.

## Renewal (T1 and T2 Timers)

Clients do not wait for their lease to expire before asking to keep it. 
* **T1 Timer (Renewal):** When the lease is 50% expired, the client sends a unicast request directly to the DHCP server asking to renew the lease. 
* **T2 Timer (Rebinding):** If the original server is offline and doesn't respond by the time the lease is 87.5% expired, the client broadcasts a request to *any* available DHCP server to extend the lease.

If the lease fully expires, the client must immediately stop using the IP address and restart the DORA process.

# DHCP Options

While the IP address is the most critical piece of information, a DHCP server provides other essential configuration details, known as DHCP Options.

* **Subnet Mask (Option 1):** Defines the size of the local network.
* **Router / Default Gateway (Option 3):** Tells the client where to send traffic destined for the internet.
* **Domain Name Server (Option 6):** Provides the IP addresses of the DNS servers the client should use to resolve web addresses.

# DHCPv6

IPv6 also has a version of DHCP, called DHCPv6. However, its role is slightly different.

Because IPv6 devices can largely configure their own IP addresses using SLAAC (Stateless Address Autoconfiguration), DHCPv6 is often used in a "Stateless" mode. In this mode, the router gives the device its IP address prefix via SLAAC, and the DHCPv6 server just hands out the extra options, like DNS server addresses. It can also operate in "Stateful" mode, which works very similarly to traditional IPv4 DHCP.

# Summary

DHCP is the invisible service that makes modern networking plug-and-play. By automating the distribution of IP addresses, subnet masks, and routing information, DHCP eliminates the massive administrative overhead of manual IP management and prevents errors like IP address conflicts, ensuring devices can reliably connect to networks.

# Tags

* networking
* dhcp
* ip-addressing
* dora
* network-administration
* udp
* ipv4

# Hyperlinks

| **Word in Document** | **Official Source** |
| :--- | :--- |
| DHCP | https://datatracker.ietf.org/doc/html/rfc2131 |
| IPv4 | https://datatracker.ietf.org/doc/html/rfc791 |
| UDP | https://datatracker.ietf.org/doc/html/rfc768 |
| DNS | https://datatracker.ietf.org/doc/html/rfc1035 |
| IPv6 | https://datatracker.ietf.org/doc/html/rfc8200 |
| DHCPv6 | https://datatracker.ietf.org/doc/html/rfc8415 |
| SLAAC | https://datatracker.ietf.org/doc/html/rfc4862 |

# Mouse Over

| **Word in Document** | **Mouse Over Information** |
| :--- | :--- |
| Acknowledge | The final step (DHCPACK) in the DORA process where the server confirms the lease and sends all configuration data. |
| address pool | A range of available IP addresses that a DHCP server is authorized to assign to clients. |
| broadcast | Transmitting a packet to every device on a local network segment, used in the Discover and Request phases. |
| client | A computer, smartphone, or other device that requests a service (like an IP address) from a server. |
| default gateway | The router on the local network that forwards traffic to other networks or the public internet. |
| DHCP | Dynamic Host Configuration Protocol; automatically assigns IP addresses and network parameters to devices. |
| DHCP Options | Additional configuration parameters (like DNS servers or default gateway) supplied by the DHCP server. |
| DHCP reservation | A configuration where a DHCP server always assigns a specific, pre-determined IP address to a specific MAC address. |
| DHCPv6 | The IPv6 equivalent of DHCP, capable of handing out addresses or just supplementary options depending on the configuration. |
| Discover | The first step (DHCPDISCOVER) in the DORA process where a client broadcasts to find a DHCP server. |
| DNS | Domain Name System; the hierarchical system used to identify computers and resolve names (like google.com) to IP addresses. |
| DORA | An acronym (Discover, Offer, Request, Acknowledge) describing the 4-step process of obtaining a DHCP lease. |
| dynamic allocation | The process of assigning an IP address to a device temporarily from a pool of available addresses. |
| IP address | A unique string of numbers that identifies each computer using the Internet Protocol to communicate. |
| IPv4 | Internet Protocol version 4; the widely deployed version of the protocol using 32-bit addresses. |
| IPv6 | Internet Protocol version 6; the newer standard using 128-bit addresses to solve address exhaustion. |
| lease | The temporary assignment of an IP address to a device by a DHCP server. |
| lease time | The specific duration for which a client is allowed to use an assigned IP address before it must renew or release it. |
| local network | A computer network that interconnects computers within a limited area such as a residence or office building. |
| MAC address | Media Access Control address; a unique hardware identifier hardcoded into a network interface card. |
| network administrator | An IT professional responsible for maintaining, configuring, and troubleshooting computer networks. |
| Offer | The second step (DHCPOFFER) in the DORA process where a server reserves an IP and offers it to the client. |
| plug-and-play | A system or technology that works immediately when connected, without requiring manual configuration. |
| port | A virtual point where network connections start and end, associated with a specific process (e.g., port 67 and 68 for DHCP). |
| Request | The third step (DHCPREQUEST) in the DORA process where a client formally accepts a specific IP offer. |
| router | A networking device that forwards data packets between computer networks. |
| server | A computer program or device that provides a service, resource, or data to other client computers. |
| SLAAC | Stateless Address Autoconfiguration; a mechanism allowing IPv6 nodes to generate their own IP addresses without a DHCP server. |
| static IP addresses | IP addresses that are manually configured on a device by an administrator and do not change. |
| subnet mask | A 32-bit number used to mathematically separate the network portion from the host portion of an IP address. |
| UDP | User Datagram Protocol; a faster, connectionless transport protocol used by DHCP for its speed and broadcasting support. |
| unicast | A communication method where data is sent from one specific sender directly to one specific receiver. |
| Wi-Fi | A common wireless networking technology that allows devices to interface with a local network and the internet. |