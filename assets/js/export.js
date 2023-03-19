"use strict";

// vCard-Download auslösen wenn der Button geklickt wird
const generateVCardBtn = document.getElementById("generateVCardBtn");

generateVCardBtn.addEventListener("click", function () {

    // Formulardaten auslesen
    const name = document.getElementById("name").value;
    const firma = document.getElementById("firma").value;
    const stellenbezeichnung = document.getElementById("stellenbezeichnung").value;
    const email = document.getElementById("email").value;
    const website = document.getElementById("website").value;
    const telefonnummer = document.getElementById("telefonnummer").value;
    const handynummer = document.getElementById("handynummer").value;
    const faxnummer = document.getElementById("faxnummer").value;
    const adresse = document.getElementById("adresse").value;
    const postleitzahl = document.getElementById("postleitzahl").value;
    const ort = document.getElementById("ort").value;
    const land = document.getElementById("land").value;

    // vCard 3.0 zusammenbauen
    let vCard = "BEGIN:VCARD\n";
    vCard += "VERSION:3.0\n";
    vCard += "N:" + name + ";;;\n";
    vCard += "FN:" + name + "\n";
    vCard += "ORG:" + firma + "\n";
    vCard += "TITLE:" + stellenbezeichnung + "\n";
    vCard += "EMAIL;TYPE=work:" + email + "\n";
    vCard += "URL;TYPE=work:" + website + "\n";
    vCard += "TEL;TYPE=work,voice:" + telefonnummer + "\n";
    vCard += "TEL;TYPE=cell,voice:" + handynummer + "\n";
    vCard += "TEL;TYPE=fax:" + faxnummer + "\n";
    vCard += "ADR;TYPE=work:;;" + adresse + ";" + ort + ";;" + postleitzahl + ";" + land + "\n";
    vCard += "END:VCARD";

    // Blob erstellen und als .vcf-Datei herunterladen
    const vCardBlob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });

    const vCardLink = document.createElement("a");
    vCardLink.href = window.URL.createObjectURL(vCardBlob);
    vCardLink.download = name + ".vcf";
    vCardLink.style.display = "none";

    document.body.appendChild(vCardLink);
    vCardLink.click();
    document.body.removeChild(vCardLink);

});
