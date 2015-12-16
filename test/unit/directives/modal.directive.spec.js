describe('Directive: CareerPortalModal', () => {
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                integrations: {linkedin: ''},
                acceptedResumeTypes: []
            });
        });
    });

    // load the controller's module
    beforeEach(angular.mock.module('CareerPortal'));

    let $compile,
        element,
        $rootScope,
        $httpBackend,
        $controller,
        $scope,
        configuration;

    // Initialize the controller and a mock scope
    beforeEach(inject(($injector) => {
        // Injected dependencies
        $httpBackend = $injector.get('$httpBackend');
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        // Configuration
        configuration = $injector.get('configuration');
        // Create a scope
        $scope = $rootScope.$new();
        // Mock http requests
        $httpBackend.when('GET', 'res/en-US/common.json').respond({});
        $httpBackend.when('GET', 'res/en-US/modal.json').respond({});
        $httpBackend.when('GET', './app.json').respond(configuration);
        // Mock Directive Element
        element = angular.element(`<career-portal-modal></career-portal-modal>`);
        $compile(element)($scope);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should render the modal HTML.', () => {
        $httpBackend.expectGET('res/en-US/common.json');
        $httpBackend.expectGET('res/en-US/modal.json');
        $httpBackend.flush();
    });
});
