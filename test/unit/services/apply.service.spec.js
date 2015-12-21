// Mock the providers
describe('Service: ApplyService', () => {

    let ApplyService;

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                integrations: {linkedin: ''}
            });
            //$provide.value('job', {});
        });
    });

    beforeEach(inject(($injector) => {
        ApplyService = $injector.get('ApplyService');
    }));

    it('should be registered.', ()  => {
        expect(ApplyService).toBeDefined();
    });

    describe('Function: form()', () => {
        it('should be defined.', ()  => {
            expect(ApplyService.form).toBeDefined();
        });
    });

    describe('Function: requestParams()', () => {
        it('should be defined.', ()  => {
            expect(ApplyService.requestParams).toBeDefined();
        });
    });

    describe('Function: submit()', () => {
        it('should be defined.', ()  => {
            expect(ApplyService.submit).toBeDefined();
        });
    });

    describe('Function: _publicServiceUrl()', () => {
        it('should be defined.', ()  => {
            expect(ApplyService._publicServiceUrl).toBeDefined();
        });
    });
});
