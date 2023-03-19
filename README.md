# SignaturImport

Browserbasierte Web-App, die E-Mail-Signaturen analysiert und die extrahierten Kontaktdaten als vCard 3.0 (`.vcf`) exportiert. Alles läuft offline im Browser – keine Daten verlassen das Gerät.

## Funktionsweise

1. E-Mail-Signatur in das Textfeld einfügen
2. Kontaktdaten werden automatisch per Regex-Analyse erkannt und in die Felder eingetragen
3. vCard herunterladen und in das Adressbuch importieren

Die Extraktion erfolgt in `assets/js/extract.js` über die Klassen `Signature` und `Contact`. Zuerst werden klar erkennbare Felder (E-Mail, Telefon, Adresse, Firma, Website) per Regex extrahiert und aus den verbleibenden Zeilen entfernt. Name und Jobtitel werden anschließend durch Ausschlussverfahren aus den übrigen Zeilen ermittelt.

## Lokal starten

Dateien herunterladen und `index.html` im Browser öffnen – fertig. Es wird kein Server benötigt.

## Tests

Abhängigkeiten installieren und Tests headless ausführen:

```bash
npm install
npm test
```

Die Testfälle in `tests/specs/specs.js` decken 32 reale Signaturen aus verschiedenen Branchen und Formaten ab (398 Einzeltests).

Alternativ `tests/index.html` direkt im Browser öffnen (Jasmine 5.1.2 Standalone).

## Projektstruktur

```
index.html                    → Hauptseite: Signatur-Input + Kontaktfelder
infos.html                    → Infoseite
credits.html                  → Verwendete Bibliotheken
assets/js/extract.js          → Extraktionslogik (Signature, Contact)
assets/js/export.js           → vCard 3.0 Export
assets/css/styles.css         → Styles
tests/specs/specs.js          → Jasmine-Tests
tools/show-remaining.js       → Debug-Tool: zeigt nicht extrahierte Zeilen
```

## Lizenz

MIT
