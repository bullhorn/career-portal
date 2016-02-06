class CareerPortalModalController {
    /* jshint -W072 */
    constructor($location, $window, $filter, $log, SharedData, SearchService, ApplyService, configuration, locale, LinkedInService, ShareService, MobileDetection, VerifyLI) {
        'ngInject';
        // NG Dependencies
        this.$location = $location;
        this.$window = $window;
        this.$filter = $filter;
        this.$log = $log;

        // Dependencies
        this.configuration = configuration;
        this.SharedData = SharedData;
        this.SearchService = SearchService;
        this.ShareService = ShareService;
        this.ApplyService = ApplyService;
        this.LinkedInService = LinkedInService;
        this.locale = locale;

        // Variables
        this.isLinkedInActive = VerifyLI.verified;
        this.isIOS = MobileDetection.browserData.os.ios;
        // Create a local variable to store user's email address for sendEmailLink
        this.email = '';
        // Boolean to indicate if the user has attempted to apply via LinkedIn
        this.hasAttemptedLIApply = false;
        // Resume object that contains the parsed LinkedIn data and the user's input
        this.linkedInData = {
            header: '',
            resume: '',
            footer: ''
        };

        // Load directive with modal closed by default
        this.closeModal();
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
        if (!file || !file.name) {
            this.updateUploadClass(false);
            return false;
        }

        // First check the type
        var fileArray = file.name.split('.'),
            fileExtension = fileArray[fileArray.length - 1];

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

    enableSendButton(isFormValid) {
        var resume = this.ApplyService.form.resumeInfo;

        if (isFormValid && (resume || this.linkedInData.resume)) {
            if (this.linkedInData.resume.length !== 0 || resume.type) {
                return false;
            }
        } else if (this.email) {
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

    // TODO: offload to factory

    formatResume(userProfile) {
        var lineBreak = '\n',
            hardBreak = '\n\n\n',
            months = this.$filter('i18n')('modal.Months').split('_'),
            today = new Date(),
            friendlyDate = today.toLocaleDateString() + ' ' + this.$filter('i18n')('modal.at') + ' ' + today.toLocaleTimeString(),
            legal = this.$filter('i18n')('modal.profileReceived') + ' ' + friendlyDate + '. \n\n' + this.$filter('i18n')('modal.legal') + '\n\n';

        // First Name
        this.linkedInData.header = (userProfile.formattedName || '') + lineBreak;
        // Email Address
        this.linkedInData.header += (userProfile.emailAddress || '') + lineBreak;
        // Location
        if (userProfile.location && userProfile.location.name) {
            this.linkedInData.header += (userProfile.location.name || '') + ', ';
            if (userProfile.location.country) {
                this.linkedInData.header += (userProfile.location.country.code.toUpperCase() || '') + hardBreak;
            }
        }
        // Clear Instance of resume
        this.linkedInData.resume = '';
        // Education
        if (userProfile.educations && userProfile.educations.values) {
            var education = userProfile.educations.values;
            this.linkedInData.resume += this.$filter('i18n')('modal.education') + lineBreak;
            for (var i = 0; i < education.length; i++) {
                // Add Degree Type
                if (education[i].degree) {
                    this.linkedInData.resume += education[i].degree + ' ';
                }
                // Add Field of Study Type
                if (education[i].fieldOfStudy) {
                    this.linkedInData.resume += education[i].fieldOfStudy + ' ';
                }
                // Add line break
                if (education[i].degree || education[i].fieldOfStudy) {
                    this.linkedInData.resume += lineBreak;
                }
                // Add School
                if (education[i].schoolName) {
                    this.linkedInData.resume += education[i].schoolName + ' ';
                }
                // Add Start Date
                if (education[i].startDate) {
                    this.linkedInData.resume += education[i].startDate.year + ' - ';
                }
                // Add End Date
                if (education[i].endDate) {
                    this.linkedInData.resume += education[i].endDate.year + ' ';
                }
                // Add line break
                if ((education[i].schoolName || education[i].startDate || education[i].endDate) && education[i + 1]) {
                    this.linkedInData.resume += lineBreak;
                }
            }
            // Add line break
            this.linkedInData.resume += hardBreak;
        }

        // Work Experience Block
        this.linkedInData.resume += this.$filter('i18n')('modal.workExperience') + lineBreak;
        // Positions
        if (userProfile.positions) {
            var positions = userProfile.positions.values;
            // Iterate through each position
            if (positions && positions.length) {
                for (var ii = 0; ii < positions.length; ii++) {
                    // Add Employee section header
                    this.linkedInData.resume += (positions[ii].company.name || '') + ' ';
                    // Start Date
                    if (positions[ii].startDate) {
                        this.linkedInData.resume += months[positions[ii].startDate.month - 1] + ' ' + positions[ii].startDate.year + ' - ' || '';
                    }
                    // End Date or 'Present'
                    if (positions[ii].endDate) {
                        this.linkedInData.resume += months[positions[ii].endDate.month - 1] + ' ' + positions[ii].endDate.year || '';
                    } else {
                        if (positions[ii].isCurrent) { // jshint ignore:line
                            this.linkedInData.resume += this.$filter('i18n')('modal.present');
                        }
                    }
                    this.linkedInData.resume += lineBreak;
                    // Title
                    this.linkedInData.resume += positions[ii].title + lineBreak || '';
                    // Industry
                    this.linkedInData.resume += positions[ii].company.industry ? positions[ii].company.industry + lineBreak : '';
                    if (positions[ii].location && positions[ii].location.name) {
                        // Locale
                        this.linkedInData.resume += positions[ii].location.name + lineBreak || '';
                    }
                    // Summary
                    if (positions[ii].summary) {
                        this.linkedInData.resume += positions[ii].summary + lineBreak || '';
                    }
                    this.linkedInData.resume += hardBreak;
                }
            }
        }

        // Skills
        if (userProfile.skills && userProfile.skills.values) {
            this.linkedInData.resume +=  this.$filter('i18n')('modal.skillHeading') + lineBreak;
            var skills = userProfile.skills.values;
            for (var iii = 0; iii < skills.length; iii++) {
                var newSkill = skills[iii].skill;
                if (newSkill && newSkill.name) {
                    this.linkedInData.resume += newSkill.name;
                    if (skills[iii + 1]) {
                        this.linkedInData.resume += ', ';
                    }
                }
            }
            this.linkedInData.resume += hardBreak;
        }

        // LinkedIn Information
        this.linkedInData.footer = hardBreak + this.$filter('i18n')('modal.profileURL') + lineBreak;
        this.linkedInData.footer += userProfile.publicProfileUrl + lineBreak || '';
        this.linkedInData.footer += userProfile.siteStandardProfileRequest.url + lineBreak || '';
        // Legal
        this.linkedInData.footer += hardBreak + legal;
    }

    applySuccess() {
        // Reset LinkedIn Data
        this.linkedInData.header = '';
        this.linkedInData.resume = '';
        this.linkedInData.footer = '';
        // Reset LinkedIn Flag
        this.hasAttemptedLIApply = false;
        // Reset form data
        this.ApplyService.form.resumeInfo = null;
        // Hide Form
        this.showForm = false;
    }

    submit(applyForm) {
        var isFileValid = false,
            resumeInfo = this.ApplyService.form.resumeInfo,
            resumeText = this.linkedInData.header + this.linkedInData.resume + this.linkedInData.footer,
            controller;

        if (!this.hasAttemptedLIApply && this.email) {
            // Send email
            this.$window.open(this.ShareService.sendEmailLink(this.SearchService.currentDetailData, this.email), '_self');
            this.email = '';
            this.closeModal();
        } else if (this.hasAttemptedLIApply && resumeText) {
            // LinkedIn Apply
            applyForm.$submitted = true;
            this.ApplyService.form.resumeInfo = new Blob([resumeText], {type: 'text/plain'});
            isFileValid = true;
        } else if (!this.hasAttemptedLIApply && resumeInfo) {
            // Validate file & Apply
            applyForm.$submitted = true;
            isFileValid = this.validateResume(resumeInfo);
        } else {
            this.$log.error(this.$filter('i18n')('modal.LIError'));
        }

        if (applyForm.$valid && isFileValid) {
            controller = this;
            controller.isSubmitting = true;
            this.ApplyService.submit(this.SearchService.currentDetailData.id, function () {
                controller.applySuccess();
                controller.isSubmitting = false;
            }, function () {
                controller.isSubmitting = false;
            });
        }
    }
}

export default CareerPortalModalController;
