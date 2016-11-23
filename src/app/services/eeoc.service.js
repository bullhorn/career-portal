class EeocService {

    constructor(configuration) {

        'ngInject';

        this.genderRaceEthnicity = !!configuration.eeoc && configuration.eeoc.genderRaceEthnicity === true;
        this.veteran = !!configuration.eeoc && configuration.eeoc.veteran === true;
        this.disability = !!configuration.eeoc && configuration.eeoc.disability === true;

        this.selectedEthnicities = {};
    }

    isGenderRaceEthnicityEnabled() {
        return this.genderRaceEthnicity;
    }

    isEthnicityChecked() {
        var checked = this.getCheckedEthnicities();
        return checked.length > 0;
    }

    getCheckedEthnicities() {
        var checked = [];
        angular.forEach(this.selectedEthnicities, function (value, key) {
            if (!!value) {
                checked.push(key);
            }
        });
        return checked;
    }

    isVeteranEnabled() {
        return this.veteran;
    }

    isDisabilityEnabled() {
        return this.disability;
    }
}

export default EeocService;
