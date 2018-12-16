$(window).ready(function(){
    cantripEvent.addButton();
    var mf = ModalFactory;
    mf.initModal();
});

var cantripEvent = {
    addButton : function() {
        document.arrive(".ct-spells__content", function() {
            $("[class$='spell__at-will']").parent().html('<button class="ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button character-button-block-small character-button--disabled"><span class="ct-spells-spell__at-will" style="color: #fefefe">At Will</span></button>');
        });
    }
}