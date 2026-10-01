# yay

Yay (Yet Another Yogurt) ist ein in Go geschriebener AUR-Helper. Er wickelt sich um `pacman` und ergänzt den Zugriff auf das Arch User Repository (AUR), sodass du Pakete aus den offiziellen Repositories und aus dem AUR mit einem einzigen Werkzeug installieren, suchen und verwalten kannst.

# Was yay ist

Yay ist ein AUR-Helper — ein Werkzeug, das den Prozess des Herunterladens von PKGBUILDs aus dem AUR, der Auflösung von Abhängigkeiten und des Bauens von Paketen mit `makepkg` automatisiert. Außerdem fungiert es als Wrapper um `pacman`, sodass du es für alle normalen Paketverwaltungsaufgaben verwenden kannst, ohne zwischen den beiden Werkzeugen wechseln zu müssen.

## AUR-Helper

Das Arch User Repository ist eine von der Community gepflegte Sammlung von PKGBUILD-Dateien. Yay automatisiert das Bauen und Installieren von Paketen daraus und übernimmt die manuellen Schritte des Klonens, der Abhängigkeitsauflösung und des Aufrufs von `makepkg`.

## pacman-Wrapper

Yay leitet die meisten Befehle mit denselben Flags an `pacman` weiter. Zum Beispiel aktualisiert `yay -Syu` dein System genauso wie `pacman -Syu`, prüft aber zusätzlich das AUR auf Aktualisierungen.

## In Go geschrieben

Yay ist eine kompilierte Go-Binärdatei ohne Laufzeitabhängigkeiten über das hinaus, was `pacman` bereits bereitstellt.

# Warum yay verwenden

Yay vereinfacht die Nutzung des AUR und bietet eine einheitliche Oberfläche für offizielle und Community-Pakete.

## Ein Werkzeug für alles

Statt `pacman` für offizielle Pakete und manuelles Bauen für AUR-Pakete zu verwenden, kannst du `yay` für beides nutzen. Die Flags entsprechen denen von `pacman`, es gibt also keine neue Syntax zu lernen.

## Abhängigkeitsauflösung

Yay löst Abhängigkeiten im Voraus auf, einschließlich AUR-Abhängigkeiten, und kann reine Build-Abhängigkeiten nach dem Bauen wieder entfernen.

## Lesbare Ausgabe

Yay liefert eine ausführlichere und besser lesbare Ausgabe als reines `pacman`, sodass man während Installationen und Updates leichter erkennen kann, was passiert.

## AUR-Tab-Vervollständigung

Yay enthält Shell-Vervollständigungen für AUR-Paketnamen, was die Eingabe von Befehlen beschleunigt.

# Installation

Yay ist nicht in den offiziellen Arch-Repositories verfügbar. Es muss aus dem AUR gebaut oder über einen bereits vorhandenen Helper installiert werden.

## Voraussetzungen

Installiere die Build-Werkzeuge und Git:

    sudo pacman -S --needed base-devel git

## Aus dem Quellcode bauen

Klonen das yay-Repository und baue es mit `makepkg`:

    git clone https://aur.archlinux.org/yay.git
    cd yay
    makepkg -si

Die Flags `-si` weisen `makepkg` an, Abhängigkeiten aufzulösen (`-s`) und das gebaute Paket zu installieren (`-i`).

## Binärpaket

Wenn du eine vorgebaute Binärdatei gegenüber dem Kompilieren bevorzugst, verwende `yay-bin`:

    git clone https://aur.archlinux.org/yay-bin.git
    cd yay-bin
    makepkg -si

## Installation überprüfen

Prüfe die Version:

    yay --version

## Distributionspakete

Einige Arch-basierte Distributionen (Manjaro, EndeavourOS) paketieren `yay` selbst, und es kann direkt mit `pacman -S yay` installiert werden. Prüfe die Repositories deiner Distribution.

# Häufige Befehle

Die Befehls-Flags von yay entsprechen denen von `pacman`. Die folgenden Tabellen decken die am häufigsten verwendeten Operationen ab.

## Suchen

| Befehl | Zweck |
| :--- | :--- |
| `yay <Begriff>` | Interaktive Suche über Repos und AUR |
| `yay -Ss <Begriff>` | Sowohl Repositories als auch AUR durchsuchen |
| `yay -Ss <Begriff1> <Begriff2>` | Eingrenzende Suche (erst Begriff1, dann Begriff2 in den Ergebnissen) |

## Installieren

| Befehl | Zweck |
| :--- | :--- |
| `yay -S <Paket>` | Aus Repos oder AUR installieren |
| `yay -S --noconfirm <Paket>` | Ohne Rückfragen installieren |
| `yay -G <Paket>` | Nur PKGBUILD herunterladen (kein Build) |
| `yay -Gp <Paket>` | PKGBUILD nach stdout ausgeben |

