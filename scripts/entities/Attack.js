function Attack(rolls, hitModifier, damage, save){
    this.roll1 = rolls[0];
    this.roll2 = rolls[1];
    this.hitModifier = parseInt(hitModifier);
    this.damage = parseInt(damage);
    this.save = save;

    this.advantage = Math.max(...rolls);
    this.disadvantage = Math.min(...rolls);
}