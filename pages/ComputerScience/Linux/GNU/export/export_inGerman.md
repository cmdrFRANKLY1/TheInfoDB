# export — Umgebungsvariablen exportieren

Der Befehl `export` markiert Shell-Variablen für die Aufnahme in die Umgebung von Kindprozessen. Er ist ein Builtin-Befehl in Bash und den meisten anderen Unix-Shells, das heißt, er läuft im Shell-Prozess selbst und nicht als eigenständiges Programm. Sobald eine Variable exportiert wurde, erbt jedes von dieser Shell gestartete Programm sie.

# Überblick

`export` ist die Brücke zwischen den internen Variablen der Shell und der Umgebung, die externe Programme sehen. Ohne `export` bleiben in der Shell definierte Variablen privat. Mit `export` werden sie Teil der Umgebung, die an jeden Kindprozess weitergegeben wird — einschließlich Skripten, Befehlen und anderen Shells.

## Was es ist

Eine Shell-Variable ist ein Name, der einen Wert innerhalb der Shell speichert. Eine Umgebungsvariable ist eine Variable, die für den Export markiert wurde und an Kindprozesse weitergegeben wird. Der Befehl `export` setzt diese Markierung. Er erstellt die Variable nicht selbst, kann aber gleichzeitig einen Wert zuweisen.

## Warum es wichtig ist

Viele Programme verlassen sich auf Umgebungsvariablen zur Konfiguration. `PATH` bestimmt, wo die Shell nach ausführbaren Dateien sucht. `EDITOR` teilt Werkzeugen mit, welcher Editor verwendet werden soll. `LANG` und `LC_*` steuern Locale- und Sprachverhalten. `HOME`, `USER` und `PWD` werden von unzähligen Programmen verwendet. Ohne `export` hätte das Setzen dieser Variablen in einer Shell keine Wirkung auf die gestarteten Programme.

## Hauptmerkmale

- Markiert Shell-Variablen für den Export an Kindprozesse
- Kann in einer einzigen Anweisung zuweisen und exportieren
- Kann das Export-Attribut mit `-n` entfernen
- Kann Shell-Funktionen mit `-f` exportieren
- Kann alle exportierten Variablen mit `-p` anzeigen
- Funktioniert in jeder POSIX-kompatiblen Shell

# Wie es funktioniert

Wenn man `export NAME=value` ausführt, erstellt oder aktualisiert die Shell die Variable `NAME` und fügt sie der Liste der Variablen hinzu, die von Kindprozessen geerbt werden. Wenn ein Kindprozess gestartet wird, kopiert die Shell die exportierten Variablen in die Umgebung des neuen Prozesses.

## Der grundlegende Ablauf

1. Die Shell liest den `export`-Befehl und seine Argumente.
2. Für jedes Argument der Form `NAME=value` weist die Shell der Variablen den Wert zu.
3. Die Shell markiert die Variable für den Export.
4. Wenn ein Kindprozess gestartet wird, übergibt die Shell die exportierten Variablen in dessen Umgebung.
5. Der Kindprozess liest die benötigten Variablen aus dieser Umgebung.

## Wichtige Details

`export NAME` ohne Wert erstellt keine Variable. Es markiert nur eine vorhandene Variable für den Export. Existiert die Variable nicht, wird sie in manchen Shells als leere exportierte Variable angelegt.

`export NAME=value` weist in einem Schritt zu und exportiert. Das ist die gebräuchlichste Form.

Sobald eine Variable exportiert ist, bleibt ihr Export-Status bestehen, bis man ihn mit `export -n NAME` entfernt oder die Variable mit `unset NAME` vollständig löscht.

Exportierte Variablen werden von allen Kindprozessen geerbt, einschließlich Subshells, Skripten und externen Befehlen. Änderungen an einer exportierten Variable in einem Kindprozess wirken sich nicht auf die Eltern-Shell aus.

## Ein einfaches Beispiel

    export EDITOR=vim
    echo $EDITOR

