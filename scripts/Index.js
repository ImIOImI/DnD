var cantripEvent = {
    initialized : false,

    addButton : function() {
        document.arrive(".ct-spells__content", function() {
            if(cantripEvent.initialized == true){
                return false;
            }
            console.log('at will');

            var cantrips = document.querySelectorAll('.ct-spells-spell__at-will');
            cantrips.forEach(function (cantrip) {
                cantrip.parentElement.innerHTML = '<button class="ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button character-button-block-small character-button--disabled"><span class="ct-spells-spell__at-will" style="color: #fefefe">At Will</span></button>';
            });
            cantripEvent.initialized = true;
        });
    }
}

var spellActionEvent = {
    initialized : false,

    addEvent : function() {
        if(spellActionEvent.initialized == true){
            return false;
        }
        console.log('action');

        document.arrive(".ct-spells-spell__action", function() {
            ModalFactory.initModal();
        });
        spellActionEvent.initialized = true;
    }
}

cantripEvent.addButton();
spellActionEvent.addEvent();