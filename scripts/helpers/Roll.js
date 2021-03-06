var Roll;
Roll = {
    d2: function (dice) {
        return this.roll(2, dice);
    },
    d4: function (dice) {
        return this.roll(4, dice);
    },
    d6: function (dice) {
        return this.roll(6, dice);
    },
    d8: function (dice) {
        return this.roll(8, dice);
    },
    d10: function (dice) {
        return this.roll(10, dice);
    },
    d12: function (dice) {
        return this.roll(12, dice);
    },
    d20: function (dice) {
        return this.roll(20, dice);
    },

    roll: function (sides, dice) {
        var damage = 0;
        if(dice == null){
            dice = 1;
        }

        for (i = 0; i < dice; i++) {
            damage += Math.floor(Math.random() * sides) + 1;
        }

        return parseInt(damage);
    }
}