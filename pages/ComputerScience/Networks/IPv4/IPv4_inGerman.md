# IPv4

Internet Protocol Version 4 (IPv4) ist die vierte Version des Internetprotokolls und die erste, die flächendeckend eingesetzt wurde. Sie ist das Adressierungssystem, auf dem der Großteil des Internets bis heute läuft, und verwendet 32-Bit-Adressen, um jedes Gerät in einem Netzwerk zu identifizieren.

# Was IPv4 ist

IPv4 ist ein verbindungsloses Protokoll mit Best-Effort-Zustellung, das verwendet wird, um Pakete zwischen Geräten in einem Netzwerk weiterzuleiten. Jedes Gerät, das über IPv4 kommuniziert, benötigt eine eindeutige 32-Bit-Adresse, die üblicherweise in punktierter Dezimalschreibweise wie `192.168.1.1` angegeben wird.

## Die 32-Bit-Adresse

Eine IPv4-Adresse ist 32 Bit lang. Sie ist in vier 8-Bit-Gruppen unterteilt, sogenannte Oktette, die jeweils von 0 bis 255 reichen.

- Format: `A.B.C.D`
- Beispiel: `192.168.1.10`
- Gesamter Adressraum: 2^32 = 4.294.967.296 Adressen

## Punktierte Dezimalschreibweise

Da Binärzahlen schwer zu lesen sind, werden IPv4-Adressen dezimal mit Punkten zwischen den Oktetten dargestellt. Die Adresse `11000000.10101000.00000001.00001010` wird als `192.168.1.10` geschrieben.

# Adressklassen

Historisch wurden IPv4-Adressen in Klassen eingeteilt, um die Zuteilung zu vereinfachen. Die Klassen sind heute weitgehend obsolet, aber die Terminologie taucht in älterer Dokumentation noch auf.

## Klasse A

Das erste Bit ist `0`. Bereich: `1.0.0.0` bis `126.255.255.255`. Jedes Klasse-A-Netz kann über 16 Millionen Hosts aufnehmen.

## Klasse B

Die ersten zwei Bits sind `10`. Bereich: `128.0.0.0` bis `191.255.255.255`. Jedes Klasse-B-Netz unterstützt bis zu 65.534 Hosts.

## Klasse C

Die ersten drei Bits sind `110`. Bereich: `192.0.0.0` bis `223.255.255.255`. Jedes Klasse-C-Netz unterstützt bis zu 254 Hosts.

## Klasse D und Klasse E

Klasse D (erste vier Bits `1110`) wird für Multicast verwendet. Klasse E (erste vier Bits `1111`) ist für experimentelle Zwecke reserviert.

| Klasse | Erste Bits | Bereich | Zweck |
| :--- | :--- | :--- | :--- |
| A | 0 | 1.0.0.0 – 126.255.255.255 | Große Netzwerke |
| B | 10 | 128.0.0.0 – 191.255.255.255 | Mittlere Netzwerke |
| C | 110 | 192.0.0.0 – 223.255.255.255 | Kleine Netzwerke |
| D | 1110 | 224.0.0.0 – 239.255.255.255 | Multicast |
| E | 1111 | 240.0.0.0 – 255.255.255.255 | Reserviert |

# Private und öffentliche Adressen

Nicht jede IPv4-Adresse ist im öffentlichen Internet routingfähig. RFC 1918 reserviert drei Bereiche für private Netzwerke, die in Wohnungen, Büros und Rechenzentren verwendet und über NAT in eine öffentliche Adresse übersetzt werden, wenn sie ins Internet gelangen sollen.

## Private Bereiche

- `10.0.0.0/8` — 16.777.216 Adressen
- `172.16.0.0/12` — 1.048.576 Adressen
- `192.168.0.0/16` — 65.536 Adressen

## Öffentliche Adressen

Alles andere ist öffentlich, wobei einige Blöcke für spezielle Zwecke reserviert sind (Loopback, Link-Local, Dokumentation, Multicast). Eine öffentliche IPv4-Adresse ist global eindeutig und routingfähig.

## Spezielle Adressen

| Bereich | Zweck |
| :--- | :--- |
| `127.0.0.0/8` | Loopback (z. B. `127.0.0.1` = Localhost) |
| `169.254.0.0/16` | Link-Local (APIPA) |
| `224.0.0.0/4` | Multicast |
| `240.0.0.0/4` | Reserviert |
| `255.255.255.255` | Begrenzte Broadcast-Adresse |

# Subnetting und CIDR

