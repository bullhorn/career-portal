import 'angular';

export default [
    '$http',
    class {

        constructor($http) {
            this.$http = $http;
        }

        //#region Properties

        /**
         * A dictionary that contains the collective state of an ApplyJobs instance.
         * 
         * @private
         * @returns { Object }
         */
        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        get config() {
            return {
                applyUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/apply/'
            };
        }

        get ajaxError() {
            return this._.ajaxError;
        }

        set ajaxError(value) {
            this._.ajaxError = value;
        }

        get form() {
            return this._.form || (this._.form = {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                resumeName: '',
                resumeInfo: {}
            });
        }
        set form(value) {
            this._.form = value;
        }

        get requestParams() {
            return this._.requestParams || (this._.requestParams = {
                firstName: () => encodeURIComponent(this.form.firstName),
                lastName: () => encodeURIComponent(this.form.lastName),
                email: () => encodeURIComponent(this.form.email),
                phone: () => encodeURIComponent(this.form.phone || ''),
                assemble: resume => { return '?externalID=Resume&type=Resume&firstName=' + this.requestParams.firstName() + '&lastName=' + this.requestParams.lastName() + '&email=' + this.requestParams.email() + '&phone=' + this.requestParams.phone() + '&format=' + resume.name.substring(resume.name.lastIndexOf('.') + 1); }
            });
        }

        get storage() {
            return {
                hasLocalStorage: () => typeof Storage !== "undefined",

                getStoredForm: () => {
                    if (this.storage.hasLocalStorage()) {
                        return {
                            firstName: localStorage.getItem("firstName"),
                            lastName: localStorage.getItem("lastName"),
                            email: localStorage.getItem("email"),
                            mobile: localStorage.getItem("mobile")
                        };
                    }

                    return {};
                },

                store: () => {
                    if (this.storage.hasLocalStorage()) {
                        localStorage.setItem("firstName", this.form.firstName);
                        localStorage.setItem("lastName", this.form.lastName);
                        localStorage.setItem("email", this.form.email);
                        localStorage.setItem("mobile", this.form.mobile);
                    }
                }
            };
        }

        //#endregion

        //#region Methods

        initializeModel() {
            if (this.storage.hasLocalStorage())
                this.form = this.storage.getStoredForm();
        }

        submit(jobID, successCallback) {
            successCallback = successCallback || function() { };

            var self = this;

            this.storage.store();

            var form = new FormData();

            form.append("resume", this.form.resumeInfo);

            var applyUrl = this.config.applyUrl + jobID + '/raw' + this.requestParams.assemble(this.form.resumeInfo);

            this.$http
                .post(applyUrl, form, { transformRequest: angular.identity, headers: { 'Content-Type': undefined } })
                .success((data) => {
                    self.form.email = data.candidate.email;
                    self.form.firstName = data.candidate.firstName;
                    self.form.lastName = data.candidate.lastName;
                    self.form.phone = data.candidate.phone;

                    self.storage.store();

                    successCallback();
                })
                .error((data) => {
                    if(data.errorCode === 400) {
                        self.ajaxError = data.errorMessage;
                    }
                });
        }

        //#endregion

    }
];
