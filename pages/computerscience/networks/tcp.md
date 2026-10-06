# TCP

The Transmission Control Protocol (TCP) is one of the foundational protocols of the Internet protocol suite. Operating at the transport layer, TCP provides reliable, ordered, and error-checked delivery of a stream of bytes between applications running on hosts communicating via an IP network.

# What TCP Is

TCP is a connection-oriented, reliable transport protocol. Unlike UDP, which simply fires packets at a destination, TCP meticulously sets up a connection, tracks every piece of data sent, and guarantees that it arrives intact and in the correct order. 

## Connection-Oriented Nature

Before any actual data is transferred, TCP establishes a strict, verified connection between the client and the server. This setup phase ensures that both devices are ready to communicate and sets the initial parameters for the data transfer.

## Guaranteed Reliability

TCP guarantees that no data is lost during transit. If network congestion or interference causes a packet to drop, TCP detects the loss and automatically retransmits the missing data. 

# The 3-Way Handshake

To establish a connection, TCP uses a process called the 3-way handshake. This ensures both the sender and receiver are synchronized before data flows.

1. **SYN (Synchronize):** The client sends a packet with the SYN flag set to the server, indicating a request to start communication and sharing its initial sequence number.
2. **SYN-ACK (Synchronize-Acknowledge):** The server receives the SYN, and replies with a packet that has both the SYN and ACK flags set. This acknowledges the client's request and shares the server's own initial sequence number.
3. **ACK (Acknowledge):** The client receives the SYN-ACK and sends back a final ACK packet to the server. The connection is now established, and data transfer can begin.

# Reliability and Flow Control

TCP uses several mechanisms to ensure data is handled carefully and efficiently without overwhelming the network.

## Sequence and Acknowledgment Numbers

Every single byte of data sent over a TCP connection is numbered. The sender uses a Sequence Number to track what it sent, and the receiver uses an Acknowledgment Number (ACK) to tell the sender exactly what it has successfully received. 

## Retransmission

If the sender transmits a packet but does not receive an ACK for it within a specific timeframe (a timeout), it assumes the packet was lost and automatically retransmits it.

## Flow Control (Sliding Window)

TCP prevents a fast sender from overwhelming a slow receiver. The receiver constantly updates the sender with its "Window Size," which indicates how much buffer space it has left to receive new data. If the window drops to zero, the sender pauses.

# The TCP Header

Because TCP does so much heavy lifting, its header is significantly larger than UDP's. The minimum TCP header size is 20 bytes, but it can be up to 60 bytes if optional features are used.

## Key Header Fields

* **Source Port / Destination Port:** (16 bits each) Identifies the sending and receiving applications.
* **Sequence Number:** (32 bits) Identifies the position of the data in the sender's byte stream.
* **Acknowledgment Number:** (32 bits) Identifies the next sequence number the receiver is expecting.
* **Flags (Control Bits):** (9 bits) Includes flags like SYN, ACK, FIN (finish), and RST (reset) that control the state of the connection.
* **Window Size:** (16 bits) Used for flow control, indicating the number of bytes the receiver is willing to accept.
* **Checksum:** (16 bits) Used for error-checking the header and payload.

# Common Use Cases

TCP is used whenever perfect accuracy is more important than absolute real-time speed.

## Web Browsing (HTTP/HTTPS)

When you load a webpage, every line of code, image, and text must arrive perfectly. A missing packet would result in a broken image or a corrupted script. 

## File Transfers (FTP/SSH)

Downloading a file requires 100% data integrity. If even a single byte is missing from a downloaded software executable or a ZIP file, the entire file becomes corrupted and unusable.

## Email (SMTP/IMAP)

Emails contain text and attachments that must not be scrambled or dropped during delivery. 

# TCP vs UDP

TCP and UDP (User Datagram Protocol) are the two primary transport layer protocols. 

| Feature | TCP | UDP |
| :--- | :--- | :--- |
| **Connection type** | Connection-oriented (3-way handshake) | Connectionless (no handshake) |
| **Reliability** | Reliable (guaranteed delivery) | Unreliable (best-effort) |
| **Ordering** | Packets reassembled in order | No ordered delivery |
| **Speed** | Slower (higher overhead) | Very fast (low latency) |
| **Header size** | 20 to 60 bytes | 8 bytes |
| **Retransmission** | Lost packets are resent | None |
| **Use cases** | Web browsing, Email, File transfers | Gaming, VoIP, Streaming, DNS |

# Summary

TCP is the backbone of the reliable internet. While its overhead makes it slightly slower than UDP, its elaborate system of handshakes, sequence numbers, and acknowledgments guarantees that data arrives exactly as it was sent. This reliability is what makes complex web applications, secure file transfers, and modern digital communication possible.

# Tags

* networking
* tcp
* transport-layer
* connection-oriented
* reliable
* udp
* handshake
* flow-control

# Hyperlinks

