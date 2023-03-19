"use strict";


class Signature {
    constructor(input) {
        this.input = "";
        this.remaining = [];
        this.setSignature(input);
    }

    setRows() {
        // Signatur in Zeilen aufteilen und Unicode-Whitespace bereinigen (u.a. U+00A0, U+200B, U+FEFF)
        this.remaining = this.input.split("\n").map(line => line.trim().replace(/^[\u00A0\u200B\u200C\u200D\u2002\u2003\u2009\u202F\uFEFF]+|[\u00A0\u200B\u200C\u200D\u2002\u2003\u2009\u202F\uFEFF]+$/g, ""));
    }

    setSignature(text) {
        this.input = text;
        this.setRows();
    }

    readSignatureFromTextarea() {
        const userinput = document.getElementById('signature').value;
        this.setSignature(userinput);
    }

}

class Contact {
    constructor() {
        this.name = "";
        this.job = "";
        this.email = "";
        this.phone = "";
        this.mobile = "";
        this.fax = "";
        this.street = "";
        this.zip = "";
        this.city = "";
        this.country = "";
        this.company = "";
        this.website = "";
    }

    // Setzt alle Kontaktfelder zurück – wird hauptsächlich in Jasmine-Tests verwendet
    reset_all_data() {
        this.name = "";
        this.job = "";
        this.email = "";
        this.phone = "";
        this.mobile = "";
        this.fax = "";
        this.street = "";
        this.zip = "";
        this.city = "";
        this.country = "";
        this.company = "";
        this.website = "";
    }

