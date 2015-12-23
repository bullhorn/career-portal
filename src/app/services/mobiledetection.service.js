class MobileDetection {
    constructor($window) {
        'ngInject';
        this.$window = $window;
        this.browserData = this.getDeviceInfo();
    }

    getDeviceInfo() {
        var ua = this.$window.navigator.userAgent,
            operatingSystemRegex = {
                MAC: {and:[/\bMac OS\b/,{not:/Windows Phone/}]},
                IOS: {and: [{or: [/\biPad\b/, /\biPhone\b/, /\biPod\b/]}, {not: /Windows Phone/}]}
            },
            browserRegex = {
                SAFARI: {and:[/^((?!CriOS).)*\Safari\b.*$/,{not:{or:[/\bOPR\b/,/\bEdge\b/,/Windows Phone/,/\bChrome\b/]}}]}
            },
            browsers = {
                SAFARI: 'safari'
            },
            operatingSystems = {
                MAC: 'mac',
                IOS: 'ios'
            },
            deviceInfo = {
                userAgent: ua,
                os: {},
                browser: {}
            };

        deviceInfo.os = Object.keys(operatingSystems).reduce((obj, item) => {
            obj[operatingSystems[item]] = this.deepRegex(ua, operatingSystemRegex[item]);
            return obj;
        }, {});

        deviceInfo.browser = Object.keys(browsers).reduce((obj, item) => {
            obj[browsers[item]] = this.deepRegex(ua, browserRegex[item]);
            return obj;
        }, {});

        return deviceInfo;
    }

    deepRegex(string, regex) {
        if (typeof regex === 'string' || regex instanceof String) {
            regex = new RegExp(regex);
        }
        if (regex instanceof RegExp) {
            return regex.test(string);
        } else if (regex && Array.isArray(regex.and)) {
            return regex.and.every(item => {
                return this.deepRegex(string, item);
            });
        } else if (regex && Array.isArray(regex.or)) {
            return regex.or.some(item => {
                return this.deepRegex(string, item);
            });
        } else if (regex && regex.not) {
            return !this.deepRegex(string, regex.not);
        } else {
            return false;
        }
    }

}

export default MobileDetection;
