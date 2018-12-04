var SpellFactory = {
    resolveSpell: function () {
        var name = Spell.name.replace(/\s/g, '');

        if (typeof this[name] == 'undefined') {
            return this.default(Spell);
        }

        return this[name](Spell);
    },

    default: function () {
        this.attack(0);
    },

    MagicMissle: function () {
        var attacks = 3 + this.getAdditionalAttacks();
        this.multiAttack(attacks);
    },

    ScorchingRay: function () {
        var attacks = 3 + this.getAdditionalAttacks();
        this.multiAttack(attacks);
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

        if (i == null) {
            i = 0;
        }

        if (Spell.save == null) {
            rolls[0] = Roll.d20();
            rolls[1] = Roll.d20();
            hitModifier = Spell.modifier;
        }
        else {
            var save = Spell.save;
        }

        var a = this.convertDice(Spell);
        // console.log('dice array: ');
        // console.log(a);
        var diceDamage = Roll.roll(a.sides, a.dice);
        // console.log('Dice damage: ' + diceDamage);

        var plus = 0;
        if(typeof a.plus !== 'undefined') {
            plus = parseInt(a.plus);
        }

        var damage = Roll.roll(a.sides, a.dice) + plus;
        // console.log('Damage: ' + damage);

        Spell.attacks[i] = new Attack(rolls, hitModifier, damage, Spell.save);
        return Spell;
    },

    multiAttack: function (attacks) {
        var a = parseInt(attacks);
        var i = 0;
        for (; i < a; i++) {
            //console.log('attack #: ' + i + ' max attacks: ' + a);
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
            plus: b[1]
        }
    }
}
