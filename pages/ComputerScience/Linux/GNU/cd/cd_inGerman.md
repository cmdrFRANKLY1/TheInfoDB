# cd — Verzeichnis wechseln

Der Befehl `cd` ändert das aktuelle Arbeitsverzeichnis der Shell. Er ist ein Builtin-Befehl in Bash und den meisten anderen Unix-Shells, das heißt, er läuft im Shell-Prozess selbst und nicht als eigenständiges Programm. Deshalb wirkt sich seine Änderung nur auf die Shell aus, in der er ausgeführt wird.

# Überblick

`cd` gehört zu den am häufigsten verwendeten Befehlen auf jedem Unix-ähnlichen System. Er bestimmt, wie man sich auf der Kommandozeile im Dateisystem bewegt, und ist grundlegend für nahezu jeden Arbeitsablauf — vom Navigieren in Quellcode-Verzeichnissen bis zum Ausführen von Skripten.

## Was es ist

`cd` steht für „change directory" (Verzeichnis wechseln). Beim Ausführen aktualisiert die Shell ihr internes Konzept des aktuellen Arbeitsverzeichnisses, das in der Umgebungsvariable `$PWD` gespeichert ist. Alle nachfolgenden relativen Pfade werden von diesem neuen Ort aus aufgelöst.

## Warum es wichtig ist

Jeder Befehl, der relative Pfade akzeptiert, hängt vom aktuellen Arbeitsverzeichnis ab. Ohne `cd` müsste man ständig absolute Pfade eingeben. Es ist das wichtigste Navigationswerkzeug für die interaktive Shell-Nutzung und ein häufiger Baustein in Skripten.

## Hauptmerkmale

- Ändert das aktuelle Arbeitsverzeichnis der Shell
- Akzeptiert absolute Pfade, relative Pfade und Abkürzungen wie `~` und `-`
- Unterstützt eine `CDPATH`-Suchliste für bequemes Springen
- Kann Symlinks mit `-P` und `-L` auflösen oder beibehalten
- Benötigt kein externes Programm — es ist ein Shell-Builtin

# Wie es funktioniert

`cd` startet keinen neuen Prozess. Stattdessen bittet es die Shell selbst, das Arbeitsverzeichnis des aktuellen Prozesses zu ändern. Deshalb bleibt die Änderung nach dem Befehl bestehen.

## Der grundlegende Ablauf

1. Die Shell liest das Argument, das an `cd` übergeben wird.
2. Die Shell prüft, ob das Argument zu einem gültigen Verzeichnis aufgelöst werden kann.
3. Die Shell versucht, ihr Arbeitsverzeichnis mit dem zugrunde liegenden Systemaufruf `chdir()` zu ändern.
4. Bei Erfolg wird `$OLDPWD` auf das vorherige Verzeichnis gesetzt und `$PWD` aktualisiert.
5. Bei Misserfolg gibt die Shell einen Fehler aus und das Arbeitsverzeichnis bleibt unverändert.

## Wichtige Details

Wird kein Argument angegeben, verwendet `cd` den Wert von `$HOME`. Ist das Argument `-`, wird `$OLDPWD` verwendet, also das Verzeichnis vor dem letzten erfolgreichen `cd`. Ist `CDPATH` gesetzt und das Argument ist ein relativer Pfad, durchsucht die Shell jeden Eintrag in `CDPATH`, bevor sie auf das aktuelle Verzeichnis zurückgreift.

Symbolische Links sind hier wichtig. Mit `-L` (Standard) behält die Shell den logischen Pfad, den man eingegeben hat. Mit `-P` löst die Shell Symlinks auf und speichert den physischen Pfad.

## Ein einfaches Beispiel

    cd /var/log        # wechselt nach /var/log
    cd ..              # wechselt eine Ebene höher nach /var
    cd -               # kehrt nach /var/log zurück

# Komponenten

`cd` interagiert mit mehreren Shell-Funktionen und Umgebungsvariablen. Wer diese Teile versteht, kann das Verhalten von `cd` zuverlässig vorhersagen.

## Das Arbeitsverzeichnis

Das aktuelle Arbeitsverzeichnis ist eine Eigenschaft des Shell-Prozesses. Es wird von untergeordneten Prozessen geerbt, die aus dieser Shell gestartet werden. Deshalb wirkt sich `cd` in einem Skript nicht auf die Shell aus, die das Skript aufgerufen hat.

## Umgebungsvariablen

Mehrere Variablen beeinflussen oder spiegeln das Verhalten von `cd` wider. `$HOME` liefert das Standardziel. `$OLDPWD` speichert das vorherige Verzeichnis. `$PWD` spiegelt stets das aktuelle wider. `$CDPATH` definiert einen Suchpfad für relative Argumente.

## Shell-Optionen

Die Optionen `-L`, `-P` und `-e` steuern, wie Pfade interpretiert werden und ob Fehler gemeldet werden, wenn der physische Pfad nicht bestimmt werden kann.

