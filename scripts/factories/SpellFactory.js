var SpellFactory = {
    resolveSpell: function () {
        var name = Spell.name.replace(/\s/g, '');

        if (typeof SpellFactory[name] == 'undefined') {
            return this.default(Spell);
        }

        return SpellFactory[name](Spell);
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
        var allAttacks = [];
        Spell.modifier = 8;
        Spell.dice = '1d4+4';
        this.multiAttack(10);
        allAttacks['tiny'] = Spell.attacks;
        // Spell.attacks = [];
        //
        // Spell.modifier = 6;
        // Spell.dice = '1d8+2';
        // this.multiAttack(10);
        // allAttacks['small'] = Spell.attacks;
        // Spell.attacks = [];
        //
        // Spell.modifier = 5;
        // Spell.dice = '2d6+1';
        // this.multiAttack(5);
        // allAttacks['medium'] = Spell.attacks;
        // Spell.attacks = [];
        //
        // Spell.modifier = 6;
        // Spell.dice = '2d10+2';
        // this.multiAttack(2);
        // allAttacks['large'] = Spell.attacks;
        // Spell.attacks = [];
        //
        // Spell.modifier = 8;
        // Spell.dice = '2d12+4';
        // this.multiAttack(1);
        // allAttacks['huge'] = Spell.attacks;
        // Spell.attacks = allAttacks;
    },

    setModal : function(attacks, title) {
        ModalFactory.setAttacks(attacks);
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
    }
}