## Aktualisieren

| Befehl | Zweck |
| :--- | :--- |
| `yay` oder `yay -Syu` | Vollständiges System-Upgrade (Repos + AUR) |
| `yay -Sua` | Nur AUR-Pakete aktualisieren |
| `yay -Qua` | AUR-Pakete mit Aktualisierungen auflisten |
| `yay -Syu --devel` | -git-Pakete auf neue Commits prüfen |

## Entfernen

| Befehl | Zweck |
| :--- | :--- |
| `yay -R <Paket>` | Ein Paket entfernen |
| `yay -Rns <Paket>` | Paket, Konfigurationsdateien und unnötige Abhängigkeiten entfernen |

## Abfragen und Aufräumen

| Befehl | Zweck |
| :--- | :--- |
| `yay -Qm` | Installierte AUR-Pakete auflisten |
| `yay -Ps` | System- und Paketstatistiken ausgeben |
| `yay -Yc` | Unnötige Abhängigkeiten entfernen |
| `yay -Scc` | Paket-Cache leeren |

# Beispiele

Praxisnahe, direkt nutzbare Beispiele für die häufigsten Aufgaben.

## Ein Paket installieren

| Szenario | Befehl |
| :--- | :--- |
| Firefox installieren | `yay -S firefox` |
| VLC installieren | `yay -S vlc` |
| Ein AUR-Paket installieren | `yay -S google-chrome` |
| Ein -git-Paket installieren | `yay -S neovim-git` |
| Ohne Rückfragen installieren | `yay -S --noconfirm firefox` |
| Mehrere auf einmal installieren | `yay -S firefox vlc htop` |
| Ein Paket neu installieren | `yay -S firefox` |

## Nach Paketen suchen

| Szenario | Befehl |
| :--- | :--- |
| Nach einem Begriff suchen | `yay -Ss neovim` |
| Eingrenzende Suche (zwei Begriffe) | `yay -Ss neovim plugin` |
| Interaktive Suche (aus Menü wählen) | `yay neovim` |
| Nur AUR-Ergebnisse anzeigen | `yay -Ss neovim` und dann den AUR-Abschnitt filtern |

## Das System aktualisieren

| Szenario | Befehl |
| :--- | :--- |
| Vollständiges System-Upgrade (Repos + AUR) | `yay -Syu` |
| Vollständiges Upgrade ohne Rückfragen | `yay -Syu --noconfirm` |
| Nur AUR-Pakete aktualisieren | `yay -Sua` |
| Nur auf AUR-Aktualisierungen prüfen | `yay -Qua` |
| -git-Pakete auf neue Commits prüfen | `yay -Syu --devel` |
| Vollständiges Upgrade mit Devel-Prüfung | `yay -Syu --devel --timeupdate` |

## Pakete entfernen

| Szenario | Befehl |
| :--- | :--- |
| Ein Paket entfernen | `yay -R firefox` |
| Paket und Konfigurationsdateien entfernen | `yay -Rns firefox` |
| Verwaiste Abhängigkeiten entfernen | `yay -Yc` |
| Zwischengespeicherte Pakete entfernen | `yay -Scc` |

## Installierte Pakete abfragen

| Szenario | Befehl |
| :--- | :--- |
| Alle installierten AUR-Pakete auflisten | `yay -Qm` |
| Aktualisierbare AUR-Pakete auflisten | `yay -Qua` |
| Info über ein Paket anzeigen | `yay -Si firefox` |
| Dateien eines Pakets auflisten | `yay -Ql firefox` |
| Herausfinden, welches Paket eine Datei besitzt | `yay -Qo /usr/bin/firefox` |

## Aufräumen

| Szenario | Befehl |
| :--- | :--- |
| Unnötige Abhängigkeiten entfernen | `yay -Yc` |
| Den Paket-Cache leeren (alles) | `yay -Scc` |
| Cache leeren, nur Installiertes behalten | `yay -Sc` |
| Build-Dateien nach der Installation entfernen | `yay -S --cleanafter <Paket>` |
| Systemstatistiken ausgeben | `yay -Ps` |

## PKGBUILD-Inspektion

| Szenario | Befehl |
| :--- | :--- |
| Ein PKGBUILD herunterladen, ohne zu bauen | `yay -G google-chrome` |
| Ein PKGBUILD nach stdout ausgeben | `yay -Gp google-chrome` |
| Den Diff seit dem letzten Build anzeigen | `yay -S <aur-paket>` (fragt standardmäßig nach) |

## Kombinierte Arbeitsabläufe