IPv4-Adressen werden in einen Netzwerkanteil und einen Hostanteil aufgeteilt. Die Grenze wird durch eine Subnetzmaske oder in moderner Notation durch ein CIDR-Präfix wie `/24` definiert.

## Subnetzmasken

Eine Subnetzmaske ist eine 32-Bit-Zahl, bei der die 1en die Netzwerkbits und die 0en die Hostbits markieren.

- `/24` = `255.255.255.0`
- `/16` = `255.255.0.0`
- `/8`  = `255.0.0.0`

## CIDR-Notation

Classless Inter-Domain Routing (CIDR) schreibt die Präfixlänge direkt hinter die Adresse: `192.168.1.0/24`. Die Zahl nach dem Schrägstrich gibt an, wie viele führende Bits zum Netzwerk gehören.

## Ein Beispiel

Gegeben sei `192.168.1.10/24`:

1. Das `/24` bedeutet, dass die ersten 24 Bits das Netzwerk bilden: `192.168.1`.
2. Die letzten 8 Bits sind der Host: `10`.
3. Die Netzwerkadresse ist `192.168.1.0`.
4. Die Broadcast-Adresse ist `192.168.1.255`.
5. Nutzbare Hosts: `192.168.1.1` bis `192.168.1.254`.

# IPv4-Header

Jedes IPv4-Paket beginnt mit einem Header, der die Informationen enthält, die Router zur Zustellung benötigen. Der Header ist mindestens 20 Byte lang und bis zu 60 Byte, wenn Optionen verwendet werden.

## Wichtige Felder

- **Version** — 4 für IPv4.
- **IHL** — Internet Header Length, in 32-Bit-Wörtern.
- **Total Length** — Größe des Pakets einschließlich Header und Nutzlast.
- **TTL** — Time To Live, wird bei jedem Hop verringert; bei 0 wird das Paket verworfen.
- **Protocol** — das Nutzlastprotokoll (TCP = 6, UDP = 17, ICMP = 1).
- **Source Address** — 32-Bit-Adresse des Absenders.
- **Destination Address** — 32-Bit-Adresse des Empfängers.

## Fragmentierung

Wenn ein Paket größer ist als die MTU der nächsten Verbindung, können IPv4-Router es in kleinere Stücke fragmentieren. Die Felder `Identification`, `Flags` und `Fragment Offset` ermöglichen dem Empfänger die Reassemblierung.

# IPv4 vs. IPv6

IPv4 hat keine Adressen mehr übrig. IPv6 wurde entwickelt, um es zu ersetzen, aber beide Protokolle sind heute noch im Einsatz.

## Adressgröße

- IPv4: 32 Bit, ca. 4,3 Milliarden Adressen.
- IPv6: 128 Bit, ca. 340 Undezillionen Adressen.

## Header-Unterschiede

IPv6-Header sind einfacher und haben eine feste Größe (40 Byte), ohne Fragmentierung durch Router, ohne Header-Prüfsumme und ohne Optionsfeld (Erweiterungen sind separate Header).

## Koexistenz

Dual-Stack-Hosts betreiben IPv4 und IPv6 parallel. Tunnel und Übersetzungsmechanismen (wie NAT64 und 464XLAT) ermöglichen es IPv6-only-Netzen, IPv4-only-Ziele zu erreichen.

# Häufige Befehle

Diese Befehle werden häufig verwendet, wenn man unter Linux und macOS mit IPv4 arbeitet:

- `ip addr` — IPv4-Adressen auf Schnittstellen anzeigen.
- `ip route` — Routing-Tabelle anzeigen.
- `ping 8.8.8.8` — Erreichbarkeit prüfen.
- `traceroute 8.8.8.8` — den Pfad zu einem Host verfolgen.
- `dig example.com A` — eine IPv4-Adresse auflösen.

Unter Windows verwendet man `ipconfig` statt `ip addr`.

# Zusammenfassung

IPv4 ist ein 32-Bit-Adressierungsprotokoll, das das Internet seit Jahrzehnten antreibt. Seine Grenzen — insbesondere die Erschöpfung der verfügbaren Adressen — haben zur Entwicklung von NAT als kurzfristige Lösung und IPv6 als langfristige Lösung geführt. Das Verständnis von IPv4-Adressierung, Subnetting und Header-Aufbau bleibt für jeden, der mit Netzwerken arbeitet, unerlässlich.

---

# Tags

- networking
- ipv4
- ip-addressing
- subnetting
- cidr
- routing
- multicast
