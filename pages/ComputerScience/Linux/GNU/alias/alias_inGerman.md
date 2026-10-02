# alias

Der Befehl `alias` erstellt, zeigt oder entfernt Abkürzungen für längere Befehle. Er ist ein Builtin-Befehl in Bash und den meisten anderen Unix-Shells, das heißt, er läuft im Shell-Prozess selbst und nicht als eigenständiges Programm. Aliase sind eine einfache Möglichkeit, Tipparbeit zu sparen und das Verhalten der Shell anzupassen.

# Überblick

`alias` ist eines der einfachsten Anpassungswerkzeuge in einer Unix-Shell. Es ermöglicht, einem längeren Befehl oder einer Befehlsfolge einen kurzen Namen zuzuweisen, sodass man weniger tippen muss und Fehler reduziert werden. Aliase werden häufig in interaktiven Shells und in Startdateien wie `~/.bashrc` verwendet.

## Was es ist

Ein Alias ist ein Name, den die Shell vor der Ausführung eines Befehls durch eine Zeichenkette ersetzt. Wenn man den Aliasnamen als erstes Wort einer Befehlszeile eingibt, ersetzt die Shell ihn durch den hinterlegten Text und führt das Ergebnis aus. Der Befehl `alias` selbst ist das Builtin, mit dem diese Abkürzungen definiert, aufgelistet und verwaltet werden.

## Warum es wichtig ist

Aliase verbessern Produktivität und Konsistenz bei der interaktiven Nutzung der Shell. Sie ermöglichen:

- Häufig verwendete Befehle abzukürzen (`ll` für `ls -alF`)
- Standardoptionen hinzuzufügen (`rm -i`, um `rm` interaktiv zu machen)
- Einprägsame Namen für komplexe Pipelines zu erstellen
- Sicherere Gewohnheiten bei destruktiven Befehlen zu fördern

Sie ersetzen keine Skripte oder Funktionen, sind aber die leichteste verfügbare Anpassung.

## Hauptmerkmale

- Abkürzungen für Befehle und Befehlsfolgen definieren
- Aktuell definierte Aliase auflisten
- Aliase mit `unalias` entfernen
- Über Shell-Startdateien dauerhaft speichern
- Quoting- und Escaping-Regeln für komplexe Werte unterstützen
- Nur das erste Wort einer Befehlszeile erweitern

# Wie es funktioniert

Wenn die Shell eine Befehlszeile liest, prüft sie, ob das erste Wort einem definierten Alias entspricht. Ist das der Fall, ersetzt die Shell dieses Wort durch den Aliaswert und parst die Zeile neu. Diese Ersetzung erfolgt vor der Ausführung des Befehls.

## Der grundlegende Ablauf

1. Die Shell liest eine Befehlszeile.
2. Die Shell prüft das erste Wort gegen die Liste der definierten Aliase.
3. Bei einer Übereinstimmung ersetzt die Shell das Wort durch den Aliaswert.
4. Die Shell parst die resultierende Befehlszeile neu.
5. Die Shell führt den erweiterten Befehl aus.

## Wichtige Details

Aliase werden nur erweitert, wenn der Aliasname als erstes Wort eines Befehls erscheint. Sie werden nicht innerhalb von Argumenten, Variablen oder nach anderen Wörtern in derselben Zeile erweitert.

Endet ein Alias mit einem Leerzeichen, versucht die Shell zusätzlich, das nächste Wort als Alias zu erweitern. Das ist nützlich für die Verkettung von Aliasen, kann aber auch Verwirrung stiften.

Aliase werden nicht an untergeordnete Shells oder Skripte vererbt, es sei denn, sie werden in einer Startdatei definiert, die die untergeordnete Shell liest. Aliase sind in nicht-interaktiven Shells standardmäßig deaktiviert, was bedeutet, dass Skripte sie nicht sehen.

Um zu sehen, wie die Shell einen Befehl erweitern wird, verwendet man `type`:

    type ll

## Ein einfaches Beispiel

    alias ll='ls -alF'
    ll

Die erste Zeile definiert den Alias. Die zweite Zeile wird von der Shell vor der Ausführung zu `ls -alF` erweitert.

# Komponenten

Der `alias`-Mechanismus umfasst einige Shell-Funktionen, die zusammenwirken. Wer sie versteht, kann Aliase zuverlässig vorhersagen.

## Die Alias-Tabelle

Jede Shell-Instanz führt ihre eigene Tabelle mit Aliasen. Man kann die Tabelle mit `alias` anzeigen und mit `alias` oder `unalias` ändern. Die Tabelle wird nicht zwischen Shells geteilt.

## Shell-Startdateien

Aliase werden üblicherweise in einer Startdatei definiert, damit sie über Sitzungen hinweg bestehen bleiben. In Bash sind die üblichen Dateien:

