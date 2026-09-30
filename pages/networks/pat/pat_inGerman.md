# PAT (Port Address Translation)

PAT, auch bekannt als NAT Overload, ist eine Variante von NAT, bei der mehrere private IP-Adressen über eine einzige öffentliche IP-Adresse kommunizieren. Die Unterscheidung erfolgt über eindeutige Portnummern. Eine Einführung in die Grundlagen finden Sie unter [Verwandte Konzepte](#verwandte-konzepte).

## Grundlagen von PAT

PAT ist die praktisch bedeutsamste Form von NAT. Während klassisches NAT nur IP-Adressen übersetzt, bezieht PAT auch die Portnummern in die Übersetzung ein. Dadurch können tausende Geräte gleichzeitig über eine einzige öffentliche IPv4-Adresse kommunizieren.

### Warum PAT?

| Problem | Lösung durch PAT |
| :--- | :--- |
| **IPv4-Adressknappheit** | Tausende Geräte teilen sich eine einzige öffentliche IP-Adresse. |
| **Kosteneinsparung** | ISPs müssen weniger öffentliche Adressen pro Kunde bereitstellen. |
| **Sicherheit** | Eingehende Verbindungen werden nur bei bestehender Zuordnung durchgelassen. |

### PAT vs. NAT

- **NAT (statisch/dynamisch):** Übersetzt nur IP-Adressen, 1:1 oder n:m Zuordnung ohne Portbetrachtung.
- **PAT:** Übersetzt zusätzlich die Portnummern und ermöglicht n:1 Zuordnung (viele private IPs → eine öffentliche IP).
- **Beides zusammen:** In der Praxis wird PAT fast immer gemeinsam mit NAT eingesetzt, weshalb die Begriffe oft synonym verwendet werden.

## Funktionsweise

PAT arbeitet mit einer Übersetzungstabelle, die IP-Adresse und Portnummer kombiniert. Jede ausgehende Verbindung erhält einen eindeutigen Quellport, sodass Rückantworten korrekt zugeordnet werden können.

### Ablauf einer Verbindung

1. Client A (192.168.1.10:12345) sendet eine Anfrage an einen Webserver (93.184.216.34:80).
2. Der PAT-Router ersetzt die Quell-IP durch seine öffentliche IP (203.0.113.5) und den Quellport durch einen freien Port (z. B. 50001).
3. Der Router speichert: 192.168.1.10:12345 ↔ 203.0.113.5:50001.
4. Client B (192.168.1.11:12345) sendet ebenfalls eine Anfrage – gleicher Quellport, aber andere private IP.
5. Der Router vergibt einen anderen öffentlichen Port (z. B. 50002) und speichert: 192.168.1.11:12345 ↔ 203.0.113.5:50002.
6. Antworten an 203.0.113.5:50001 gehen an Client A, Antworten an Port 50002 an Client B.

### Die Übersetzungstabelle

- **Interne IP:Port** – die ursprüngliche Quelle im privaten Netz.
- **Externe IP:Port** – die übersetzte Quelle im öffentlichen Netz.
- **Ziel-IP:Port** – der entfernte Kommunikationspartner.
- **Timeout:** Einträge werden nach Inaktivität entfernt (typisch 24 h für TCP, 30–120 s für UDP).

## Portbereiche und Grenzen

PAT ist durch die verfügbaren Portnummern begrenzt. Ein Verständnis der Portbereiche hilft, Skalierungsgrenzen einzuschätzen.

### Portnummern im Überblick

| Bereich | Größe | Verwendung |
| :--- | :--- | :--- |
| **0 – 1023** | 1.024 | Well-known Ports (Systemdienste, nur mit Root-Rechten bindbar). |
| **1024 – 49151** | 48.128 | Registered Ports (Anwendungen, Dienste). |
| **49152 – 65535** | 16.384 | Ephemeral / Dynamic Ports – hier vergibt PAT typischerweise seine Übersetzungsports. |

### Skalierungsgrenzen

| Aspekt | Details |
| :--- | :--- |
| **Theoretisches Maximum** | Ca. 65.535 gleichzeitige Verbindungen pro öffentlicher IP-Adresse (begrenzt durch 16-Bit-Portfeld). |
| **Praktisches Maximum** | Deutlich niedriger, da Ports wiederverwendet werden müssen und das Betriebssystem Reservierungen vornimmt. |
| **Erweiterung** | Mehrere öffentliche IPs oder CGNAT (Carrier-Grade NAT) bei ISPs. |

## Verwandte Konzepte

PAT baut direkt auf [NAT](#nat) auf und ist eng mit Firewalls, CGNAT und der Portweiterleitung (Port Forwarding) verwandt. Bei IPv6 entfällt PAT weitgehend, da jedes Gerät eine eigene globale Adresse erhalten kann.

## Zusammenfassung

PAT ist die Technik, die das moderne Internet am Laufen hält: Millionen von Geräten teilen sich eine begrenzte Anzahl öffentlicher IPv4-Adressen. Ohne PAT wäre der Adressmangel längst kritisch geworden. Gehen Sie nach [oben](#top) für einen Neuanfang.

## TLDR

**1. Was ist PAT?**
PAT (NAT Overload) übersetzt IP-Adressen UND Portnummern, damit viele Geräte eine öffentliche IP teilen können.

**2. Wie funktioniert es?**
Jede ausgehende Verbindung erhält einen eindeutigen Quellport. Der Router speichert die Zuordnung in einer Tabelle.

**3. Grenzen**
Maximal ca. 65.535 gleichzeitige Verbindungen pro öffentlicher IP – praktisch oft weniger. CGNAT erweitert die Kapazität.

**4. Warum wichtig?**
PAT ist der Grund, warum das IPv4-Internet trotz Adressmangels bis heute funktioniert.