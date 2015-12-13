class CareerPortalModalController {
    /* jshint -W072 */
    constructor(SharedData, $location, SearchService, ApplyService, configuration, locale, $filter, detectUtils, LinkedInService, ShareService, $window) {
        'ngInject';

        this.SharedData = SharedData;
        this.$location = $location;
        this.SearchService = SearchService;
        this.$window = $window;

        this.ShareService = ShareService;
        this.ApplyService = ApplyService;
        this.LinkedInService = LinkedInService;
        this.configuration = configuration;
        this.locale = locale;
        this.$filter = $filter;
        this.isMobile = detectUtils.isMobile();

        this.email = '';

        // Initialize the model
        this.ApplyService.initializeModel();
        this.closeModal();
        this.hasAttemptedLIApply = false;

        this.linkedInData = {
            header: '',
            resume: '',
            footer: ''
        };

    }

    /* jshint +W072 */

    applyWithLinkedIn() {
        this.hasAttemptedLIApply = true;
        this.LinkedInService.getUser()
            .then((linkedInUser) => {
                this.ApplyService.form.firstName = linkedInUser.firstName || '';
                this.ApplyService.form.lastName = linkedInUser.lastName || '';
                this.ApplyService.form.email = linkedInUser.emailAddress || '';
                this.ApplyService.form.phone = linkedInUser.phoneNumbers ? linkedInUser.phoneNumbers.values[0].phoneNumber : '';

                this.ApplyService.form.resumeInfo = this.formatResume(linkedInUser);
            });
    }

    closeModal(applyForm) {
        this.SharedData.modalState = 'closed';
        this.showForm = true;
        this.hasAttemptedLIApply = false;

        // Clear the errors if we have the form
        if (applyForm) {
            applyForm.$setPristine();
        }
    }

    validateResume(file) {
        if (!file) {
            this.updateUploadClass(false);
            return false;
        }

        // First check the type
        var fileArray = file.name.split('.');
        var fileExtension = fileArray[fileArray.length - 1];

        if (this.configuration.acceptedResumeTypes.indexOf((fileExtension || '').toLowerCase()) === -1) {
            this.resumeUploadErrorMessage = (fileExtension || '').toUpperCase() + ' ' + this.$filter('i18n')('modal.resumeInvalidFormat');
            this.updateUploadClass(false);
            this.isSubmitting = false;
            return false;
        }

        // Now check the size
        if (file.size > this.configuration.maxUploadSize) {
            this.resumeUploadErrorMessage = this.$filter('i18n')('modal.resumeToBig') + ' (' + this.$filter('i18n')('modal.maxLabel') + ': ' + this.configuration.maxUploadSize / (1024 * 1024) + 'MB)';
            this.updateUploadClass(false);
            this.isSubmitting = false;
            return false;
        }

        this.resumeUploadErrorMessage = null;
        this.updateUploadClass(true);
        return true;
    }

    updateUploadClass(valid) {
        var $uploadContainer = document.querySelector('.upload-container');
        if ($uploadContainer) {
            $uploadContainer.classList.toggle('valid', valid);
        }
    }

    showSendButton (form) {
        if (form || this.email) {
            return false;
        }
        return true;
    }

    getTooltipText() {
        var tooltip = '<ul>';

        this.configuration.acceptedResumeTypes.forEach(function (type) {
            tooltip += '<li>' + type + '</li>';
        });
        tooltip += '</ul>';
        return tooltip;
    }

    formatResume(userProfile) {
        var resumeText = '',
            lineBreak = '\n',
            hardBreak = '\n\n\n',
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            today = new Date(),
            friendlyDate = today.toLocaleDateString() + ' at ' + today.toLocaleTimeString(),
            legal = 'This LinkedIn profile information was received on ' + friendlyDate + '. \n\nIt contains confidential information and is intended only for use within the Bullhorn platform as a part of the Career Portal app.\n\n';

        // First Name
        this.linkedInData.header += (userProfile.formattedName || '') + lineBreak;
        // Email Address
        this.linkedInData.header += (userProfile.emailAddress || '') + lineBreak;
        // Location
        if (userProfile.location && userProfile.location.name) {
            this.linkedInData.header += (userProfile.location.name || '') + ', ';
            this.linkedInData.header += (userProfile.location.country.code.toUpperCase() || '') + hardBreak;
        }
        // Education Block
        this.linkedInData.header += 'Education:' + hardBreak;

        // Work Experience Block
        this.linkedInData.resume += 'Work Experience:' + lineBreak;
        // Positions
        if (userProfile.positions.values && userProfile.positions.values.length) {
            this.linkedInData.resume += (userProfile.positions.values[0].company.name || '') + ' ';
            // Start Date
            if (userProfile.positions.values[0].startDate) {
                this.linkedInData.resume += months[userProfile.positions.values[0].startDate.month - 1] + ' ' + userProfile.positions.values[0].startDate.year + ' - ' || '';
            }
            // End Date or 'Present'
            if (userProfile.positions.values[0].endDate) {
                this.linkedInData.resume += months[userProfile.positions.values[0].endDate.month - 1] + ' ' + userProfile.positions.values[0].endDate.year || '';
            } else {
                if (userProfile.positions.values[0].isCurrent) {
                    this.linkedInData.resume += 'Present';
                }
            }
            this.linkedInData.resume += lineBreak;
            // Title
            this.linkedInData.resume += userProfile.positions.values[0].title + lineBreak || '';
            // Industry
            this.linkedInData.resume += userProfile.positions.values[0].company.industry + lineBreak || '';
            if (userProfile.positions.values[0].location) {
                // Locale
                this.linkedInData.resume += userProfile.positions.values[0].location.name + lineBreak || '';
            }

        }
        this.linkedInData.resume += hardBreak;
        // Skills
        this.linkedInData.resume += 'Skills:' + lineBreak + '*' + hardBreak;

        // LinkedIn Information
        this.linkedInData.footer += hardBreak + 'LinkedIn Profile URL:' + lineBreak;
        this.linkedInData.footer += userProfile.publicProfileUrl + lineBreak || '';
        this.linkedInData.footer += userProfile.siteStandardProfileRequest.url + lineBreak || '';
        // Legal
        this.linkedInData.footer += hardBreak + legal;
        //return resumeText;
    }

    applySuccess() {
        // Reset form data
        this.ApplyService.form.firstName = '';
        this.ApplyService.form.lastName = '';
        this.ApplyService.form.email = '';
        this.ApplyService.form.phone = '';
        // Reset LinkedIn Data
        this.linkedInData.header = '';
        this.linkedInData.resume = '';
        this.linkedInData.footer = '';
        // Hide Form
        this.showForm = false;
    }

    submit(applyForm) {
        var isFileValid = false,
            resumeInfo = this.ApplyService.form.resumeInfo,
            resumeText = this.linkedInData.header + this.linkedInData.resume + this.linkedInData.footer;

        if (this.hasAttemptedLIApply) {
            applyForm.$submitted = true;
            this.ApplyService.form.resumeInfo = new Blob([resumeText], {type: 'text/plain'});
            isFileValid = true;
        } else if (resumeInfo) {
            isFileValid = this.validateResume(resumeInfo);
        } else {
            this.$window.open(this.ShareService.sendEmailLink(this.SearchService.currentDetailData, this.email), '_self');
            this.email = '';
            this.closeModal();
        }



        if (applyForm.$valid && isFileValid) {
            var controller = this;
            controller.isSubmitting = true;
            this.ApplyService.submit(this.SearchService.currentDetailData.id, function () {
                controller.applySuccess();
                controller.isSubmitting = false;
            }, function () {
                controller.isSubmitting = false;
            });
        }
    }

    verifyLinkedInInfo () {
        if (this.verifyLinkedInIntegration()) {
            // Verify that LinkedIn


        } else {
            // Always return valid if linkedIn integration isn't configured
            return true;
        }
    }

    verifyLinkedInIntegration () {
        return (this.configuration.integrations.linkedin && this.configuration.integrations.linkedin.clientId);
    }

}

class CareerPortalModal {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/modal/modal.html',
            scope: false,
            controller: CareerPortalModalController,
            controllerAs: 'modal',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

export default CareerPortalModal;