- `~/.bashrc` für interaktive Nicht-Login-Shells
- `~/.bash_profile` oder `~/.profile` für Login-Shells

## Quoting und Escaping

Da die Shell den Aliaswert parst, ist Quoting wichtig. Einfache Anführungszeichen sind für einfache Aliase meist am besten. Doppelte Anführungszeichen erlauben Variablenexpansion zum Definitionszeitpunkt. Backslashes sind nötig, um die Alias-Expansion zu verhindern, wenn man den zugrunde liegenden Befehl ausführen möchte.

# Häufige Befehle

Die folgenden Beispiele decken die häufigsten Verwendungen von `alias` ab.

## Grundlegende Befehle

| Befehl | Zweck |
| :--- | :--- |
| `alias` | Alle definierten Aliase auflisten |
| `alias name='value'` | Einen Alias definieren oder neu definieren |
| `alias name` | Den Wert eines einzelnen Alias anzeigen |
| `unalias name` | Einen einzelnen Alias entfernen |
| `unalias -a` | Alle Aliase entfernen |
| `type name` | Anzeigen, wie die Shell einen Namen interpretiert |

## Fortgeschrittene Befehle

| Befehl | Zweck |
| :--- | :--- |
| `alias -p` | Alle Aliase in wiederverwendbarer Form ausgeben |
| `\command` | Einen Alias für einen einzelnen Aufruf umgehen |
| `command name` | Den externen Befehl ausführen und Aliase ignorieren |
| `shopt -s expand_aliases` | Alias-Expansion in nicht-interaktiven Shells aktivieren |

# Beispiele

Praktische, sofort einsetzbare Beispiele für die häufigsten Aufgaben.

## Szenario Eins

| Szenario | Befehl |
| :--- | :--- |
| `ls -alF` abkürzen | `alias ll='ls -alF'` |
| `rm` interaktiv machen | `alias rm='rm -i'` |
| `cp` interaktiv machen | `alias cp='cp -i'` |
| `mv` interaktiv machen | `alias mv='mv -i'` |
| `grep` farbig machen | `alias grep='grep --color=auto'` |

## Szenario Zwei

| Szenario | Befehl |
| :--- | :--- |
| Einen Alias anzeigen | `alias ll` |
| Einen Alias entfernen | `unalias ll` |
| Alle Aliase entfernen | `unalias -a` |
| Alle Aliase auflisten | `alias` |
| Aliase in wiederverwendbarer Form auflisten | `alias -p` |

## Kombinierte Arbeitsabläufe

| Szenario | Befehl |
| :--- | :--- |
| Definieren und sofort verwenden | `alias ll='ls -alF' && ll` |
| Einen Alias einmal umgehen | `\rm file.txt` |
| Einen Alias mit `command` umgehen | `command rm file.txt` |
| Einen Alias dauerhaft speichern | `echo "alias ll='ls -alF'" >> ~/.bashrc` |
| Startdatei neu laden | `source ~/.bashrc` |

# Konfiguration

Aliase werden üblicherweise in Shell-Startdateien gespeichert, nicht in einer eigenen Konfigurationsdatei.

## Speicherort der Konfiguration

Der häufigste Ort für interaktive Bash-Aliase ist:

    ~/.bashrc

Für Login-Shells können Aliase auch hier abgelegt werden:

    ~/.bash_profile
    ~/.profile

## Häufige Optionen

- `alias name='value'` — einen Alias definieren oder aktualisieren
- `unalias name` — einen Alias entfernen
- `unalias -a` — alle Aliase entfernen
- `alias -p` — Aliase in einer Form anzeigen, die erneut eingelesen werden kann
- `shopt -s expand_aliases` — Alias-Expansion in nicht-interaktiven Shells erlauben

## Änderungen dauerhaft speichern

Um einen Alias dauerhaft zu machen, fügt man ihn der Shell-Startdatei hinzu:

    echo "alias ll='ls -alF'" >> ~/.bashrc
    source ~/.bashrc

# Vergleiche

`alias` wird oft mit Shell-Funktionen und Skripten verglichen.

## Wie es sich unterscheidet

| Aspekt | `alias` | Shell-Funktion |
| :--- | :--- | :--- |
| Hauptzweck | Einfache Textersetzung | Wiederverwendbarer Befehl mit Logik |
| Lernkurve | Sehr einfach | Mittel |
| Argumente | Nicht direkt unterstützt | Vollständig unterstützt |
| Komplexität | Eine Zeile | Mehrere Zeilen, Bedingungen, Schleifen |
| Wirkungsbereich | Interaktive Shells, nur erstes Wort | Jeder Shell-Kontext |

| Aspekt | `alias` | Skript |
| :--- | :--- | :--- |
| Hauptzweck | Abkürzung in der aktuellen Shell | Eigenständiges Programm |
| Beständigkeit | Nur in der aktuellen Shell | Läuft in einem eigenen Prozess |
| Argumente | Nicht unterstützt | Vollständig unterstützt |
| Verteilung | Pro Benutzer definiert | Kann systemübergreifend geteilt werden |
| Overhead | Keiner über das Parsen hinaus | Prozessstartkosten |

