# pacman

pacman ist der Paketmanager für Arch Linux. Er verfolgt installierte Pakete mit Abhängigkeitsunterstützung, verwaltet Paketgruppen und synchronisiert sich mit entfernten Repositories, um Software zu installieren, zu aktualisieren und zu entfernen. Er wurde von Judd Vinet entwickelt und erstmals 2002 veröffentlicht und ist bis heute das zentrale Werkzeug zur Softwareverwaltung auf Arch-basierten Systemen.

# Was pacman ist

pacman ist ein bibliotheksbasierter Paketmanager, der in C geschrieben ist. Er verwendet ein einfaches binäres Paketformat und pflegt eine textbasierte Paketdatenbank, die bei Bedarf von Hand bearbeitet werden kann. Er ist auf Geschwindigkeit, Einfachheit und Leichtgewichtigkeit ausgelegt.

## Paketmanager

Ein Paket ist ein Archiv, das die kompilierten Dateien einer Anwendung, ihre Metadaten (Name, Version, Abhängigkeiten) und Installationsanweisungen für pacman enthält. pacman installiert, aktualisiert und entfernt diese Pakete und löst Abhängigkeiten automatisch auf.

## libalpm-Backend

Seit Version 3.0 ist pacman in zwei Teile aufgeteilt: eine Backend-Bibliothek namens libalpm (Arch Linux Package Management) und das pacman-Frontend. Diese Trennung erleichtert es anderen Werkzeugen, dieselbe Paketverwaltungslogik zu nutzen.

## Repository-Modell

pacman synchronisiert sich mit Master-Servern, um das System aktuell zu halten. Dieses Server-Client-Modell löst Abhängigkeiten auf und lädt Pakete mit einfachen Befehlen herunter.

# Warum pacman verwenden

pacman bietet eine konsistente, skriptbare Oberfläche für alle Paketoperationen auf Arch Linux.

## Abhängigkeitsauflösung

pacman behandelt Abhängigkeiten automatisch. Du gibst das gewünschte Programm an, und pacman installiert es zusammen mit allen erforderlichen Abhängigkeiten.

## Saubere Deinstallation

pacman führt eine Liste aller Dateien, die zu einem Paket gehören. Wenn du ein Paket entfernst, bleibt nichts versehentlich zurück. Von dir geänderte Konfigurationsdateien werden mit der Endung `.pacsave` erhalten.

## Einfache Aktualisierungen

pacman aktualisiert vorhandene Pakete, sobald Aktualisierungen verfügbar werden, und hält das System mit einem einzigen Befehl aktuell.

# Installation

pacman ist auf Arch Linux und seinen Derivaten vorinstalliert. Es ist keine zusätzliche Installation erforderlich.

## Installation überprüfen

Prüfe die Version:

    pacman --version

## Enthaltene Werkzeuge

Das pacman-Paket enthält Werkzeuge wie `makepkg` und `vercmp`. Weitere nützliche Werkzeuge wie `pactree` und `checkupdates` befinden sich im Paket `pacman-contrib`.

# Häufige Befehle

pacman verwendet Operations-Flags mit Optionen. Die am häufigsten verwendeten Befehle sind unten aufgeführt.

## Suchen

| Befehl | Zweck |
| :--- | :--- |
| `pacman -Ss <Begriff>` | Repositories nach einem Paket durchsuchen |
| `pacman -Qs <Begriff>` | Lokal installierte Pakete durchsuchen |

## Installieren

| Befehl | Zweck |
| :--- | :--- |
| `pacman -S <Paket>` | Ein Paket installieren |
| `pacman -Syu <Paket>` | System aktualisieren und ein Paket installieren |
| `pacman -S --needed <Paket>` | Aktuelle Pakete nicht neu installieren |

## Aktualisieren

| Befehl | Zweck |
| :--- | :--- |
| `pacman -Sy` | Paketdatenbank aktualisieren |
| `pacman -Syu` | Datenbank aktualisieren und alle Pakete aufrüsten |
| `pacman -Qu` | Alle veralteten Pakete auflisten |

## Entfernen

| Befehl | Zweck |
| :--- | :--- |
| `pacman -R <Paket>` | Ein Paket entfernen |
| `pacman -Rs <Paket>` | Paket und nicht mehr benötigte Abhängigkeiten entfernen |
| `pacman -Rns <Paket>` | Paket, Abhängigkeiten und Konfigurationsdateien entfernen |

## Abfragen

| Befehl | Zweck |
| :--- | :--- |
| `pacman -Q` | Alle installierten Pakete auflisten |
| `pacman -Qe` | Explizit installierte Pakete auflisten |
| `pacman -Qm` | Fremde Pakete auflisten (z. B. aus dem AUR) |
| `pacman -Qtdq` | Verwaiste Pakete auflisten |

# Beispiele

Praxisnahe, direkt nutzbare Beispiele für die häufigsten Aufgaben.

## Ein Paket installieren

| Szenario | Befehl |
| :--- | :--- |
| Ein einzelnes Paket installieren | `sudo pacman -S firefox` |
| Mehrere Pakete installieren | `sudo pacman -S firefox vlc htop` |
| Ohne Rückfragen installieren | `sudo pacman -S --noconfirm firefox` |
| Aus einem bestimmten Repo installieren | `sudo pacman -S extra/firefox` |
| Eine Paketgruppe installieren | `sudo pacman -S gnome` |
| Über Musterexpansion installieren | `sudo pacman -S plasma-{desktop,mediacenter,nm}` |

## Nach Paketen suchen

| Szenario | Befehl |
| :--- | :--- |
| Nach einem Paket suchen | `pacman -Ss lynis` |
| Mit regulärem Ausdruck suchen | `pacman -Ss "lyn*"` |
| Installierte Pakete durchsuchen | `pacman -Qs python` |
| Nach Paketen suchen, die eine Datei enthalten | `pacman -F lynis` |

