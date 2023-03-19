// Tests nicht in zufälliger Reihenfolge ausführen
jasmine.getEnv().configure({
    random: false
});

// Eigener Reporter, der verhindert, dass nach dem Testlauf zur "Failures"-Ansicht gewechselt wird
function CustomReporter() {
    this.jasmineStarted = function () {
        const specListMenu = document.querySelector(".jasmine-spec-list-menu");
        if (specListMenu) {
            specListMenu.click();
        }
    };

    this.jasmineDone = function () {
        // Kurze Verzögerung, damit das DOM nach dem Testlauf vollständig bereit ist
        setTimeout(function () {
            const specListMenu = document.querySelector(".jasmine-spec-list-menu");
            if (specListMenu) {
                specListMenu.click();
            }
        }, 100);
    };
}

jasmine.getEnv().addReporter(new CustomReporter());