# Häufige Befehle

Die folgenden Beispiele decken die häufigsten Verwendungen von `cd` ab.

## Grundlegende Befehle

| Befehl | Zweck |
| :--- | :--- |
| `cd` | Ins Home-Verzeichnis wechseln |
| `cd ~` | Ins Home-Verzeichnis wechseln |
| `cd /` | Ins Wurzelverzeichnis wechseln |
| `cd ..` | Eine Ebene höher wechseln (Elternverzeichnis) |
| `cd ../..` | Zwei Ebenen höher wechseln |
| `cd -` | Zum vorherigen Verzeichnis zurückkehren |
| `cd /etc` | Zu einem absoluten Pfad wechseln |
| `cd projects` | Zu einem relativen Unterverzeichnis wechseln |
| `cd "Meine Dokumente"` | Zu einem Verzeichnis mit Leerzeichen im Namen wechseln |

## Fortgeschrittene Befehle

| Befehl | Zweck |
| :--- | :--- |
| `cd -P /usr/lib` | Symlinks auflösen und physischen Pfad verwenden |
| `cd -L /usr/lib` | Logischen Pfad beibehalten (Standardverhalten) |
| `cd -e -P /usr/lib` | Mit `-P` einen Fehler ausgeben, wenn der physische Pfad nicht bestimmt werden kann |
| `CDPATH=.:~:/projects cd myapp` | `CDPATH`-Einträge nach dem Ziel durchsuchen |

# Beispiele

Praktische, sofort einsetzbare Beispiele für die häufigsten Aufgaben.

## Szenario Eins

| Szenario | Befehl |
| :--- | :--- |
| Ins Home-Verzeichnis wechseln | `cd` |
| In ein bestimmtes Verzeichnis wechseln | `cd /var/log` |
| In ein Unterverzeichnis wechseln | `cd projects/app` |
| Eine Ebene höher wechseln | `cd ..` |
| Zwei Ebenen höher wechseln | `cd ../..` |

## Szenario Zwei

| Szenario | Befehl |
| :--- | :--- |
| Zwischen zwei Verzeichnissen wechseln | `cd /etc && cd /tmp && cd -` |
| Zu einem Verzeichnis mit Leerzeichen wechseln | `cd "Meine Dokumente"` |
| Zu einem Verzeichnis mit Leerzeichen wechseln (escaped) | `cd Meine\ Dokumente` |
| Ins Home-Verzeichnis eines anderen Benutzers wechseln | `cd ~alice` |

## Kombinierte Arbeitsabläufe

| Szenario | Befehl |
| :--- | :--- |
| Verzeichnis wechseln, dann auflisten | `cd /etc && ls -la` |
| Verzeichnis in einer Subshell wechseln | `(cd /tmp && ls)` |
| Verzeichnis wechseln, dann Skript ausführen | `cd /opt/app && ./run.sh` |
| Aktuelles Verzeichnis speichern, wechseln, wiederherstellen | `OLD=$PWD; cd /tmp; cd "$OLD"` |

# Konfiguration

`cd` hat keine eigene Konfigurationsdatei, aber sein Verhalten wird durch Shell-Variablen und Startdateien geprägt.

## Speicherort der Konfiguration

Alle Einstellungen, die `cd` beeinflussen, gehören üblicherweise in die Shell-Startdatei:

    ~/.bashrc

## Häufige Optionen

- `CDPATH` — doppelpunktgetrennte Liste von Verzeichnissen, die bei relativen Argumenten durchsucht werden
- `HOME` — Standardziel, wenn kein Argument angegeben wird
- `OLDPWD` — vorheriges Verzeichnis, verwendet von `cd -`
- `PWD` — aktuelles Arbeitsverzeichnis, von der Shell gepflegt
- `shopt -s cdable_vars` — erlaubt `cd`, Variablennamen als Verzeichnisse zu akzeptieren

## Änderungen dauerhaft speichern

Um `CDPATH` dauerhaft zu setzen, fügt man es der Shell-Startdatei hinzu:

    echo 'export CDPATH=.:~:/projects' >> ~/.bashrc

# Vergleiche

`cd` wird oft mit verwandten Befehlen zur Verzeichnisnavigation verglichen.

## Wie es sich unterscheidet

| Aspekt | `cd` | `pushd` / `popd` |
| :--- | :--- | :--- |
| Hauptzweck | Verzeichnis wechseln | Einen Verzeichnisstapel verwalten |
| Lernkurve | Sehr einfach | Etwas komplexer |
| Zustand | Ein aktuelles Verzeichnis | Ein Stapel von Verzeichnissen |
| Rückgängig machen | `cd -` (ein Schritt zurück) | `popd` (unbegrenzter Stapel) |