Die erste Zeile weist `EDITOR` den Wert `vim` zu und markiert sie für den Export. Die zweite Zeile gibt den Wert aus. Jedes danach gestartete Programm erbt `EDITOR=vim`.

# Komponenten

Der `export`-Mechanismus umfasst einige Shell-Funktionen, die zusammenwirken.

## Shell-Variablen vs. Umgebungsvariablen

Eine Shell-Variable lebt nur innerhalb der Shell. Eine Umgebungsvariable ist eine Shell-Variable, die exportiert wurde. Der Unterschied ist wichtig, weil Kindprozesse nur exportierte Variablen sehen.

## Der Umgebungsblock

Jeder Prozess hat einen Umgebungsblock — eine Liste von `NAME=value`-Paaren, die ihm beim Start übergeben wird. `export` füllt diesen Block für Kindprozesse.

## Der `env`-Befehl

Der Befehl `env` zeigt die Umgebung eines Befehls an oder ändert sie. Er ist nützlich, um zu prüfen, was aktuell exportiert ist:

    env | sort

## Der `set`-Befehl

Der Befehl `set` zeigt alle Shell-Variablen an, ob exportiert oder nicht. Verwende `set`, um private Variablen zu sehen, und `env`, um exportierte zu sehen.

# Häufige Befehle

Die folgenden Beispiele decken die häufigsten Verwendungen von `export` ab.

## Grundlegende Befehle

| Befehl | Zweck |
| :--- | :--- |
| `export NAME=value` | Eine Variable zuweisen und exportieren |
| `export NAME` | Eine vorhandene Variable für den Export markieren |
| `export -p` | Alle exportierten Variablen auflisten |
| `export -n NAME` | Das Export-Attribut entfernen |
| `unset NAME` | Die Variable vollständig entfernen |
| `env` | Die Umgebung von Kindprozessen anzeigen |

## Fortgeschrittene Befehle

| Befehl | Zweck |
| :--- | :--- |
| `export -f function_name` | Eine Shell-Funktion exportieren |
| `export -p > env_backup.sh` | Exportierte Variablen in eine Datei speichern |
| `export PATH="$PATH:/opt/bin"` | `PATH` sicher erweitern |
| `export -n NAME` | Die Variable behalten, aber nicht mehr exportieren |
| `env -i command` | Einen Befehl mit leerer Umgebung ausführen |

# Beispiele

Praktische, sofort einsetzbare Beispiele für die häufigsten Aufgaben.

## Szenario Eins

| Szenario | Befehl |
| :--- | :--- |
| Standard-Editor setzen | `export EDITOR=vim` |
| Standard-Pager setzen | `export PAGER=less` |
| Sprache setzen | `export LANG=en_US.UTF-8` |
| Terminaltyp setzen | `export TERM=xterm-256color` |
| Eigene Variable setzen | `export APP_ENV=production` |

## Szenario Zwei

| Szenario | Befehl |
| :--- | :--- |
| Ein Verzeichnis zu `PATH` hinzufügen | `export PATH="$PATH:/opt/bin"` |
| Ein Verzeichnis `PATH` voranstellen | `export PATH="/opt/bin:$PATH"` |
| Alle exportierten Variablen anzeigen | `export -p` |
| Die Umgebung anzeigen | `env` |
| Das Export-Attribut entfernen | `export -n APP_ENV` |
| Eine Variable löschen | `unset APP_ENV` |

## Kombinierte Arbeitsabläufe

| Szenario | Befehl |
| :--- | :--- |
| Exportieren und sofort verwenden | `export EDITOR=vim && $EDITOR file.txt` |
| Einen Export dauerhaft speichern | `echo 'export EDITOR=vim' >> ~/.bashrc` |
| Startdatei neu laden | `source ~/.bashrc` |
| Einen Befehl mit temporärer Variable ausführen | `EDITOR=nano command` |
| Einen Befehl mit sauberer Umgebung ausführen | `env -i /bin/bash` |
| Exporte in eine Datei speichern | `export -p > ~/env_backup.sh` |
| Exporte aus einer Datei wiederherstellen | `source ~/env_backup.sh` |

