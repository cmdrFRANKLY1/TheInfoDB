# IPv6

Internet Protocol Version 6 (IPv6) ist die aktuellste Version des Internetprotokolls. Sie wurde entwickelt, um IPv4 zu ersetzen und das Problem der Adressknappheit zu lösen, indem sie 128-Bit-Adressen verwendet — genug, damit jedes Gerät auf der Erde eine eigene, global eindeutige öffentliche Adresse haben kann.

# Was IPv6 ist

IPv6 ist ein verbindungsloses Protokoll mit Best-Effort-Zustellung, das Pakete zwischen Geräten in einem Netzwerk weiterleitet. Anders als IPv4 verwendet es 128-Bit-Adressen, die in hexadezimalen, durch Doppelpunkte getrennten Gruppen geschrieben werden. Jedes Gerät kann eine global eindeutige Adresse haben, ohne dass NAT erforderlich ist.

## Die 128-Bit-Adresse

Eine IPv6-Adresse ist 128 Bit lang und in acht Gruppen zu je 16 Bit unterteilt. Jede Gruppe wird als vier hexadezimale Ziffern geschrieben, getrennt durch Doppelpunkte.

- Format: `xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`
- Beispiel: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Gesamter Adressraum: 2^128 ≈ 340 Undezillionen Adressen

## Hexadezimale Notation

IPv6 verwendet das Hexadezimalsystem (Basis 16) mit den Ziffern 0-9 und a-f. Jede Gruppe besteht aus vier Hex-Ziffern und kann damit Werte von `0000` bis `ffff` (0 bis 65535 dezimal) darstellen.

## Adresskomprimierung

Lange Folgen von Nullen können komprimiert werden. Aufeinanderfolgende Nullgruppen werden durch einen doppelten Doppelpunkt `::` ersetzt. Dies darf pro Adresse nur einmal vorkommen.

- Vollständig: `2001:0db8:0000:0000:0000:0000:0000:0001`
- Komprimiert: `2001:db8::1`

Führende Nullen innerhalb einer Gruppe können ebenfalls weggelassen werden: `0db8` wird zu `db8`.

# Adresstypen

IPv6 kennt mehrere Adresstypen, die jeweils einem anderen Zweck dienen.

## Unicast

Eine Unicast-Adresse identifiziert eine einzelne Schnittstelle. An eine Unicast-Adresse gesendete Pakete werden an genau diese eine Schnittstelle zugestellt.

## Multicast

Eine Multicast-Adresse identifiziert eine Gruppe von Schnittstellen. An eine Multicast-Adresse gesendete Pakete werden an alle Mitglieder der Gruppe zugestellt. IPv6 kennt keinen Broadcast — stattdessen wird Multicast verwendet.

## Anycast

Eine Anycast-Adresse wird mehreren Schnittstellen zugewiesen, meist auf verschiedenen Geräten. An eine Anycast-Adresse gesendete Pakete werden an die nächstgelegene zugestellt, bestimmt durch das Routing.

| Typ | Präfix | Zweck |
| :--- | :--- | :--- |
| Global Unicast | `2000::/3` | Öffentliche, routingfähige Adressen |
| Link-Local | `fe80::/10` | Automatisch, nicht routingfähig, pro Link |
| Unique Local | `fc00::/7` | Private Adressen, ähnlich IPv4 RFC 1918 |
| Multicast | `ff00::/8` | Gruppenkommunikation |
| Loopback | `::1/128` | Localhost |
| Unspecified | `::/128` | Keine Adresse (während der Einrichtung) |

# Adressaufbau

Jede IPv6-Unicast-Adresse ist in zwei Teile gegliedert: ein Netzwerkpräfix und einen Interface-Identifier.

## Netzwerkpräfix

Die ersten 64 Bit sind das Netzwerkpräfix, das vom ISP oder vom lokalen Netzwerkadministrator zugewiesen wird. Dies entspricht dem Netzwerkanteil bei IPv4.

## Interface-Identifier

Die letzten 64 Bit sind der Interface-Identifier, der pro Gerät im Link eindeutig ist. Er kann aus der MAC-Adresse abgeleitet (EUI-64) oder zufällig generiert werden (Privacy Extensions).

## Subnetting

Da der Interface-Identifier auf 64 Bit festgelegt ist, ist der Subnetzanteil des Netzwerkpräfixes üblicherweise die 16 Bit zwischen der /48-ISP-Zuteilung und dem /64-Subnetz. Das ergibt 65.536 Subnetze pro /48 — weit mehr, als jeder Haushalt oder Betrieb benötigt.

# IPv6-Header

Der IPv6-Header ist einfacher als der von IPv4. Er hat eine feste Größe von 40 Byte und nur acht Felder.

## Wichtige Felder

- **Version** — 6 für IPv6.
- **Traffic Class** — ähnlich wie ToS bei IPv4, für QoS.
- **Flow Label** — kennzeichnet Pakete, die zum selben Fluss gehören.
- **Payload Length** — Größe der Nutzlast, ohne Header.
- **Next Header** — kennzeichnet den nächsten Header (z. B. TCP, UDP oder einen Extension-Header).
- **Hop Limit** — entspricht dem TTL bei IPv4.
- **Source Address** — 128-Bit-Adresse des Absenders.
- **Destination Address** — 128-Bit-Adresse des Empfängers.

