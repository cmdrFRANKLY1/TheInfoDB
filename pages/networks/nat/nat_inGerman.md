# Network Address Translation (NAT)

**Network Address Translation (NAT)** ist eine Methode, mit der Router einen Satz von IP-Adressen in einen anderen übersetzen. Sie wird am häufigsten verwendet, damit Geräte in einem privaten lokalen Netzwerk (z. B. einem Heim-WLAN) über eine einzige öffentliche IP-Adresse mit dem öffentlichen Internet kommunizieren können.

## Warum wird NAT verwendet?

Der Hauptgrund für die Existenz von NAT ist die **IPv4-Adressknappheit**.

IPv4-Adressen sind 32-Bit-Zahlen und bieten etwa 4,3 Milliarden eindeutige Adressen. Mit dem Wachstum des Internets gingen diese Adressen zur Neige. NAT löst dieses Problem, indem es einem gesamten privaten Netzwerk (das Tausende von Geräten umfassen kann) ermöglicht, sich nur **eine** öffentliche IPv4-Adresse zu teilen.

## Funktionsweise (Die Grundlagen)

Wenn ein Gerät in einem lokalen Netzwerk (z. B. ein Laptop) auf eine Website zugreifen möchte:

1. **Ausgehende Anfrage:** Der Laptop sendet eine Anfrage an den Router. Die Anfrage enthält eine **private Quell-IP** (z. B. `192.168.1.10`) und einen **Quellport** (z. B. `54321`).
2. **Übersetzung:** Der Router fängt dieses Paket ab. Er ersetzt die private Quell-IP durch seine eigene **öffentliche IP** (z. B. `203.0.113.5`). Außerdem weist er einen neuen, eindeutigen Quellport zu (z. B. `60001`) und speichert diese Zuordnung in einer Tabelle.
3. **Internet-Anfrage:** Das Paket durchquert nun das Internet und sieht so aus, als käme es von `203.0.113.5:60001`.
4. **Eingehende Antwort:** Der Webserver antwortet an `203.0.113.5:60001`.
5. **Rückübersetzung:** Der Router empfängt die Antwort, schlägt in seiner Zuordnungstabelle nach, sieht, dass Port `60001` zum Laptop gehört, und leitet das Paket zurück an `192.168.1.10:54321`.

## Arten von NAT

Es gibt verschiedene Möglichkeiten, NAT zu implementieren:

### 1. Statisches NAT (SNAT)

Eine 1:1-Zuordnung zwischen einer privaten IP-Adresse und einer öffentlichen IP-Adresse. Dies wird häufig für Webserver verwendet, die eine konstante öffentliche IP benötigen.

- `192.168.1.10` ⇄ `203.0.113.5`

### 2. Dynamisches NAT

Ein Pool öffentlicher IP-Adressen wird unter einer größeren Gruppe privater Geräte aufgeteilt. Der Router weist einem privaten Gerät eine öffentliche IP nach dem Prinzip „Wer zuerst kommt, mahlt zuerst" zu.

### 3. PAT (Port Address Translation) / NAT Overload

Dies ist die häufigste Form von NAT in Haushalten und kleinen Unternehmen. Sie entspricht dem, was im Abschnitt „Funktionsweise" oben beschrieben ist. Sie ermöglicht **vielen** privaten Geräten, sich eine **einzige** öffentliche IP-Adresse zu teilen, indem verschiedene Portnummern zur Verfolgung der Verbindungen verwendet werden.

- Technisch gesehen ist dies eine Teilmenge des dynamischen NAT, aber es ist so verbreitet, dass es meist einfach „NAT" genannt wird.

## Vor- und Nachteile

| Vorteile | Nachteile |
| :--- | :--- |
| **Spart IPv4-Adressen:** Verlangsamt die Erschöpfung öffentlicher IPs. | **Bricht die Ende-zu-Ende-Konnektivität:** Geräte hinter NAT sind ohne Portweiterleitung nicht direkt aus dem Internet erreichbar. |
| **Sicherheit:** Verbirgt die interne Netzwerkstruktur vor der Außenwelt. | **Performance-Overhead:** Router müssen zusätzliche Arbeit leisten, um Paket-Header zu ändern. |
| **Flexibilität:** Sie können Ihr internes IP-Schema ändern, ohne Ihren ISP zu benachrichtigen. | **Kompliziert Protokolle:** Einige Protokolle (wie VoIP oder bestimmte Spiele) betten IP-Adressen in die Datennutzlast ein, was NAT nicht ohne Weiteres übersetzen kann. |

## NAT und IPv6

Mit der Einführung von **IPv6** ist der Adressraum so gewaltig (340 Undezillionen Adressen), dass jedes Gerät seine eigene eindeutige öffentliche IP-Adresse haben kann.

Aus diesem Grund ist **NAT für IPv6 im Allgemeinen nicht erforderlich**. Einige Netzwerkadministratoren verwenden jedoch aus Sicherheits- oder Netzwerkverwaltungsgründen weiterhin eine Variante davon (NAT66), obwohl dies weniger verbreitet ist.