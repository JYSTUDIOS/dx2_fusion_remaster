import i18n from '../utility/i18n'

class SwordShieldType {

    constructor(type){

        this.name = type.name;
        this.names = type.names;
        this.swordShields = type.swordShields;
    }

    showName(){
        return this.names
            ? (this.names[i18n.locale] || this.names[i18n.defaultLocale])
            : '';
    }
}

export default SwordShieldType;