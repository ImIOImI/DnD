$(window).ready(function(){
    //add the modal to be used later
    // $('body').append($('<div>', {class: 'dndModal'}));
    var body = document.getElementsByTagName('body')[0];
    var modalBackground = document.createElement('div');
    modalBackground.style.display = "none";
    modalBackground.id = 'dndModal';
    modalBackground.classList.add('roller-modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('roller-modal-content');

    var modal = document.createElement('div');
    modal.classList.add('roller-modal-wrapper');
    modalBackground.appendChild(modal);

    var titleDiv = document.createElement('div');
    titleDiv.classList.add('roller-title', 'roller-wipe-content');

    var close = document.createElement('span');
    close.classList.add('roller-close');
    close.id = 'roller-close-modal';
    close.innerText = 'X';
    close.onclick = function() {
        modalBackground.style.display = "none";
        var divs = document.querySelectorAll('.roller-wipe-content');
        divs.forEach(function(div) {
            div.innerHTML = '';
        })
    }

    body.appendChild(modalBackground);
    document.getElementsByClassName('dndModal');

    var tbl = document.createElement('table');
    var tblBody = document.createElement('tbody');
    tblBody.classList.add('roller-wipe-content')

    //need to set a listener for when the Spell class div appears <div class="ct-spells">
    $('body').on( "click", "[class$='spell__action']", function(event) {
        clickEventFactory.build(event, $('body'));
        SpellFactory.resolveSpell(Spell);

        var spellName = document.createElement('div');
        spellName.classList.add('roller-spell-name');
        spellName.innerText = Spell.name;
        titleDiv.appendChild(spellName);

        var attackType = 'hit';
        if(typeof Spell.attacks[0].save === 'string'){
            attackType = 'save';
        }

        if(attackType == 'hit') {
            var roll1Head = makeHeader('First Roll');
            var roll2Head = makeHeader('Second Roll');
            tblBody.append(roll1Head);
            tblBody.append(roll2Head);
        }
        else{
            var saveHead = makeHeader('Save');
            tblBody.append(saveHead);
        }

        var damageHead = makeHeader('Damage');
        // console.log(roll1Head);


        tblBody.append(damageHead);

        Spell.attacks.forEach(function (attack) {
            var row = document.createElement('tr');
            row.classList.add('roller-roll');
            // console.log(attack);

            if(attackType == 'hit') {
                var hit1Total = attack.roll1 + attack.hitModifier;
                var hit2Total = attack.roll1 + attack.hitModifier;

                var hitText1 = attack.roll1 + ' + ' + attack.hitModifier + ' = ' + hit1Total;
                var hitText2 = attack.roll1 + ' + ' + attack.hitModifier + ' = ' + hit2Total;

                var roll1Cell = getCell(hitText1);
                var roll2Cell = getCell(hitText2);

                row.append(roll1Cell);
                row.append(roll2Cell);
            }
            else{
                var saveCell = getCell(attack.save);
                row.append(saveCell);
            }

            var damageCell = getCell(attack.damage);
            row.append(damageCell);

            tblBody.appendChild(row);
        });

        titleDiv.appendChild(close);
        modal.appendChild(titleDiv);
        modalContent.appendChild(tbl);
        tbl.appendChild(tblBody);
        modal.appendChild(modalContent);

        //document.getElementById('roller-close-modal').innerText =
        modalBackground.style.display = "flex";
    });


});

var makeHeader = function (text){
    var head = document.createElement('th');
    head.innerText = text;
    head.classList.add('roller-header');
    return head;
}

var getCell = function (text) {
    var cell = document.createElement('td');
    cell.innerText = text;
    cell.classList.add('roller-cell');
    return cell;
}