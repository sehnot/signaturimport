#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

// Logging unterdrücken (wird in extract.js als global erwartet)
global.logging = () => {};
// console.log ebenfalls unterdrücken bis extract.js geladen ist
const originalConsoleLog = console.log;
console.log = () => {};

// extract.js in den globalen Kontext laden
const extractCode = fs.readFileSync('assets/js/extract.js', 'utf8');
vm.runInThisContext(extractCode);

// Signaturen aus specs.js per Regex extrahieren
const specsContent = fs.readFileSync('tests/specs/specs.js', 'utf8');
const signatureRegex = /signature:\s*"((?:[^"\\]|\\.)*)"/g;
const signatures = [];
let match;
while ((match = signatureRegex.exec(specsContent)) !== null) {
    const sig = match[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    signatures.push(sig);
}

// console.log wieder aktivieren
console.log = originalConsoleLog;

// Jede Signatur verarbeiten
signatures.forEach((sig, index) => {
    const contact = new Contact();
    const signature = new Signature(sig);
    console.log = () => {};
    contact.extractData(signature);
    console.log = originalConsoleLog;

    const remaining = signature.remaining.filter(line => /[a-zA-Z0-9äöüÄÖÜß]/.test(line));
    const firstLine = sig.split('\n')[0];

    console.log(`\n=== Signatur ${index + 1}: ${firstLine} ===`);
    console.log(`  Name:    ${contact.name || '-'}`);
    console.log(`  Job:     ${contact.job || '-'}`);
    console.log(`  E-Mail:  ${contact.email || '-'}`);
    console.log(`  Telefon: ${contact.phone || '-'}`);
    console.log(`  Fax:     ${contact.fax || '-'}`);
    console.log(`  Mobil:   ${contact.mobile || '-'}`);
    console.log(`  Adresse: ${contact.street || '-'}, ${contact.zip || '-'} ${contact.city || '-'}`);
    console.log(`  Firma:   ${contact.company || '-'}`);
    console.log(`  Website: ${contact.website || '-'}`);
    if (remaining.length > 0) {
        console.log(`  Übrig:`);
        remaining.forEach(line => console.log(`    > "${line}"`));
    } else {
        console.log(`  Übrig:   (nichts)`);
    }
});
