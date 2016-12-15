describe('Service: EeocService', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let EeocService;
    let configuration = {
                eeoc: {
                    genderRaceEthnicity: true,
                    veteran: true,
                    disability: false
                }
            };

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', configuration);
        });
    });

    beforeEach(inject(($injector) => {
        EeocService = $injector.get('EeocService');
    }));


    it('should be registered', () => {
        expect(EeocService).not.toEqual(null);
    });

    describe('Function: isGenderRaceEthnicityEnabled()', () => {
        it('should be defined.', ()  => {
            expect(EeocService.isGenderRaceEthnicityEnabled).toBeDefined();
        });
        it('should return boolean value of eeoc.genderRaceEthnicity from the configuration.', ()  => {
            expect(EeocService.isGenderRaceEthnicityEnabled()).toBe(configuration.eeoc.genderRaceEthnicity);
        });
    });

    describe('Function: isEthnicityChecked()', () => {
        it('should be defined.', ()  => {
            expect(EeocService.isEthnicityChecked).toBeDefined();
        });
        it('should return true if there are selected ethnicities.', ()  => {
            EeocService.selectedEthnicities = {'green':1, 'blue': 2};

            expect(EeocService.isEthnicityChecked()).toBe(true);
        });
        it('should return false if there are no selected ethnicities.', ()  => {
            EeocService.selectedEthnicities = {};

            expect(EeocService.isEthnicityChecked()).toBe(false);
        });
    });

    describe('Function: getCheckedEthnicities()', () => {
        it('should be defined.', ()  => {
            expect(EeocService.getCheckedEthnicities).toBeDefined();
        });
        it('should return an array of selected ethnicities.', ()  => {
            EeocService.selectedEthnicities = {'green':1, 'blue': 2};
            let expectedEthnicities = ['green', 'blue'];

            expect(EeocService.getCheckedEthnicities()).toEqual(expectedEthnicities);
        });
    });

    describe('Function: isVeteranEnabled()', () => {
        it('should be defined.', ()  => {
            expect(EeocService.isVeteranEnabled).toBeDefined();
        });
        it('should return boolean value of eeoc.veteran from the configuration.', ()  => {
            expect(EeocService.isVeteranEnabled()).toBe(configuration.eeoc.veteran);
        });
    });

    describe('Function: isDisabilityEnabled()', () => {
        it('should be defined.', ()  => {
            expect(EeocService.isDisabilityEnabled).toBeDefined();
        });
        it('should return boolean value of eeoc.disability from the configuration.', ()  => {
            expect(EeocService.isDisabilityEnabled()).toBe(configuration.eeoc.disability);
        });
    });

});