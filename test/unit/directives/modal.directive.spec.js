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
        $httpBackend.flush();
    });

    it('should render the modal HTML.', () => {
        $scope.$digest();
        expect(element[0].innerHTML).toContain('modal');
        expect(element[0].innerHTML).toContain('category');
        expect(element[0].innerHTML).toContain('location');
        expect(element[0].innerHTML).toContain('separator');
        expect(element[0].innerHTML).toContain('main');
        expect(element[0].innerHTML).toContain('applyForm');
        expect(element[0].innerHTML).toContain('footer');
    });
});
