
tstcon = new Contact;
tstsig = new Signature("");

describe("basic tests", function() {

    describe("contact tests", function() {

        it("reset contact, name is empty", function() {
            tstcon.reset_all_data();
            expect(tstcon.name).toBe("");
        });

        it("set name to Max Mustermann", function() {
            tstcon.name = "Max Mustermann";
            expect(tstcon.name).toBe("Max Mustermann");
        });
  
    });

    describe("signature tests", function() {
        it("set simple signature 'Testing'", function() {
            tstsig.setSignature("Testing");
            expect(tstsig.input).toBe("Testing");
        });

        it("check split of rows", function() {
            tstsig.setSignature("Row 1\nRow 2\nRow3");
            expect(tstsig.remaining[1]).toBe("Row 2");
        });
  
    });

});

describe("address tests", function() {

    describe("address in one row", function() {

        describe("Gewerbegebiet Ziesegrund 17440 Hohendorf bei Wolgast", function() {

            beforeAll(function() {
                tstcon.reset_all_data();
                tstsig.setSignature("Gewerbegebiet Ziesegrund 17440 Hohendorf bei Wolgast");
                tstcon.check_address_in_one_row(tstsig);    
            });
        
            it("street", function() {
                expect(tstcon.street).toBe("Gewerbegebiet Ziesegrund");
            });
    
            it("zip", function() {
                expect(tstcon.zip).toBe("17440");
            });

            it("city", function() {
                expect(tstcon.city).toBe("Hohendorf bei Wolgast");
            });

        });
      
    });

});


