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
    filterDiv : null,

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
        mf.titleDiv.appendChild(mf.close);

        mf.filterDiv = document.createElement('div');
        mf.filterDiv.classList.add('roller-wipe-content');
        mf.modal.appendChild(mf.titleDiv);
        mf.modal.appendChild(mf.filterDiv);
        mf.modalContent.appendChild(mf.tbl);
        mf.tbl.appendChild(mf.tblBody);
        mf.modal.appendChild(mf.modalContent);
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

            if((!SpellFactory.isSpell(Spell.name))&&(!Number.isInteger(parseInt(Spell.dice)))){
                return false;
            }
            SpellFactory.resolveSpell(Spell);

            mf.setSpellName(Spell.name);
            mf.setAttackTypeFromAttack(Spell.attacks[0]);

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
        var headerRow = document.createElement('tr');
        headerRow.classList.add('roller-row');

        var subClass = false;
        if(text.length > 0){
            subClass = text.replace(/\s/g, '-');
            var textRow = document.createElement('tr');
            textRow.classList.add('roller-row-text');
            var textCell = document.createElement('td');
            textCell.classList.add('roller-cell-text');
            textCell.colSpan = '42';

            var expandId = mf.getExpandId(subClass);
            var hideId = mf.getHideId(subClass);

            var expandSpan = document.createElement('span');
            expandSpan.classList.add('roller-expand');
            expandSpan.id = expandId;
            expandSpan.style.display = 'none';
            expandSpan.onclick = function(subClass){(ModalFactory.showAll(subClass))};
            expandSpan.innerHTML = text + ' &#9660;';

            var hideSpan = document.createElement('span');
            hideSpan.classList.add('roller-hide');
            hideSpan.id = hideId;
            hideSpan.style.display = 'inline';
            hideSpan.onclick = function(subClass){(ModalFactory.hideAll(subClass))};
            hideSpan.innerHTML = text + ' &#9650;';

            textCell.append(expandSpan);
            textCell.append(hideSpan);

            textRow.append(textCell);

            mf.tblBody.append(textRow);
            headerRow.classList.add(subClass);

            if(collapse === true){
                headerRow.style.display = 'none';
                expandSpan.style.display = 'inline';
                hideSpan.style.display = 'none';
            }
        }

        switch(mf.attackType) {
            case 'save':
                var saveHead = mf.makeHeader('Save');
                headerRow.append(saveHead);
                break;
            case 'hit':
                var defaultHead = mf.makeHeader('Roll');
                defaultHead.classList.add('roller-default-col');
                var advantageHead = mf.makeHeader('Advantage');
                advantageHead.classList.add('roller-advantage-col');
                advantageHead.style.display = 'none';
                var disadvantageHead = mf.makeHeader('Disadvantage')
                disadvantageHead.classList.add('roller-disadvantage-col');
                disadvantageHead.style.display = 'none';
                headerRow.append(defaultHead);
                headerRow.append(advantageHead);
                headerRow.append(disadvantageHead);
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
        if(mf.attackType == 'hit'){
            mf.addAdvantageFilters(subClass);
        }

        attacks.forEach(function (attack) {
            var row = document.createElement('tr');
            row.classList.add('roller-roll');

            switch(mf.attackType) {
                case 'save':
                    var saveCell = mf.getCell(attack.save);
                    row.append(saveCell);
                    break;
                case 'hit':
                    var defaultRoll = attack.roll1 + attack.hitModifier;
                    var advantage = attack.advantage + attack.hitModifier;
                    var disadvantage = attack.disadvantage + attack.hitModifier;

                    var defaultText = '(' + attack.roll1 + ') + ' + attack.hitModifier + ' = ' + defaultRoll;
                    var advantageText = '(' + attack.advantage + ') + ' + attack.hitModifier + ' = ' + advantage;
                    var disadvantageText = '(' + attack.disadvantage + ') + ' + attack.hitModifier + ' = ' + disadvantage;

                    var rollCell = mf.getCell(defaultText);
                    rollCell.classList.add('roller-default-col');
                    var advantageCell = mf.getCell(advantageText);
                    advantageCell.classList.add('roller-advantage-col');
                    advantageCell.style.display = 'none';
                    var disadvantageCell = mf.getCell(disadvantageText);
                    disadvantageCell.classList.add('roller-disadvantage-col');
                    disadvantageCell.style.display = 'none';

                    row.append(rollCell);
                    row.append(advantageCell);
                    row.append(disadvantageCell);
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
                    row.style.display = 'none';
                }
            }

            mf.tblBody.appendChild(row);
        });
    },

    addAdvantageFilters : function() {
        var mf = ModalFactory;

        var defaultInput = document.createElement("input");
        var advantageInput = document.createElement("input");
        var disadvantageInput = document.createElement("input");

        var defaultLabel = document.createElement("label");
        var advantageLabel = document.createElement("label");
        var disadvantageLabel = document.createElement("label");

        defaultInput.checked = true;

        defaultInput.type = 'radio';
        advantageInput.type = 'radio';
        disadvantageInput.type = 'radio';

        defaultInput.name = name;
        advantageInput.name = name;
        disadvantageInput.name = name;

        defaultInput.value = 'default';
        advantageInput.value = 'advantage';
        disadvantageInput.value = 'disadvantage';

        defaultLabel.innerText = 'Default';
        advantageLabel.innerText = 'Advantage';
        disadvantageLabel.innerText = 'Disadvantage';

        defaultInput.id = 'Roller-Default-Radio';
        advantageInput.id = 'Roller-Advantage-Radio';
        disadvantageInput.id = 'Roller-Disadvantage-Radio';

        defaultLabel.classList.add('roller-radio-label', 'roller-radio-label-selected');
        advantageLabel.classList.add('roller-radio-label');
        disadvantageLabel.classList.add('roller-radio-label');

        defaultLabel.id = 'roller-default-radio-label';
        advantageLabel.id = 'roller-advantage-radio-label';
        disadvantageLabel.id = 'roller-disadvantage-radio-label';


        defaultInput.onclick = function(event) {ModalFactory.advantageSwitch(event);};
        advantageInput.onclick = function(event) {ModalFactory.advantageSwitch(event);};
        disadvantageInput.onclick = function(event) {ModalFactory.advantageSwitch(event);};


        defaultLabel.append(defaultInput);
        advantageLabel.append(advantageInput);
        disadvantageLabel.append(disadvantageInput);

        mf.filterDiv.append(defaultLabel);
        mf.filterDiv.append(advantageLabel);
        mf.filterDiv.append(disadvantageLabel);
    },

    advantageSwitch : function(event) {
        var id = event.target.id;
        var subClass = event.target.getAttribute('subclass');
        var value = event.target.value;

        var defC = '.roller-default-col';
        var addC = '.roller-advantage-col';
        var disC = '.roller-disadvantage-col';

        var addList = document.querySelectorAll(addC);
        var disList = document.querySelectorAll(disC);
        var defList = document.querySelectorAll(defC);

        var offList1 = false;
        var offList2 = false;
        var onList = false;

        var defLabel = document.getElementById('roller-default-radio-label');
        var advLabel = document.getElementById('roller-advantage-radio-label');
        var disLabel = document.getElementById('roller-disadvantage-radio-label');

        defLabel.classList.remove('roller-radio-label-selected');
        advLabel.classList.remove('roller-radio-label-selected')
        disLabel.classList.remove('roller-radio-label-selected');

        switch (value){
            case 'default':
                offList1 = addList;
                offList2 = disList;
                onList = defList;
                defLabel.classList.add('roller-radio-label-selected');
                break;
            case 'advantage':
                offList1 = defList;
                offList2 = disList;
                onList = addList;
                advLabel.classList.add('roller-radio-label-selected');
                break;
            case 'disadvantage':
                offList1 = addList;
                offList2 = defList;
                onList = disList;
                disLabel.classList.add('roller-radio-label-selected');
                break;
        }

        offList1.forEach(function(col){
            col.style.display = 'none';
        })
        offList2.forEach(function(col){
            col.style.display = 'none';
        })
        onList.forEach(function(col){
            col.removeAttribute('style');
        })
    },

    hideAll : function(event){
        subClass = event.target.id.replace('-hide', '');
        var mf = ModalFactory;
        var hideId = mf.getHideId(subClass);
        var expandId = mf.getExpandId(subClass);

        var list = document.querySelectorAll('.' + subClass);
        list.forEach(function(tr){
            tr.style.display = 'none';
        })

        document.getElementById(hideId).style.display = 'none';
        document.getElementById(expandId).style.display = 'inline';
    },

    showAll : function(event){
        subClass = event.target.id.replace('-expand', '');
        var mf = ModalFactory;
        var hideId = mf.getHideId(subClass);
        var expandId = mf.getExpandId(subClass);

        var list = document.querySelectorAll('.' + subClass);
        list.forEach(function(tr){
            tr.removeAttribute('style');
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