| **Word in Document** | **Official Source** |
| :--- | :--- |
| TCP | https://datatracker.ietf.org/doc/html/rfc9293 |
| UDP | https://datatracker.ietf.org/doc/html/rfc768 |
| IP | https://datatracker.ietf.org/doc/html/rfc791 |
| HTTP | https://datatracker.ietf.org/doc/html/rfc9110 |
| HTTPS | https://datatracker.ietf.org/doc/html/rfc9110 |
| FTP | https://datatracker.ietf.org/doc/html/rfc959 |
| SMTP | https://datatracker.ietf.org/doc/html/rfc5321 |
| IMAP | https://datatracker.ietf.org/doc/html/rfc9051 |

# Mouse Over

| **Word in Document** | **Mouse Over Information** |
| :--- | :--- |
| 3-way handshake | The process TCP uses to establish a reliable connection before sending data (SYN, SYN-ACK, ACK). |
| ACK | Acknowledge; a TCP flag and packet type used to confirm the successful receipt of data. |
| Acknowledgment Number | A 32-bit field in the TCP header indicating the next sequence number the receiver is expecting. |
| best-effort | A network design where the system attempts to deliver data but does not guarantee successful delivery. |
| buffer space | Temporary memory storage reserved by a receiver to hold incoming data before the application processes it. |
| bytes | Units of digital information, where one byte consists of 8 bits. |
| Checksum | A computed value used to verify the integrity of the data in the header and payload, ensuring it wasn't corrupted. |
| client | A computer or application that requests a service, resource, or connection from a server. |
| connection-oriented | A protocol that establishes a dedicated, verified link between two devices before transferring data. |
| connectionless | A type of protocol where data is sent without establishing a dedicated, persistent connection first. |
| Destination Port | The port number on the receiving device that dictates which application should process the incoming data. |
| DNS | Domain Name System; the hierarchical system used to identify computers and resolve names to IPs. |
| FIN | Finish; a TCP control flag used to gracefully terminate a connection when no more data needs to be sent. |
| Flow Control | A mechanism in TCP to manage the rate of data transmission so a fast sender doesn't overwhelm a slow receiver. |
| FTP | File Transfer Protocol; a standard network protocol used for the transfer of computer files between a client and server. |
| handshake | A process of negotiation that dynamically sets parameters of a communications channel before normal communication begins. |
| header | Supplemental data placed at the start of a packet, containing necessary control and routing information. |
| HTTP | Hypertext Transfer Protocol; the foundation of data communication for the World Wide Web. |
| HTTPS | Hypertext Transfer Protocol Secure; an extension of HTTP used for secure communication over a computer network. |
| IMAP | Internet Message Access Protocol; an internet standard protocol used by email clients to retrieve messages from a mail server. |
| Internet protocol suite | The conceptual model and set of communications protocols used in the Internet and similar computer networks (TCP/IP). |
| IP | Internet Protocol; the fundamental communications protocol used for routing datagrams across network boundaries. |
| latency | The time it takes for data to pass from one point on a network to another. |
| network congestion | A condition that occurs when a network node or link carries more data than it can handle, leading to packet loss. |
| overhead | The extra data (like headers) and processing time required to operate a protocol, which does not contribute to the actual payload. |
| packet | Small, formatted blocks of data traveling over a network. |
| packet loss | Occurs when one or more packets of data traveling across a computer network fail to reach their destination. |
| payload | The actual intended message or data inside a packet, excluding the header information. |
| port | A virtual point where network connections start and end, associated with a specific process or service. |
| retransmits | The act of sending a dropped or lost packet again, a core reliability feature of TCP. |
| RST | Reset; a TCP control flag used to immediately terminate a connection, often due to an error or unexpected condition. |
| Sequence Number | A 32-bit field in the TCP header used to keep track of the order of the bytes being sent. |
| server | A computer program or device that provides a service, resource, or data to another computer program and its user. |
| Sliding Window | The specific method TCP uses for flow control, adjusting the amount of unacknowledged data allowed on the network. |
| SMTP | Simple Mail Transfer Protocol; an internet standard communication protocol for electronic mail transmission. |
| Source Port | The port number on the sending device from which the data connection originates. |
| SSH | Secure Shell; a cryptographic network protocol for operating network services securely over an unsecured network. |
| SYN | Synchronize; a TCP control flag used to initiate a connection during the 3-way handshake. |
| SYN-ACK | Synchronize-Acknowledge; the server's response during a 3-way handshake, confirming the request and setting its own parameters. |
| TCP | Transmission Control Protocol; a reliable, connection-oriented protocol that ensures guaranteed data delivery. |
| timeout | A specified period of time TCP waits for an acknowledgment before assuming a packet was lost and retransmitting it. |
| transport layer | The network layer responsible for end-to-end communication and data delivery (e.g., TCP or UDP). |
| UDP | User Datagram Protocol; a faster, connectionless protocol that does not guarantee successful data delivery. |
| VoIP | Voice over IP; technology that allows voice calls to be made over internet connections. |
| Window Size | A field in the TCP header where the receiver advertises how much buffer space it has available for new data. |