describe("Signaturtests", function() {

    const testCases = [
    {
        signature: "John Doe\nSoftware Engineer\njohn.doe@example.com\nTel: +123456789",
        expected: {
        name: "John Doe",
        job: "Software Engineer",
        email: "john.doe@example.com",
        phone: "+123456789",
        mobile: "",
        fax: "",
        street: "",
        zip: "",
        city: "",
        country: "Deutschland",
        company: "",
        website: ""
        }
    },
    {
        signature: "Jane Smith\nMarketing Manager\njane.smith@example.com\nTel: +987654321",
        expected: {
        name: "Jane Smith",
        job: "Marketing Manager",
        email: "jane.smith@example.com",
        phone: "+987654321",
        mobile: "",
        fax: "",
        street: "",
        zip: "",
        city: "",
        country: "Deutschland",
        company: "",
        website: ""
        }
    },
    // 1. GmbH - Format mit "Tel:" und "Fax:"
    {
        signature: "Anna Weber\nProjektleitung\nTechSolutions GmbH\nBahnhofstraße 42\n80335 München\nTel: +49 89 1234-5000\nFax: +49 89 1234-5099\nE-Mail: a.weber@techsolutions.de\nwww.techsolutions.de\nGeschäftsführer: Klaus Müller, Petra Schmidt\nAmtsgericht München, HRB 234567",
        expected: {
            name: "Anna Weber",
            job: "Projektleitung",
            email: "a.weber@techsolutions.de",
            phone: "+49 89 1234-5000",
            mobile: "",
            fax: "+49 89 1234-5099",
            street: "Bahnhofstraße 42",
            zip: "80335",
            city: "München",
            country: "Deutschland",
            company: "TechSolutions GmbH",
            website: "http://www.techsolutions.de"
        }
    },
    // 2. AG - Format mit "Telefon:" und "Handy:"
    {
        signature: "Martin Bauer\nVertriebsleiter\nSchütz AG\nMarienplatz 12\n70173 Stuttgart\nTelefon: 0711 / 22 33 44\nHandy: +49 172 8765432\nE-Mail: m.bauer@schuetz-ag.de\nInternet: www.schuetz-ag.de\nAufsichtsratsvorsitzender: Heinrich König\nSitz: Stuttgart, Registergericht: Amtsgericht Stuttgart, HRB 567890",
        expected: {
            name: "Martin Bauer",
            job: "Vertriebsleiter",
            email: "m.bauer@schuetz-ag.de",
            phone: "0711 / 22 33 44",
            mobile: "+49 172 8765432",
            fax: "",
            street: "Marienplatz 12",
            zip: "70173",
            city: "Stuttgart",
            country: "Deutschland",
            company: "Schütz AG",
            website: "http://www.schuetz-ag.de"
        }
    },
    // 3. KG - Format mit "T:" und "M:"
    {
        signature: "Sabine Hoffmann\nGeschäftsführung\nHoffmann & Söhne KG\nBurgstraße 89\n10178 Berlin\nT: 030 / 4567-890\nM: +49 171 2345678\nE-Mail: s.hoffmann@hoffmann-soehne.de\nWeb: www.hoffmann-soehne.de\nPersönlich haftender Gesellschafter: Franz Hoffmann & Partner GmbH\nRegistergericht: Amtsgericht Berlin-Mitte, HRB 890123",
        expected: {
            name: "Sabine Hoffmann",
            job: "Geschäftsführung",
            email: "s.hoffmann@hoffmann-soehne.de",
            phone: "030 / 4567-890",
            mobile: "+49 171 2345678",
            fax: "",
            street: "Burgstraße 89",
            zip: "10178",
            city: "Berlin",
            country: "Deutschland",
            company: "Hoffmann & Söhne KG",
            website: "http://www.hoffmann-soehne.de"
        }
    },
    // 5. GmbH & Co. KG - Format mit "Phone:" (englisch)
    {
        signature: "Robert Kellner\nProjektmanagement\nRK Consulting GmbH & Co. KG\nIndustriestraße 234\n50997 Köln\nPhone: +49 221 9876-543\nFax: +49 221 9876-599\nMobile: +49 177 9876543\nEmail: r.kellner@rk-consulting.de\nwww.rk-consulting.de\nGF: Michael Kellner (GmbH), persönlich haftend: RK Beteiligungen GmbH\nHR: Amtsgericht Köln, HRB 456789",
        expected: {
            name: "Robert Kellner",
            job: "Projektmanagement",
            email: "r.kellner@rk-consulting.de",
            phone: "+49 221 9876-543",
            mobile: "+49 177 9876543",
            fax: "+49 221 9876-599",
            street: "Industriestraße 234",
            zip: "50997",
            city: "Köln",
            country: "Deutschland",
            company: "RK Consulting GmbH & Co. KG",
            website: "http://www.rk-consulting.de"
        }
    },
    // 6. UG (haftungsbeschränkt) - Format kompakt
    {
        signature: "Julia Schmidt\nGeschäftsführerin\nMaxPower UG (haftungsbeschränkt)\nGrüner Weg 67\n20251 Hamburg\nT: 040-5555666\nM: 0160-777888\nE: j.schmidt@maxpower-ug.de\nwww.maxpower-ug.de\nGF: Julia Schmidt | HRB 123456",
        expected: {
            name: "Julia Schmidt",
            job: "Geschäftsführerin",
            email: "j.schmidt@maxpower-ug.de",
            phone: "040-5555666",
            mobile: "0160-777888",
            fax: "",
            street: "Grüner Weg 67",
            zip: "20251",
            city: "Hamburg",
            country: "Deutschland",
            company: "MaxPower UG (haftungsbeschränkt)",
            website: "http://www.maxpower-ug.de"
        }
    },
    // 7. GmbH - Variante mit Abteilungsangabe
    {
        signature: "Thomas Berger\nLeiter Kundenservice | Service-Abteilung\nDataCare GmbH\nTechnologiepark 10\n45131 Essen\nTel.: +49 201 12345-200\nFax: +49 201 12345-299\nMobil: +49 171 555666\nE-Mail: t.berger@datacare.de\nWebsite: www.datacare.de\nGeschäftsführer: Hartmut Lüdke, Sandra Wirth\nOrt: Essen | Registergericht: Amtsgericht Essen | HRB 111222",
        expected: {
            name: "Thomas Berger",
            job: "Leiter Kundenservice | Service-Abteilung",
            email: "t.berger@datacare.de",
            phone: "+49 201 12345-200",
            mobile: "+49 171 555666",
            fax: "+49 201 12345-299",
            street: "Technologiepark 10",
            zip: "45131",
            city: "Essen",
            country: "Deutschland",
            company: "DataCare GmbH",
            website: "http://www.datacare.de"
        }
    },
    // 8. Partnerschaft (PartGmbB) - Format
    {
        signature: "Klaus Großmann\nPartnerschaft\nRechtsanwälte Großmann & Partner PartGmbB\nFriedrichstraße 200\n10117 Berlin\nTelefon: 030 / 2020-5000\nTelefax: 030 / 2020-5099\nMobil: +49 174 123456\nE-Mail: k.grossmann@ra-partner.de\nwww.ra-partner.de\nHRB: Amtsgericht Berlin-Charlottenburg, HRB 999888",
        expected: {
            name: "Klaus Großmann",
            job: "Partnerschaft",
            email: "k.grossmann@ra-partner.de",
            phone: "030 / 2020-5000",
            mobile: "+49 174 123456",
            fax: "030 / 2020-5099",
            street: "Friedrichstraße 200",
            zip: "10117",
            city: "Berlin",
            country: "Deutschland",
            company: "Rechtsanwälte Großmann & Partner PartGmbB",
            website: "http://www.ra-partner.de"
        }
    },
    // 9. Dienstleistungs-GmbH - Format mit Mehrfach-Nummern
    {
        signature: "Petra Hoffmann\nAccount Manager\nBuildMore GmbH\nBaumeister-Straße 99\n76131 Karlsruhe\nT +49 721 88 999 000 | Zentrale\nT +49 721 88 999 111 | Direktwahl\nF +49 721 88 999 199\nM +49 170 1234567\nMail: p.hoffmann@buildmore.de\nWeb: www.buildmore.de\nGF: Werner Koch, Sylvia Nolte | Amtsgericht Karlsruhe, HRB 445566",
        expected: {
            name: "Petra Hoffmann",
            job: "Account Manager",
            email: "p.hoffmann@buildmore.de",
            phone: "+49 721 88 999 000",
            mobile: "+49 170 1234567",
            fax: "+49 721 88 999 199",
            street: "Baumeister-Straße 99",
            zip: "76131",
            city: "Karlsruhe",
            country: "Deutschland",
            company: "BuildMore GmbH",
            website: "http://www.buildmore.de"
        }
    },
    // 10. Großunternehmen AG - Format mit Mehrstandorten
    {
        signature: "Dr. Michael Richter\nLeiter Forschung & Entwicklung | Standort Bielefeld\nInnovationskonzern AG\nArtur-Lademann-Str. 40\n33617 Bielefeld\nTelefon: +49 521 5555-3000\nFaxnummer: +49 521 5555-3099\nMobil: +49 160 888999\nE-Mail: m.richter@innovationskonzern.de\nWebsite: www.innovationskonzern.de\nAufsichtsratsvorsitzender: Dr. Petra Schulze | Sitz: Frankfurt a.M.\nRegistergericht: Amtsgericht Frankfurt a.M., HRB 333555",
        expected: {
            name: "Dr. Michael Richter",
            job: "Leiter Forschung & Entwicklung | Standort Bielefeld",
            email: "m.richter@innovationskonzern.de",
            phone: "+49 521 5555-3000",
            mobile: "+49 160 888999",
            fax: "+49 521 5555-3099",
            street: "Artur-Lademann-Str. 40",
            zip: "33617",
            city: "Bielefeld",
            country: "Deutschland",
            company: "Innovationskonzern AG",
            website: "http://www.innovationskonzern.de"
        }
    },
    // 11. Mittelständischer Betrieb - Format mit Handwerkseintrag
    {
        signature: "Frank Meisner\nMeisterbetrieb für Heizungstechnik\nWohnraumtechnik Meisner GmbH\nWerkstraße 12\n52051 Aachen\nTel: 0241 / 404050\nFax: 0241 / 4040599\nMobil: +49 152 12345678\nE-Mail: f.meisner@wohnraum-meisner.de\nWeb: www.wohnraum-meisner.de\nGF: Frank Meisner | Handwerkskammer Aachen registriert",
        expected: {
            name: "Frank Meisner",
            job: "Meisterbetrieb für Heizungstechnik",
            email: "f.meisner@wohnraum-meisner.de",
            phone: "0241 / 404050",
            mobile: "+49 152 12345678",
            fax: "0241 / 4040599",
            street: "Werkstraße 12",
            zip: "52051",
            city: "Aachen",
            country: "Deutschland",
            company: "Wohnraumtechnik Meisner GmbH",
            website: "http://www.wohnraum-meisner.de"
        }
    },
    // 12. Internationale GmbH mit Niederlassung
    {
        signature: "Elisabeth Krause\nVertrieb International\nGlobalTrade GmbH (Niederlassung Bayern)\nLindwurmstraße 88\n80337 München\nTelefon: +49 89 3044-5555\nFaxnummer: +49 89 3044-5566\nMobil: +49 160 44556677\nEmail: e.krause@globaltrade-de.de\nHomepage: www.globaltrade-de.de\nAmtsgericht München, HRB 777888 | Sitz: Hamburg | Inhaber: GlobalTrade International B.V. (Niederlande)",
        expected: {
            name: "Elisabeth Krause",
            job: "Vertrieb International",
            email: "e.krause@globaltrade-de.de",
            phone: "+49 89 3044-5555",
            mobile: "+49 160 44556677",
            fax: "+49 89 3044-5566",
            street: "Lindwurmstraße 88",
            zip: "80337",
            city: "München",
            country: "Deutschland",
            company: "GlobalTrade GmbH",
            website: "http://www.globaltrade-de.de"
        }
    },
    // 13. Medienunternehmen GmbH - Format modern
    {
        signature: "David Sommer\nCreative Director\nPixelWorks GmbH\nMedienmeile 123\n22769 Hamburg\nT 040 309090 | Office\nM +49 173 9876543 | Direct\nF 040 3090999\nWeb www.pixelworks.de\nEmail: d.sommer@pixelworks.de\nGeschäftsführung: Renate Hoffmann\nHandelsregister: Amtsgericht Hamburg, HRB 112233",
        expected: {
            name: "David Sommer",
            job: "Creative Director",
            email: "d.sommer@pixelworks.de",
            phone: "040 309090",
            mobile: "+49 173 9876543",
            fax: "040 3090999",
            street: "Medienmeile 123",
            zip: "22769",
            city: "Hamburg",
            country: "Deutschland",
            company: "PixelWorks GmbH",
            website: "http://www.pixelworks.de"
        }
    },
    // 14. Tel ist am Ende
    {
        signature: "--\n\nDeutsche Muster GmbH\nAlex Meier\nConsultant\nHausanschrift: Musterstraße 3, 12345 Jena\nPostanschrift: Postfach 10 11 12, 01234 Dresden\n+49 3641 12345 1234 (Tel)\n+49 151 12345678 (Mobil)\nE-Mail: alex.meier@deutschemuster.de\n\nDie gesetzlichen Pflichtangaben finden Sie unter: www.deutschemuster.de/pflichtangaben",
        expected: {
            name: "Alex Meier",
            job: "Consultant",
            email: "alex.meier@deutschemuster.de",
            phone: "+49 3641 12345 1234",
            mobile: "+49 151 12345678",
            fax: "",
            street: "Musterstraße 3",
            zip: "12345",
            city: "Jena",
            country: "Deutschland",
            company: "Deutsche Muster GmbH",
            website: "http://www.deutschemuster.de/pflichtangaben"
        }
    },
    // 15. Anwaltskanzlei GmbH - Format mit Kammereintrag
    {
        signature: "Rechtsanwalt Christian Meyer\nMeyer & Kollegen Anwaltsgesellschaft mbH\nKant-Straße 45\n10623 Berlin\nTelefon: 030 8120-3344\nFaxnummer: 030 8120-3399\nMobil: +49 151 42424242\nE-Mail: c.meyer@meyer-kollegen.de\nWebsite: www.meyer-kollegen.de\nGründer und Partner: Helga Lange, Christian Meyer\nAnwaltskammer Berlin, Amtsgericht Berlin-Charlottenburg, HRB 555666",
        expected: {
            name: "Rechtsanwalt Christian Meyer",
            job: "",
            email: "c.meyer@meyer-kollegen.de",
            phone: "030 8120-3344",
            mobile: "+49 151 42424242",
            fax: "030 8120-3399",
            street: "Kant-Straße 45",
            zip: "10623",
            city: "Berlin",
            country: "Deutschland",
            company: "Meyer & Kollegen Anwaltsgesellschaft mbH",
            website: "http://www.meyer-kollegen.de"
        }
    },
    // 16. Verwaltungs-GmbH - Format offiziell
    {
        signature: "Bernd Schulze\nVerwaltungsrat | Büro München\nVerwaltungsgesellschaft bR\nMaximilian-Straße 56\n80538 München\nT: +49 89 212121-0 (Zentrale)\nT: +49 89 212121-200 (Durchwahlnummer)\nF: +49 89 212121-9999\nM: +49 170 7654321\nEmail: b.schulze@vg-br.de\nHomepage: www.verwaltungsgesellschaft-br.de\nGeschäftsführer: Wolfgang Kraft, Inge Schmitt\nGerichtsstand: Amtsgericht München, HRB 666777",
        expected: {
            name: "Bernd Schulze",
            job: "Verwaltungsrat | Büro München",
            email: "b.schulze@vg-br.de",
            phone: "+49 89 212121-0",
            mobile: "+49 170 7654321",
            fax: "+49 89 212121-9999",
            street: "Maximilian-Straße 56",
            zip: "80538",
            city: "München",
            country: "Deutschland",
            company: "Verwaltungsgesellschaft bR",
            website: "http://www.verwaltungsgesellschaft-br.de"
        }
    },
    // 17. Software-Startup GmbH - Format minimalistisch
    {
        signature: "Lisa Wagner\nCo-Founder & CEO\nAppFlow GmbH\nSaarbrücker Straße 89\n10405 Berlin\nTel 030-555-0123\nMob +49-172-555-6789\nweb www.appflow.de\nmail l.wagner@appflow.de\nHR: Amtsgericht Berlin-Charlottenburg, HRB 888999",
        expected: {
            name: "Lisa Wagner",
            job: "Co-Founder & CEO",
            email: "l.wagner@appflow.de",
            phone: "030-555-0123",
            mobile: "+49-172-555-6789",
            fax: "",
            street: "Saarbrücker Straße 89",
            zip: "10405",
            city: "Berlin",
            country: "Deutschland",
            company: "AppFlow GmbH",
            website: "http://www.appflow.de"
        }
    },
    // 18. Finanz-AG - Format mit kompletten Angaben
    {
        signature: "Prof. Dr. Johannes Weber\nBereichsleiter Kapitalanlage\nFinanzPro AG\nKönigstraße 123\n70173 Stuttgart\nTelefon: +49 711 88-0\nSekretariat: +49 711 88-1234\nDirektwahlnummer: +49 711 88-5678\nTelefax: +49 711 88-99999\nMobil: +49 170 123456\nE-Mail: j.weber@finanzpro-ag.de\nwww.finanzpro-ag.de\nVorstandsmitglieder: Dr. Helmut Franzen, Walter Strobel\nAufsichtsratsvorsitzender: Günter Herwig\nSitz: Stuttgart, Registergericht: Amtsgericht Stuttgart, HRB 777555",
        expected: {
            name: "Prof. Dr. Johannes Weber",
            job: "Bereichsleiter Kapitalanlage",
            email: "j.weber@finanzpro-ag.de",
            phone: "+49 711 88-0",
            mobile: "+49 170 123456",
            fax: "+49 711 88-99999",
            street: "Königstraße 123",
            zip: "70173",
            city: "Stuttgart",
            country: "Deutschland",
            company: "FinanzPro AG",
            website: "http://www.finanzpro-ag.de"
        }
    },
    // 19. Betriebliche Wohnungswirtschaft - Genossenschaft Format
    {
        signature: "Horst Richter\nGeschäftsführung\nWohnungsbau eG\nGoethestraße 11\n50937 Köln\nTelefon: 0221 / 444-0\nFax: 0221 / 444-5555\nHandy: +49 160 88889999\nE-Mail: h.richter@wohnungsbau-eg.de\nwww.wohnungsbau-eg.de\nGenossenschaftsregister: Amtsgericht Köln, GnR 5555\nVorstand: Karl Hoffmann, Petra Bauer",
        expected: {
            name: "Horst Richter",
            job: "Geschäftsführung",
            email: "h.richter@wohnungsbau-eg.de",
            phone: "0221 / 444-0",
            mobile: "+49 160 88889999",
            fax: "0221 / 444-5555",
            street: "Goethestraße 11",
            zip: "50937",
            city: "Köln",
            country: "Deutschland",
            company: "Wohnungsbau eG",
            website: "http://www.wohnungsbau-eg.de"
        }
    },
    // 20. Beratungs-GmbH - Format mit akademischem Titel
    {
        signature: "Dr. Burkhard Hoffmann\nSenior Consultant\nStrategy & Partners GmbH\nTheodor-Heuss-Ring 13\n50668 Köln\nT: +49 221 8000-400\nT (Zentrale): +49 221 8000-0\nF: +49 221 8000-799\nM: +49 171 5555666\nE-Mail: b.hoffmann@strategy-partners.de\nweb: www.strategy-partners.de\nGF: Dr. Michael Schenk, Anja Müller | HRB 444555 (Amtsgericht Köln)",
        expected: {
            name: "Dr. Burkhard Hoffmann",
            job: "Senior Consultant",
            email: "b.hoffmann@strategy-partners.de",
            phone: "+49 221 8000-400",
            mobile: "+49 171 5555666",
            fax: "+49 221 8000-799",
            street: "Theodor-Heuss-Ring 13",
            zip: "50668",
            city: "Köln",
            country: "Deutschland",
            company: "Strategy & Partners GmbH",
            website: "http://www.strategy-partners.de"
        }
    },
    // 21. Versicherungs-AG - Format mit Vermittlernummer
    {
        signature: "Silvio Schäfer\nVertriebsmanager\nVersicherPro AG\nAdolf-Jörg-Straße 22\n14482 Potsdam\nTelefon: 0331 2040-6000\nFaxnummer: 0331 2040-6099\nMobiltelefon: +49 162 3333444\nE-Mail: s.schaefer@versicherpro-ag.de\nWebsite: www.versicherpro-ag.de\nVermittlerregisternummer: 44555666\nSitz: Frankfurt a.M., Registergericht: Amtsgericht Frankfurt, HRB 111222",
        expected: {
            name: "Silvio Schäfer",
            job: "Vertriebsmanager",
            email: "s.schaefer@versicherpro-ag.de",
            phone: "0331 2040-6000",
            mobile: "+49 162 3333444",
            fax: "0331 2040-6099",
            street: "Adolf-Jörg-Straße 22",
            zip: "14482",
            city: "Potsdam",
            country: "Deutschland",
            company: "VersicherPro AG",
            website: "http://www.versicherpro-ag.de"
        }
    },
    // 22. Einzelhandelskette GmbH - Format mit Filialangabe
    {
        signature: "Margret Bauer\nVerkaufsleitung | Filiale Leipzig\nFashion Plus GmbH\nPetersstraße 88\n04109 Leipzig\nTel: 0341 / 123456\nFax: 0341 / 123457\nMobil: 0160 88776655\nE-Mail: m.bauer@fashionplus-gmbh.de\nwww.fashionplus-gmbh.de\nGF: Helmut Preuß, Iris Meisner\nRegistergericht: Amtsgericht Leipzig, HRB 333444\nZentrale: Leipzig",
        expected: {
            name: "Margret Bauer",
            job: "Verkaufsleitung | Filiale Leipzig",
            email: "m.bauer@fashionplus-gmbh.de",
            phone: "0341 / 123456",
            mobile: "0160 88776655",
            fax: "0341 / 123457",
            street: "Petersstraße 88",
            zip: "04109",
            city: "Leipzig",
            country: "Deutschland",
            company: "Fashion Plus GmbH",
            website: "http://www.fashionplus-gmbh.de"
        }
    },
    // 23. Ingenieur-Büro GmbH - Format mit Betriebsstättennummer
    {
        signature: "Dipl.-Ing. Richard Kohler\nProjektleiter Hochbau\nKohler Bauingenieure GmbH\nRichard-Wagner-Str. 12\n45659 Recklinghausen\nTelefon: 02361 50440\nTelefax: 02361 504499\nHandy: +49 175 1234567\nE-Mail: r.kohler@kohler-bauingenieure.de\nwww.kohler-bauingenieure.de\nGeschäftsführer: Richard Kohler\nKammereintrag: Architekten- und Ingenieurkammer NRW\nRegistergericht: Amtsgericht Gelsenkirchen, HRB 555666",
        expected: {
            name: "Dipl.-Ing. Richard Kohler",
            job: "Projektleiter Hochbau",
            email: "r.kohler@kohler-bauingenieure.de",
            phone: "02361 50440",
            mobile: "+49 175 1234567",
            fax: "02361 504499",
            street: "Richard-Wagner-Str. 12",
            zip: "45659",
            city: "Recklinghausen",
            country: "Deutschland",
            company: "Kohler Bauingenieure GmbH",
            website: "http://www.kohler-bauingenieure.de"
        }
    },
    // 24. Steuerberatungs-GmbH - Format mit Kammereintrag
    {
        signature: "StB Ulrich Neubauer\nSteuerberater und Betriebswirt\nNeubauer & Team Steuerberater GmbH\nMainzer Straße 234\n65189 Wiesbaden\nT: 0611 / 9876-543\nF: 0611 / 9876-544\nM: +49 171 111222\nEmail: u.neubauer@neubauer-steuer.de\nwww.neubauer-steuer.de\nSteuerberater-Kammer Hessen registriert\nHRB: Amtsgericht Wiesbaden 66666",
        expected: {
            name: "StB Ulrich Neubauer",
            job: "Steuerberater und Betriebswirt",
            email: "u.neubauer@neubauer-steuer.de",
            phone: "0611 / 9876-543",
            mobile: "+49 171 111222",
            fax: "0611 / 9876-544",
            street: "Mainzer Straße 234",
            zip: "65189",
            city: "Wiesbaden",
            country: "Deutschland",
            company: "Neubauer & Team Steuerberater GmbH",
            website: "http://www.neubauer-steuer.de"
        }
    },
    // 25. Logistik-GmbH - Format mit Betriebsstättennummer
    {
        signature: "Werner Schäfer\nBetriebsleiter\nLogistiCare GmbH (Betriebsstätte Hannover)\nIndustriepark 45\n30855 Hannover\nTel: 0511-66666-0 | Zentrale\nTel: 0511-66666-555 | Betriebsleitung\nFax: 0511-66666-999\nMobil: +49 160-6666666\nEmail: w.schaefer@logisticare-gmbh.de\nWeb: www.logisticare-gmbh.de\nGeschäftsführer: Gottfried Hoffmann, Anke Richter\nHauptsitz: Braunschweig | HRB Hannover 777888",
        expected: {
            name: "Werner Schäfer",
            job: "Betriebsleiter",
            email: "w.schaefer@logisticare-gmbh.de",
            phone: "0511-66666-0",
            mobile: "+49 160-6666666",
            fax: "0511-66666-999",
            street: "Industriepark 45",
            zip: "30855",
            city: "Hannover",
            country: "Deutschland",
            company: "LogistiCare GmbH",
            website: "http://www.logisticare-gmbh.de"
        }
    },
    // 26. Gesundheitsdienstleister GmbH - Format
    {
        signature: "Prof. Dr. Dieter Hoffmann\nÄrztlicher Direktor\nMedServe Gesundheit GmbH\nKlinikerstraße 99\n81377 München\nTelefon: 089 / 77-0000\nÄrztlicher Notfalldienst: 089 / 77-9999\nFaxnummer: 089 / 77-1111\nMobil: +49 170 5555555\nE-Mail: d.hoffmann@medserve-gmbh.de\nwww.medserve-gmbh.de\nGeschäftsführer: Dr. Helmut Bauer\nHRB: Amtsgericht München 888999",
        expected: {
            name: "Prof. Dr. Dieter Hoffmann",
            job: "Ärztlicher Direktor",
            email: "d.hoffmann@medserve-gmbh.de",
            phone: "089 / 77-0000",
            mobile: "+49 170 5555555",
            fax: "089 / 77-1111",
            street: "Klinikerstraße 99",
            zip: "81377",
            city: "München",
            country: "Deutschland",
            company: "MedServe Gesundheit GmbH",
            website: "http://www.medserve-gmbh.de"
        }
    },
    // 27. Verlag GmbH - Format mit Abteilung
    {
        signature: "Anja Müller\nLektorin | Sachbuchverlag\nWissensmedien GmbH\nBuchstraße 111\n10115 Berlin\nTelefon: 030 / 2020-3000\nFax: 030 / 2020-3099\nMobil: +49 170 4747474\nE-Mail: a.mueller@wissenmedien-gmbh.de\nwww.wissenmedien-gmbh.de\nGeschäftsführung: Carl Richter, Petra Hoffmann\nRegistergericht: Amtsgericht Berlin-Charlottenburg, HRB 999111",
        expected: {
            name: "Anja Müller",
            job: "Lektorin | Sachbuchverlag",
            email: "a.mueller@wissenmedien-gmbh.de",
            phone: "030 / 2020-3000",
            mobile: "+49 170 4747474",
            fax: "030 / 2020-3099",
            street: "Buchstraße 111",
            zip: "10115",
            city: "Berlin",
            country: "Deutschland",
            company: "Wissensmedien GmbH",
            website: "http://www.wissenmedien-gmbh.de"
        }
    },
    // 28. Tourismus- und Hotelkette AG - Format
    {
        signature: "Klaus-Dieter Schäfer\nDirector of Sales\nHotel & Reisen Pro AG\nParkstraße 200\n10115 Berlin\nTel: +49 30 9000-0 (Zentrale)\nTel: +49 30 9000-500 (Direktwahl)\nFax: +49 30 9000-9999\nMobil: +49 172 888999\nE-Mail: k.schaefer@hotelproag.de\nwww.hotelproag.de\nVorstandsmitglieder: Dr. Peter Hoffmann, Marion Weber\nAufsichtsratsvorsitzender: Franz Herrmann\nSitz: Berlin | Registergericht: Amtsgericht Berlin-Charlottenburg, HRB 111333",
        expected: {
            name: "Klaus-Dieter Schäfer",
            job: "Director of Sales",
            email: "k.schaefer@hotelproag.de",
            phone: "+49 30 9000-0",
            mobile: "+49 172 888999",
            fax: "+49 30 9000-9999",
            street: "Parkstraße 200",
            zip: "10115",
            city: "Berlin",
            country: "Deutschland",
            company: "Hotel & Reisen Pro AG",
            website: "http://www.hotelproag.de"
        }
    },
    // 29. Architekturbüro - Format mit Titel
    {
        signature: "Dipl. Arch. Sabine Weber\nGeschäftsführerin\nWeber Architekten und Planer GmbH\nWilhelmstraße 45\n80801 München\nTelefon: 089 / 3838-0\nFaxnummer: 089 / 3838-999\nMobil: +49 170 123123\nE-Mail: s.weber@weber-architekten.de\nwww.weber-architekten.de\nRegistergericht: Amtsgericht München, HRB 555777\nArchitekten- u. Ingenieurkammer Bayern",
        expected: {
            name: "Dipl. Arch. Sabine Weber",
            job: "Geschäftsführerin",
            email: "s.weber@weber-architekten.de",
            phone: "089 / 3838-0",
            mobile: "+49 170 123123",
            fax: "089 / 3838-999",
            street: "Wilhelmstraße 45",
            zip: "80801",
            city: "München",
            country: "Deutschland",
            company: "Weber Architekten und Planer GmbH",
            website: "http://www.weber-architekten.de"
        }
    },
    // 30. Stiftung (rechtsfähig) - Format
    {
        signature: "Hans Gruber\nGeschäftsführer\nKulturförderung Hoffmann Stiftung bürgerlichen Rechts\nMuseumsstraße 5\n50667 Köln\nTelefon: 0221 / 2222-0\nFaxnummer: 0221 / 2222-99\nMobil: +49 170 2222222\nE-Mail: h.gruber@hoffmann-stiftung.de\nwww.hoffmann-stiftung.de\nStiftungsrat: Dr. Helmut König, Petra Hoffmann\nStiftungsvermögen: 5.000.000 Euro\nAmtsgericht Köln, Stiftungsregister",
        expected: {
            name: "Hans Gruber",
            job: "Geschäftsführer",
            email: "h.gruber@hoffmann-stiftung.de",
            phone: "0221 / 2222-0",
            mobile: "+49 170 2222222",
            fax: "0221 / 2222-99",
            street: "Museumsstraße 5",
            zip: "50667",
            city: "Köln",
            country: "Deutschland",
            company: "Kulturförderung Hoffmann Stiftung bürgerlichen Rechts",
            website: "http://www.hoffmann-stiftung.de"
        }
    },
    // 31. Mitgliedschaftsverband - Format
    {
        signature: "Renate Hoffmann\nGeschäftsführerin | Landesverband Bayern\nHandwerksbund e.V.\nRichard-Strauss-Str. 88\n80689 München\nT: 089 / 5555-0\nF: 089 / 5555-9999\nM: +49 171 444555\nEmail: r.hoffmann@handwerksbund-by.de\nWeb: www.handwerksbund-by.de\nRegisteramt: Amtsgericht München, VR 7777\nSatzung verfügbar unter: www.handwerksbund-by.de/satzung",
        expected: {
            name: "Renate Hoffmann",
            job: "Geschäftsführerin | Landesverband Bayern",
            email: "r.hoffmann@handwerksbund-by.de",
            phone: "089 / 5555-0",
            mobile: "+49 171 444555",
            fax: "089 / 5555-9999",
            street: "Richard-Strauss-Str. 88",
            zip: "80689",
            city: "München",
            country: "Deutschland",
            company: "Handwerksbund e.V.",
            website: "http://www.handwerksbund-by.de"
        }
    },
    ];

    testCases.forEach(function(testCase) {

        const signatureWithLineBreaks = testCase.signature.replace(/\n/g, "<br/>");

        describe("Signatur: " + signatureWithLineBreaks, function() {

            beforeAll(function() {
                tstcon.reset_all_data();
                tstsig.setSignature(testCase.signature);
                tstcon.extractData(tstsig);

                // Create a div element to display text in the frontend
                // const div = document.createElement('div');
                // div.innerHTML = "Processing signature:<br>" + signatureWithLineBreaks;
                // div.style.marginTop = "20px";  // Optional: adds space above the div
                // document.body.insertBefore(div, document.body.firstChild);
            });

            it("Name: " + testCase.expected.name, function() {
                expect(tstcon.name).toBe(testCase.expected.name);
            });

            it("Job: " + testCase.expected.job, function() {
                expect(tstcon.job).toBe(testCase.expected.job);
            });

            it("Email: " + testCase.expected.email, function() {
                expect(tstcon.email).toBe(testCase.expected.email);
            });

            it("Phone: " + testCase.expected.phone, function() {
                expect(tstcon.phone).toBe(testCase.expected.phone);
            });

            it("Mobile: " + testCase.expected.mobile, function() {
                expect(tstcon.mobile).toBe(testCase.expected.mobile);
            });

            it("Fax: " + testCase.expected.fax, function() {
                expect(tstcon.fax).toBe(testCase.expected.fax);
            });

            it("Street: " + testCase.expected.street, function() {
                expect(tstcon.street).toBe(testCase.expected.street);
            });

            it("Zip: " + testCase.expected.zip, function() {
                expect(tstcon.zip).toBe(testCase.expected.zip);
            });

            it("City: " + testCase.expected.city, function() {
                expect(tstcon.city).toBe(testCase.expected.city);
            });

            it("Country: " + testCase.expected.country, function() {
                expect(tstcon.country).toBe(testCase.expected.country);
            });

            it("Company: " + testCase.expected.company, function() {
                expect(tstcon.company).toBe(testCase.expected.company);
            });

            it("Website: " + testCase.expected.website, function() {
                expect(tstcon.website).toBe(testCase.expected.website);
            });

        });

    })

});

