# 🌐 The `ping` Command

### ❓ What is it?

`ping` is a network diagnostic tool used to test the reachability of a host on an IP network. It sends ICMP "Echo Request" packets to a target and waits for an "Echo Reply" to measure round-trip time and packet loss, confirming whether a connection exists between the source and destination.

---

### 🏳️ Options & Flags

`ping [options] [destination]`

|Flag|Description|
|---|---|
|`-c <count>`|Stop after sending `<count>` packets.|
|`-i <interval>`|Wait `<interval>` seconds between sending each packet (default is 1s).|
|`-W <timeout>`|Time in seconds to wait for a response before timing out.|
|`-s <size>`|Specifies the number of data bytes to be sent.|
|`-q`, `--quiet`|Quiet output; only displays summary lines at start and completion.|
|`-v`, `--verbose`|Verbose output; lists ICMP packets received other than Echo Replies.|
|`-4`|Use IPv4 only.|
|`-6`|Use IPv6 only.|
|`-t <ttl>`|Set the IP Time to Live (TTL) value.|
|`-f`|Flood ping (sends packets as fast as they come back); requires root privileges.|
|`-a`|Audible ping (beeps when a packet is received).|
|`--help`|Display help message and exit.|