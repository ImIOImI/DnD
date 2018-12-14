var clickEventFactory;
clickEventFactory = {
    event: null,
    target: null,
    isSpell: null,
    spell: null,

    build: function (event, doc) {
        this.event = event;
        this.target = event.target;
        row = this.findRow(doc);
        spell = this.buildSpell(row);

        return spell;
    },

    findRow: function (doc) {
        //we need to figure out if we just clicked on the span or the button
        tagName = this.event.target.tagName;
        return $(this.event.target).closest(".ct-spells-spell");
    },

    buildSpell: function (row) {
        var name;
        var modifier;
        var save;
        var dice;
        var notes;

        self = this;
        row.find('div').each(function () {
            text = null;
            switch (this.className.trim()) {
                case 'ct-spells-spell__label':
                case 'ct-spells-spell__label ct-spells-spell__label--scaled':
                case self.regTest('__label', this.className):
                    name = this.innerText;
                    break;
                case 'ct-spells-spell__attacking':
                    modifier = this.innerText.replace(/[\n\r]+/g, '');
                    break;
                case 'ct-spells-spell__save':
                    save = this.innerText;
                    break;
                case 'ct-spells-spell__damage':
                    dice = this.innerText.replace(/[\n\r]+/g, '').replace(/\*+/g, '');
                    break;
                case 'ct-spells-spell__notes':
                    notes = this.innerText.replace(/[\n\r]+/g, '').replace(/\*+/g, '');
                    break;
                default:
            }
        });

        Spell.build(name, modifier, save, dice, notes);
    },

    regTest: function (re, str) {
        var regex = RegExp(re);
        if (regex.test(str)) {
            return true;
        }
        return false;
    }
};

var Spell = {
    build: function (name, modifier, save, dice, notes) {
        this.name = name;
        this.modifier = modifier;
        this.save = save;
        this.dice = dice;
        this.notes = notes;

        this.attacks = [];
    }
}