describe("Amtsgericht-Erkennung", function() {

    describe("check_court_registration direkt", function() {

        it("entfernt 'Amtsgericht Jena HRB 202327'", function() {
            tstsig.setSignature("Max Mustermann\nAmtsgericht Jena HRB 202327");
            tstcon.check_court_registration(tstsig);
            expect(tstsig.remaining.join("\n")).not.toContain("Amtsgericht");
        });

        it("entfernt 'Registergericht: Amtsgericht Stuttgart, HRB 567890'", function() {
            tstsig.setSignature("Max Mustermann\nRegistergericht: Amtsgericht Stuttgart, HRB 567890");
            tstcon.check_court_registration(tstsig);
            expect(tstsig.remaining.join("\n")).not.toContain("Amtsgericht");
        });

        it("entfernt 'Amtsgericht München, HRA 456' (HRA)", function() {
            tstsig.setSignature("Max Mustermann\nAmtsgericht München, HRA 456");
            tstcon.check_court_registration(tstsig);
            expect(tstsig.remaining.join("\n")).not.toContain("Amtsgericht");
        });

        it("entfernt mehrere Amtsgericht-Zeilen", function() {
            tstsig.setSignature("Max Mustermann\nAmtsgericht Jena HRB 202327\nAmtsgericht Köln VR 1234");
            tstcon.check_court_registration(tstsig);
            expect(tstsig.remaining.join("\n")).not.toContain("Amtsgericht");
        });

    });

    describe("Amtsgericht wird nicht als Job erkannt (Vollextraktion)", function() {

        beforeAll(function() {
            tstcon.reset_all_data();
            tstsig.setSignature("Max Mustermann\nGeschäftsführer\nMuster GmbH\nMusterstraße 1\n07743 Jena\nTel: 03641 123456\nmax@muster-gmbh.de\nwww.muster-gmbh.de\nAmtsgericht Jena HRB 202327");
            tstcon.extractData(tstsig);
        });

        it("Name korrekt", function() {
            expect(tstcon.name).toBe("Max Mustermann");
        });

        it("Job korrekt", function() {
            expect(tstcon.job).toBe("Geschäftsführer");
        });

        it("Amtsgericht nicht als Job erkannt", function() {
            expect(tstcon.job).not.toContain("Amtsgericht");
        });

    });

});