class EeocService {

    constructor(configuration) {

        'ngInject';

        this.genderRaceEthnicity = !!configuration.eeoc && configuration.eeoc.genderRaceEthnicity === true;
        this.veteran = !!configuration.eeoc && configuration.eeoc.veteran === true;
        this.disability = !!configuration.eeoc && configuration.eeoc.disability === true;
    }

    isGenderRaceEthnicityEnabled() {
        return this.genderRaceEthnicity;
    }

    isVeteranEnabled() {
        return this.veteran;
    }

    isDisabilityEnabled() {
        return this.disability;
    }
}

export default EeocService;
