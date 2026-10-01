# NAT

Network Address Translation (NAT) ist eine Methode, die von Routern verwendet wird, um einen Satz von IP-Adressen in einen anderen zu übersetzen. Sie wird am häufigsten eingesetzt, damit Geräte in einem privaten, lokalen Netzwerk (wie einem Heim-WLAN) über eine einzige öffentliche IP-Adresse mit dem öffentlichen Internet kommunizieren können.

# Warum NAT existiert

Der Hauptgrund für die Existenz von NAT ist der **Mangel an IPv4-Adressen**. IPv4-Adressen sind 32-Bit-Zahlen und bieten etwa 4,3 Milliarden eindeutige Adressen. Als das Internet wuchs, gingen diese Adressen zur Neige. NAT löst dieses Problem, indem es einem gesamten privaten Netzwerk (mit potenziell Tausenden von Geräten) ermöglicht, sich nur **eine** öffentliche IPv4-Adresse zu teilen.

## Mangel an IPv4-Adressen

IPv4 bietet etwa 4,3 Milliarden eindeutige Adressen. Als das Internet entworfen wurde, schien dies mehr als genug zu sein, doch das explosive Wachstum vernetzter Geräte erschöpfte den verfügbaren Pool öffentlicher IPv4-Adressen weit schneller als erwartet.

## Die Rolle von NAT

NAT streckt eine einzelne öffentliche IP-Adresse über viele private Geräte. Ein Heimrouter hat beispielsweise typischerweise eine öffentliche IP vom ISP, kann aber Dutzende von Geräten im lokalen Netzwerk unterstützen, die sich alle dieselbe Adresse teilen.

# Wie NAT funktioniert

Wenn ein Gerät in einem lokalen Netzwerk (z. B. ein Laptop) auf eine Website zugreifen möchte, führt der Router beim Hinausgehen und beim Zurückkommen eine Übersetzung durch. Der Vorgang ist sowohl für das Gerät als auch für den entfernten Server transparent.

## Ausgehende Anfrage

Der Laptop sendet eine Anfrage an den Router. Die Anfrage hat eine **private Quell-IP** (z. B. `192.168.1.10`) und einen **Quellport** (z. B. `54321`).

## Übersetzung

Der Router fängt dieses Paket ab. Er ersetzt die private Quell-IP durch seine eigene **öffentliche IP** (z. B. `203.0.113.5`). Außerdem weist er einen neuen, eindeutigen Quellport zu (z. B. `60001`) und zeichnet diese Zuordnung in einer Tabelle auf.

## Anfrage im Internet

Das Paket reist nun durch das Internet und sieht so aus, als käme es von `203.0.113.5:60001`.

## Eingehende Antwort

Der Webserver antwortet an `203.0.113.5:60001`. Der Router empfängt die Antwort, schlägt in seiner Zuordnungstabelle nach, sieht, dass Port `60001` zum Laptop gehört, und leitet das Paket zurück an `192.168.1.10:54321`.

# Arten von NAT

Es gibt verschiedene Möglichkeiten, NAT zu implementieren, jede für unterschiedliche Anforderungen geeignet.

## Statisches NAT (SNAT)

Eine Eins-zu-Eins-Zuordnung zwischen einer privaten IP-Adresse und einer öffentlichen IP-Adresse. Dies wird häufig für Webserver verwendet, die eine konsistente öffentliche IP benötigen.

- `192.168.1.10` ⇄ `203.0.113.5`

## Dynamisches NAT

Ein Pool öffentlicher IP-Adressen wird unter einer größeren Gruppe privater Geräte geteilt. Der Router weist einem privaten Gerät nach dem Windhundprinzip (first come, first served) eine öffentliche IP zu.

## PAT (Port Address Translation) / NAT Overload

Dies ist die häufigste Art von NAT, die in Privathaushalten und kleinen Unternehmen eingesetzt wird. Sie ermöglicht es **vielen** privaten Geräten, eine **einzige** öffentliche IP-Adresse zu teilen, indem verschiedene Portnummern verwendet werden, um die Verbindungen nachzuverfolgen.

- Technisch gesehen ist dies eine Unterart des dynamischen NAT, aber es ist so verbreitet, dass man es üblicherweise einfach "NAT" nennt.

# Vor- und Nachteile

| Vorteile | Nachteile |
| :--- | :--- |
| **Spart IPv4-Adressen:** Verlangsamt die Erschöpfung öffentlicher IPs. | **Bricht die Ende-zu-Ende-Konnektivität:** Geräte hinter NAT können ohne Portweiterleitung nicht direkt aus dem Internet erreicht werden. |
| **Sicherheit:** Verbirgt die interne Netzwerkstruktur vor der Außenwelt. | **Leistungsaufwand:** Router müssen zusätzliche Arbeit leisten, um Paket-Header zu ändern. |
| **Flexibilität:** Sie können Ihr internes IP-Schema ändern, ohne Ihren ISP zu benachrichtigen. | **Erschwert Protokolle:** Einige Protokolle (wie VoIP oder bestimmte Spiele) betten IP-Adressen in die Datennutzlast ein, die NAT nicht ohne Weiteres übersetzen kann. |

# NAT und IPv6

Mit der Einführung von **IPv6** ist der Adressraum so riesig (340 Undezillionen Adressen), dass jedes Gerät seine eigene eindeutige öffentliche IP-Adresse haben kann.

## Warum NAT nicht benötigt wird

Da jedes Gerät seine eigene öffentliche IPv6-Adresse haben kann, entfällt die Hauptmotivation für NAT (die Einsparung von Adressen).

## NAT66

Einige Netzwerkadministratoren verwenden dennoch eine Variante namens NAT66 aus Sicherheits- oder Netzwerkverwaltungsgründen, obwohl dies weniger verbreitet ist.

# Tags

- networking
- nat
- ipv4
- ipv6
- address-translation
- pat
- port-forwarding
- cgnat
