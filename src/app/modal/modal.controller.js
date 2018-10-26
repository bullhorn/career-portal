class CareerPortalModalController {
    /* jshint -W072 */
    constructor($rootScope, $location, $window, $filter, $log, SharedData, SearchService, ApplyService, configuration, locale, ShareService, APPLIED_JOBS_KEY, EeocService) {
        'ngInject';
        // NG Dependencies
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$filter = $filter;
        this.$log = $log;

        // Dependencies
        this.configuration = configuration;
        this.SharedData = SharedData;
        this.SearchService = SearchService;
        this.ShareService = ShareService;
        this.ApplyService = ApplyService;
        this.EeocService = EeocService;
        this.locale = locale;

        // Variables
        this.isToolTipHidden = true;
        this.currentToolTip = 0;
        this.APPLIED_JOBS_KEY = APPLIED_JOBS_KEY;
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

        this.consentValue = false || !configuration.privacyConsent.consentCheckbox;

        configuration.privacyConsent.privacyStatementParagraphs = configuration.privacyConsent.privacyStatementParagraphs.join('<br/><br/>');
        this.privacyConsent = configuration.privacyConsent;

        this.tooltipStyle = {top: '50%'};

        // Load directive with modal closed by default
        this.closeModal();
    }

    closeModal(applyForm) {
        this.SharedData.modalState = 'closed';
        this.showForm = true;
        this.hasAttemptedLIApply = false;

        // Clear the errors if we have the form
        if (applyForm) {
            applyForm.$setPristine();
        }
        let modal = document.getElementById('modal-container');
        if (modal) {
            modal.scrollTop = 0;
        }

    }

    validateResume(file) {
        if (!file || !file.name) {
            this.updateUploadClass(false);
            return false;
        }

        // First check the type
        let fileArray = file.name.split('.'),
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
        } else if (file.size < this.configuration.minUploadSize) {
            this.resumeUploadErrorMessage = this.$filter('i18n')('modal.resumeToSmall') + ' (' + this.$filter('i18n')('modal.minLabel') + ': ' + this.configuration.minUploadSize / 1024 + 'KB)';
            this.updateUploadClass(false);
            this.isSubmitting = false;
            return false;
        }

        this.resumeUploadErrorMessage = null;
        this.updateUploadClass(true);
        return true;
    }

    updateUploadClass(valid) {
        let $uploadContainer = document.querySelector('.upload-container');
        if ($uploadContainer) {
            $uploadContainer.classList.toggle('valid', valid);
        }
    }

    disableSendButton(isFormValid) {
        let resume = this.ApplyService.form.resumeInfo;

        if (isFormValid && (resume || this.linkedInData.resume) && this.consentValue) {
            if (this.linkedInData.resume.length !== 0 || resume.type) {
                return false;
            }
        } else if (this.email && this.consentValue) {
            return false;
        }
        return true;
    }

    showTooltip(toolTipType) {
        // 0: FileTypes
        // 1: EEOC Gender, Race, Ethnicity
        // 2: EEOC  Race/Ethnicity
        // 3: EEOC Veteran
        // 4: EEOC Disability
        // 5: Privacy Policy
        if ((toolTipType || toolTipType === 0) && (toolTipType !== 5 || (toolTipType === 5 && !this.privacyConsent.usePrivacyPolicyUrl))) {
            this.isToolTipHidden = false;
            let percentage = '50%';
            switch (toolTipType) {
                case 5:
                if (this.EeocService.isVeteranEnabled() && this.EeocService.isGenderRaceEthnicityEnabled() && this.EeocService.getCheckedEthnicities()) {
                    percentage = '75%';
                } else if (this.EeocService.isVeteranEnabled() || this.EeocService.isGenderRaceEthnicityEnabled() || this.EeocService.getCheckedEthnicities()) {
                    percentage = '55%';
                } else {
                    percentage = '45%';
                }
                    break;
                case 4:
                percentage = '65%';
                    break;
                default:
                    break;
            }

            this.tooltipStyle = {top: percentage};
            this.currentToolTip = toolTipType;
        }
    }

    hideTooltip() {
        this.isToolTipHidden = true;
    }

    formatResume(userProfile) {
        let lineBreak = '\n',
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
        if (this.checkNested(userProfile, 'location', 'name')) {
            this.linkedInData.header += (userProfile.location.name || '') + ', ';
            if (userProfile.location.country) {
                this.linkedInData.header += (userProfile.location.country.code.toUpperCase() || '') + hardBreak;
            }
        }
        // Clear Instance of resume
        this.linkedInData.resume = '';
        // Education
        if (this.checkNested(userProfile, 'educations', 'values')) {
            //if (userProfile.educations && userProfile.educations.values) {
            let education = userProfile.educations.values;
            this.linkedInData.resume += this.$filter('i18n')('modal.education') + lineBreak;
            for (let i = 0; i < education.length; i++) {
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
        if (this.checkNested(userProfile, 'positions', 'values')) {
            for (let i = 0; i < userProfile.positions.values.length; i++) {
                // Add Employee section header
                this.linkedInData.resume += ((userProfile.positions.values[i].company || {}).name || '') + ' ';
                // Start Date
                if (userProfile.positions.values[i].startDate) {
                    this.linkedInData.resume += months[userProfile.positions.values[i].startDate.month - 1] + ' ' + userProfile.positions.values[i].startDate.year + ' - ' || '';
                }
                // End Date or 'Present'
                if (userProfile.positions.values[i].endDate) {
                    this.linkedInData.resume += months[userProfile.positions.values[i].endDate.month - 1] + ' ' + userProfile.positions.values[i].endDate.year || '';
                } else {
                    if (userProfile.positions.values[i].isCurrent) { // jshint ignore:line
                        this.linkedInData.resume += this.$filter('i18n')('modal.present');
                    }
                }
                this.linkedInData.resume += lineBreak;
                // Title
                this.linkedInData.resume += userProfile.positions.values[i].title + lineBreak || '';
                // Industry
                this.linkedInData.resume += userProfile.positions.values[i].company.industry ? userProfile.positions.values[i].company.industry + lineBreak : '';
                if (userProfile.positions.values[i].location && userProfile.positions.values[i].location.name) {
                    // Locale
                    this.linkedInData.resume += userProfile.positions.values[i].location.name + lineBreak || '';
                }
                // Summary
                if (userProfile.positions.values[i].summary) {
                    this.linkedInData.resume += userProfile.positions.values[i].summary + lineBreak || '';
                }
                this.linkedInData.resume += hardBreak;
            }
        }

        // Skills
        if (this.checkNested(userProfile, 'skills', 'values')) {
            this.linkedInData.resume +=  this.$filter('i18n')('modal.skillHeading') + lineBreak;
            let skills = userProfile.skills.values;
            for (let i = 0; i < skills.length; i++) {
                let newSkill = skills[i].skill;
                if (newSkill && newSkill.name) {
                    this.linkedInData.resume += newSkill.name;
                    if (skills[i + 1]) {
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

    checkNested(obj) {
        let args = Array.prototype.slice.call(arguments, 1);
        for (let i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
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
        // Set the job id in session storage to make sure they can't apply to the same one during the same session
        let alreadyAppliedJobs = sessionStorage.getItem(this.APPLIED_JOBS_KEY);
        if (alreadyAppliedJobs) {
            let alreadyAppliedJobsArray = JSON.parse(alreadyAppliedJobs);
            alreadyAppliedJobsArray.push(this.SearchService.currentDetailData.id);
            sessionStorage.setItem(this.APPLIED_JOBS_KEY, JSON.stringify(alreadyAppliedJobsArray));
        } else {
            sessionStorage.setItem(this.APPLIED_JOBS_KEY, JSON.stringify([this.SearchService.currentDetailData.id]));
        }
        // Send a modal success message to update other views
        this.$rootScope.$broadcast('ModalSuccess');
    }

    submit(applyForm) {
        let isFileValid = false,
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
