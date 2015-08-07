class ApplyService {
    constructor($http, configuration) {
        'ngInject';

        this.$http = $http;
        this.configuration = configuration;
    }

    get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    get ajaxError() {
        return this._.ajaxError;
    }

    set ajaxError(value) {
        this._.ajaxError = value;
    }

    get _applyUrl() {
        return this._.applyUrl || (this._.applyUrl = `${this._publicServiceUrl}/apply`);
    }

    get form() {
        return this._.form || (this._.form = {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                resumeInfo: {}
            });
    }

    set form(value) {
        this._.form = value;
    }

    get _publicServiceUrl() {
        let result = this._.publicServiceUrl;

        if (!result) {
            let corpToken = this.configuration.service.corpToken;
            let port = parseInt(this.configuration.service.port) || 443;
            let scheme = `http${port === 443 ? 's' : ''}`;
            let swimlane = this.configuration.service.swimlane;

            result = this._.publicServiceUrl = `${scheme}://public-rest${swimlane}.bullhornstaffing.com:${port}/rest-services/${corpToken}`;
        }

        return result;
    }

    get requestParams() {
        return this._.requestParams || (this._.requestParams = {
                firstName: () => encodeURIComponent(this.form.firstName),
                lastName: () => encodeURIComponent(this.form.lastName),
                email: () => encodeURIComponent(this.form.email),
                phone: () => encodeURIComponent(this.form.phone || ''),
                assemble: resume => {
                    return '?externalID=Resume&type=Resume&firstName=' + this.requestParams.firstName() + '&lastName=' + this.requestParams.lastName() + '&email=' + this.requestParams.email() + '&phone=' + this.requestParams.phone() + '&format=' + resume.name.substring(resume.name.lastIndexOf('.') + 1);
                }
            });
    }

    get storage() {
        return {
            hasLocalStorage: () => typeof Storage !== 'undefined',

            getStoredForm: () => {
                if (this.storage.hasLocalStorage()) {
                    return {
                        firstName: localStorage.getItem('firstName'),
                        lastName: localStorage.getItem('lastName'),
                        email: localStorage.getItem('email'),
                        mobile: localStorage.getItem('mobile')
                    };
                }

                return {};
            },

            store: () => {
                if (this.storage.hasLocalStorage()) {
                    localStorage.setItem('firstName', this.form.firstName);
                    localStorage.setItem('lastName', this.form.lastName);
                    localStorage.setItem('email', this.form.email);
                    localStorage.setItem('mobile', this.form.mobile);
                }
            }
        };
    }

    initializeModel() {
        if (this.storage.hasLocalStorage()) {
            this.form = this.storage.getStoredForm();
        }
    }

    submit(jobID, successCallback, errorCallback) {
        successCallback = successCallback || function () {
            };

        errorCallback = errorCallback || function () {
            };

        var self = this;
        self.ajaxError = '';

        this.storage.store();

        if (this.form.resumeInfo) {
            var form = new FormData();
            form.append('resume', this.form.resumeInfo);
            var applyUrl = this._applyUrl + '/' + jobID + '/raw' + this.requestParams.assemble(this.form.resumeInfo);

            this.$http.post(applyUrl, form, {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
                .success((data) => {
                    self.form.email = data.candidate.email;
                    self.form.firstName = data.candidate.firstName;
                    self.form.lastName = data.candidate.lastName;
                    self.form.phone = data.candidate.phone;

                    self.storage.store();

                    self.ajaxError = '';

                    successCallback();
                }).error((data) => {
                    if (data.errorCode === 400) {
                        self.ajaxError = data.errorMessage;
                    }
                    self.ajaxError = 'There was an error when applying. Try again.';
                    errorCallback();
                });
        }
    }
}

export default ApplyService;