    check_address_in_one_row(signature) {
        logging("Adresse in einer Zeile prüfen");
        let regex = /^(?:.+:)*([a-zäöüß\s\d.-]+?)\s*([\d\s]+(?:\s?[-|+/]\s?\d+)?\s*[a-z]?)?[,|\s]*(\d{5})(?!\d)\s+([a-zA-ZäöüÄÖÜß].+)$/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.street = result[1].trim();
            if (result[2] != null) this.street = this.street + " " + result[2].trim();
            this.zip = result[3];
            this.city = result[4];
            return true;
        } else {
            return false;
        }
    }

    check_zip_and_city(signature) {
        logging("PLZ und Ort prüfen");
        let regex = /^(\d{5})\s*(.+)?$/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.zip = result[1];
            this.city = result[2];
            return true;
        } else {
            return false;
        }
    }

    check_street_and_number(signature) {
        logging("Straße und Hausnummer prüfen");
        let regex = /^([a-zäöüß\s\d.,-]+?)\s*([\d\s]+(?:\s?[-|+/]\s?\d+)?\s*[a-z]?)+?$/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.street = result[1];
            if (result[2] !== null) this.street = this.street + " " + result[2];
            return true;
        } else {
            return false;
        }
    }

    check_country(signature) {
        logging("Land prüfen");
        let regex = /(Austria|Deutschland|Germany|Österreich|Schweiz|Suisse|Switzerland)/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.country = result[1];
            return true;
        } else {
            return false;
        }
    }

    check_email_adress(signature) {
        logging("E-Mail-Adresse prüfen");
        let regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.email = result[1];
            return true;
        } else {
            return false;
        }
    }

    check_phone_number(signature) {
        logging("Telefonnummer prüfen");
        let regex = /^\(*(?:t|p|f)[a-z.]*\)*[.:\t \(]*((?:(?:\+|00)+[0-9])*[\)\-\t\. \(\/]*[0-9]+[\)\-\t\. \(\/]*[(0-9)]+(?:[a-z.:\t \-\/]*[0-9]*)*)/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.phone = result[1].trim();
            return true;
        }
        // Fallback: Nummer zuerst, Keyword in Klammern dahinter: "+49 123 456 (Tel)"
        let regex2 = /^((?:(?:\+|00)[0-9]|0)[0-9\s\.\-\/]*[0-9])\s*\((?:tel|t|p|fon|phone)[a-z.]*\)/im;
        result = this.perform_regex_check(regex2, signature);
        if (result !== false) {
            this.phone = result[1].trim();
            return true;
        }
        return false;
    }

    check_mobile_number(signature) {
        logging("Handynummer prüfen");
        let regex = /^\(*(?:m|h|cell|funk)[a-z.]*\)*[.:\t \(]*((?:(?:\+|00)+[0-9])*[\)\-\t\. \(\/]*[0-9]+[\)\-\t\. \(\/]*[(0-9)]+(?:[a-z.:\t \-\/]*[0-9]*)*)/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.mobile = result[1].trim();
            return true;
        }
        // Fallback: Nummer zuerst, Keyword in Klammern dahinter: "+49 151 123456 (Mobil)"
        let regex2 = /^((?:(?:\+|00)[0-9]|0)[0-9\s\.\-\/]*[0-9])\s*\((?:m|h|mobil|handy|mobile|cell|funk)[a-z.]*\)/im;
        result = this.perform_regex_check(regex2, signature);
        if (result !== false) {
            this.mobile = result[1].trim();
            return true;
        }
        return false;
    }

    check_fax_number(signature) {
        logging("Faxnummer prüfen");
        let regex = /(?:^\(*f\)*[.:\t \(]+|\(*(?:fax)[a-z]*\)*[.:\t ]*)((?:\+|00)*[0-9\-\(\)\t. \/]+(?:ext[a-z]*[.:\t ]*[0-9\-]*)*)/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.fax = result[1].trim();
            return true;
        } else {
            return false;
        }
    }

    check_company_name(signature) {
        logging("Firmenname prüfen");
        let regex = /^(.*(?: AG| bR| eG| e\. ?V\.| GbR| gGmbH| GmbH| mbH| KG| KGaA| OHG| OHG mbH| PartGmbB| PartG mbB| PartG| SE| Stiftung bürgerlichen Rechts| UG \(haftungsbeschränkt\)| VVaG))/m;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.company = result[1];
            return true;
        } else {
            return false;
        }
    }

    check_website(signature) {
        logging("Website prüfen");
        let regex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/im;
        let result = this.perform_regex_check(regex, signature);
        if (result !== false) {
            this.website = this.website + (result[1] !== undefined ? result[1] : "http://");
            if (result[2] !== undefined) this.website = this.website + result[2];
            if (result[3] !== undefined) this.website = this.website + "." + result[3];
            if (result[4] !== undefined) this.website = this.website + result[4];
            logging("Website: " + this.website);
            return true;
        } else {
            return false;
        }
    }

    // Prüft einen Regex gegen alle verbleibenden Signaturzeilen.
    // Gibt ein Array der Treffer zurück, oder false wenn kein Match gefunden wurde.
    perform_regex_check(regex, signature) {
        let found = false;
        let i = 0;
        let matches = [];
        while ((found === false) && (i < signature.remaining.length)) {
            matches = signature.remaining[i].match(regex);
            if (matches != null) {
                found = true;
                signature.remaining[i] = signature.remaining[i].replace(matches[0], "");
                logging("Regex-Treffer: " + matches[0]);
            }
            i++;
        }
        logging("Verbleibende Signatur:");
        logging(signature.remaining);
        if (found === true) {
            return matches;
        } else {
            return false;
        }

    }

    extractData(signature) {
        if (this.check_address_in_one_row(signature) === false) {
            // Adresse nicht in einer Zeile – alternative Extraktion

            if (this.check_zip_and_city(signature) === false) {
                // PLZ und Ort nicht in einer Zeile gefunden
            }

            if (this.check_street_and_number(signature) === false) {
                // Straße und Hausnummer nicht gefunden
            }

        }

        if (this.check_country(signature) === false) {
            // Land nicht gefunden – Fallback: Deutschland
            // todo: PLZ-Länge prüfen, um Land besser zu erkennen (CH: 4-stellig, AT: 4-stellig)
            this.country = "Deutschland";
        }

        // Adresssuche abgeschlossen – weitere Felder extrahieren

        if (this.check_email_adress(signature) === false) {
            // E-Mail-Adresse nicht gefunden
        }

        if (this.check_fax_number(signature) === false) {
            // Faxnummer nicht gefunden
        }

        if (this.check_phone_number(signature) === false) {
            // Telefonnummer nicht gefunden
        }

        if (this.check_mobile_number(signature) === false) {
            // Handynummer nicht gefunden
        }

        if (this.check_company_name(signature) === false) {
            // Firmenname nicht gefunden
        }

        if (this.check_website(signature) === false) {
            // Website nicht gefunden
        }

        this.check_court_registration(signature);

        this.check_name(signature);
        this.check_job(signature);

    }

    check_court_registration(signature) {
        logging("Amtsgericht-Eintrag prüfen");
        // Entfernt Zeilen wie „Amtsgericht Musterstadt HRB 123456" oder „Registergericht München, HRA 456"
        let regex = /^.*(?:Amts|Register)gericht\b.*$/im;
        while (this.perform_regex_check(regex, signature) !== false) {}
    }

    check_name(signature) {
        logging("Name prüfen");
        const index = signature.remaining.findIndex(line => /[a-zA-ZäöüÄÖÜß]/.test(line));
        if (index !== -1) {
            this.name = signature.remaining[index].trim();
            signature.remaining[index] = "";
        }
    }

    check_job(signature) {
        logging("Jobtitel prüfen");
        const index = signature.remaining.findIndex(line => /[a-zA-ZäöüÄÖÜß]/.test(line));
        if (index !== -1 && !signature.remaining[index].includes(":")) {
            this.job = signature.remaining[index].trim();
            signature.remaining[index] = "";
        }
    }


    writeFormFields() {

        document.getElementById("name").value = this.name;
        document.getElementById("stellenbezeichnung").value = this.job;
        document.getElementById("email").value = this.email;
        document.getElementById("telefonnummer").value = this.phone;
        document.getElementById("handynummer").value = this.mobile;
        document.getElementById("faxnummer").value = this.fax;
        document.getElementById("adresse").value = this.street;
        document.getElementById("postleitzahl").value = this.zip;
        document.getElementById("ort").value = this.city;
        document.getElementById("land").value = this.country;
        document.getElementById("firma").value = this.company;
        document.getElementById("website").value = this.website;

    }
}


function signatureExtraction() {

    const signature = new Signature("");

    signature.readSignatureFromTextarea();

    const contact = new Contact();

    contact.extractData(signature);

    logging("Alle Kontaktdaten:");
    logging(contact);

    contact.writeFormFields();

}


function logging(logmsg, loglabel = false) {

    if (loglabel !== false) {
        console.log(loglabel + ": " + logmsg);
    } else {
        console.log(logmsg);
    }

}

/*

Roadmap:

Extrahieren
- mehrere Tel/Mob/Fax-Nummern in einer Zeile: prüfen und ggf. in einzelne Zeilen verschieben
- Berücksichtigung von Österreich & Schweiz bei der Adress-Suche (unterschiedlicher PLZ-Aufbau)

Export
- QR Code: Kontakt einscannen für Nutzer ohne Desktop-App?

*/
