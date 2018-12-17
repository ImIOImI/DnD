var SpellFactory = {
    resolveSpell: function () {
        var sf = SpellFactory;
        var name = sf.normalizeName(Spell.name);

        if (!sf.isSpell(name)) {
            return this.default(Spell);
        }

        return sf[name](Spell);
    },

    default: function () {
        this.attack(0);
        SpellFactory.setModal(Spell.attacks, false);
    },

    MagicMissile: function () {
        var attacks = 3 + this.getAdditionalAttacks();
        this.multiAttack(attacks);
        SpellFactory.setModal(Spell.attacks, false);
    },

    CloudOfDaggers: function () {
        this.attack(0);
        SpellFactory.setModal(Spell.attacks, false);
    },

    ScorchingRay: function () {
        var attacks = 3 + this.getAdditionalAttacks();
        this.multiAttack(attacks);
        SpellFactory.setModal(Spell.attacks, false);
    },

    AnimateObjects: function () {
        var sf = SpellFactory;

        Spell.modifier = 8;
        Spell.dice = '1d4+4';
        sf.multiAttack(10);
        sf.setModal(Spell.attacks, 'Tiny Object Attack', false);

        Spell.attacks = [];
        Spell.modifier = 6;
        Spell.dice = '1d8+2';
        sf.multiAttack(10);
        sf.setModal(Spell.attacks, 'Small Object Attack', true);

        Spell.attacks = [];
        Spell.modifier = 5;
        Spell.dice = '2d6+1';
        sf.multiAttack(5);
        sf.setModal(Spell.attacks, 'Medium Object Attack', true);

        Spell.attacks = [];
        Spell.modifier = 6;
        Spell.dice = '2d10+2';
        sf.multiAttack(2);
        sf.setModal(Spell.attacks, 'Large Object Attack', true);

        Spell.attacks = [];
        Spell.modifier = 8;
        Spell.dice = '2d12+4';
        sf.multiAttack(1);
        sf.setModal(Spell.attacks, 'Huge Object Attack', true);
    },

    TolltheDead: function () {
        sf = SpellFactory;
        sf.attack(0);
        SpellFactory.setModal(Spell.attacks, 'If Creature is at 100% Health');

        Spell.attacks = [];
        sf.attack(0);
        Spell.dice = Spell.dice.replace('d8', 'd12');
        SpellFactory.setModal(Spell.attacks, 'If Creature is Already Hurt');
    },

    setModal : function(attacks, title, collapse) {
        ModalFactory.buildTableFromAttacks(attacks, title, collapse);
        // ModalFactory.attacksToRows(attacks);
        //ModalFactory.setAttacks(attacks);
    },

    getAdditionalAttacks: function () {
        var r = /Count\: \+(\d)/
        m = r.exec(Spell.notes)
        if (m != null) {
            return parseInt(m[1]);
        }

        return 0;
    },

    attack: function (i) {
        var rolls = [];
        var hitModifier = 0;
        var damageRolls = [];
        var rows = [];

        if (i == null) {
            i = 0;
        }
        switch(true) {
            case (Spell.save != null):
                var save = Spell.save;
                break;
            case (Spell.modifier === '--'):
                //auto hit spell
                break;
            case (Spell.modifier != null):
                rolls[0] = Roll.d20();
                rolls[1] = Roll.d20();
                hitModifier = Spell.modifier;
                break;
            default:
                //don't do anything
        }

        var a = this.convertDice(Spell);
        var x = 0;
        var diceDamage = 0;
        for (; x < a.dice; x++) {
            var roll = Roll.roll(a.sides);
            damageRolls[x] = roll;
            diceDamage += roll;
        }

        var plus = 0;
        if(a.plus > 0) {
            plus = a.plus;
        }

        var damage = diceDamage + plus;
        Spell.attacks[i] = new Attack(rolls, hitModifier, damage, damageRolls, plus, Spell.save);
        return Spell;
    },

    multiAttack: function (attacks) {
        var a = parseInt(attacks);
        var i = 0;
        for (; i < a; i++) {
            this.attack(i);
        }
    },

    getDamage: function (Spell) {
        var a = this.convertDice(Spell);
    },

    convertDice: function (Spell) {
        var a = Spell.dice.split('d');
        var b = a[1].split('+');
        return {
            dice: a[0],
            sides: b[0],
            plus: parseInt(b[1])
        }
    },

    normalizeName : function(name) {
        return Spell.name.replace(/\s/g, '');
    },

    isSpell : function(name){
        name = SpellFactory.normalizeName(name);

        if (typeof SpellFactory[name] == 'undefined') {
            return false
        }
        return true;
    },
}