# Konfiguration

Exportierte Variablen werden üblicherweise in Shell-Startdateien definiert, damit sie über Sitzungen hinweg bestehen bleiben.

## Speicherort der Konfiguration

Die häufigsten Orte für exportierte Variablen in Bash sind:

    ~/.bashrc           # interaktive Nicht-Login-Shells
    ~/.bash_profile     # Login-Shells
    ~/.profile          # Login-Shells (POSIX)
    /etc/environment    # systemweit, von PAM gelesen
    /etc/profile        # systemweite Login-Shells

## Häufige Optionen

- `export NAME=value` — zuweisen und exportieren
- `export -p` — exportierte Variablen auflisten
- `export -n NAME` — das Export-Attribut entfernen
- `export -f NAME` — eine Shell-Funktion exportieren
- `export -fp` — exportierte Funktionen auflisten

## Änderungen dauerhaft speichern

Um einen Export dauerhaft zu machen, fügt man ihn der Shell-Startdatei hinzu:

    echo 'export EDITOR=vim' >> ~/.bashrc
    source ~/.bashrc

Für systemweite Einstellungen fügt man die Zeile zu `/etc/environment` oder zu Skripten in `/etc/profile.d/` hinzu.

# Vergleiche

`export` wird oft mit verwandten Befehlen und Mechanismen verglichen.

## Wie es sich unterscheidet

| Aspekt | `export` | `set` |
| :--- | :--- | :--- |
| Hauptzweck | Variablen für Kindprozesse markieren | Shell-Optionen und Variablen anzeigen oder setzen |
| Sichtbarkeit | Kindprozesse sehen die Variable | Nur die aktuelle Shell sieht sie |
| Ausgabe | Nur exportierte Variablen | Alle Shell-Variablen |
| Typische Verwendung | Umgebung konfigurieren | Shell-Zustand debuggen |

| Aspekt | `export` | `env` |
| :--- | :--- | :--- |
| Hauptzweck | Eine Variable für den Export markieren | Umgebung eines Befehls anzeigen oder ändern |
| Wirkungsbereich | Betrifft die aktuelle Shell und ihre Kinder | Betrifft nur den ausgeführten Befehl |
| Beständigkeit | Bleibt in der Shell bestehen | Temporär für einen Befehl |
| Typische Verwendung | Shell-Sitzung konfigurieren | Einen Befehl mit eigener Umgebung ausführen |

| Aspekt | `export` | Lokale Variable |
| :--- | :--- | :--- |
| Vererbung | Wird an Kindprozesse weitergegeben | Wird nicht an Kindprozesse weitergegeben |
| Wirkungsbereich | Shell-Sitzung und ihre Kinder | Nur Shell-Sitzung |
| Typische Verwendung | Konfiguration | Temporäre Werte und Schleifen |

## Wann man was wählt

- Wähle **`export`**, wenn ein Kindprozess die Variable sehen soll.
- Wähle eine **lokale Variable**, wenn der Wert nur in der aktuellen Shell gebraucht wird.
- Wähle **`env`**, wenn du einen einzelnen Befehl mit geänderter Umgebung ausführen möchtest.
- Wähle **`unset`**, wenn du eine Variable vollständig entfernen möchtest.

# Best Practices

- Exportiere nur, was Kindprozesse tatsächlich brauchen.
- Verwende `~/.bashrc` oder `~/.profile`, um Exporte dauerhaft zu speichern.
- Setze Werte mit Leerzeichen oder Sonderzeichen in Anführungszeichen.
- Verwende `export PATH="$PATH:/new/dir"`, um sicher anzuhängen.
- Exportiere keine Geheimnisse in Shell-Startdateien.
- Überprüfe exportierte Variablen regelmäßig mit `export -p` oder `env`.
- Bevorzuge Kleinbuchstaben für private Shell-Variablen und Großbuchstaben für exportierte.

