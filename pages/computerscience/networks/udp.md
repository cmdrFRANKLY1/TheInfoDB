# UDP

The User Datagram Protocol (UDP) is one of the core communication protocols of the Internet protocol suite. Operating at the transport layer, UDP is used to send short messages called datagrams across an IP network. It is known for being incredibly fast, but at the cost of reliability.

# What UDP Is

UDP is a connectionless, best-effort transport protocol. Unlike its counterpart, TCP, UDP does not establish a connection before sending data. It simply packages the data and sends it to the destination as quickly as possible. Because there is no setup and no error-checking guarantee, it is highly efficient for time-sensitive applications.

## Connectionless Nature

In UDP, there is no "handshake." The sending device does not check if the receiving device is ready, active, or even exists. It just fires the datagrams at the destination IP address and port.

## Best-Effort Delivery

UDP provides no guarantee that the data will arrive. If a datagram is lost in transit due to network congestion or interference, UDP does not attempt to retransmit it. The data is simply dropped. It also does not guarantee that datagrams will arrive in the order they were sent.

# The UDP Header

Because UDP is so minimal, its header is incredibly small. While a TCP header is at least 20 bytes long, the UDP header is a fixed 8 bytes. This low overhead is a major reason why UDP is so fast.

## Header Fields

The 8-byte header consists of only four fields, each 16 bits (2 bytes) long:

1. **Source Port:** The port number of the sender. (Optional; if not used, it is set to zero).
2. **Destination Port:** The port number the datagram is intended for on the receiving device.
3. **Length:** The length of the entire UDP datagram (header + payload) in bytes.
4. **Checksum:** Used to detect corruption in the header and payload during transit. (Optional in IPv4, but mandatory in IPv6).

# Common Use Cases

Because UDP drops packets rather than slowing down to resend them, it is ideal for applications where real-time speed is more important than perfect accuracy.

## Streaming Media

When watching a live video or listening to an audio stream, it is better to lose a single frame of video (a momentary glitch) than to pause the entire stream to wait for delayed packets.

## Online Gaming

In fast-paced multiplayer games, positional data changes every millisecond. If a packet containing a player's previous position is lost, the game doesn't need it resent; it just needs the newest packet with the current position.

## Voice over IP (VoIP)

Voice calls rely on UDP. If a packet is lost, you might hear a slight skip or crackle in the audio. If TCP were used, the audio would constantly freeze and stutter as the network tried to recover lost data.

## DNS Lookups

The Domain Name System (DNS) typically uses UDP for resolving hostnames to IP addresses. A DNS request is usually a single small datagram, and the response is another. The speed of UDP makes web browsing feel instantaneous.

# UDP vs TCP

UDP and TCP (Transmission Control Protocol) are the two main transport-layer protocols, serving opposite needs.

| Feature | UDP | TCP |
| :--- | :--- | :--- |
| **Connection type** | Connectionless (no handshake) | Connection-oriented (3-way handshake) |
| **Reliability** | Unreliable (best-effort) | Reliable (guaranteed delivery) |
| **Ordering** | No ordered delivery | Packets reassembled in order |
| **Speed** | Very fast (low latency) | Slower (higher overhead) |
| **Header size** | 8 bytes | 20 to 60 bytes |
| **Retransmission** | None | Lost packets are resent |
| **Use cases** | Gaming, VoIP, Streaming, DNS | Web browsing, Email, File transfers |

# Summary

UDP is the "fire and forget" protocol of the internet. By stripping away error correction, flow control, and connection management, UDP provides a incredibly lightweight and fast way to transmit data. It relies on the applications themselves to handle any necessary error correction, making it the perfect tool for the real-time, high-speed demands of the modern internet.

# Tags

* networking
* udp
* transport-layer
* datagram
* connectionless
* tcp
* voip
* dns

# Hyperlinks

| **Word in Document** | **Official Source** |
| :--- | :--- |
| UDP | https://datatracker.ietf.org/doc/html/rfc768 |
| TCP | https://datatracker.ietf.org/doc/html/rfc9293 |
| IPv4 | https://datatracker.ietf.org/doc/html/rfc791 |
| IPv6 | https://datatracker.ietf.org/doc/html/rfc8200 |
| DNS | https://datatracker.ietf.org/doc/html/rfc1035 |
| IP | https://datatracker.ietf.org/doc/html/rfc791 |

# Mouse Over

| **Word in Document** | **Mouse Over Information** |
| :--- | :--- |
| 16 bits | A piece of data consisting of 16 binary digits, capable of representing values up to 65,535. |
| 3-way handshake | The process TCP uses to establish a reliable connection before sending data (SYN, SYN-ACK, ACK). |
| best-effort | A network design where the system attempts to deliver data but does not guarantee successful delivery. |
| bytes | Units of digital information, where one byte consists of 8 bits. |
| Checksum | A computed value used to verify the integrity of the data in the header and payload, ensuring it wasn't corrupted. |
| connection-oriented | A protocol that establishes a dedicated, verified link between two devices before transferring data. |
| connectionless | A type of protocol where data is sent without establishing a dedicated, persistent connection first. |
| datagrams | The fundamental, self-contained transfer units used by UDP, containing both source/destination info and data. |
| Destination Port | The port number on the receiving device that dictates which application should process the datagram. |
| DNS | Domain Name System; the hierarchical system used to identify computers and resolve names to IPs. |
| flow control | A mechanism in TCP to manage the rate of data transmission so a fast sender doesn't overwhelm a slow receiver. |
| handshake | A process of negotiation that dynamically sets parameters of a communications channel before normal communication over the channel begins. |
| header | Supplemental data placed at the start of a packet or datagram, containing necessary control and routing information. |
| hostnames | Human-readable labels assigned to a device connected to a computer network (e.g., example.com). |
| Internet protocol suite | The conceptual model and set of communications protocols used in the Internet and similar computer networks (often called TCP/IP). |
| IP | Internet Protocol; the fundamental communications protocol used for routing datagrams across network boundaries. |
| IP address | A unique string of numbers separated by periods (IPv4) or colons (IPv6) that identifies each computer. |
| IPv4 | Internet Protocol version 4; the widely deployed version of the protocol using 32-bit addresses. |
| IPv6 | Internet Protocol version 6; the newer standard using 128-bit addresses. |
| latency | The time it takes for data to pass from one point on a network to another. |
| network congestion | A condition that occurs when a network node or link carries more data than it can handle, leading to packet loss. |
| overhead | The extra data (like headers) and processing time required to operate a protocol, which does not contribute to the actual payload. |
| packet loss | Occurs when one or more packets of data traveling across a computer network fail to reach their destination. |
| packets | Small, formatted blocks of data traveling over a network. |
| payload | The actual intended message or data inside a datagram, excluding the header information. |
| port | A virtual point where network connections start and end, associated with a specific process or service. |
| retransmit | The act of sending a dropped or lost packet again, a feature of TCP but not UDP. |
| Source Port | The port number on the sending device from which a datagram originates. |
| TCP | Transmission Control Protocol; a reliable, connection-oriented protocol that ensures data delivery. |
| transport layer | The network layer responsible for end-to-end communication and data delivery (e.g., TCP or UDP). |
| UDP | User Datagram Protocol; a faster, connectionless protocol that does not guarantee successful data delivery. |
| VoIP | Voice over IP; technology that allows voice calls to be made over internet connections. |