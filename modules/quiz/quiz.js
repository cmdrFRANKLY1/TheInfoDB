(function() {
    // -------------------------------------------------------------------------
    // Module State Variables
    // -------------------------------------------------------------------------
    let queue = [];
    let currentQuestionIndex = -1;
    let clickCounts = {};

    // -------------------------------------------------------------------------
    // Quiz Database (WiSo & Security)
    // -------------------------------------------------------------------------
    const questionDatabase = [
        // === WiSo & Recht ===
        {
            id: "wiso_01", type: "single",
            title: "Prokura Unterschrift",
            text: "Herr Meister ist Prokurist der Compu AG. Wie muss er rechtsgültig unterschreiben?",
            answer: "Compu AG / ppa. Michael Meister",
            options: ["Compu AG / ppa. Michael Meister", "Compu AG / i.V. Michael Meister", "Compu AG / i.A. Michael Meister", "Compu AG / Michael Meister"],
            hints: ["Eine besondere handelrechtliche Vollmacht.", "Die Abkürzung steht für 'per procura'.", "Die Lösung lautet: ppa."]
        },
        {
            id: "wiso_02", type: "single",
            title: "Marktformen",
            text: "Wenige Anbieter treffen auf viele Nachfrager. Welche Marktform liegt hier vor?",
            answer: "Angebotsoligopol",
            options: ["Polypol", "Angebotsmonopol", "Nachfragemonopol", "Angebotsoligopol"],
            hints: ["Es geht um die Anbieterseite (Angebot...).", "Oligo = Wenige, Mono = Einer, Poly = Viele.", "Die Lösung lautet Angebotsoligopol."]
        },
        {
            id: "wiso_03", type: "single",
            title: "Ausbildungsvertrag",
            text: "In welcher Form muss der wesentliche Inhalt eines Ausbildungsvertrages seit dem 01.08.2024 (BVaDiG) abgeschlossen werden?",
            answer: "Textform (z.B. digital übermittelbar und druckbar)",
            options: ["Zwingend handschriftlich (Schriftform)", "Mündlich reicht aus", "Nur notariell beglaubigt", "Textform (z.B. digital übermittelbar und druckbar)"],
            hints: ["Das Gesetz wurde modernisiert, Tinte ist nicht mehr zwingend.", "Ein PDF oder eine E-Mail reicht mittlerweile aus.", "Die Lösung ist die Textform."]
        },
        {
            id: "wiso_04", type: "single",
            title: "Gesellschaftsformen",
            text: "Welche Aussage zur Haftung einer GmbH ist richtig?",
            answer: "Die Haftung ist grundsätzlich auf das Gesellschaftsvermögen beschränkt.",
            options: ["Geschäftsführer haften immer mit ihrem Privatvermögen.", "Die Gesellschafter haften unbeschränkt.", "Die Haftung ist grundsätzlich auf das Gesellschaftsvermögen beschränkt.", "Eine GmbH haftet gar nicht."],
            hints: ["Was bedeutet die Abkürzung GmbH?", "Gesellschaft mit *beschränkter* Haftung.", "Das Privatvermögen ist grundsätzlich geschützt."]
        },
        {
            id: "wiso_05", type: "single",
            title: "Gewinnverteilung OHG",
            text: "Wie wird der Gewinn einer OHG nach aktueller gesetzlicher Regelung (seit 01.01.2024, MoPeG) standardmäßig verteilt?",
            answer: "Vorrangig nach vereinbarten Beitragswerten, sonst nach gleichen Anteilen.",
            options: ["Immer 4% auf das Kapital, der Rest nach Köpfen.", "Der Inhaber bekommt 50%.", "Vorrangig nach vereinbarten Beitragswerten, sonst nach gleichen Anteilen.", "Nach Lebensalter der Gesellschafter."],
            hints: ["Die alte 4%-Regel wurde abgeschafft.", "Es kommt darauf an, was die Gesellschafter in die Firma eingebracht haben.", "Verteilung nach vereinbarten Beitragswerten."]
        },
        {
            id: "wiso_06", type: "single",
            title: "Produktionsfaktoren",
            text: "Ein IT-Betrieb nutzt Strom für seine Server. Zu welchem betriebswirtschaftlichen Faktor zählt der Strom?",
            answer: "Betriebsstoff",
            options: ["Rohstoff", "Hilfsstoff", "Betriebsstoff", "Kapital"],
            hints: ["Er geht nicht physisch in das Endprodukt ein.", "Er wird benötigt, um den 'Betrieb' am Laufen zu halten.", "Strom ist ein Betriebsstoff."]
        },
        {
            id: "wiso_07", type: "single",
            title: "Kündigungsschutz",
            text: "Welche Personengruppe genießt KEINEN besonderen, gesetzlichen Kündigungsschutz (aufgrund ihres Status)?",
            answer: "Leitende Angestellte",
            options: ["Schwerbehinderte", "Werdende Mütter", "Auszubildende nach der Probezeit", "Leitende Angestellte"],
            hints: ["Besonders schutzbedürftig sind Minderheiten oder gesundheitlich Eingeschränkte.", "Manager und Chefs auf oberer Ebene haben dieses Privileg nicht pauschal.", "Leitende Angestellte."]
        },
        {
            id: "wiso_08", type: "single",
            title: "Betriebsrat / JAV",
            text: "Eine Jugend- und Auszubildendenvertretung (JAV) darf gegründet werden...",
            answer: "...wenn es im Unternehmen bereits einen Betriebsrat gibt und die personellen Voraussetzungen erfüllt sind.",
            options: ["...in jedem Unternehmen ab dem 1. Azubi.", "...ohne dass ein Betriebsrat existiert.", "...wenn es im Unternehmen bereits einen Betriebsrat gibt und die personellen Voraussetzungen erfüllt sind.", "...nur in der Industrie, nicht im Handel."],
            hints: ["Die JAV ist kein unabhängiger Ersatz für den Betriebsrat.", "Die JAV ist in die Betriebsratsstruktur eingebunden.", "Es muss zwingend ein Betriebsrat existieren."]
        },

        // === KPIs & Ziele ===
        {
            id: "kpi_01", type: "single",
            title: "Treiber-KPI",
            text: "Was ist ein typischer Treiber-KPI (Leading Indicator)?",
            answer: "Anzahl durchgeführter Code-Reviews pro Woche",
            options: ["Jahresumsatz des Vorjahres", "Anzahl durchgeführter Code-Reviews pro Woche", "Endgültige Projektmarge nach Abschluss", "Fehlerquote des fertigen Produkts"],
            hints: ["Ein 'Leading Indicator' blickt in die Zukunft und steuert den Prozess *vor* dem Ende.", "Er hilft, zukünftige Fehler zu vermeiden.", "Maßnahmen WÄHREND der Entwicklung (wie Code-Reviews)."]
        },
        {
            id: "kpi_02", type: "single",
            title: "Unternehmensleitbild",
            text: "Was beantwortet die 'Mission' eines Unternehmens?",
            answer: "Wem nützen wir heute womit? (Gegenwart)",
            options: ["Wo wollen wir in 10 Jahren sein? (Zukunft)", "Wem nützen wir heute womit? (Gegenwart)", "Welchen Gewinn streben wir an?", "Wie arbeiten wir im Team zusammen? (Kultur)"],
            hints: ["Vision = Zukunft. Werte = Kultur.", "Die Mission beschreibt den aktuellen Zweck.", "Die Mission ist im Hier und Jetzt (Gegenwart)."]
        },
        {
            id: "kpi_03", type: "single",
            title: "SMART-Kriterien",
            text: "Was bedeutet das 'A' in der SMART-Methode?",
            answer: "Attraktiv (oder Akzeptiert)",
            options: ["Attraktiv (oder Akzeptiert)", "Analytisch", "Allgemeingültig", "Automatisiert"],
            hints: ["Das Ziel muss motivierend für das Team sein.", "Es soll erstrebenswert klingen.", "Attraktiv."]
        },
        
        // === Datenschutz (DSGVO / BDSG) ===
        {
            id: "ds_01", type: "single",
            title: "Datenschutz-Grundsatz",
            text: "Was bedeutet das 'Verbot mit Erlaubnisvorbehalt' im Datenschutz?",
            answer: "Die Verarbeitung von personenbezogenen Daten ist grundsätzlich verboten, es sei denn, ein Gesetz erlaubt sie explizit.",
            options: ["Datenverarbeitung ist immer erlaubt, außer man verbietet sie.", "Nur die Aufsichtsbehörde darf Ausnahmen genehmigen.", "Die Verarbeitung von personenbezogenen Daten ist grundsätzlich verboten, es sei denn, ein Gesetz erlaubt sie explizit.", "Man darf Daten nur speichern, wenn man sie nicht verändert."],
            hints: ["Es ist wie eine dauerhaft rote Ampel.", "Man darf nur gehen, wenn es explizit erlaubt (grün) wird.", "Grundsätzlich verboten, außer durch Gesetz erlaubt (z.B. Art. 6)."]
        },
        {
            id: "ds_02", type: "single",
            title: "Rechtsgrundlagen",
            text: "Welches ist im Geschäftsbereich die sicherste Rechtsgrundlage für die Datenverarbeitung?",
            answer: "Zur Erfüllung eines Vertrags (Art. 6 Abs. 1 lit. b)",
            options: ["Die Einwilligung des Betroffenen.", "Zur Erfüllung eines Vertrags (Art. 6 Abs. 1 lit. b)", "Berechtigtes Interesse.", "Mündliche Absprache."],
            hints: ["Eine Einwilligung kann jederzeit widerrufen werden, ist also instabil.", "Pacta sunt servanda (Verträge sind einzuhalten).", "Die Vertragserfüllung ist bindend."]
        },
        {
            id: "ds_03", type: "single",
            title: "Auftragsverarbeitung",
            text: "Wann spricht man von einer Auftragsverarbeitung (AV)?",
            answer: "Wenn ein externer Dienstleister weisungsgebunden personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.",
            options: ["Wenn ein Dienstleister eigene Zwecke mit den Daten verfolgt.", "Wenn ein Steuerberater die Buchhaltung macht (Funktionsübertragung).", "Wenn ein externer Dienstleister weisungsgebunden personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.", "Wenn Daten verschlüsselt ins Ausland verkauft werden."],
            hints: ["Der Dienstleister hat keine eigene Entscheidungsgewalt über die Daten.", "Beispiel: Ein Cloud-Hoster.", "Er arbeitet weisungsgebunden 'im Auftrag'."]
        },
        {
            id: "ds_04", type: "single",
            title: "Datenpanne",
            text: "Innerhalb welchen Zeitraums muss eine meldepflichtige Datenpanne der Aufsichtsbehörde gemeldet werden?",
            answer: "Innerhalb von 72 Stunden.",
            options: ["Innerhalb von 24 Stunden.", "Innerhalb von 7 Tagen.", "Innerhalb von 72 Stunden.", "Bis zum Ende des Quartals."],
            hints: ["Es sind genau drei Tage Zeit.", "Auch übers Wochenende muss die Frist beachtet werden.", "72 Stunden."]
        },
        {
            id: "ds_05", type: "single",
            title: "Besondere pbD",
            text: "Welche der folgenden Daten gehören NICHT zu den 'besonderen Kategorien' (Art. 9 DSGVO)?",
            answer: "Bankdaten / IBAN",
            options: ["Gesundheitsdaten", "Religiöse Überzeugungen", "Bankdaten / IBAN", "Biometrische Daten"],
            hints: ["Besondere Kategorien beziehen sich auf höchstpersönliche, oft körperliche/ethische Eigenschaften.", "Geld ist wichtig, aber rechtlich keine 'besondere Kategorie' nach Art. 9.", "Finanz- und Bankdaten."]
        },
        {
            id: "ds_06", type: "single",
            title: "Verzeichnis der Verarbeitungstätigkeiten",
            text: "Wer ist für das Führen des VVT (Verzeichnis der Verarbeitungstätigkeiten) verantwortlich?",
            answer: "Der Verantwortliche (z.B. die Geschäftsführung)",
            options: ["Der Datenschutzbeauftragte (DSB)", "Die Aufsichtsbehörde", "Die IT-Administration", "Der Verantwortliche (z.B. die Geschäftsführung)"],
            hints: ["Der DSB berät und kontrolliert nur.", "Wer trägt die rechtliche Hauptverantwortung (Rechenschaftspflicht)?", "Die oberste Leitung (der Verantwortliche)."]
        },
        {
            id: "ds_07", type: "single",
            title: "Informationelle Selbstbestimmung",
            text: "Was versteht man unter informationeller Selbstbestimmung?",
            answer: "Das Recht des Einzelnen, grundsätzlich selbst über die Preisgabe und Verwendung seiner personenbezogenen Daten zu bestimmen.",
            options: ["Das Recht auf kostenloses Internet.", "Die Pflicht, echte Namen im Netz zu verwenden.", "Das Recht des Einzelnen, grundsätzlich selbst über die Preisgabe und Verwendung seiner personenbezogenen Daten zu bestimmen.", "Das Recht, Passwörter selbst zu wählen."],
            hints: ["Es leitet sich aus dem allgemeinen Persönlichkeitsrecht ab.", "Man entscheidet selbst über seine eigenen Informationen.", "Selbst zu bestimmen, wer was über mich weiß."]
        },

        // === Datensicherheit / Informationssicherheit ===
        {
            id: "sec_01", type: "single",
            title: "Schutzziele CIA",
            text: "Was sind die drei Kern-Schutzziele der Informationssicherheit?",
            answer: "Vertraulichkeit, Integrität, Verfügbarkeit",
            options: ["Transparenz, Minimierung, Löschung", "Vertraulichkeit, Integrität, Verfügbarkeit", "Pseudonymisierung, Verschlüsselung, Authentifizierung", "Geschwindigkeit, Kapazität, Redundanz"],
            hints: ["Im Englischen nennt man es das CIA-Triad.", "C = Confidentiality, I = Integrity, A = Availability.", "Vertraulichkeit, Integrität, Verfügbarkeit."]
        },
        {
            id: "sec_02", type: "single",
            title: "Integrität vs. Vertraulichkeit",
            text: "Was bedeutet das Schutzziel 'Integrität' in der Datensicherheit?",
            answer: "Die Daten sind unversehrt, richtig und wurden nicht unbefugt oder unbeabsichtigt manipuliert.",
            options: ["Die Daten sind für Unbefugte nicht lesbar.", "Die Server laufen rund um die Uhr (99,9%).", "Die Daten sind unversehrt, richtig und wurden nicht unbefugt oder unbeabsichtigt manipuliert.", "Die Daten wurden gelöscht."],
            hints: ["Wenn sich auf dem Konto plötzlich der Betrag ändert, wurde dieses Schutzziel verletzt.", "Es geht um die Unverfälschtheit.", "Manipulation verhindern = Integrität."]
        },
        {
            id: "sec_03", type: "single",
            title: "Zugangskontrolle",
            text: "Welche Maßnahme ist ein typisches Beispiel für 'Zugangskontrolle'?",
            answer: "Passwortabfrage und 2-Faktor-Authentifizierung (2FA) am PC",
            options: ["Ein Zaun um das Firmengelände", "Passwortabfrage und 2-Faktor-Authentifizierung (2FA) am PC", "Ein Berechtigungskonzept für einen bestimmten Ordner", "Eine Alarmanlage"],
            hints: ["Zutritt = Raum/Gebäude. Zugang = IT-System. Zugriff = Datei/Ordner.", "Wie kommt man ins System hinein?", "Der Log-In am PC (Passwort)."]
        },
        {
            id: "sec_04", type: "single",
            title: "Daten löschen",
            text: "Wie vernichtet man digitale Daten (z.B. auf Festplatten) datenschutzkonform?",
            answer: "Durch mehrfaches Überschreiben mit Zufallsdaten oder physikalische Zerstörung.",
            options: ["Durch Verschieben in den Papierkorb.", "Durch einfache Formatierung der Festplatte.", "Durch mehrfaches Überschreiben mit Zufallsdaten oder physikalische Zerstörung.", "Durch Umbenennen der Dateien."],
            hints: ["Formatieren löscht oft nur das Inhaltsverzeichnis, nicht die Daten selbst.", "Daten müssen unwiederbringlich gemacht werden.", "Überschreiben (Wiping) oder Schreddern."]
        },
        {
            id: "sec_05", type: "single",
            title: "KRITIS",
            text: "Wer fällt unter den Begriff KRITIS (Kritische Infrastrukturen)?",
            answer: "Unternehmen von wesentlicher Bedeutung für das Gemeinwesen (z.B. Strom, Wasser, Krankenhäuser).",
            options: ["Jedes IT-Unternehmen.", "Nur staatliche Behörden.", "Unternehmen von wesentlicher Bedeutung für das Gemeinwesen (z.B. Strom, Wasser, Krankenhäuser).", "Jedes Unternehmen mit mehr als 500 Mitarbeitern."],
            hints: ["Ein Ausfall dieser Systeme hätte dramatische Folgen für die Gesellschaft.", "Es geht um Versorgungssicherheit.", "Krankenhäuser, Wasserwerke, Stromversorger."]
        },

        // === MATCHING QUESTIONS ===
        {
            id: "match_wiso_1", type: "match",
            title: "Wirtschaftskreislauf: Geldströme",
            text: "Ordne die Richtungen den korrekten Geldströmen zu.",
            answer: ["Einkommen", "Konsumausgaben", "Sparen", "Transferleistungen", "Subventionen"],
            left: ["Unternehmen → Haushalte", "Haushalte → Unternehmen", "Haushalte → Banken", "Staat → Haushalte", "Staat → Unternehmen"],
            choices: ["Konsumausgaben", "Sparen", "Transferleistungen", "Subventionen", "Einkommen"],
            hints: ["Unternehmen zahlen Haushalten für Arbeit.", "Haushalte kaufen Güter bei Unternehmen.", "Einkommen, Konsumausgaben, Sparen, Transfers, Subventionen."]
        },
        {
            id: "match_wiso_2", type: "match",
            title: "Wirtschaftspolitische Ziele",
            text: "Welche Messgrößen gehören zu den Zielen des 'Magischen Vierecks'?",
            answer: ["Inflationsrate / VPI", "Reales BIP", "Arbeitslosenquote", "Außenhandelssaldo"],
            left: ["Preisstabilität", "Angemessenes Wirtschaftswachstum", "Hoher Beschäftigungsstand", "Außenwirtschaftliches Gleichgewicht"],
            choices: ["Reales BIP", "Arbeitslosenquote", "Außenhandelssaldo", "Inflationsrate / VPI"],
            hints: ["Wachstum = Inlandsprodukt.", "Beschäftigung = Arbeitslose.", "Preisstabilität -> Inflation, Wachstum -> BIP."]
        },
        {
            id: "match_sec_1", type: "match",
            title: "TOMs: Zutritt, Zugang, Zugriff",
            text: "Ordne die Maßnahmen den korrekten Kontrollarten zu.",
            answer: ["Zutrittskontrolle", "Zugangskontrolle", "Zugriffskontrolle"],
            left: ["Schlüsselkarte für das Firmengebäude", "Passwort und 2FA für den Windows-Login", "Ordner-Berechtigungen (Nur Lesen/Schreiben) auf dem Server"],
            choices: ["Zugangskontrolle", "Zugriffskontrolle", "Zutrittskontrolle"],
            hints: ["Zutritt = Physisch.", "Zugang = Ins System hinein.", "Zugriff = Auf Daten innerhalb des Systems."]
        }
    ];


    // Scoped CSS styles using the host app's CSS variables for seamless integration
    const quizStyles = `
        <style>
            #quiz-module-container {
                /* Scoped variables falling back to global theme variables */
                --ok: #03dac6;
                --warn: #cf6679;
                --card-bg: var(--bg-secondary);
                --line-color: var(--border-color);
                
                width: min(900px, 95%);
                margin: 0 auto 40px auto;
                font-family: inherit;
                color: var(--text-normal);
                line-height: 1.45;
            }
            
            #quiz-module-container .header {
                background: linear-gradient(120deg, var(--bg-secondary), var(--bg-tertiary));
                border-bottom: 3px solid var(--accent-color);
                border-radius: 12px;
                padding: 18px 20px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                margin-bottom: 14px;
            }
            
            #quiz-module-container .header h1 {
                margin: 0 0 8px;
                font-size: 1.6rem;
                color: var(--accent-color);
                font-weight: bold;
            }
            
            #quiz-module-container .meta {
                color: var(--text-muted);
                font-size: 0.95rem;
            }
            
            #quiz-module-container .toolbar {
                position: sticky;
                top: 0;
                z-index: 5;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            #quiz-module-container .badge {
                display: inline-block;
                border-radius: 8px;
                padding: 6px 12px;
                font-weight: 700;
                background: var(--accent-color);
                color: #fff;
                font-size: 0.9rem;
            }
            
            #quiz-module-container .q {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 20px;
                margin-top: 16px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #quiz-module-container .q h3 {
                margin: 0 0 8px;
                font-size: 1.1rem;
                color: var(--accent-color);
                font-weight: 600;
            }
            
            #quiz-module-container .q p { margin: 6px 0 15px; font-size: 1.05rem; }
            
            #quiz-module-container .opts {
                display: grid;
                gap: 10px;
            }
            
            #quiz-module-container .opt {
                display: flex;
                align-items: flex-start;
                padding: 12px 15px;
                border-radius: 8px;
                background-color: var(--bg-tertiary);
                color: var(--text-normal);
                cursor: pointer;
                border: 2px solid transparent;
                transition: background-color 0.2s, border-color 0.2s;
            }
            
            #quiz-module-container .opt:hover { 
                background-color: var(--bg-primary); 
                border-color: var(--accent-color); 
            }
            
            #quiz-module-container .opt input { display: none; }
            
            /* High contrast text for result states to ensure readability across themes */
            #quiz-module-container .opt.correct { background-color: var(--ok); color: #000; border-color: var(--ok); }
            #quiz-module-container .opt.incorrect { background-color: var(--warn); color: #000; border-color: var(--warn); }
            
            /* Match Dropdown Styles */
            #quiz-module-container .match-grid { display: grid; gap: 10px; }
            #quiz-module-container .match-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                align-items: center;
                background: var(--bg-tertiary);
                border-radius: 8px;
                padding: 10px 15px;
                border: 1px solid var(--border-color);
            }
            
            #quiz-module-container select {
                width: 100%;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 10px;
                background: var(--bg-primary);
                color: var(--text-normal);
                font-size: 0.95rem;
                outline: none;
            }
            #quiz-module-container select:focus {
                border-color: var(--accent-color);
            }
            
            #quiz-module-container .submit-btn {
                margin-top: 15px;
                background-color: var(--accent-color);
                color: #fff;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                width: 100%;
                font-size: 1rem;
                transition: filter 0.2s;
            }
            #quiz-module-container .submit-btn:hover { filter: brightness(1.2); }
            
            /* Hint Styles */
            #quiz-module-container .hint-container {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px dashed var(--border-color);
            }
            #quiz-module-container .hint-btn {
                background-color: var(--bg-tertiary);
                color: var(--text-normal);
                border: 1px solid var(--border-color);
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            #quiz-module-container .hint-btn:hover { background-color: var(--bg-primary); }
            #quiz-module-container .hint-text {
                margin-top: 10px;
                font-size: 0.95rem;
                color: #ffb74d;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            @media (max-width: 600px) {
                #quiz-module-container .match-row { grid-template-columns: 1fr; }
            }
        </style>
    `;

    const htmlTemplate = `
        ${quizStyles}
        <div id="quiz-module-container">
            <section class="header">
                <h1>Spaced Repetition Quiz</h1>
                <div class="meta">
                    Dein Lern-Algorithmus: Richtig = Ende der Warteschlange. Falsch = Mitte der Warteschlange (kommt schneller wieder).
                </div>
            </section>

            <div class="toolbar">
                <span>Wähle die richtige Antwort.</span>
                <span id="queue-status" class="badge">Fragen: 0</span>
            </div>

            <div id="quiz-content-area">
                <!-- JS rendered questions go here -->
            </div>
        </div>
    `;


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateQueueStatus() {
        const statusEl = document.getElementById('queue-status');
        if (statusEl) {
            statusEl.textContent = `Verbleibend in Queue: ${queue.length}`;
        }
    }


    function renderNextQuestion() {
        const container = document.getElementById('quiz-content-area');
        if (!container) return; // Prevent errors if user navigated away

        container.innerHTML = ""; // clear previous

        if (queue.length === 0) {
            container.innerHTML = `
                <div class="q" style="text-align:center; padding: 40px;">
                    <h2 style="color:var(--ok); font-size:2rem; margin-bottom:10px;">Glückwunsch!</h2>
                    <p>Du hast alle Fragen erfolgreich in deinem Gedächtnis verankert.</p>
                    <button id="quiz-restart-btn" class="submit-btn" style="width: auto; margin-top:20px;">Deck neu starten</button>
                </div>
            `;
            // Attach event listener directly to avoid inline strings
            document.getElementById('quiz-restart-btn').addEventListener('click', startQuizData);
            return;
        }

        currentQuestionIndex = queue[0];
        const q = questionDatabase[currentQuestionIndex];
        clickCounts[q.id] = 0;

        const card = document.createElement("div");
        card.className = "q";
        
        const title = document.createElement("h3");
        title.textContent = q.title;
        card.appendChild(title);

        const text = document.createElement("p");
        text.textContent = q.text;
        card.appendChild(text);

        // Render Single Choice
        if (q.type === "single") {
            const optsContainer = document.createElement("div");
            optsContainer.className = "opts";
            
            const shuffledOptions = [...q.options];
            shuffleArray(shuffledOptions);

            shuffledOptions.forEach((optText) => {
                const label = document.createElement("label");
                label.className = "opt";
                
                const input = document.createElement("input");
                input.type = "radio";
                input.name = q.id;
                input.value = optText;
                
                label.appendChild(input);
                
                const span = document.createElement("span");
                span.textContent = optText;
                label.appendChild(span);
                
                optsContainer.appendChild(label);

                label.addEventListener('click', () => {
                     // Prevent multi-click
                     if(optsContainer.querySelector('.correct') || optsContainer.querySelector('.incorrect')) return;
                     input.checked = true;
                     handleAnswer(q, optText, label, optsContainer);
                });
            });
            card.appendChild(optsContainer);
        } 
        
        // Render Matching Dropdowns
        else if (q.type === "match") {
            const grid = document.createElement("div");
            grid.className = "match-grid";
            
            q.left.forEach((leftText, i) => {
                const row = document.createElement("div");
                row.className = "match-row";
                
                const l = document.createElement("div");
                l.textContent = leftText;
                l.style.fontWeight = "bold";
                
                const s = document.createElement("select");
                
                const empty = document.createElement("option");
                empty.value = "";
                empty.textContent = "-- Zuordnen --";
                s.appendChild(empty);
                
                const shuffledChoices = [...q.choices];
                shuffleArray(shuffledChoices);

                shuffledChoices.forEach((choice) => {
                    const o = document.createElement("option");
                    o.value = choice;
                    o.textContent = choice;
                    s.appendChild(o);
                });
                
                row.appendChild(l);
                row.appendChild(s);
                grid.appendChild(row);
            });
            card.appendChild(grid);

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Antworten prüfen";
            submitBtn.className = "submit-btn";
            submitBtn.onclick = () => handleMatchAnswer(q, grid, submitBtn);
            card.appendChild(submitBtn);
        }


        if (q.hints && q.hints.length > 0) {
            const hintContainer = document.createElement("div");
            hintContainer.className = "hint-container";
            
            const hintBtn = document.createElement("button");
            hintBtn.textContent = "💡 Hint anzeigen";
            hintBtn.className = "hint-btn";
            
            const hintText = document.createElement("div");
            hintText.className = "hint-text";

            hintBtn.onclick = () => {
                clickCounts[q.id]++;
                const count = clickCounts[q.id];
                
                if (count <= q.hints.length) {
                    const newHint = document.createElement('span');
                    newHint.innerHTML = `<strong>Tipp ${count}:</strong> ${q.hints[count-1]}`;
                    hintText.appendChild(newHint);
                }
                
                if (count >= q.hints.length) {
                    hintBtn.style.display = 'none';
                } else {
                    hintBtn.textContent = `💡 Weiterer Hint (${q.hints.length - count} übrig)`;
                }
            };

            hintContainer.appendChild(hintBtn);
            hintContainer.appendChild(hintText);
            card.appendChild(hintContainer);
        }

        container.appendChild(card);
    }


    function handleAnswer(q, selectedAnswer, labelElement, optsContainer) {
        const isCorrect = selectedAnswer === q.answer;
        
        if (isCorrect) {
            labelElement.classList.add('correct');
        } else {
            labelElement.classList.add('incorrect');
            const allLabels = optsContainer.querySelectorAll('.opt');
            allLabels.forEach(l => {
                if (l.querySelector('span').textContent === q.answer) {
                    l.classList.add('correct');
                }
            });
        }
        processSpacedRepetition(isCorrect);
    }

    function handleMatchAnswer(q, gridElement, submitBtn) {
        let allCorrect = true;
        const selects = gridElement.querySelectorAll('select');
        
        selects.forEach((select, index) => {
            const selectedValue = select.value;
            const correctAnswer = q.answer[index];
            
            if (selectedValue === correctAnswer) {
                select.style.borderColor = "var(--ok)";
                select.style.color = "var(--ok)";
            } else {
                select.style.borderColor = "var(--warn)";
                select.style.color = "var(--warn)";
                allCorrect = false;
            }
            select.disabled = true; 
        });

        submitBtn.style.display = 'none';
        processSpacedRepetition(allCorrect);
    }

    function processSpacedRepetition(isCorrect) {
        const currentQIndex = queue.shift();

        if (isCorrect) {
            // Push correct to back
            queue.push(currentQIndex);
        } else {
            // Incorrect: place back into the middle to review sooner
            const insertIndex = Math.max(1, Math.floor(queue.length / 2));
            queue.splice(insertIndex, 0, currentQIndex);
        }

        updateQueueStatus();
        setTimeout(() => renderNextQuestion(), 2000); 
    }


    function startQuizData() {
        // Create initial queue of indices and shuffle
        queue = questionDatabase.map((_, i) => i);
        shuffleArray(queue);
        clickCounts = {};
        updateQueueStatus();
        renderNextQuestion();
    }

    function initModule() {
        // Render into host canvas
        window.AppAPI.canvas.setContent(htmlTemplate);
        // Start logic
        startQuizData();
    }

    if (window.AppAPI && window.AppAPI.sidebar) {
        window.AppAPI.sidebar.addEntry(
            'quiz-module',
            'Spaced Repetition',
            'fa-solid fa-graduation-cap', 
            () => initModule()
        );
    } else {
        console.warn("AppAPI not found. Cannot register quiz module.");
    }
})();