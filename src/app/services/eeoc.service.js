class EeocService {

    constructor(configuration) {

        'ngInject';

        this.genderRaceEthnicity = !!configuration.eeoc && !!configuration.eeoc.genderRaceEthnicity;
        this.veteran = !!configuration.eeoc && !!configuration.eeoc.veteran;
        this.disability = !!configuration.eeoc && !!configuration.eeoc.disability;
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
