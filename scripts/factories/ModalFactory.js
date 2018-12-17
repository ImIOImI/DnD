var ModalFactory;
ModalFactory = {
    attacks : [],

    //modal content elements
    close : null,
    titleDiv : null,
    tbl : null,
    tblBody : null,
    modalContent : null,
    modal : null,
    modalBackground : null,
    spellName : null,

    attackType : null,

    initModal : function () {
        var mf = ModalFactory;
        mf.buildContainer();
        mf.addSpellClickEvent();
    },

    buildContainer : function () {
        var mf = ModalFactory;
        var body = document.getElementsByTagName('body')[0];
        mf.modalBackground = document.createElement('div');
        mf.modalBackground.style.display = "none";
        mf.modalBackground.id = 'dndModal';
        mf.modalBackground.classList.add('roller-modal');

        mf.modalContent = document.createElement('div');
        mf.modalContent.classList.add('roller-modal-content');

        mf.modal = document.createElement('div');
        mf.modal.classList.add('roller-modal-wrapper');
        mf.modalBackground.appendChild(mf.modal);

        mf.titleDiv = document.createElement('div');
        mf.titleDiv.classList.add('roller-title');

        mf.close = document.createElement('span');
        mf.close.classList.add('roller-close');
        mf.close.id = 'roller-close-modal';
        mf.close.innerText = 'X';
        mf.addCloseOnClickEvent();

        body.appendChild(mf.modalBackground);
        document.getElementsByClassName('dndModal');

        mf.tbl = document.createElement('table');
        mf.tblBody = document.createElement('tbody');
        mf.tblBody.classList.add('roller-wipe-content')

        mf.spellName = document.createElement('div');
        mf.spellName.classList.add('roller-spell-name');
        mf.titleDiv.appendChild(mf.spellName);
    },

    addCloseOnClickEvent : function () {
        var mf = ModalFactory;
        mf.close.onclick = function() {
            mf.modalBackground.style.display = "none";
            var divs = document.querySelectorAll('.roller-wipe-content');
            divs.forEach(function(div) {
                div.innerHTML = '';
            })
        }
    },

    addSpellClickEvent : function () {
        var mf = ModalFactory;
        //need to set a listener for when the Spell class div appears <div class="ct-spells">
        $('body').on( "click", "[class$='spell__action']", function(event) {
            clickEventFactory.build(event, $('body'));

            console.log(Spell);
            if((!SpellFactory.isSpell(Spell.name))&&(!Number.isInteger(parseInt(Spell.dice)))){
                return false;
            }
            SpellFactory.resolveSpell(Spell);

            mf.setSpellName(Spell.name);
            mf.setAttackTypeFromAttack(Spell.attacks[0]);

            mf.titleDiv.appendChild(mf.close);
            mf.modal.appendChild(mf.titleDiv);
            mf.modalContent.appendChild(mf.tbl);
            mf.tbl.appendChild(mf.tblBody);
            mf.modal.appendChild(mf.modalContent);

            //document.getElementById('roller-close-modal').innerText =
            mf.modalBackground.style.display = "flex";
        });
    },

    setAttackTypeFromAttack : function (attack) {
        var mf = ModalFactory;
        switch(true) {
            case (typeof attack.save === 'string'):
                mf.attackType = 'save';
                break;
            case (typeof attack.roll1 === 'number'):
                mf.attackType = 'hit';
                break;
            default:
                mf.attackType = 'autohit';
        }
    },

    setSpellName : function (name) {
        var mf = ModalFactory;
        mf.spellName.innerText = name;
    },

    buildTableFromAttacks : function (attacks, text, collapse) {
        var mf = ModalFactory;
        mf.setAttackTypeFromAttack(attacks[0]);

        var subClass = false;
        if(text.length > 0){
            subClass = text.replace(/\s/g, '-');
            var textRow = document.createElement('tr');
            textRow.classList.add('roller-row-text');
            var textCell = document.createElement('td');
            textCell.classList.add('roller-cell-text');
            textCell.colSpan = '42';

            var expandId = subClass + '-expand';
            var hideId = subClass + '-hide';
            textCell.innerHTML = text + "<span class='roller-expand' id='"+ expandId + "' style='display: none' onclick='ModalFactory.showAll(\""+subClass+"\")'>&#9660;</span>" + "<span class='roller-hide' id='" + hideId + "' style='display: inline' onclick='ModalFactory.hideAll(\""+subClass+"\")'>&#9650;</span>";

            textRow.append(textCell);

            mf.tblBody.append(textRow);
        }

        var headerRow = document.createElement('tr');

        headerRow.classList.add('roller-row');
        if(subClass != false){
            headerRow.classList.add(subClass);
        }

        switch(mf.attackType) {
            case 'save':
                var saveHead = mf.makeHeader('Save');
                headerRow.append(saveHead);
                break;
            case 'hit':
                var roll1Head = mf.makeHeader('First Roll');
                var roll2Head = mf.makeHeader('Second Roll');
                headerRow.append(roll1Head);
                headerRow.append(roll2Head);
                break;
            default:
                break;
        }

        var damageHead = mf.makeHeader('Damage' + ' (' + Spell.dice + ')');
        headerRow.append(damageHead);
        mf.tblBody.append(headerRow);

        mf.attacksToRows(attacks, subClass, collapse);
    },


    attacksToRows : function (attacks, subClass, collapse) {
        var mf = ModalFactory;
        attacks.forEach(function (attack) {
            var row = document.createElement('tr');
            row.classList.add('roller-roll');

            switch(mf.attackType) {
                case 'save':
                    var saveCell = mf.getCell(attack.save);
                    row.append(saveCell);
                    break;
                case 'hit':
                    var hit1Total = attack.roll1 + attack.hitModifier;
                    var hit2Total = attack.roll2 + attack.hitModifier;

                    var hitText1 = '(' + attack.roll1 + ') + ' + attack.hitModifier + ' = ' + hit1Total;
                    var hitText2 = '(' + attack.roll2 + ') + ' + attack.hitModifier + ' = ' + hit2Total;

                    var roll1Cell = mf.getCell(hitText1);
                    var roll2Cell = mf.getCell(hitText2);

                    row.append(roll1Cell);
                    row.append(roll2Cell);
                    break;
                default:
                //don't do anything for auto hits
            }

            var damageText = '';
            if((attack.damageRolls.length > 1) || (attack.damageModifier > 0)){
                damageText += '(' + attack.damageRolls.join(' + ') + ')';
                if(attack.damageModifier > 0){
                    damageText += ' + ' + attack.damageModifier;
                }
                damageText += ' = ';
            }
            damageText += attack.damage;

            var damageCell = mf.getCell(damageText);
            row.append(damageCell);

            if(subClass != false){
                row.classList.add(subClass);

                if(collapse === true){
                    //row.style.visiblility = 'collapse';
                }
            }

            mf.tblBody.appendChild(row);
        });

        console.log(document.getElementById('Tiny-Object-Attack-expand'));
    },

    hideAll : function(subClass){
        console.log('hide all!');
        var mf = ModalFactory;
        var hideId = mf.getHideId(subClass);
        var expandId = mf.getExpandId(subClass);

        var list = document.querySelectorAll('.' + subClass);
        list.forEach(function(span){
            console.log(span);
            span.style.display = 'none';
        })

        document.getElementById(hideId).style.display = 'none';
        document.getElementById(expandId).style.display = 'inline';
    },

    showAll : function(subClass){
        console.log('show all!');
        var mf = ModalFactory;
        var hideId = mf.getHideId(subClass);
        var expandId = mf.getExpandId(subClass);

        var list = document.querySelectorAll('.' + subClass);
        list.forEach(function(span){
            console.log(span);
            span.removeAttribute('style');
        })

        document.getElementById(hideId).style.display = 'inline';
        document.getElementById(expandId).style.display = 'none';
    },

    getExpandId : function (subClass) {
        return subClass + '-expand';
    },

    getHideId : function (subClass) {
        return subClass + '-hide';
    },


    makeHeader : function (text){
        var head = document.createElement('th');
        head.innerText = text;
        head.classList.add('roller-header');
        return head;
    },

    getCell : function (text) {
        var cell = document.createElement('td');
        cell.innerText = text;
        cell.classList.add('roller-cell');
        return cell;
    },

    /**
     *
     titleDiv.appendChild(close);
     modal.appendChild(titleDiv);
     modalContent.appendChild(tbl);
     tbl.appendChild(tblBody);
     modal.appendChild(modalContent);
     * @param attacks
     */

    setAttacks : function (attacks) {
        ModalFactory.attacks = attacks;
    }
}