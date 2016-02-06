/* global describe, beforeEach, it, expect */
describe('Service: VerifyLI', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let VerifyLI;

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', {
                integrations: {
                    linkedin: {
                        clientId: ''
                    }
                }
            });
        });
    });

    beforeEach(inject(($injector) => {
        VerifyLI = $injector.get('VerifyLI');
    }));

    it('should be registered', () => {
        expect(VerifyLI).toBeDefined();
    });

    describe('Function: verifyLinkedInIntegration()', () => {
        it('should return true if the clientId is defined and 14 characters.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = '00000000000000';
            expect(VerifyLI.verifyLinkedInIntegration()).toBeTruthy();
        });

        it('should return false if the clientId is defined less than 11 characters.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = '11';
            expect(VerifyLI.verifyLinkedInIntegration()).toBeFalsy();
        });

        it('should return false if the clientId is defined greater than 20 characters.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = '123456789012345678901';
            expect(VerifyLI.verifyLinkedInIntegration()).toBeFalsy();
        });
        it('should return false if the clientId is not defined.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = '';
            expect(VerifyLI.verifyLinkedInIntegration()).toBeFalsy();
        });
        it('should return false if the clientId is null.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = null;
            expect(VerifyLI.verifyLinkedInIntegration()).toBeFalsy();
        });
        it('should return false if the clientId is `[ CLIENTID HERE ]`.', () => {
            VerifyLI.configuration.integrations.linkedin.clientId = '[ CLIENTID HERE ]';
            expect(VerifyLI.verifyLinkedInIntegration()).toBeFalsy();
        });
    });
});
