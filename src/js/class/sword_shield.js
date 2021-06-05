import i18n from '../utility/i18n'

class Sword_shield {

    constructor(swordShield) {

        this.name = swordShield.name;
        this.names = swordShield.names;
        this.skills = swordShield.skills;
        this.elements = swordShield.elements;
        this.icon = swordShield.icon;
        this.panels = swordShield.panels;
        this.type = null;
    }

    showName() {

        return this.names
            ? (this.names[i18n.locale] || this.names[i18n.defaultLocale])
            : '';
    }

    showPanel(index) {

        return this.panels[index]
            ? (this.panels[index][i18n.locale] || this.panels[index][i18n.defaultLocale])
            : '';
    }

}

export default Sword_shield;