| Aspekt | `cd` | `cd` in einem Skript |
| :--- | :--- | :--- |
| Wirkungsbereich | Betrifft die aktuelle Shell | Betrifft nur die Subshell |
| Beständigkeit | Änderung bleibt nach dem Befehl bestehen | Änderung geht beim Skriptende verloren |

## Wann man was wählt

- Wähle **`cd`**, wenn du einfach in ein anderes Verzeichnis wechseln möchtest.
- Wähle **`pushd` / `popd`**, wenn du zwischen mehreren Verzeichnissen wechseln und in Reihenfolge zurückkehren möchtest.
- Wähle **`cd` in einer Subshell**, wenn du eine temporäre Änderung möchtest, die deine Hauptshell nicht betrifft.

# Best Practices

- Bevorzuge `cd` gegenüber `pushd` für einfache einstufige Navigation.
- Setze Pfade mit Leerzeichen in Anführungszeichen: `cd "Meine Dokumente"`.
- Verwende `cd -`, um zwischen zwei Verzeichnissen zu wechseln, statt Pfade neu einzugeben.
- Verwende `cd "$DIR" || exit` in Skripten, um sicher abzubrechen.
- Verlasse dich in Skripten nicht auf `CDPATH`, da es überraschende Ergebnisse liefern kann.

# Häufige Fallstricke

## Vergessen, dass `cd` in einem Skript lokal wirkt

Ein `cd` in einem Skript ändert das Arbeitsverzeichnis nur für die Subshell des Skripts. Wenn das Skript endet, kehrt die aufrufende Shell in ihr ursprüngliches Verzeichnis zurück.

    # script.sh
    cd /tmp
    pwd        # gibt /tmp aus

    # Aufrufer
    ./script.sh
    pwd        # gibt das ursprüngliche Verzeichnis aus, nicht /tmp

Um das Verzeichnis des Aufrufers zu ändern, muss man das Skript mit `source` einbinden:

    source script.sh

## `cd` ohne Prüfung auf Fehler verwenden

Wenn `cd` fehlschlägt, laufen nachfolgende Befehle im falschen Verzeichnis. Man sollte immer gegen Fehler absichern:

    cd /nonexistent || exit 1
    cd /nonexistent && rm -rf *    # gefährlich, wenn cd still fehlschlägt

## Leerzeichen in Pfaden ignorieren

Nicht in Anführungszeichen gesetzte Pfade mit Leerzeichen werden in mehrere Argumente aufgeteilt:

    cd Meine Dokumente      # falsch: versucht zuerst "Meine", dann "Dokumente"
    cd "Meine Dokumente"    # richtig

## Annehmen, dass `cd -` immer funktioniert

`cd -` hängt von `$OLDPWD` ab. In einer frischen Shell kann `$OLDPWD` nicht gesetzt sein, und `cd -` schlägt fehl.

# Sicherheit

`cd` selbst hat wenige Sicherheitsimplikationen, aber sein Missbrauch kann zu gefährlichen Ergebnissen führen.

## Allgemeine Ratschläge

- Setze Variablen, die als `cd`-Argumente verwendet werden, immer in Anführungszeichen: `cd "$DIR"`.
- Prüfe den Exit-Status von `cd`, bevor du zerstörerische Befehle ausführst.
- Wechsle nicht in nicht vertrauenswürdige Verzeichnisse und führe dort Skripte aus.
- Sei vorsichtig mit `CDPATH` in Skripten, da es die Navigation unerwartet umleiten kann.

## Spezifische Warnungen

- `cd /nonexistent && rm -rf *` ist nur deshalb sicher, weil `&&` kurzschließt. Die Verwendung von `;` stattdessen kann Dateien im falschen Verzeichnis löschen.
- Das Ausführen von `rm -rf *` nach einem fehlgeschlagenen `cd` in einem sensiblen Verzeichnis (wie `$HOME`) kann schweren Datenverlust verursachen.
- Das Einbinden eines nicht vertrauenswürdigen Skripts, das `cd` enthält, ändert das aktuelle Verzeichnis der Shell.

# Zusammenfassung

`cd` ist ein Shell-Builtin, das das aktuelle Arbeitsverzeichnis der laufenden Shell ändert. Es akzeptiert absolute Pfade, relative Pfade und Abkürzungen wie `~`, `..` und `-`, und sein Verhalten wird von Variablen wie `$HOME`, `$OLDPWD`, `$PWD` und `$CDPATH` beeinflusst. Da es ein Builtin ist, ist seine Wirkung auf die aktuelle Shell beschränkt und wird nicht an die Eltern-Shell vererbt. Bei unvorsichtiger Verwendung in Skripten können Befehle an unerwarteten Orten ausgeführt werden, daher ist es wichtig, es mit `|| exit` abzusichern und Pfade in Anführungszeichen zu setzen.

---

Verwandte Themen finden sich in den Abschnitten zu `pwd`, `pushd`, `popd`, `dirs` und `ls`.

# Tags

- cd
- shell-builtin
- navigation
- bash
- linux
- dokumentation
- markdown
