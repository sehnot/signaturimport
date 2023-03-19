# CLAUDE.md

Diese Datei enthält Hinweise für Claude Code (claude.ai/code) zur Arbeit mit diesem Repository.

## Was dieses Projekt macht

**SignaturImport** ist eine browserbasierte Web-App, die E-Mail-Signaturen per Regex analysiert und die extrahierten Kontaktdaten als vCard 3.0 (`.vcf`) exportiert. Alles läuft offline im Browser – keine Server-Kommunikation.

## Tests ausführen

**Headless (empfohlen):**
```bash
npm test
```
Nutzt `jasmine-browser-runner` mit headless Chrome. Konfiguration in `jasmine-browser-runner.json`.

**Im Browser:**
`tests/index.html` im Browser öffnen (Jasmine 5.1.2 standalone).

Die Testfälle in `tests/specs/specs.js` decken 32 reale Signaturen aus verschiedenen Branchen und Formaten ab.

## Architektur

```
index.html                        → UI: Textarea (Signatur-Input) + Formularfelder (Kontaktdaten)
infos.html                        → Infoseite (Herausforderung, Vorteile, Funktionsweise)
credits.html                      → Verwendete Bibliotheken und Lizenzen
assets/css/styles.css             → Gemeinsame Styles für alle drei HTML-Seiten
assets/css/fontawesome-all.min.css → Font Awesome Free 7.2.0
assets/webfonts/                  → Webfonts (.woff2 only)
assets/js/extract.js              → Kern-Logik: Klassen Signature + Contact, Regex-Extraktion
assets/js/export.js               → vCard 3.0 Export per Blob-Download
assets/js/jasmine-config.js       → Jasmine-Konfiguration (random: false, Custom Reporter)
tests/index.html                  → Browser-Testrunner (Jasmine 5.1.2 standalone)
tests/specs/specs.js              → Jasmine-Tests
jasmine-browser-runner.json       → Konfiguration für headless CLI-Testrunner
```

## CSS-Architektur

Alle Styles liegen in `assets/css/styles.css` – die HTML-Dateien enthalten keinen eigenen `<style>`-Block. Eingebunden wird die Datei zusammen mit dem Google-Fonts-Link:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css" />
<!-- nur auf infos.html und credits.html: -->
<link rel="stylesheet" href="assets/css/fontawesome-all.min.css" />
```

Seitenspezifische Breiten des Inhaltsbereichs werden per Modifier-Klasse gesteuert:

- `.content-section--narrow` (max-width: 860 px) → `infos.html`, `credits.html`

Der Content-Wrapper auf `index.html` heißt `.tool-section` (kein `.content-section`).

**Datenfluss:**
1. Nutzer fügt Signatur-Text in Textarea ein
2. `oninput`-Event mit 300ms Debounce ruft `signatureExtraction()` in `extract.js` automatisch auf
3. `Signature`-Klasse zerlegt den Text in Zeilen (`signature.remaining[]`)
4. `Contact.extractData()` führt alle `check_*()`-Methoden sequenziell aus
5. Jede `check_*()`-Methode nutzt `perform_regex_check()`, das den Match aus `signature.remaining` entfernt (verhindert Doppel-Extraktion)
6. `Contact.writeFormFields()` befüllt die HTML-Formularfelder
7. Nutzer klickt "Download vCard" → `export.js` generiert vCard 3.0 und triggert Download

## Wichtige Implementierungsdetails

- `signature.remaining` ist ein Array aller Zeilen. Nach jedem Regex-Treffer wird der gematchte Teil aus der entsprechenden Zeile gelöscht. Das Prinzip dahinter: Zuerst werden leicht erkennbare Felder (E-Mail, Telefon, PLZ, Website, Firma) mit zuverlässigen Regex-Treffern extrahiert und aus der Signatur entfernt. Was am Ende übrig bleibt, sind schwer erkennbare Felder wie Name und Jobtitel – die sich kaum per Regex fassen lassen, aber durch Ausschlussverfahren identifiziert werden können.
- Die Reihenfolge der `check_*()`-Aufrufe in `extractData()` ist bewusst gewählt:
  1. Adresse (`check_address_in_one_row` → Fallback: `check_zip_and_city` + `check_street_and_number`)
  2. Land (`check_country`) → Fallback `"Deutschland"`
  3. E-Mail
  4. Fax – **vor** Telefon, weil `check_phone_number` auch `f` als Präfix matcht (`Fon:`, `F:`)
  5. Telefon
  6. Mobil
  7. Firma (`check_company_name`) – sucht nach Rechtsform-Suffixen (GmbH, AG, KG, eG, e.V., mbH, bR, PartGmbB, Stiftung bürgerlichen Rechts …)
  8. Website – zuletzt, weil die Regex sehr breit ist und sonst andere Felder matchen würde
  9. Amtsgericht (`check_court_registration`) – entfernt Zeilen wie „Amtsgericht Jena HRB 203811" per `while`-Schleife (kann mehrere solcher Zeilen geben)
  10. Name (`check_name`) – nimmt die erste übrige Zeile mit Buchstaben aus `signature.remaining`
  11. Jobtitel (`check_job`) – nimmt die neue erste übrige Zeile, aber nur wenn sie keinen Doppelpunkt enthält (Doppelpunkt = Label-Zeile wie `"E-Mail: "`)
- `setRows()` bereinigt jede Zeile mit `.trim()` und einem anschließenden `.replace()`, das Unicode-Whitespace-Zeichen entfernt, die `trim()` nicht erfasst (u.a. U+00A0 Nbsp, U+200B Zero-Width Space, U+FEFF BOM).
- `check_name()` und `check_job()` nutzen **kein Regex**, sondern positionale Extraktion per Ausschlussverfahren: Name ist immer die erste, Job die zweite nicht-leere übrige Zeile. Diese Annahme gilt, weil alle anderen Felder davor entfernt wurden.
- Firmen ohne Rechtsform-Suffix können nicht automatisch erkannt werden.
- Die Adress-Regex (`check_address_in_one_row`) verwendet `(\d{5})(?!\d)\s+([a-zA-ZäöüÄÖÜß].+)` – die PLZ muss isoliert (nicht Teil einer längeren Ziffernfolge) und von einem Stadtnamen gefolgt sein. Dadurch werden Telefonnummern mit 5+-stelligen Sequenzen nicht mehr fälschlich als Adresse gematcht.
- Die Website-Regex ergänzt automatisch `http://` wenn kein Protokoll in der Signatur angegeben ist.
- Alle Nummern-Felder (Telefon, Fax, Mobil) werden nach der Extraktion per `.trim()` bereinigt.
- vCard-Export: Format ist **vCard 3.0** (UTF-8), Blob-Download ohne Server.