## Das System aktualisieren

| Szenario | Befehl |
| :--- | :--- |
| Vollständiges System-Upgrade | `sudo pacman -Syu` |
| Nur die Datenbank aktualisieren | `sudo pacman -Sy` |
| Veraltete Pakete auflisten | `pacman -Qu` |
| Ohne Rückfragen aktualisieren | `sudo pacman -Syu --noconfirm` |

## Pakete entfernen

| Szenario | Befehl |
| :--- | :--- |
| Ein Paket entfernen | `sudo pacman -R lynis` |
| Paket und Abhängigkeiten entfernen | `sudo pacman -Rs lynis` |
| Paket, Abhängigkeiten und Konfiguration entfernen | `sudo pacman -Rns lynis` |
| Verwaiste Pakete entfernen | `sudo pacman -Rns $(pacman -Qtdq)` |

## Installierte Pakete abfragen

| Szenario | Befehl |
| :--- | :--- |
| Alle installierten Pakete auflisten | `pacman -Q` |
| Explizit installierte auflisten | `pacman -Qe` |
| Fremde Pakete auflisten | `pacman -Qm` |
| Paketinformationen anzeigen | `pacman -Qi firefox` |
| Dateien eines Pakets auflisten | `pacman -Ql firefox` |
| Herausfinden, welches Paket eine Datei besitzt | `pacman -Qo /usr/bin/firefox` |

## Aufräumen

| Szenario | Befehl |
| :--- | :--- |
| Den Paket-Cache leeren | `sudo pacman -Scc` |
| Verwaiste Pakete entfernen | `sudo pacman -Rns $(pacman -Qtdq)` |
| Verwaiste Pakete auflisten | `pacman -Qtdq` |

## Dateioperationen

| Szenario | Befehl |
| :--- | :--- |
| Nach Dateien in Paketen suchen | `sudo pacman -Fy lynis` |
| Mit einem Regex suchen | `sudo pacman -Fxy lyni` |
| Dateien in einer Paketdatei auflisten | `pacman -Qlp /path/to/package.pkg.tar.zst` |

## Häufige Arbeitsabläufe

| Szenario | Befehl |
| :--- | :--- |
| System aktualisieren und Waisen entfernen | `sudo pacman -Syu && sudo pacman -Rns $(pacman -Qtdq)` |
| Installieren und Neuinstallationen überspringen | `sudo pacman -S --needed firefox` |
| Herausfinden, welches Paket eine Datei besitzt | `pacman -Qo /usr/bin/lynis` |

# Konfiguration

pacman liest seine Konfiguration aus `/etc/pacman.conf`. Diese Datei steuert Repositories, Cache-Verzeichnisse und Verhaltensoptionen.

## Speicherort der Konfiguration

    /etc/pacman.conf

## Häufige Optionen

- `CacheDir` — Verzeichnis, in dem heruntergeladene Pakete gespeichert werden (Standard: `/var/cache/pacman/pkg/`)
- `ParallelDownloads` — Anzahl gleichzeitiger Downloads (z. B. `ParallelDownloads = 5`)
- `SigLevel` — Stufe der Paketsignaturprüfung
- `Color` — farbige Ausgabe aktivieren

## Spiegelliste

Die Spiegelliste befindet sich unter `/etc/pacman.d/mirrorlist`. Halte sie aktuell für schnellere Downloads. Das Werkzeug `reflector` kann eine optimierte Liste erzeugen.

# Sicherheit und das AUR

pacman ist der offizielle Paketmanager für Arch Linux. Er installiert keine Pakete direkt aus dem Arch User Repository (AUR) — das erfordert einen AUR-Helper wie `yay` oder manuelles Bauen mit `makepkg`.

## Warnung vor Teilupgrades

Führe niemals `pacman -Sy` gefolgt von `pacman -S <Paket>` ohne das `-u`-Flag aus. Das kann zu Teilupgrades führen, die nicht unterstützt werden und dein System beschädigen können. Verwende immer `pacman -Syu`, um das vollständige System aufzurüsten.

## AUR-Pakete

AUR-Pakete werden von Nutzern gepflegt und nicht von Arch-Entwicklern geprüft. Prüfe PKGBUILDs vor dem Bauen. Werkzeuge wie `yay` und `paru` bieten AUR-Unterstützung.

## Paketsignierung

pacman unterstützt Paketsignaturen. Die Standardeinstellung `SigLevel = Required DatabaseOptional` verifiziert Signaturen für alle Pakete in offiziellen Repositories.

# pacman vs. andere Werkzeuge

| Merkmal | pacman | AUR-Helper (yay, paru) |
| :--- | :--- | :--- |
| Offizielle Repos | Ja | Ja (umhüllt pacman) |
| AUR-Pakete | Nein | Ja |
| Aus Quellcode bauen | Nein | Ja (über makepkg) |
| Lernkurve | Niedrig | Niedrig (entspricht pacman-Flags) |

# Zusammenfassung

pacman ist der zentrale Paketmanager für Arch Linux. Er installiert, aktualisiert, fragt ab und entfernt Pakete mit automatischer Abhängigkeitsauflösung und sauberer Deinstallation. Er ist schnell, skriptbar und die Grundlage, auf der AUR-Helper aufbauen. Führe immer vollständige System-Upgrades mit `pacman -Syu` durch und installiere niemals ein Paket, ohne gleichzeitig das System aufzurüsten.

---

Für die AUR-Paketverwaltung siehe den Abschnitt zu `yay`. Für weitere Terminal-Werkzeuge siehe die Abschnitte zu `grep`, `chmod` und `cd`.