# Häufige Fallstricke

## Vergessen zu exportieren

Eine ohne `export` gesetzte Variable ist für Kindprozesse nicht sichtbar:

    EDITOR=vim
    some_program    # sieht EDITOR nicht

    export EDITOR=vim
    some_program    # sieht EDITOR

## Exportieren, nachdem das Kind bereits läuft

Das Exportieren einer Variable betrifft nur zukünftige Kindprozesse. Ein bereits laufendes Programm sieht den neuen Wert nicht.

## `PATH` überschreiben statt anhängen

`PATH` ohne den vorherigen Wert zu setzen, bricht die Befehlssuche:

    export PATH=/opt/bin         # falsch: verliert /usr/bin, /bin usw.
    export PATH="$PATH:/opt/bin" # richtig

## Quoting-Fehler

Nicht in Anführungszeichen gesetzte Werte mit Leerzeichen oder Glob-Zeichen können unerwartet expandiert werden:

    export GREETING="hello world"    # richtig
    export GREETING=hello world      # falsch: weist nur "hello" zu

## Annehmen, dass Änderungen nach oben wandern

Exportierte Variablen fließen von der Eltern- zur Kind-Shell, niemals umgekehrt. Ein Skript, das eine Variable exportiert, ändert nicht die Umgebung des Aufrufers.

## Geheimnisse preisgeben

Das Exportieren von Passwörtern oder Tokens macht sie für jeden Kindprozess und für Werkzeuge wie `ps e` sichtbar:

    export API_KEY=secret    # für alle Kindprozesse sichtbar

# Sicherheit

`export` beeinflusst, was jeder Kindprozess sehen kann, und hat daher echte Sicherheitsimplikationen.

## Allgemeine Ratschläge

- Exportiere keine Geheimnisse; verwende Dateien mit eingeschränkten Rechten oder Secret-Manager.
- Halte `PATH` sauber und vorhersehbar; exportiere nicht `.` oder weltweit beschreibbare Verzeichnisse.
- Sei vorsichtig beim Einbinden nicht vertrauenswürdiger Skripte, die `export`-Befehle enthalten.
- Überprüfe `/etc/environment` und `/etc/profile.d/` regelmäßig auf gemeinsam genutzten Systemen.
- Verwende `env -i`, um nicht vertrauenswürdige Befehle mit minimaler Umgebung auszuführen.

## Spezifische Warnungen

- Ein exportierter `PATH`, der ein beschreibbares Verzeichnis enthält, kann zum Command-Hijacking führen.
- Das Exportieren von `LD_PRELOAD` oder ähnlichen Variablen kann Code in Kindprozesse einschleusen.
- Exportierte Variablen sind in `/proc/<pid>/environ` für Benutzer mit ausreichenden Rechten sichtbar.
- Ein bösartiges Skript, das in die Shell eingebunden wird, kann Variablen exportieren, die das zukünftige Befehlsverhalten ändern.

# Zusammenfassung

`export` ist ein Shell-Builtin, das Variablen für die Aufnahme in die Umgebung von Kindprozessen markiert. Es kann in einem Schritt zuweisen und exportieren, exportierte Variablen mit `-p` auflisten und das Export-Attribut mit `-n` entfernen. Exportierte Variablen fließen von der Eltern- zur Kind-Shell, niemals umgekehrt, und werden üblicherweise in `~/.bashrc`, `~/.profile` oder systemweiten Dateien wie `/etc/environment` definiert. Bei unvorsichtiger Verwendung können Exporte Geheimnisse preisgeben, `PATH` brechen oder unsichere Einstellungen in jeden gestarteten Prozess einschleusen.

---

Verwandte Themen finden sich in den Abschnitten zu `env`, `set`, `unset`, `PATH` und Shell-Startdateien.

# Tags

- export
- shell-builtin
- umgebung
- bash
- linux
- dokumentation
- markdown