export const questionDatabase = [
    // ==========================================
    // ProbeWiSo001.html (20 Fragen)
    // ==========================================
    {
        id: "wiso_01", type: "single",
        title: "Besonderer Kündigungsschutz",
        text: "Welche Personengruppe erhält keinen besonderen Kündigungsschutz?",
        answer: 4,
        options: ["Schwerbehinderte", "Werdende Mütter", "Angehörige des Betriebsrats", "Auszubildende nach der Probezeit", "Leitende Angestellte"]
    },
    {
        id: "wiso_02", type: "single",
        title: "Individualarbeitsrecht",
        text: "Welche Regelung gehört nicht zum kollektiven Arbeitsrecht, sondern zum Individualarbeitsrecht?",
        answer: 2,
        options: ["Betriebliche Überstundenregelungen", "Unfallverhütungsvorschriften", "Übertarifliche Gehaltsvereinbarungen", "Urlaubsregelungen nach dem Bundesurlaubsgesetz", "Betriebsvereinbarungen"]
    },
    {
        id: "wiso_03", type: "single",
        title: "Ausbildungsvertrag",
        text: "Welche Aussage ist falsch bzw. nicht zulässig?",
        answer: 1,
        options: ["Die Probezeit beträgt mindestens einen und höchstens vier Monate.", "Die Ausbildungsvergütung ist während der gesamten Ausbildung gleich hoch.", "Bei Minderjährigen ist die Unterschrift der Erziehungsberechtigten erforderlich.", "Die Anzahl der Urlaubstage ist abhängig vom Alter des Auszubildenden.", "Der Ausbildungsvertrag ist zwingend schriftlich zu erstellen."]
    },
    {
        id: "wiso_04", type: "single",
        title: "Gewinnverteilung einer OHG",
        text: "Wie hoch ist der Gewinnanteil von Gesellschafter C?",
        context: "Die IT-Service OHG erzielt 24.000 € Gewinn. Kapitalanteile: A = 60.000 €, B = 40.000 €, C = 100.000 €, D = 76.000 €. Für diese Übungsaufgabe gilt ausdrücklich: zuerst 4 % auf die Kapitalanteile, anschließend Verteilung des Restgewinns zu gleichen Teilen.",
        answer: 0,
        options: ["7.240 €", "7.640 €", "6.840 €", "7.160 €"]
    },
    {
        id: "wiso_05", type: "match",
        title: "Kündigungsarten",
        text: "Ordnen Sie die passende Kündigungsart zu.",
        answer: ["Verhaltensbedingte Kündigung", "Betriebsbedingte Kündigung", "Personenbedingte Kündigung"],
        left: ["Wiederholtes Zuspätkommen eines Mitarbeiters", "Schließung der IT-Abteilung und Auslagerung der Aufgaben", "Eine Pflegekraft kann wegen eines chronischen Rückenleidens ihre Aufgaben nicht mehr erfüllen"],
        choices: ["Personenbedingte Kündigung", "Betriebsbedingte Kündigung", "Verhaltensbedingte Kündigung"]
    },
    {
        id: "wiso_06", type: "multi",
        title: "Mitbestimmung des Betriebsrats",
        text: "In welchen zwei Fällen hat der Betriebsrat ein Mitbestimmungsrecht?",
        answer: [3, 4],
        options: ["Ein neuer Geschäftsführer wird ernannt.", "Eine zusätzliche Filiale wird eröffnet.", "Der Personalbedarf für das kommende Jahr wird ermittelt.", "Jährliche Betriebsferien werden eingeführt.", "Ein neues Kassensystem misst auch die Arbeitsgeschwindigkeit der Kassiererinnen und Kassierer."]
    },
    {
        id: "wiso_07", type: "match",
        title: "Bedürfnis, Bedarf und Nachfrage",
        text: "Vervollständigen Sie den Lückentext.",
        answer: ["Nachfrage", "Bedarf", "Bedürfnis"],
        left: ["Ein Markt entsteht, wo ein Verbraucher mit _____ auf ein Angebot trifft.", "Der Verbraucher setzt seine finanziellen Mittel ein. Es entsteht also _____.", "Ohne ausreichendes Geld hat er lediglich ein _____."],
        choices: ["Bedürfnis", "Nachfrage", "Bedarf"]
    },
    {
        id: "wiso_08", type: "match",
        title: "Geldströme im Wirtschaftskreislauf",
        text: "Ordnen Sie jeder Ziffer der Grafik den passenden Geldstrom zu.",
        answer: ["Einkommen", "Konsumausgaben", "Sparen", "Transferleistungen", "Subventionen", "Importausgaben"],
        left: ["Geldstrom 1", "Geldstrom 2", "Geldstrom 3", "Geldstrom 4", "Geldstrom 5", "Geldstrom 6"],
        choices: ["Subventionen", "Sparen", "Einkommen", "Importausgaben", "Transferleistungen", "Konsumausgaben"]
    },
    {
        id: "wiso_09", type: "single",
        title: "Grundkapital einer AG",
        text: "Wie hoch muss das Grundkapital einer AG mindestens sein?",
        answer: 1,
        options: ["25.000 €", "50.000 €", "1 €", "100.000 €"]
    },
    {
        id: "wiso_10", type: "single",
        title: "Angebot und Gleichgewichtspreis",
        text: "Wie verändert sich auf einem vollkommenen Markt der Gleichgewichtspreis, wenn das Angebot bei gleichbleibender Nachfrage steigt?",
        answer: 1,
        options: ["Er steigt.", "Er sinkt.", "Er bleibt gleich.", "Keine Antwort ist richtig."]
    },
    {
        id: "wiso_11", type: "match",
        title: "Betriebliche Produktionsfaktoren",
        text: "Ordnen Sie die Beispiele aus der Stuhlproduktion den Produktionsfaktoren zu.",
        answer: ["Arbeit", "Betriebsmittel", "Werkstoffe (Betriebsstoffe)", "Werkstoffe (Rohstoffe)"],
        left: ["Mitarbeiter der Produktion", "Produktionsanlage", "Energie", "Holz"],
        choices: ["Werkstoffe (Rohstoffe)", "Betriebsmittel", "Arbeit", "Werkstoffe (Betriebsstoffe)"]
    },
    {
        id: "wiso_12", type: "multi",
        title: "Personengesellschaften",
        text: "Identifizieren Sie die beiden Personengesellschaften.",
        answer: [1, 3],
        options: ["GmbH", "GmbH & Co. KG", "Jan Küster EDV-Systeme (Einzelunternehmen)", "OHG", "Jan Küster AG"]
    },
    {
        id: "wiso_13", type: "multi",
        title: "Aussagen zu Wirtschaft und Recht",
        text: "Was ist falsch? Bitte auswählen.",
        answer: [0, 3, 5, 10, 11, 13],
        options: ["Subventionen sind indirekte Steuern der Unternehmen an den Staat.", "Transferleistungen werden vom Staat an die Haushalte gewährt.", "Ausbilder dürfen in der Regel nur im eigenen Beruf ausbilden.", "Ohne einen Betriebsrat ist die Gründung einer JAV nicht möglich.", "Wenn sich die Nachfrage vermindert, sinkt bei gleichem Angebot der Preis.", "Ein Rechtsanwalt ist eine juristische Person.", "Lediglich rechtlich vorteilhafte Rechtsgeschäfte können auch beschränkt Geschäftsfähige eingehen.", "Rechtsgeschäfte unterliegen dem Grundsatz der Vertragsfreiheit.", "Schein- und Scherzgeschäfte sind nichtig.", "Nur ein Kaufmann bzw. eine Kauffrau kann nach HGB Prokura erteilen.", "Ein Kaufmann haftet immer mit dem Privatvermögen.", "Kaufleute und Freiberufler sind zur Mitgliedschaft in der IHK verpflichtet.", "Verträge, die gegen gesetzliche Formvorschriften verstoßen, sind von vornherein ungültig.", "Das Handelsregister wird von der IHK geführt."]
    },
    {
        id: "wiso_14", type: "match",
        title: "Konjunkturverlauf",
        text: "Ordnen Sie die Ziffern der Grafik den Begriffen zu.",
        answer: ["Depression", "Aufschwung", "Hochkonjunktur", "Rezession", "Trend"],
        left: ["Ziffer 1", "Ziffer 2", "Ziffer 3", "Ziffer 4", "Ziffer 5"],
        choices: ["Rezession", "Trend", "Aufschwung", "Depression", "Hochkonjunktur"]
    },
    {
        id: "wiso_15", type: "single",
        title: "Unterschrift eines Prokuristen",
        text: "Herr Meister ist Prokurist der Compu AG. Wie muss er unterschreiben?",
        answer: 0,
        options: ["Compu AG / ppa. Michael Meister", "Compu AG / i.V. Michael Meister", "Compu AG / i.A. Michael Meister", "Compu AG / Michael Meister"]
    },
    {
        id: "wiso_16", type: "multi",
        title: "Haftung bei Gesellschaften",
        text: "Kreuzen Sie die richtigen Aussagen an.",
        answer: [1, 2, 4],
        options: ["Die Komplementäre einer KG haften nur mit ihrer Einlage.", "Die OHG-Gesellschafter haften mit ihrem Privatvermögen.", "Die Aktionäre einer AG haften nicht mit ihrem Privatvermögen.", "Die Geschäftsführer einer GmbH haften mit ihrem Privatvermögen.", "Die Kommanditisten einer KG haften nicht mit ihrem Privatvermögen."]
    },
    {
        id: "wiso_17", type: "multi",
        title: "Senkung der Einkommensteuer",
        text: "Welche zwei möglichen Auswirkungen hat eine Senkung der Einkommensteuer auf die Geldströme?",
        answer: [1, 4],
        options: ["Konsum sinkt.", "Konsum steigt.", "Transferleistungen steigen.", "Staatsausgaben steigen.", "Spareinlagen steigen."]
    },
    {
        id: "wiso_18", type: "single",
        title: "Wirtschaftswachstum",
        text: "An welchem Indikator wird das Wirtschaftswachstum gemessen?",
        answer: 2,
        options: ["Kreditaufnahme des Staates", "Investitionen", "Bruttoinlandsprodukt", "Arbeitslosigkeit"]
    },
    {
        id: "wiso_19", type: "single",
        title: "Tarifvertragsparteien",
        text: "Wer kann auf Seiten der Arbeitnehmer Tarifvertragspartei sein?",
        answer: 0,
        options: ["Gewerkschaften", "Betriebsrat", "Arbeitgeberverbände", "Einzelne Arbeitgeber"]
    },
    {
        id: "wiso_20", type: "match",
        title: "Wirtschaftspolitische Ziele",
        text: "Ordnen Sie den wirtschaftspolitischen Zielen die passenden Kennzahlen zu.",
        answer: ["Lebenshaltungskostenindex", "Außenhandelsüberschuss/-defizit", "Reales Bruttoinlandsprodukt", "Arbeitslosenquote"],
        left: ["Preisstabilität", "Außenhandelsgleichgewicht", "Wirtschaftswachstum", "Hoher Beschäftigungsgrad"],
        choices: ["Arbeitslosenquote", "Reales Bruttoinlandsprodukt", "Lebenshaltungskostenindex", "Außenhandelsüberschuss/-defizit"]
    },

    // ==========================================
    // Übungen zum Kapitel 1 (17 Fragen)
    // ==========================================
    {
        id: "ds_k1_01", type: "single",
        title: "Informationelle Selbstbestimmung",
        text: "Was versteht man unter dem Begriff 'informationelle Selbstbestimmung'?",
        answer: 4,
        options: [
            "Ich bestimme selbst darüber was ich als Beruf lerne.",
            "Ich bestimme selbst darüber, welche Medien ich zur eigenen Information nutze.",
            "Ich bestimme selbst darüber, welche Informationen ich über mich veröffentliche und welche nicht.",
            "Ich bestimme selbst darüber, wann ich das Internet nutze und was ich dort tue.",
            "Ich bestimme selbst darüber, wer meine personenbezogenen Daten, zu welchem Zweck, verwenden darf."
        ]
    },
    {
        id: "ds_k1_02", type: "single",
        title: "Kritik an sozialen Medien",
        text: "Was wird bei sozialen Medien, bezogen auf den Datenschutz oft kritisiert?",
        answer: 3,
        options: [
            "Dass man sich anmelden muss und nicht anonym sein darf.",
            "Dass man nicht nur netten Menschen begegnet.",
            "Dass man mit zu vielen Informationen überschwemmt wird.",
            "Das die persönlichen Daten oft zu Werbezwecken genutzt und weitergegeben werden.",
            "Dass sie abhängig machen."
        ]
    },
    {
        id: "ds_k1_03", type: "open",
        title: "Aufsichtsbehörde",
        text: "Welche Aufsichtsbehörde ist für dich zuständig? Besuche deren Website und stöbere nach Vordrucken oder Vorlagen, die für deine Arbeit wichtig sein können.",
        answer: "Individuelle Rechercheaufgabe.",
        options: ["Individuelle Rechercheaufgabe."]
    },
    {
        id: "ds_k1_04", type: "single",
        title: "Datenschutz und Datensicherheit",
        text: "Was bedeutet Datenschutz und Datensicherheit?",
        answer: 3,
        options: [
            "Datenschutz ist der Schutz aller Daten vor Manipulation, Verlust oder unberechtigter Kenntnisnahme.",
            "Datensicherheit gewährleistet, dass alle persönlichen Daten jederzeit für jeden abrufbar sind.",
            "Datenschutz stellt sicher das alle elektronischen Daten eines Unternehmens in einer Cloud gespeichert werden",
            "Datenschutz ist ein verfassungsrechtlich geschütztes Recht auf informationelle Selbstbestimmung. Datensicherheit ist der Schutz aller Daten vor Manipulation, Verlust oder unberechtigter Kenntnisnahme."
        ]
    },
    {
        id: "ds_k1_05", type: "open",
        title: "Besondere personenbezogene Daten",
        text: "Nenne 3 Beispiele von besonderen personenbezogenen Daten, die in einem Arbeitsverhältnis verarbeitet werden könnten",
        answer: "Beispiele: Religionszugehörigkeit, Gesundheitsdaten, Biometrische Daten, Gewerkschaftszugehörigkeit.",
        options: ["Beispiele: Religionszugehörigkeit, Gesundheitsdaten, Biometrische Daten, Gewerkschaftszugehörigkeit."]
    },
    {
        id: "ds_k1_06", type: "multi",
        title: "Verarbeitungen nach Art. 4 DSGVO",
        text: "Welche der folgenden Punkte gehören zu den Verarbeitungen nach Art. 4 DSGVO?",
        answer: [0, 1, 2, 3, 4, 7],
        options: ["Einschränken", "Löschen", "Abgleichen", "Ordnen", "Erfassen", "Terminieren", "Entwerfen", "Speichern"]
    },
    {
        id: "ds_k1_07", type: "single",
        title: "Zusammenhang DSGVO und BDSG",
        text: "Welchen Zusammenhang gibt es zwischen der DSGVO und dem BDSG?",
        answer: 2,
        options: [
            "Unternehmen dürfen sich aussuchen, ob sie das BDSG oder die DSGVO anwenden.",
            "Die DSGVO war nur ein Versuch der EU, der gescheitert ist, weshalb das BDSG als nationales Gesetz angewendet wird.",
            "Die DSGVO ist ein Gesetz auf europäischer Ebene, welches durch das BDSG konkretisiert wurde. Beide Gesetze sind von Unternehmen und Organisationen zu berücksichtigen."
        ]
    },
    {
        id: "ds_k1_08", type: "open",
        title: "Personenbezogene Daten",
        text: "Nenne 10 Beispiele von personenbezogenen Daten, die ein Arbeitgeber von dir erheben könnte.",
        answer: "Beispiele: Name, Adresse, Geburtsdatum, Bankverbindung, Konfession, Steuer-ID, Sozialversicherungsnummer, Telefonnummer, E-Mail, Qualifikationen.",
        options: ["Beispiele: Name, Adresse, Geburtsdatum, Bankverbindung, Konfession, Steuer-ID, Sozialversicherungsnummer, Telefonnummer, E-Mail, Qualifikationen."]
    },
    {
        id: "ds_k1_09", type: "single",
        title: "Teil- oder automatisierte Verarbeitung",
        text: "Was ist eine teil- oder automatisierte Verarbeitung?",
        answer: 1,
        options: [
            "Wenn neuartige Systeme, wie z. B. eine KI zur Recherche genutzt werden, ohne dass dabei personenbezogene Daten eingegeben werden",
            "Die Verarbeitung personenbezogener Daten mit Hilfe technischer Unterstützung, wie z. B. Computer, Smartphones, Maschinen, etc.",
            "Eine Verarbeitung die ohne technische Hilfsmittel durchgeführt wird."
        ]
    },
    {
        id: "ds_k1_10", type: "multi",
        title: "Anwendungsbereich DSGVO",
        text: "Wer fällt in den Anwendungsbereich der DSGVO, wenn die genannten Stellen personenbezogene Daten verarbeiten?",
        answer: [1, 2, 3, 4],
        options: [
            "Sängerin Silvia, die in ihrem privaten Smartphone die Telefonnummer ihrer Kollegin verwaltet.",
            "Der Schachverein 'King Chess' aus Dänemark.",
            "Der selbstständige Influencer aus Köln, der Produkte testet und Videos im Internet zur Verfügung stellt.",
            "Die Firma 'Samurai' aus Japan, die ihre Produkte weltweit vertreibt?",
            "Der Betriebsarzt aus München des Konzerns 'CrashCars AG' aus Nürnberg"
        ]
    },
    {
        id: "ds_k1_11", type: "multi",
        title: "Anwendungsbereich BDSG",
        text: "Wer fällt in den Anwendungsbereich des BDSG, wenn die genannten Stellen personenbezogene Daten verarbeiten?",
        answer: [0, 1, 2, 4],
        options: [
            "Die Gemeindeverwaltung der Stadt Frankfurt Oder.",
            "Der Schachverein 'Räuber-Schach' aus Düsseldorf.",
            "Der selbstständige Influencer aus Köln, der Produkte testet und Videos im Internet zur Verfügung stellt.",
            "Die Firma 'Samurai' aus Japan, die ihre Produkte in Dänemark vertreibt?",
            "Der Betriebsarzt aus München des Konzerns 'CrashCars AG'"
        ]
    },
    {
        id: "ds_k1_12", type: "multi",
        title: "Beschäftigte im Sinne BDSG",
        text: "§ 26 BDSG gilt für die Verarbeitung von Beschäftigten. Was sind Beschäftigte im Sinne BDSG und DSGVO?",
        answer: [0, 3, 4, 5],
        options: ["Arbeitnehmer", "Vorstandsmitglieder", "Ehrenamtliche (Verein / Verband)", "Auszubildende", "Leiharbeiter", "Bewerber", "Bereits ausgeschiedene Beschäftigte"]
    },
    {
        id: "ds_k1_13", type: "single",
        title: "Datenschutz vs. Datensicherheit",
        text: "Welche der folgenden Aussagen ist falsch?",
        answer: 2,
        options: [
            "Die DSGVO beschäftigt sich überwiegend mit Datenschutz, enthält aber auch Vorschriften zur Datensicherheit.",
            "Beim Datenschutz geht es um die Grundrechte und Grundfreiheiten von natürlichen Personen.",
            "Datensicherheit beschäftigt sich überwiegend mit dem Schutz von Geschäftsgeheimnissen.",
            "Die Schnittmenge von Datenschutz und Datensicherheit sind die sogenannten technisch organisatorischen Maßnahmen (TOM)."
        ]
    },
    {
        id: "ds_k1_14", type: "multi",
        title: "Gesetzliche Grundlagen",
        text: "Welche beiden Aussagen zu den gesetzlichen Grundlagen des Datenschutzes sind korrekt?",
        answer: [1, 2],
        options: [
            "Die DSGVO gilt ausschließlich für Unternehmen, nicht für die öffentlichen Stellen des Bundes.",
            "Die DSGVO gilt als europäisches Recht in jedem Mitgliedsland der EU. Die nationalen Parlamente (in Deutschland der Bundestag) mussten der DSGVO nicht zustimmen.",
            "In Deutschland enthalten neben dem BDSG und der DSGVO noch zahlreiche weitere Gesetze Vorschriften zum Datenschutz.",
            "Das Bundesdatenschutzgesetz gilt ausschließlich für öffentliche Stellen."
        ]
    },
    {
        id: "ds_k1_15", type: "single",
        title: "Online-Shop im EWR",
        text: "Ein kanadischer Konzern möchte seine Produkte online in Ländern des EWR anbieten. Welche Aussage in Bezug auf den Datenschutz ist richtig?",
        answer: 2,
        options: [
            "Die Regeln der DSGVO müssen nicht beachtet werden, da der Sitz des Unternehmens in Kanada liegt und der Online-Shop über Südafrika läuft.",
            "Da der Konzern seinen Sitz in Kanada hat, müssen die kanadischen Datenschutzgesetze beachtet werden, die DSGVO muss daher nicht einbezogen werden.",
            "Da der Onlineshop sich an Kunden (betroffene Personen) in Europa richtet, müssen alle Vorgaben der DSGVO beachtet werden."
        ]
    },
    {
        id: "ds_k1_16", type: "single",
        title: "Personenbezogene Daten",
        text: "Was sind personenbezogene Daten?",
        answer: 3,
        options: [
            "Nur Daten, die eine identifizierte Person bezeichnen.",
            "Ausschließlich Namen, Adresse und Kontaktdaten, da diese Daten die Person direkt bezeichnen.",
            "Alle Daten, die ständig verfügbar sein müssen und eine natürliche Person betreffen.",
            "Alle Daten, von denen man direkt oder indirekt eine natürliche Person ermitteln kann."
        ]
    },
    {
        id: "ds_k1_17", type: "single",
        title: "Verantwortlichkeit",
        text: "Wer ist bei einer verantwortlichen Stelle immer für die Einhaltung der Datenschutzvorschriften verantwortlich?",
        answer: 2,
        options: ["Der Datenschutzbeauftragte", "Der Abteilungsleiter, in dessen Abteilung die Daten verarbeitet werden", "Die oberste Leitungsebene"]
    },

    // ==========================================
    // Übungen zum Kapitel 2 (37 Fragen)
    // ==========================================
    {
        id: "ds_k2_01", type: "multi",
        title: "Betroffene Person",
        text: "Welche zwei Aussagen definieren eine betroffene Person?",
        answer: [1, 2],
        options: [
            "Die Nationalität",
            "Eine identifizierte oder identifizierbare natürliche Person",
            "Einen Beschäftigten der indirekt bestimmbar ist.",
            "Eine identifizierte oder identifizierbare juristische Person",
            "Eine durch eine Rechtsverletzung benachteiligte anonyme Person"
        ]
    },
    {
        id: "ds_k2_02", type: "multi",
        title: "Grundsätze gem. DSGVO",
        text: "Welche Grundsätze gem. DSGVO gelten für die Verarbeitung von personenbezogener Daten?",
        answer: [0, 1, 3, 4, 5],
        options: ["Transparenz", "Zweckbindung", "Kopplungsverbot", "Datenminimierung", "Speicherbegrenzung", "Rechenschaftspflicht", "Informationelle Selbstbestimmung", "Freiwilligkeit des Betroffenen"]
    },
    {
        id: "ds_k2_03", type: "multi",
        title: "Prinzip der Datenminimierung",
        text: "Wie kannst du das Prinzip der Datenminimierung erfüllen?",
        answer: [0, 2, 3],
        options: ["So wenig Daten wie möglich erheben", "Der vorgegebene Speicherplatz für die Daten sollte nicht überschritten werden", "Nur die Daten erheben, die für die Erfüllung des Zweckes erforderlich sind", "Doppelte Datenerhebung sollte vermieden werden", "Alle Daten sollten nur noch abgekürzt gespeichert werden"]
    },
    {
        id: "ds_k2_04", type: "single",
        title: "Verbot mit Erlaubnisvorbehalt",
        text: "Was versteht man unter dem juristischen Begriff 'Verbot mit Erlaubnisvorbehalt'?",
        answer: 0,
        options: [
            "Die Verarbeitung von pbD ist grundsätzlich verboten. Die Gesetze der DSGVO und des BDSG machen von dieser Regel ein paar Ausnahmen, die als Erlaubnistatbestände aufgezählt werden.",
            "Damit ist gemeint, dass es verboten ist, gegen den Datenschutz zu verstoßen. Nur die Aufsichtsbehörde darf eine Genehmigung zur Datenverarbeitung von pbD erteilen.",
            "Die Verarbeitung von nicht-öffentlichen Stellen wird damit eingeschränkt. Juristische Personen sind davon ausgeschlossen.",
            "Die Erlaubnistatbestände sind im Art.6 der DSGVO aufgeführt. Wenn keiner dieser Tatbestände anwendbar ist, dann darf ich personenbezogene Daten nicht verarbeiten."
        ]
    },
    {
        id: "ds_k2_05", type: "multi",
        title: "Bedingungen einer Einwilligung",
        text: "Was sind die Bedingungen einer rechtskonformen Einwilligung nach der DSGVO?",
        answer: [0, 1, 3],
        options: ["Zweck der Verarbeitung muss angegeben sein", "Nachweisbarkeit sollte gegeben sein", "Nennung des Speicherortes", "Widerrufsrecht muss eingeräumt sein", "Übersichtlicher Text, max. 1 Din A4 Seite"]
    },
    {
        id: "ds_k2_06", type: "single",
        title: "Double-Opt-In",
        text: "Was bedeutet in dem Zusammenhang das Double-Opt-In Verfahren?",
        answer: 3,
        options: [
            "Der User muss sowohl über den Zweck als auch die Rechtsgrundlage der Erhebung der Daten informiert werden.",
            "Der User muss schriftlich und elektronisch in die Verarbeitung seiner Daten einwilligen.",
            "Die Daten müssen an zwei Orten gespeichert sein, um bei einem Datenverlust immer auf eine Kopie zurückgreifen zu können.",
            "Der User muss eine elektronische Einwilligung nochmals per E-Mail bestätigen, z. B. durch Anklicken eines Links."
        ]
    },
    {
        id: "ds_k2_07", type: "multi",
        title: "Einwilligung von Kindern",
        text: "Was ist bei der Einwilligung von Kindern, im Sinne des Art. 8 DSGVO zu beachten?",
        answer: [0, 1],
        options: [
            "Kinder ab 16 Jahren dürfen selbst einwilligen, wenn sie einen Dienst der Informationsgesellschaft nutzen, der sich direkt an Kinder und Jugendliche wendet.",
            "Kinder unter 16 Jahren benötigen die Einwilligung oder Zustimmung der Erziehungsberechtigten.",
            "Eine rechtswirksame Einwilligung kann nur ab dem 18 Lebensjahr abgegeben werden.",
            "Die Einwilligung von Kindern muss mit Grafiken verständlich gemacht werden und darf keinen Text enthalten.",
            "Die Einwilligung von Kindern muss mit einem Double-Opt-In Verfahren verifiziert werden."
        ]
    },
    {
        id: "ds_k2_08", type: "multi",
        title: "Unabdingbare Rechte",
        text: "Welche Rechte gehören zu den unabdingbaren Rechten der Betroffenen?",
        answer: [0, 1, 2, 4, 5],
        options: ["Recht auf Einschränkung/Sperrung", "Recht auf Auskunft", "Recht auf Berichtigung", "Recht auf Treu und Glaube", "Recht auf Löschung", "Recht auf Beschwerde", "Recht auf Datenminimierung"]
    },
    {
        id: "ds_k2_09", type: "single",
        title: "Recht auf Auskunft bei Nicht-Vorliegen von Daten",
        text: "Du erhältst einen Anruf eines vermeintlichen Kunden, der sein Recht auf Auskunft wahrnehmen möchte. Deiner Firma liegen allerdings keine Daten dieser Person vor. Muss der Verantwortliche auf diese Anfrage reagieren?",
        answer: 3,
        options: [
            "Nein, der Verantwortliche muss nicht reagieren, da keine Verarbeitung stattgefunden hat",
            "Der Verantwortliche muss dem Recht auf Auskunft nur folgen, wenn sein Unternehmen besondere personenbezogene Daten verarbeiten würde.",
            "Ja, da die betroffene Person zunächst das Recht hätte zu erfahren, ob persönliche Daten verarbeitet wurden.",
            "Vor einer solchen Auskunft (auch bei Negativauskunft), muss zunächst die Identität geprüft werden."
        ]
    },
    {
        id: "ds_k2_10", type: "single",
        title: "Recht auf Widerspruch",
        text: "Was ist mit dem Recht auf Widerspruch gemeint?",
        answer: 1,
        options: [
            "Widerspruch gegen die erteilte Einwilligung",
            "Widerspruch gegen die Datenverarbeitung",
            "Widerspruch gegen die nicht erfolgte Löschen wegen anderer Aufbewahrungspflichten des Unternehmens",
            "Widerspruch gilt nur in Bezug auf die Verarbeitung der personenbezogenen Daten, eine erteilte Einwilligung wird widerrufen nicht widersprochen"
        ]
    },
    {
        id: "ds_k2_11", type: "multi",
        title: "Daten löschen",
        text: "Unter welchen Voraussetzungen muss der Verantwortliche personenbezogene Daten unverzüglich löschen?",
        answer: [0, 2, 3, 4],
        options: [
            "Wenn der Betroffene seine Einwilligung widerrufen hat",
            "Wenn der DSB es verlangt",
            "Wenn der Betroffene der Verarbeitung seiner personenbezogenen Daten rechtsgültig widerspricht.",
            "Wenn der Zweck der Datenverarbeitung erfüllt ist.",
            "Wenn keine Rechtsgrundlage der DSGVO oder des BDSG zur Verarbeitung der Daten vorliegt.",
            "Nachdem ein Betroffener von seinem Auskunftsrecht Gebrauch gemacht hat."
        ]
    },
    {
        id: "ds_k2_12", type: "multi",
        title: "Informationspflichten",
        text: "Über welche Inhalte müssen Betroffene zum Zeitpunkt einer Datenerhebung grundsätzlich informiert werden?",
        answer: [0, 1, 2, 3, 4, 5],
        options: [
            "Die Rechtsgrundlage(n) für die Verarbeitung",
            "Name und Kontaktdaten des DSB (wenn vorhanden)",
            "Name und Kontaktdaten der verarbeitenden Stelle / des Verantwortlichen",
            "Name und Kontaktdaten der zuständigen Aufsichtsbehörde",
            "Zweck der Datenerhebung und Dauer der Speicherung",
            "Geplante Übermittlung in Drittländer",
            "Die wichtigsten Begriffsbestimmungen zum Datenschutz"
        ]
    },
    {
        id: "ds_k2_13", type: "multi",
        title: "Datenschutzverletzung",
        text: "Welche Schritte sind zu ergreifen bei einer Datenschutzverletzung?",
        answer: [1, 3, 4],
        options: [
            "Der DSB muss sofort informiert werden",
            "Im Falle eines Risikos für die Rechte und Freiheiten von Betroffenen, muss die Datenpanne der Aufsichtsbehörde gemeldet werden (durch den Verantwortlichen)",
            "In jedem Fall müssen die Betroffenen über die Datenschutzverletzung und deren mögliche Folgen informiert werden",
            "Nur bei einem hohen Risiko für die Rechte und Freiheiten von Betroffenen müssen diese über die Datenschutzverletzung und deren mögliche Folgen informiert werden",
            "Die Datenpanne muss dokumentiert werden"
        ]
    },
    {
        id: "ds_k2_14", type: "multi",
        title: "Beispiele für Datenpanne",
        text: "Welche der folgenden Vorfälle stellt eine Datenpanne gem. DSGVO dar?",
        answer: [1, 2, 4],
        options: [
            "Der PC-Arbeitsplatz in der Personalabteilung hat keine automatische Bildschirmsperre",
            "Verlust eines unverschlüsselten USB-Sticks mit personenbezogenen Daten",
            "Einbruch im Unternehmen und Diebstahl des Servers",
            "Das Verzeichnis der Verarbeitungstätigkeiten ist nicht vollständig und muss aktualisiert werden",
            "Ein Sachbearbeiter der Buchhaltungsabteilung hat versehentlich zwei Gehaltsmitteilungen vertauscht"
        ]
    },
    {
        id: "ds_k2_15", type: "multi",
        title: "Inhalte Meldung Datenpanne",
        text: "Welche Informationen muss die Meldung einer Datenschutzverletzung an die Aufsichtsbehörde mindestens enthalten?",
        answer: [0, 1, 2, 3],
        options: ["Name und Kontaktdaten des DSB", "Beschreibung der Datenschutzverletzung", "Beschreibung der wahrscheinlichen Folgen", "Kategorie und ungefähre Anzahl der Datensätze", "Name und Kontaktdaten der Betroffenen"]
    },
    {
        id: "ds_k2_16", type: "multi",
        title: "Drittlandübermittlung",
        text: "Die Übermittlung von Daten in Drittländer ist nach der DSGVO zulässig, wenn...",
        answer: [0, 1, 4],
        options: [
            "die betroffene Person in die Übermittlung gem. Art. 49 (1) lit. a DSGVO ausdrücklich eingewilligt hat",
            "das Land ein angemessenes Schutzniveau hat und dies mittels Angemessenheitsbeschluss nach Art. 45 nachgewiesen wurde",
            "das Unternehmen ein Verzeichnis der Verarbeitungstätigkeiten der Aufsichtsbehörde vorgelegt hat",
            "eine Datenschutz-Folgenabschätzung gem. Art. 35 DSGVO stattgefunden hat",
            "der Verantwortliche geeignete Garantien vorgesehen hat, z. B. durch Standardvertragsklauseln"
        ]
    },
    {
        id: "ds_k2_17", type: "single",
        title: "Drittland",
        text: "Was ist im Sinne der DSGVO unter einem Drittland zu verstehen?",
        answer: 2,
        options: [
            "Ein Land, in dem die DSGVO zur Anwendung kommt",
            "Ein Land innerhalb der Europäischen Union",
            "Ein Land außerhalb der Europäischen Union",
            "Ein Land für das ein angemessenes Datenschutzniveau vorliegt",
            "Das Empfängerland nach einer Übermittlung an einen Dritten"
        ]
    },
    {
        id: "ds_k2_18", type: "multi",
        title: "Übermittlung an andere Empfänger",
        text: "Welche Voraussetzungen müssen bei der Übermittlung an andere Unternehmen erfüllt werden?",
        answer: [0, 3, 4],
        options: [
            "Es muss mindestens eine Rechtsgrundlage nach DSGVO oder BDSG erfüllt sein, um Daten zu verarbeiten",
            "Zuvor muss eine Datenschutz-Folgenabschätzung durchgeführt werden",
            "Es müssen keine Voraussetzungen berücksichtigt werden, da die Übermittlung keine Datenverarbeitung ist",
            "Wenn die Übermittlung eine Auftragsverarbeitung darstellt, muss ein Auftragsverarbeitungsvertrag geschlossen worden sein",
            "Bei der Übermittlung in ein Drittland müssen zusätzliche Regelungen nach Art. 44 ff DSGVO berücksichtigt werden, wie Angemessenheitsbeschlüsse oder geeignete Garantien, die ein ähnliches Datenschutzniveau wie das der EU garantieren"
        ]
    },
    {
        id: "ds_k2_19", type: "multi",
        title: "Videoüberwachung",
        text: "In welchen der folgenden Bereiche ist Videoüberwachung grundsätzlich verboten?",
        answer: [0, 2, 4, 5, 6],
        options: ["Umkleidekabinen des Unternehmens", "In der Kantine", "Ruheraum der Mitarbeiter in einer Arztpraxis", "Flure und IT-Abteilung einer Behörde", "Vorräume einer Toilette eines Vereines", "Duschräume", "Toilettenräume", "Öffentlicher Parkplatz"]
    },
    {
        id: "ds_k2_20", type: "multi",
        title: "Verpflichtung auf Vertraulichkeit",
        text: "Was soll bei der Verpflichtung der Mitarbeiter auf die Vertraulichkeit beachtet werden?",
        answer: [0, 3],
        options: [
            "Die Mitarbeiter sollen verstehen, was das Ziel dieser Verpflichtung ist",
            "Der Fokus muss auf den Bußgeldvorschriften liegen und es wird mit Abmahnungen gedroht",
            "Im Rahmen der Aufklärung müssen die Mitarbeiter mit sämtlichen Regelungen der DSGVO, dem BDSG, DDG, TDDDG und dem TMK vertraut gemacht werden und einen Wissenstest absolvieren",
            "Die Verpflichtung auf die Vertraulichkeit sollte erst erfolgen, wenn die Mitarbeiter ausreichend in den Umgang mit personenbezogenen Daten eingewiesen wurden."
        ]
    },
    {
        id: "ds_k2_21", type: "multi",
        title: "Akzeptanz des Datenschutzes",
        text: "Mit welchen Maßnahmen können die Verantwortlichen eine bessere Akzeptanz des Datenschutzes herstellen?",
        answer: [0, 1, 2],
        options: [
            "Die Geschäftsführung sollte als Vorbild vorangehen",
            "Mitarbeiter frühzeitig und umfassend informieren",
            "Mitarbeiterschulungen interessant und für die tatsächliche Verarbeitung gestalten, damit der Sinn für den Datenschutz klar zu erkennen ist",
            "Mitarbeiter regelmäßig mit Bußgeldern und Sanktionen drohen",
            "Die Kenntnisse der Mitarbeiter zum Datenschutz monatlich prüfen"
        ]
    },
    {
        id: "ds_k2_22", type: "multi",
        title: "Analyse-Tool auf Website",
        text: "Welche Regelungen sind bei der Nutzung eines Analyse-Tools zu beachten?",
        answer: [1, 3, 4],
        options: [
            "Es muss eine Datenschutz-Folgenabschätzung durchgeführt werden",
            "Die Datenschutzerklärung der Website muss den Besucher umfassend über die Verwendung der Cookies gem. DSGVO und TDDDG informieren",
            "Es sind keine besonderen Regelungen zu beachten, da es sich bei Cookies immer um technisch notwendige Maßnahmen handelt",
            "Die Besucher der Website müssen zuvor über ein Cookie-Banner einwilligen [gem. § 25 (1) TDDDG]",
            "Der Verantwortliche muss ggf. einen Vertrag zur Auftragsverarbeitung mit dem Anbieter des Analyse-Tools schließen"
        ]
    },
    {
        id: "ds_k2_23", type: "multi",
        title: "Schutzziele Informationssicherheit",
        text: "Welches sind die Schutzziele in der Informationssicherheit?",
        answer: [0, 5, 12],
        options: ["Verfügbarkeit", "Verschlüsselung", "Authentizität", "Pseudonymisierung", "Belastbarkeit", "Vertraulichkeit", "Datenminimierung", "Nichtverkettung", "Transparenz", "Intervenierbarkeit", "Wiederherstellung", "Wirksamkeit", "Integrität", "Nichtabstreitbarkeit"]
    },
    {
        id: "ds_k2_24", type: "multi",
        title: "Schutzziele DSGVO",
        text: "Welches sind die Schutzziele im Datenschutz gem. DSGVO?",
        answer: [0, 5, 12],
        options: ["Verfügbarkeit", "Verschlüsselung", "Authentizität", "Pseudonymisierung", "Belastbarkeit", "Vertraulichkeit", "Datenminimierung", "Nichtverkettung", "Transparenz", "Intervenierbarkeit", "Wiederherstellung", "Wirksamkeit", "Integrität", "Nichtabstreitbarkeit"]
    },
    {
        id: "ds_k2_25", type: "multi",
        title: "Schutzziele nach SDM",
        text: "Welches sind die Schutzziele nach SDM (Standard Datenschutz Model)?",
        answer: [0, 5, 7, 8, 9, 12],
        options: ["Verfügbarkeit", "Verschlüsselung", "Authentizität", "Pseudonymisierung", "Belastbarkeit", "Vertraulichkeit", "Datenminimierung", "Nichtverkettung", "Transparenz", "Intervenierbarkeit", "Wiederherstellung", "Wirksamkeit", "Integrität", "Nichtabstreitbarkeit"]
    },
    {
        id: "ds_k2_26", type: "single",
        title: "Rechtsgrundlage Datenübermittlung",
        text: "Dein Unternehmen möchte deine personenbezogenen Daten an andere Empfänger übermitteln. Welches Gesetz(e) regeln und ermöglichen das?",
        answer: 1,
        options: ["Ausschließlich die DSGVO", "DSGVO in Verbindung mit dem BDSG", "Ausschließlich das BDSG bei Beschäftigten", "Das BGB", "Keine der o.a. Antworten ist richtig"]
    },
    {
        id: "ds_k2_27", type: "multi",
        title: "Informationspflichten",
        text: "Welche Personen müssen vor einer Datenverarbeitung ihrer personenbezogenen Daten informiert werden?",
        answer: [0, 1, 2, 3, 4, 5, 7],
        options: ["Nutzer der Website", "Interessenten bei Anfragen über die Kontaktseite der Internetseite", "Beschäftigte", "Bewerber", "Praktikanten", "Geschäftspartner und Lieferanten", "Behörden", "Kunden"]
    },
    {
        id: "ds_k2_28", type: "multi",
        title: "Inhalte Datenschutzinformation",
        text: "Welche groben Inhalte sollte eine Information zu Datenschutz enthalten?",
        answer: [0, 1, 2, 3, 6, 7, 8],
        options: ["Die Kontaktdaten des Verantwortlichen und des DSBs (wenn benannt)", "Den Zweck der Datenverarbeitung", "Die Empfänger der Daten", "Eine beabsichtigte Übermittlung in Drittländer", "Die Webadresse des Unternehmens", "Die Anzahl der Beschäftigten und die Art des Unternehmens", "Die Dauer der Speicherung der Daten", "Eine Auflistung der Betroffenenrechte", "Hinweise zum Beschwerde- und Widerrufsrecht", "Informationen in der Landessprache und mindestens auch in englischer Sprache verfasst sein"]
    },
    {
        id: "ds_k2_29", type: "multi",
        title: "TOMs",
        text: "Welchen Zweck erfüllen TOMs (techn.- organisatorische Maßnahmen)?",
        answer: [1, 2, 3, 4],
        options: ["TOMs sind nach DSGVO vorgeschrieben und müssen nicht immer einen Zweck erfüllen", "TOMs erfüllen Anforderungen zu Schutzzielen der DSGVO", "TOMs erfüllen Anforderungen zu Schutzzielen der Informationssicherheit", "Organisatorische Maßnahmen können Richtlinien und Mitarbeiteranweisungen sein", "Technische Maßnahmen können z. B. durch Transponder Key Schließsysteme als Zutrittskontrolle umgesetzt werden, um einen berechtigten Zutritt zu gewährleisten", "TOMs sind nur in datenschutzrechtlichen Aspekten wirksam", "TOMs beziehen ausschließlich auf die Datensicherheit"]
    },
    {
        id: "ds_k2_30", type: "single",
        title: "Risikoansätze",
        text: "Welche Risikoansätze werden bei der Verarbeitung personenbezogener Daten nach DSGVO im Vergleich zur allgemeinen IT verfolgt?",
        answer: 1,
        options: [
            "Es gibt keinen Unterschied, da beide die gleiche Formel zur Berechnung des Risikoausmaßes verwenden.",
            "Der Datenschutz nach DSGVO betrachtet die qualitativen Risken, denen die Rechte und Freiheiten natürlicher Personen ausgesetzt sind. Diesen Risiken liegen keine direkt quantifizierbaren Werte zugrunde - sie müssen kategorisiert werden.",
            "Die allgemeine IT verfolgt einen quantifizierbaren Ansatz, bei dem die Schadenshöhe und die Eintrittswahrscheinlichkeit zum Einsatz kommen."
        ]
    },
    {
        id: "ds_k2_31", type: "single",
        title: "Schutzbedarfsanalyse",
        text: "Was versteht man im Datenschutz unter einer Schutzbedarfsanalyse?",
        answer: 1,
        options: ["Die Methode, wie alle Informationen im Unternehmen abgesichert werden müssen.", "Bildung von Schutzbedarfskategorien aus einer Risikoanalyse über personenbezogene Daten.", "Die Beschreibung welche Technisch-Organisatorische Maßnahme zu welchem Risiko passt."]
    },
    {
        id: "ds_k2_32", type: "single",
        title: "Besondere Kategorien von Daten",
        text: "Welche der folgenden Daten zählen nicht zu den „Daten besonderer Kategorie“ nach Art. 9 DSGVO wie z. B. Gesundheitsdaten?",
        answer: 0,
        options: ["Bankdaten", "Biometrische Daten", "Religiöse Überzeugung", "Polizeiliches Führungszeugnis"]
    },
    {
        id: "ds_k2_33", type: "multi",
        title: "Keine Betroffenenrechte",
        text: "Welche der folgenden Rechte sind keine Betroffenenrechte gemäß DSGVO?",
        answer: [1, 3],
        options: ["Recht auf Berichtigung", "Recht auf Verschlüsselung", "Recht auf Einschränkung der Verarbeitung", "Recht auf Anonymisierung"]
    },
    {
        id: "ds_k2_34", type: "multi",
        title: "Auskunftsrecht",
        text: "Welche beiden der folgenden Aussagen sind falsch? Das Auskunftsrecht nach DSGVO...",
        answer: [0, 1],
        options: ["gilt nur gegenüber Behörden, nicht gegenüber Privatunternehmen.", "wird durch die Aufsichtsbehörde ausgeübt.", "schließt das Recht auf eine Kopie der Daten ein.", "kann bei exzessiver Nutzung verweigert werden."]
    },
    {
        id: "ds_k2_35", type: "multi",
        title: "Ausnahmen Art. 9 DSGVO",
        text: "Die besonderen Kategorien des Art. 9 DSGVO untersagen grundsätzlich die Verarbeitung der bezeichneten Daten. Es gibt aber Ausnahmen. Welche Aussagen sind richtig?",
        answer: [0, 2],
        options: [
            "Die Einwilligung der betroffenen Person liegt in rechtsgültiger Form vor.",
            "Die Datenverarbeitung dient dem berechtigten Interesse der Verantwortlichen Stelle.",
            "Die Verarbeitung ist aus arbeits- und sozialrechtlichen Gründen notwendig.",
            "Die Verarbeitung dient zur Vertragserfüllung und -anbahnung oder eines Arbeitsvertrages."
        ]
    },
    {
        id: "ds_k2_36", type: "single",
        title: "Rechtsgrundlage",
        text: "Welches ist im normalen Geschäftsbereich die sicherste und stärkste Rechtsgrundlage für die Verarbeitung personenbezogener Daten?",
        answer: 2,
        options: ["Die Einwilligung, weil die von der betroffenen Person bewusst gegeben werden muss.", "Berechtigte Interessen, weil die am breitesten ausgelegt werden können.", "Ein Vertrag, der auf Anfrage der betroffenen Person zustande kommt."]
    },
    {
        id: "ds_k2_37", type: "single",
        title: "Datensparsamkeit bei Formularen",
        text: "Wie muss eine Eingabemaske für einen Online-Büchershop konditioniert werden?",
        answer: 2,
        options: [
            "Alle Eingabefelder können als Pflichtfelder deklariert werden, da die Daten auch anderweitig verwendet werden können.",
            "Es müssen keine Pflichtfelder gekennzeichnet werden, damit die Kunden zum Ausfüllen aller Felder motiviert werden.",
            "Nur die für den Verkauf benötigten Daten dürfen als Pflichtfelder gekennzeichnet werden, die anderen müssen als optional erkennbar sein."
        ]
    },

    // ==========================================
    // Übungen zum Kapitel 3 (24 Fragen)
    // ==========================================
    {
        id: "ds_k3_01", type: "single",
        title: "Entscheidungsgewalt Verarbeitung",
        text: "Wer bestimmt über den Zweck und die Mittel einer Verarbeitung von personenbezogenen Daten?",
        answer: 0,
        options: ["Der Verantwortliche", "Der Auftragsverarbeiter", "Der Empfänger der pbD", "Der Dritte, wenn dieser in Deutschland ansässig ist", "Der zuständige Sachbearbeiter/in der verarbeitenden Stelle"]
    },
    {
        id: "ds_k3_02", type: "multi",
        title: "Auftragsverarbeitung Aktenvernichtung",
        text: "Dein Unternehmen möchte für die jährliche Aktenvernichtung einen externen Dienstleister beauftragen. Welche der folgenden Voraussetzungen sind vor dem Beginn der Dienstleistung zu erfüllen?",
        answer: [1, 2, 3],
        options: [
            "Die Beschäftigten müssen gem. Art. 6 (1) lit. a DSGVO ihre Einwilligung zur Vernichtung der Akten zustimmen",
            "Der DSB (oder der Verantwortliche) prüft vor einer Zusammenarbeit, ob der Dienstleister geeignete Garantien zum Schutz der personenbezogenen Daten vorweisen kann",
            "Es handelt sich um eine Auftragsverarbeitung gem. Art. 28 DSGVO",
            "Der Verantwortliche schließt als Auftraggeber vor der Zusammenarbeit einen Auftragsverarbeitungsvertrag (AVV) mit dem Dienstleister (Auftragnehmer) ab",
            "Der DSB muss der Zusammenarbeit zustimmen",
            "Es sind keine besonderen Vorkehrungen zu treffen, da es sich um die Vernichtung von Daten handelt"
        ]
    },
    {
        id: "ds_k3_03", type: "multi",
        title: "Unterauftragnehmer",
        text: "Der Dienstleister für die Aktenvernichtung möchte bei Engpässen auf die Leistungen eines Partnerunternehmens zurückgreifen. Welche der folgenden Aussagen sind korrekt?",
        answer: [0, 2],
        options: [
            "Das Partnerunternehmen wird als Unterauftragnehmer gegenüber deiner Firma angesehen",
            "Der Aktenvernichter wird dann zum Unterauftragnehmer und das Partnerunternehmen wird zum Auftragnehmer",
            "Das Partnerunternehmen muss einen AVV mit dem Aktenvernichter (Auftragnehmer) schließen",
            "Das Partnerunternehmen muss einen AVV mit deiner Firma schließen"
        ]
    },
    {
        id: "ds_k3_04", type: "multi",
        title: "Gemeinsame Verantwortung",
        text: "Welche Aussagen zur gemeinsamen Verantwortung gem. Art. 26 DSGVO sind richtig?",
        answer: [2, 3],
        options: [
            "Die gemeinsame Verantwortung gibt es im Sinne der DSGVO nicht",
            "Der DSB prüft, ob eine Datenschutz-Folgenabschätzung durchgeführt werden muss",
            "Es ist ein Vertrag über die Zusammenarbeit zu schließen, aus der die unterschiedlichen Verantwortlichkeiten hervorgehen",
            "Betroffene können ihre Rechte bei jedem der Verantwortlichen geltend machen z. B. ihr Recht auf Auskunft. Die Verantwortlichen regeln untereinander, wer diese Anfrage bearbeitet, und stellen eine verlässliche Regelung sicher",
            "Die Aufsichtsbehörde muss einer gemeinsamen Verantwortung zustimmen"
        ]
    },
    {
        id: "ds_k3_05", type: "multi",
        title: "Inhalte Auftragsverarbeitungsvertrag",
        text: "Welche Inhalte müssen in einem Auftragsverarbeitungsvertrag mindestens abgedeckt sein?",
        answer: [0, 1, 2, 4],
        options: [
            "Eine Bestätigung, dass alle Beschäftigten des Auftragsverarbeiters zur Vertraulichkeit verpflichtet wurden",
            "Nachweis oder Übersicht über die eingerichteten TOMs, um den Schutz von pbD zu gewährleisten",
            "Beschreibung der Bedingungen zur Inanspruchnahme von Unterauftragnehmern",
            "Anschrift der zuständigen Aufsichtsbehörde",
            "Bedingungen über die Löschung oder Vernichtung der übermittelten Daten nach Abschluss der erbrachten Leistungen",
            "Übersicht der Einwilligungen der Betroffenen"
        ]
    },
    {
        id: "ds_k3_06", type: "open",
        title: "Recherche AVV",
        text: "Recherchiere im Internet und suche bei deiner Aufsichtsbehörde nach Vertragsmustern für Auftragsverarbeitung und gemeinsamer Verantwortung.",
        answer: "Individuelle Rechercheaufgabe.",
        options: ["Individuelle Rechercheaufgabe."]
    },
    {
        id: "ds_k3_07", type: "single",
        title: "Führung des VVT",
        text: "Wer führt das Verzeichnis der Verarbeitungstätigkeiten (VVT) gem. DSGVO?",
        answer: 2,
        options: ["Der Datenschutzbeauftragte, falls dieser benannt ist", "Die Fachabteilung die mit dieser Verarbeitung beauftragt ist", "Der Verantwortliche z. B. der Geschäftsführer", "Der Datenschutzkoordinator", "Der Leiter des Personalbüros"]
    },
    {
        id: "ds_k3_08", type: "multi",
        title: "Inhalte VVT",
        text: "Welche Inhalte müssen im VVT mindestens abgebildet sein?",
        answer: [0, 1, 2, 5, 6],
        options: [
            "Zweck der Verarbeitung",
            "Kategorie der personenbezogenen Daten",
            "Name und Kontaktdaten des Verantwortlichen",
            "Name und Kontaktdaten des DSB (wenn benannt)",
            "Kontaktdaten der Aufsichtsbehörde",
            "Angaben zu Löschfristen",
            "Art der Geeigneten Garantie bei Drittlandübermittlung z.B. Angemessenheitsbeschluss der EU-Kommission"
        ]
    },
    {
        id: "ds_k3_09", type: "multi",
        title: "EG 78 DSGVO TOMs",
        text: "Der Erwägungsgrund (EG) 78 der DSGVO bezieht sich auf mehrere TOMs die besonders von Fachinformatikern eingehalten werden sollten. Welche sind das?",
        answer: [0, 3, 4, 5, 6, 7, 8],
        options: [
            "Datenschutz durch Technikgestaltung",
            "Arbeitszeiterfassung in digitaler Form",
            "Digitales Fahrtenbuch für Dienstwagen",
            "Privacy by design / datenschutzfreundliche Software",
            "Privacy by default / datenschutzfreundliche Voreinstellung",
            "Datenminimierung",
            "Pseudonymisierung wann immer es möglich ist",
            "Transparenz im Bezug auf die Funktionen und die Verarbeitung",
            "Sicherheitsfunktionen zu schaffen, zum Nutzen der Betroffenen",
            "Die Belange des Verantwortlichen stehen dabei immer im Vordergrund",
            "Die Rechenschaftspflichten des Verantwortlichen sollen mit den o.a. TOMs vordergründig erreicht werden. Die Betroffenenrechte sind in diesem Zusammenhang sekundär zu betrachten."
        ]
    },
    {
        id: "ds_k3_10", type: "multi",
        title: "Nachweispflichten",
        text: "Welche Nachweispflichten bestehen für den Verantwortlichen?",
        answer: [0, 1, 6, 11],
        options: [
            "Benennung des DSB (wann gemeldet)",
            "Verzeichnis der Verarbeitungstätigkeiten",
            "Benennungsurkunde des DSB von der Aufsichtsbehörde",
            "Schulungsnachweise der Mitarbeiter",
            "Verpflichtungserklärungen der Mitarbeiter",
            "Verantwortliche müssen nichts nachweisen, solange sich kein Kunde beschwert hat. Erst dann greifen Nachweispflichten",
            "Konzepte zum Datenschutz und der Umsetzung im Unternehmen",
            "Tätigkeitsberichte des DSB",
            "Verfahrensanweisungen z. B. bei Datenpannen",
            "Hinweise zum Datenschutz für Kunden",
            "Liste aller getroffenen TOMS",
            "Nachweis der AVVs (Auftragsverarbeitungsverträge)"
        ]
    },
    {
        id: "ds_k3_11", type: "multi",
        title: "KRITIS Unternehmen",
        text: "Welche Unternehmen fallen unter den Begriff KRITIS?",
        answer: [0, 3, 4, 9, 10, 11, 12, 14, 15],
        options: [
            "Krankenhäuser", "Elektriker", "Klempnerbetriebe", "Telekommunikationsunternehmen", "Wasserversorger", "Internet-Dienstleister (Hosting)", "Cloudcomputing Dienstleister", "Cloudspeicher Anbieter", "Betreiber großer KI-Rechenzentren", "Öffentlicher Nahverkehr", "Banken", "Abfallversorgungsunternehmen", "Staat/Verwaltung", "Klimaschutz Unternehmen", "Lebensmittelindustrie", "Pharmaindustrie"
        ]
    },
    {
        id: "ds_k3_12", type: "multi",
        title: "NIS2 Regelung",
        text: "Welches Ziel verfolgt man mit der NIS2 Regelung? Welche weiteren Aussagen sind richtig?",
        answer: [2, 3],
        options: [
            "Die Stärkung von Fördermaßnahmen in der Technologiebranche",
            "Die Stärkung des EU-Binnenmarktes bezogen auf den Handel mit digitalen Produkten",
            "Ein hohes und gemeinsames Cybersicherheitsniveau in der EU zu erreichen",
            "NIS2 richtet sich an Anbieter digitaler Dienste oder digitale Infrastrukturen"
        ]
    },
    {
        id: "ds_k3_13", type: "single",
        title: "TDDDG",
        text: "Welche neue Regelung findet sich im TDDDG?",
        answer: 3,
        options: ["Nutzen der digitalen Dienste", "Cookiefreie Webseiten", "Schutz vor Abhörmaßnahmen", "Rechte von Erben (digitales Erbe)"]
    },
    {
        id: "ds_k3_14", type: "single",
        title: "2-Klick-Regel Impressum",
        text: "Das DDG regelt u.a. auch die Impressumspflichten. Gerichte haben zusätzlich eine 2-Klick-Regel festgelegt. Was ist damit gemeint?",
        answer: 2,
        options: [
            "Die Impressumsseite wird nach zweimaligem Anklicken nicht weiter angezeigt",
            "Zum Anzeigen wird zwingend ein Doppelklick benötigt",
            "Das Impressum muss von jeder Seite der Website mit maximal 2 Klicks zu erreichen sein",
            "Das Impressum muss zumindest von der Startseite der Website mit maximal 2 Klicks zu erreichen sein"
        ]
    },
    {
        id: "ds_k3_15", type: "multi",
        title: "Urheberrecht",
        text: "Welche der folgenden Aussagen zum Urheberrecht sind richtig?",
        answer: [0, 4, 6, 8, 9],
        options: [
            "Das Urheberrecht schützt ideelle und materielle Interessen eines Urhebers an geistigen Werken",
            "Das Urheberrecht ist eine zentrale deutsche gesetzliche Grundlage",
            "Das Urheberrecht ist verfassungsrechtlich im Grundgesetz verankert",
            "Das Urheberrechts-Diensteanbieter-Gesetz regelt die Verantwortlichkeit bei dem Vertrieb urheberrechtlich geschützten Werken",
            "Es gilt für Bücher",
            "Es beinhaltet auch Patente für geistiges Eigentum",
            "Es gilt für Skulpturen und Fotos",
            "Es gilt für Markenrecht",
            "Es gilt für Software",
            "Es gilt für Musikstücke"
        ]
    },
    {
        id: "ds_k3_16", type: "multi",
        title: "Softwareerstellung im Unternehmen",
        text: "Sie erschaffen in ihrem Unternehmen eine Software, die von hohem Nutzen für das Unternehmen ist. Welche Aussage ist richtig?",
        answer: [0, 1, 3],
        options: [
            "Grundsätzlich sind sie Urheber der Software",
            "Der Arbeitgeber kann Nutzungsrechte erhalten",
            "Der Arbeitgeber ist immer zu 50% Urheber, da die Software während ihrer Arbeitszeit entstanden ist",
            "Im Arbeitsvertrag können Regelungen dazu getroffen worden sein",
            "Im Arbeitsvertrag darf es keine Regelungen zum Urheberrecht geben",
            "In jedem Fall kann der Arbeitnehmer schutzwürdige Interessen geltend machen"
        ]
    },
    {
        id: "ds_k3_17", type: "single",
        title: "Urheberrecht Grundlagen",
        text: "Welche der folgenden Aussagen ist richtig?",
        answer: 2,
        options: [
            "Das Urheberrecht gilt nur für Werke der Musik und der bildenden Kunst, nicht aber für Computerprogramme.",
            "Das Urheberrecht wird erst mit der Veröffentlichung des Werkes wirksam.",
            "Das Urheberrecht erlischt 70 Jahre nach dem Tod des Urhebers.",
            "Urheberrecht kann nur für Werke in Anspruch genommen werden, die mit dem Copyright-Zeichen gekennzeichnet sind"
        ]
    },
    {
        id: "ds_k3_18", type: "single",
        title: "Verantwortliche Stelle",
        text: "Damit eine natürliche oder juristische Person als „Verantwortlicher“ oder „verantwortliche Stelle“ gilt, muss sie Entscheidungsgewalt über zwei Dinge haben:",
        answer: 2,
        options: [
            "Zeitpunkt und Art der Daten",
            "Erhebung und Verwendung der personenbezogenen Daten",
            "Mittel und Zweck der Verarbeitung von personenbezogenen Daten",
            "Organisieren und Auslesen von personenbezogenen Daten"
        ]
    },
    {
        id: "ds_k3_19", type: "single",
        title: "Verzeichnis der Verarbeitungstätigkeiten",
        text: "Kennzeichnen Sie die falsche Aussage in Bezug auf ein Verzeichnis der Verarbeitungstätigkeiten (VVT).",
        answer: 3,
        options: [
            "Die meisten Unternehmen sind zum Erstellen eines VVT verpflichtet.",
            "Ein fehlendes VVT kann zur Verhängung eines Bußgeldes führen.",
            "Die Mindestinhalte des VVT sind in der DSGVO definiert, die Form des VVT hingegen nicht.",
            "Das VVT muss der Aufsichtsbehörde spätestens zum 2. Quartal eines jeden Jahres unaufgefordert vorgelegt werden."
        ]
    },
    {
        id: "ds_k3_20", type: "single",
        title: "Dokument für Rechtsgrundlage",
        text: "Um im Unternehmen herauszufinden, was die Rechtgrundlage und was die Löschfrist für die Arbeitszeiterfassung ist, wird welches Dokument diese Angaben enthalten?",
        answer: 3,
        options: ["Personalakte", "Stellenbeschreibung des Mitarbeiters", "Tätigkeitsbericht des DSB", "Verzeichnis der Verarbeitungstätigkeiten (VVT)"]
    },
    {
        id: "ds_k3_21", type: "single",
        title: "Zweckbindung und Identifizierung",
        text: "Die Verarbeitung personenbezogener Daten darf nur zweckgebunden erfolgen. Nach der Zweckerfüllung darf auch keine Identifizierung der betroffenen Person mehr möglich sein. Welche Aussagen sind richtig?",
        answer: 1,
        options: [
            "Nach der Zweckerfüllung müssen die personenbezogenen Daten sofort gelöscht oder anonymisiert werden, wenn keine gesetzlichen Regelungen entgegenstehen.",
            "Wenn die gesetzliche Aufbewahrungsfrist noch nicht abgelaufen ist, bleiben die Daten gespeichert, müssen aber nach der Zweckerfüllung durch ein geeignetes Verfahren dem allgemeinen Zugriff entzogen werden.",
            "Solange die gesetzliche Aufbewahrungsfrist läuft, bleiben die Daten unverändert gespeichert, damit sie jederzeit eingesehen werden können."
        ]
    },
    {
        id: "ds_k3_22", type: "single",
        title: "Definition Auftragsverarbeitung",
        text: "Wann spricht man von einer Auftragsverarbeitung?",
        answer: 2,
        options: [
            "Wenn ein Unternehmen die Daten von einer dritten Stelle bekommt und sie für eigene Zwecke verarbeitet.",
            "Wenn ein weiteres Unternehmen über Mittel und Zwecke der Verarbeitung entscheidet.",
            "Wenn eine natürliche oder juristische Person, Behörde oder Einrichtung personenbezogene Daten im Auftrag für den Verantwortlichen (dieser Daten) verarbeitet."
        ]
    },
    {
        id: "ds_k3_23", type: "single",
        title: "Werbezwecke und UWG",
        text: "Die DSGVO enthält keine detaillierten Regelungen zur Verarbeitung von personenbezogenen Daten für Werbezwecke. Diese sind explizit im UWG formuliert. Welche Aussage ist richtig?",
        answer: 2,
        options: [
            "Da das UWG ein nationales deutsches Gesetz ist, müssen die Vorgaben der DSGVO im Hinblick auf Datenerhebung und Informationspflichten nicht beachtet werden.",
            "Sobald es gem. UWG um Bestandskunden handelt, darf ich Werbung zustellen und muss nichts weiter beachten.",
            "Zusätzlich zu den Erlaubnistatbeständen des UWG müssen die Informationspflichten der DSGVO erfüllt werden."
        ]
    },
    {
        id: "ds_k3_24", type: "single",
        title: "Meldepflicht Zeitraum",
        text: "Innerhalb welchem Zeitraum nach bekannt werden muss die verantwortliche Stelle meldepflichtige Datenschutzverstöße der Aufsichtsbehörde melden?",
        answer: 1,
        options: ["Innerhalb 1 Monats", "Innerhalb von 72 Stunden", "Innerhalb von 3 Monaten"]
    }
];
