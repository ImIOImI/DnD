var clickEventFactory;
clickEventFactory = {
    event: null,
    target: null,
    isSpell: null,
    spell: null,

    build: function (event) {
        //console.log(event);
        this.event = event;
        this.target = event.target;
        row = this.findRow(event);
        console.log(row);
        spell = this.buildSpell(row);

        return spell;
    },

    findRow: function (event) {
        //we need to figure out if we just clicked on the span or the button
        tagName = clickEventFactory.event.target.tagName;
        console.log(event);
        console.log(event.target.closest(".ct-spells-spell"));
        return event.target.closest(".ct-spells-spell");
    },

    buildSpell: function (row) {
        var name;
        var modifier;
        var save;
        var dice;
        var notes;

        self = this;
        console.log(row.querySelectorAll('div'));

        row.querySelectorAll('div').forEach(function (div) {
            text = null;
            switch (div.className.trim()) {
                case 'ct-spells-spell__label':
                case 'ct-spells-spell__label ct-spells-spell__label--scaled':
                case self.regTest('__label', div.className):
                    name = div.innerText;
                    break;
                case 'ct-spells-spell__attacking':
                    modifier = div.innerText.replace(/[\n\r]+/g, '');
                    break;
                case 'ct-spells-spell__save':
                    save = div.innerText;
                    break;
                case 'ct-spells-spell__damage':
                    dice = div.innerText.replace(/[\n\r]+/g, '').replace(/\*+/g, '');
                    break;
                case 'ct-spells-spell__notes':
                    notes = div.innerText.replace(/[\n\r]+/g, '').replace(/\*+/g, '');
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