## Keine Header-Prüfsumme

Anders als IPv4 hat IPv6 keine Header-Prüfsumme. Das erspart Routern die Arbeit, sie bei jedem Hop zu prüfen; Prüfsummen auf Link- und Transportschicht fangen die meisten Fehler ab.

## Keine Fragmentierung durch Router

IPv6-Router fragmentieren keine Pakete. Der Absender muss die Pfad-MTU bestimmen und Pakete senden, die hineinpassen. Falls Fragmentierung nötig ist, erfolgt sie durch die Quelle mittels Extension-Header.

## Extension-Header

Optionen, die bei IPv4 Teil des Headers waren, sind bei IPv6 separate Extension-Header, die an den Hauptheader angehängt werden. Gängige sind Hop-by-Hop Options, Routing, Fragment und Destination Options.

# IPv6 vs. IPv4

| Merkmal | IPv4 | IPv6 |
| :--- | :--- | :--- |
| Adressgröße | 32 Bit | 128 Bit |
| Notation | Punktierte Dezimalform | Hexadezimal mit Doppelpunkten |
| Header-Größe | 20–60 Byte | 40 Byte fest |
| Header-Prüfsumme | Ja | Nein |
| Fragmentierung durch Router | Ja | Nein |
| Broadcast | Ja | Nein (stattdessen Multicast) |
| NAT | Üblich | Nicht nötig |
| Konfiguration | DHCP oder manuell | SLAAC, DHCPv6 oder manuell |

## Adressknappheit

Der Hauptgrund für IPv6 war die Erschöpfung der IPv4-Adressen. Mit 128-Bit-Adressen wird IPv6 in absehbarer Zeit nicht ausgehen.

## Ende-zu-Ende-Konnektivität

Da jedes Gerät eine global eindeutige Adresse haben kann, stellt IPv6 die Ende-zu-Ende-Konnektivität wieder her, die NAT bei IPv4 zerstört hat. Das vereinfacht Peer-to-Peer-Anwendungen, VoIP und Spiele.

## Übergangsmechanismen

IPv4 und IPv6 sind nicht direkt kompatibel. Zu den Übergangsmechanismen gehören:

- **Dual Stack** — ein Gerät betreibt beide Protokolle.
- **Tunneling** — IPv6-Pakete werden in IPv4-Paketen (oder umgekehrt) transportiert.
- **Übersetzung** — NAT64 und DNS64 übersetzen zwischen beiden.

# Autokonfiguration

IPv6-Geräte können sich ohne DHCP-Server selbst konfigurieren, mithilfe von Stateless Address Autoconfiguration (SLAAC).

## SLAAC

Das Gerät bildet eine Adresse, indem es ein Netzwerkpräfix (aus Router Advertisements) mit einem Interface-Identifier (abgeleitet aus seiner MAC oder einem Zufallswert) kombiniert.

## Router Advertisements

Router senden periodisch Router Advertisement (RA)-Nachrichten, um das Netzwerkpräfix, das Standard-Gateway und andere Parameter bekanntzugeben.

## DHCPv6

Für Umgebungen, die zentrale Verwaltung benötigen, kann DHCPv6 Adressen, DNS-Server und andere Optionen bereitstellen, ähnlich wie DHCP bei IPv4.

## Privacy Extensions

Da der EUI-64 Interface-Identifier aus der MAC-Adresse abgeleitet wird, kann er verwendet werden, um ein Gerät über Netzwerke hinweg zu verfolgen. RFC 4941 definiert Privacy Extensions, die zufällige Interface-Identifier generieren, die sich periodisch ändern.

# Häufige Befehle

Diese Befehle werden häufig verwendet, wenn man unter Linux und macOS mit IPv6 arbeitet:

- `ip -6 addr` — IPv6-Adressen auf Schnittstellen anzeigen.
- `ip -6 route` — die IPv6-Routing-Tabelle anzeigen.
- `ping6 2001:4860:4860::8888` — Erreichbarkeit prüfen (öffentlicher DNS von Google).
- `traceroute6 2001:4860:4860::8888` — den Pfad zu einem Host verfolgen.
- `dig example.com AAAA` — eine IPv6-Adresse auflösen.

Unter Windows verwendet man `ipconfig /all`, um die IPv6-Konfiguration zu sehen, und `ping -6` für IPv6-Pings.

# Zusammenfassung

IPv6 ist der langfristige Ersatz für IPv4. Sein 128-Bit-Adressraum beseitigt die Knappheit, die zur Entwicklung von NAT geführt hat, und sein einfacherer Header verbessert die Effizienz der Router. Der Übergang ist schrittweise — die meisten Netzwerke betreiben heute Dual-Stack IPv4 und IPv6 — aber die Verbreitung von IPv6 wächst weiter, da IPv4-Adressen schwieriger zu bekommen sind.

---
