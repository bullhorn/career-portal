describe('Directive: CareerPortalModal', () => {
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                integrations: {linkedin: ''},
                acceptedResumeTypes: [],
                privacyConsent: {
                    consentCheckbox: true,
                    privacyStatement: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
                    privacyPolicyUrl: '',
                    usePrivacyPolicyUrl: false
                }
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
        $httpBackend.when('GET', 'res/en-US/eeoc.json').respond({});
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