## Wann man was wählt

- Wähle **`alias`** für kurze, einfache Ersetzungen in interaktiven Shells.
- Wähle eine **Shell-Funktion**, wenn du Argumente, Bedingungen oder mehrere Befehle brauchst.
- Wähle ein **Skript**, wenn die Logik wiederverwendbar, versionierbar und systemübergreifend teilbar sein soll.

# Best Practices

- Halte Aliase kurz und einprägsam.
- Definiere Aliase in `~/.bashrc`, damit sie bestehen bleiben.
- Verwende einfache Anführungszeichen um Aliaswerte, um vorzeitige Expansion zu vermeiden.
- Überschreibe kritische Befehle wie `rm` nicht, ohne sie sicherer zu machen.
- Verwende `type`, um zu prüfen, wie ein Name aktuell interpretiert wird.
- Dokumentiere deine Aliase mit Kommentaren in der Startdatei.

# Häufige Fallstricke

## Erwarten, dass Argumente funktionieren

Aliase akzeptieren keine Argumente. Die Shell ersetzt Text, sodass Argumente nach dem erweiterten Befehl angehängt werden:

    alias ll='ls -alF'
    ll /tmp        # wird zu: ls -alF /tmp

Das funktioniert für einfache Fälle, bricht aber, wenn Argumente in der Mitte des Alias platziert werden sollen.

## Einen Alias in einem Skript definieren

Aliase sind in nicht-interaktiven Shells standardmäßig deaktiviert. Einen Alias in einem Skript zu definieren und zu erwarten, dass er funktioniert, schlägt meist fehl, es sei denn, man aktiviert `expand_aliases`:

    shopt -s expand_aliases

## Rekursive Aliase

Wenn ein Alias auf seinen eigenen Namen verweist, kann das eine Endlosschleife verursachen:

    alias ls='ls --color=auto'    # in Ordnung: verweist auf das externe ls
    alias ls='ls ls'              # problematisch

## Anführungszeichen vergessen

Nicht in Anführungszeichen gesetzte Aliaswerte werden von der Shell zum Definitionszeitpunkt geparst, was zu unerwarteten Ergebnissen führen kann:

    alias greet='echo hello world'    # in Ordnung
    alias greet=echo hello world      # falsch: definiert greet=echo, dann wird hello ausgeführt

## Annehmen, dass Aliase überall gelten

Aliase werden nur in interaktiven Shells erweitert, nur für das erste Wort und nur, nachdem die Shell die Alias-Tabelle gelesen hat. Sie gelten standardmäßig nicht in Skripten, Subshells oder nicht-interaktiven Kontexten.

# Sicherheit

Aliase sind selbst kein Sicherheitsmechanismus, können aber das Verhalten auf eine Weise beeinflussen, die relevant ist.

## Allgemeine Ratschläge

- Sei vorsichtig, wenn du Befehle wie `sudo`, `ssh` oder `rm` aliasierst.
- Überprüfe Startdateien regelmäßig, um sicherzustellen, dass keine Aliase bösartig hinzugefügt wurden.
- Vermeide Aliase, die das wahre Verhalten eines Befehls verbergen.
- Verwende `command` oder `\`, um Aliase zu umgehen, wenn du vorhersehbares Verhalten brauchst.

## Spezifische Warnungen

- `rm` so zu aliasieren, dass es still mehr löscht als erwartet, kann Datenverlust verursachen.
- `sudo` so zu aliasieren, dass Optionen hinzugefügt werden, kann Authentifizierung oder Protokollierung schwächen.
- Das Einbinden einer nicht vertrauenswürdigen Datei, die Aliase definiert, kann das Verhalten der Shell ändern.
- Aliase, die Systembefehle überschreiben, können Benutzer verwirren, die Standardverhalten erwarten.

# Zusammenfassung

`alias` ist ein Shell-Builtin, das Textersetzungen für Befehle definiert, auflistet und entfernt. Es funktioniert, indem es das erste Wort einer Befehlszeile vor der Ausführung durch den Aliaswert ersetzt. Aliase sind einfach, schnell und ideal für interaktive Abkürzungen, unterstützen aber keine Argumente, werden nicht an Skripte vererbt und können mit `\` oder `command` umgangen werden. Sie eignen sich am besten für kurze, sichere und einprägsame Anpassungen und sollten in `~/.bashrc` definiert werden, um über Sitzungen hinweg zu bestehen.

---

Verwandte Themen finden sich in den Abschnitten zu `unalias`, `type`, `command`, Shell-Funktionen und `~/.bashrc`.

# Tags

- alias
- shell
- anpassung
- bash
- linux
- konsole
- terminal