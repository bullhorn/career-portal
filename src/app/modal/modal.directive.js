class CareerPortalModalController {
    /* jshint -W072 */
    constructor(SharedData, $location, SearchService, ApplyService, configuration, locale, $filter, detectUtils, LinkedInService, ShareService) {
        'ngInject';

        this.SharedData = SharedData;
        this.$location = $location;
        this.SearchService = SearchService;

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
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        // Name & Email
        resumeText += userProfile.formattedName + lineBreak || '';
        resumeText += userProfile.emailAddress + lineBreak || '';
        // Location
        if (userProfile.location) {
            resumeText += userProfile.location.name + ', ' || '';
            resumeText += userProfile.location.country.code + hardBreak || hardBreak;
        }

        resumeText += 'Education:' + hardBreak;

        resumeText += 'Work Experience:' + lineBreak;
        // Positions
        if (userProfile.positions.values && userProfile.positions.values.length) {
            resumeText += userProfile.positions.values[0].company.name + ' ' || '';
            // Start Date
            if (userProfile.positions.values[0].startDate) {
                resumeText += months[userProfile.positions.values[0].startDate.month - 1] + ' ' + userProfile.positions.values[0].startDate.year + ' — ' || '';
            }
            // End Date or 'Present'
            if (userProfile.positions.values[0].endDate) {
                resumeText += months[userProfile.positions.values[0].endDate.month - 1] + ' ' + userProfile.positions.values[0].endDate.year || '';
            } else {
                if (userProfile.positions.values[0].isCurrent) {
                    resumeText += 'Present';
                }
            }
            resumeText += lineBreak;
            // Title
            resumeText += userProfile.positions.values[0].title + lineBreak || '';
            // Industry
            resumeText += userProfile.positions.values[0].company.industry + lineBreak || '';
            // Locale
            resumeText += userProfile.positions.values[0].location.name + lineBreak || '';
        }

        resumeText += hardBreak;

        // Skills
        resumeText += 'Skills:' + lineBreak + '*' + hardBreak;


        // LinkedIn Information
        resumeText += 'LinkedIn Profile URL:' + lineBreak;
        resumeText += userProfile.publicProfileUrl + lineBreak || '';
        resumeText += userProfile.siteStandardProfileRequest.url + lineBreak || '';

        resumeText += hardBreak;

        return resumeText;
    }

    applySuccess() {
        this.showForm = false;
    }

    submit(applyForm) {
        applyForm.$submitted = true;
        var isFileValid = false,
            resumeInfo = this.ApplyService.form.resumeInfo;

        if (angular.isString(resumeInfo)) {
            this.ApplyService.form.resumeInfo = new Blob([resumeInfo], {type: 'text/plain'});
            isFileValid = true;
        } else {
            isFileValid = this.validateResume(resumeInfo);
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

    sendEmailLink() {
        return this.ShareService.sendEmailLink(this.SearchService.currentDetailData, this.email);
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
