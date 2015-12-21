/* global describe, beforeEach, it, expect */
describe('Service: MobileDetection', () => {
    beforeEach(angular.mock.module('CareerPortal'));

    let MobileDetection,
        $window,
        reset;

    beforeEach(inject(($injector) => {
        MobileDetection = $injector.get('MobileDetection');
        $window = $injector.get('$window');
        reset = $injector.get('$window');
    }));

    afterEach(() => {
        $window = reset;
    });

    it('should be registered', () => {
        expect(MobileDetection).toBeDefined();
    });

    describe('Function: getDeviceInfo()', () => {
        it('should detect iOS.', () => {
            $window.navigator = {
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1'
            };
            expect(MobileDetection.getDeviceInfo().os.ios).toBeTruthy();
            expect(MobileDetection.getDeviceInfo().os.mac).toBeTruthy();
            expect(MobileDetection.getDeviceInfo().browser.safari).toBeTruthy();
        });
        it('should detect Safari and not iOS.', () => {
            $window.navigator = {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
            };
            expect(MobileDetection.getDeviceInfo().os.ios).toBeFalsy();
            expect(MobileDetection.getDeviceInfo().os.mac).toBeTruthy();
            expect(MobileDetection.getDeviceInfo().browser.safari).toBeTruthy();
        });
        it('should detect chrome.', () => {
            $window.navigator = {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
            };
            expect(MobileDetection.getDeviceInfo().os.ios).toBeFalsy();
            expect(MobileDetection.getDeviceInfo().os.mac).toBeTruthy();
            expect(MobileDetection.getDeviceInfo().browser.safari).toBeFalsy();
        });
    });

    describe('Function: deepRegex()', () => {
        it('should be defined.', () => {
            expect(MobileDetection.deepRegex).toBeDefined();
        });
    });
});