| Szenario | Befehl |
| :--- | :--- |
| System aktualisieren, dann Waisen entfernen | `yay -Syu && yay -Yc` |
| System ohne Rückfragen aktualisieren, dann aufräumen | `yay -Syu --noconfirm && yay -Yc` |
| Installieren und Build-Abhängigkeiten entfernen | `yay -S --removemake <Paket>` |
| Suchen und installieren in einem Fluss | `yay <Begriff>` und dann aus dem Menü wählen |

## Dauerhafte Konfiguration

| Szenario | Befehl |
| :--- | :--- |
| Devel-Prüfungen dauerhaft aktivieren | `yay -Y --devel --save` |
| Kombiniertes Upgrade-Menü aktivieren | `yay -Y --combinedupgrade --save` |
| Build-Dateien dauerhaft automatisch aufräumen | `yay -Y --cleanafter --save` |
| Build-Abhängigkeiten dauerhaft entfernen | `yay -Y --removemake --save` |
| Mehrere auf einmal konfigurieren | `yay -Y --devel --combinedupgrade --cleanafter --removemake --save` |

# Umgang mit -git- und Entwicklerpaketen

Aus -git-Quellen gebaute Pakete zeigen nur dann Aktualisierungen, wenn sich ihr Versionsfeld ändert — was nie passieren kann. Yay kann stattdessen den Upstream-Commit prüfen.

## Entwickler-Datenbank erzeugen

Einmalig ausführen, um die Datenbank für -git-Pakete aufzubauen, die ohne yay installiert wurden:

    yay -Y --gendb

## Auf Entwickler-Aktualisierungen prüfen

    yay -Syu --devel

## Einstellung dauerhaft speichern

Devel-Prüfungen dauerhaft in der Konfiguration aktivieren:

    yay -Y --devel --save

Danach prüfen `yay` und `yay -Syu` immer die Entwicklerpakete.

# Konfiguration

Yay liest seine Konfiguration aus `~/.config/yay/config.json`. Flags können mit `--save` dauerhaft gespeichert werden.

## Häufig gespeicherte Flags

    yay --devel --combinedupgrade --cleanafter --save

- `--devel` — -git-Pakete auf Aktualisierungen prüfen
- `--combinedupgrade` — Repo- und AUR-Upgrades in einem Menü anzeigen
- `--cleanafter` — Build-Dateien nach erfolgreicher Installation entfernen
- `--removemake` — reine Build-Abhängigkeiten nach dem Bau entfernen

# Sicherheit und das AUR

Das AUR wird von Nutzern gepflegt. Pakete werden nicht von Arch-Entwicklern geprüft. Prüfe PKGBUILDs vor dem Bauen, besonders bei weniger populären Paketen.

## PKGBUILD prüfen

Yay zeigt standardmäßig ein Diff-Menü für AUR-Aktualisierungen, in dem du sehen kannst, was sich seit dem letzten Build geändert hat. Lass dies als Sicherheitsprüfung aktiviert.

## Malware-Risiko

Im AUR hat es Malware-Vorfälle gegeben. Halte dich an Pakete von bekannten Maintainern oder an Projekte, die im Arch Wiki referenziert sind. Im Zweifel inspiziere das PKGBUILD vor dem Bauen.

## Root-Warnung

Führe `yay` niemals mit `sudo` aus. Es wird sich weigern, und als root ausgeführt kann es dein System beschädigen. Yay eskaliert Privilegien nur für den letzten Installationsschritt.

# yay vs. pacman

Yay ist praktisch eine Obermenge von `pacman`. Du kannst `yay` ausschließlich verwenden und `pacman` nie direkt anfassen.

## Wann was verwenden

| Szenario | Empfehlung |
| :--- | :--- |
| Nur offizielle Repo-Pakete | Beides funktioniert; `yay` ist in Ordnung |
| AUR-Pakete | Muss `yay` oder einen anderen AUR-Helper verwenden |
| Vollständiges System-Upgrade | `yay -Syu` verwenden, um AUR einzuschließen |
| Risiko von Teilupdates | Vermeiden; immer vollständige Upgrades durchführen |

## Warnung vor Teilupgrades

`pacman -Syu` für Repos und `yay -Sua` für AUR getrennt zu mischen, kann zu Teilupgrades führen, wenn die Repo-Seite nicht zur AUR-Seite passt. Bevorzuge `yay -Syu` für ein einheitliches Upgrade.

# Zusammenfassung

Yay ist der am weitesten verbreitete AUR-Helper für Arch Linux. Er umhüllt `pacman`, ergänzt AUR-Unterstützung und bietet eine einheitliche Oberfläche zum Installieren, Suchen, Aktualisieren und Entfernen von Paketen aus offiziellen und Community-Repositories. Installiere es aus dem AUR, führe es als normaler Benutzer aus und lass das Diff-Menü zur Sicherheit aktiviert.

---

Für weitere Arch-Linux-Befehle siehe die Abschnitte zu `pacman` und den Terminal-Werkzeugen.