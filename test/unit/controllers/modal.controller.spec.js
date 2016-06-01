/* global describe, beforeEach, expect, it, spyOn */
describe('Controller: CareerPortalModalController', () => {
    let vm,
        $controller;

    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.constant('configuration', {
                someUrl: '/dummyValue',
                service: {corpToken: 1, port: 1, swimlane: 1},
                integrations: {linkedin: {clientId: ''}},
                acceptedResumeTypes: ['html', 'text', 'txt'],
                minUploadSize: 4096,
                maxUploadSize: 5242880
            });
        });
    });

    beforeEach(angular.mock.module('CareerPortal'));

    beforeEach(inject(($injector) => {
        $controller = $injector.get('$controller');
        vm = $controller('CareerPortalModalController');
    }));

    it('should have all of its dependencies defined.', () => {

        // NG Dependencies
        expect(vm.$location).toBeDefined();
        expect(vm.$window).toBeDefined();
        expect(vm.$filter).toBeDefined();
        expect(vm.$log).toBeDefined();

        // Other Dependencies
        expect(vm.configuration).toBeDefined();
        expect(vm.SharedData).toBeDefined();
        expect(vm.SearchService).toBeDefined();
        expect(vm.ShareService).toBeDefined();
        expect(vm.ApplyService).toBeDefined();
        expect(vm.LinkedInService).toBeDefined();
        expect(vm.locale).toBeDefined();

        // Variables
        expect(vm.isIOSSafari).toBeDefined();
        expect(vm.email).toBeDefined();
        expect(vm.hasAttemptedLIApply).toBeFalsy();
        expect(vm.linkedInData.header).toBeDefined();
        expect(vm.linkedInData.resume).toBeDefined();
        expect(vm.linkedInData.footer).toBeDefined();
    });


    describe('Function: applyWithLinkedIn()', () => {
        it('should be defined.', () => {
            expect(vm.applyWithLinkedIn).toBeDefined();
        });
        it('should call getUser on the LinkedInService and set the hasAttemptedLIApply flag to true.', () => {
            // TODO: verify this mock is valid @krsween
            spyOn(vm.LinkedInService, 'getUser').and.callFake(function () {
                return {
                    then: function () {
                    }
                };
            });
            vm.applyWithLinkedIn();
            expect(vm.LinkedInService.getUser).toHaveBeenCalled();
            expect(vm.hasAttemptedLIApply).toBeTruthy();
        });
    });

    describe('Function: closeModal(applyForm)', () => {
        it('should be defined.', () => {
            expect(vm.closeModal).toBeDefined();
        });
        it('should reset close the modal and clear all modal data.', () => {
            vm.SharedData.modalState = 'open';
            vm.showForm = false;
            vm.hasAttemptedLIApply = true;
            vm.closeModal();
            expect(vm.SharedData.modalState).toBe('closed');
            expect(vm.showForm).toBeTruthy();
            expect(vm.hasAttemptedLIApply).toBeFalsy();
        });
    });

    describe('Function: validateResume(file)', () => {
        it('should be defined.', () => {
            expect(vm.validateResume).toBeDefined();
        });

        beforeEach(() => {
            spyOn(vm, '$filter').and.callFake(function () {
                return function (string) {
                    var localization = {
                        resumeToBig: 'Too Big',
                        resumeToSmall: 'Too Small',
                        maxLabel: 'max',
                        minLabel: 'min',
                        resumeInvalidFormat: 'INVALID'
                    };
                    string = string.replace('modal.', '');
                    return localization[string];
                };
            });
        });

        it('should return false and set the error message for an invalid format', () => {
            var validateResult = vm.validateResume({name: 'Test.pdf', size: 10});
            expect(validateResult).toBe(false);
            expect(vm.isSubmitting).toBe(false);
            expect(vm.resumeUploadErrorMessage).toEqual('PDF INVALID');
        });
        it('should return false and set the error message for a file that is too big', () => {
            var validateResult = vm.validateResume({name: 'Test.txt', size: 6000000});
            expect(validateResult).toBe(false);
            expect(vm.isSubmitting).toBe(false);
            expect(vm.resumeUploadErrorMessage).toEqual('Too Big (max: 5MB)');
        });
        it('should return false and set the error message for a file that is too small', () => {
            var validateResult = vm.validateResume({name: 'Test.txt', size: 50});
            expect(validateResult).toBe(false);
            expect(vm.isSubmitting).toBe(false);
            expect(vm.resumeUploadErrorMessage).toEqual('Too Small (min: 4KB)');
        });
    });

    describe('Function: updateUploadClass(valid)', () => {
        it('should be defined.', () => {
            expect(vm.updateUploadClass).toBeDefined();
        });
    });

    describe('Function: enableSendButton()', () => {
        it('should be defined.', () => {
            expect(vm.enableSendButton).toBeDefined();
        });
    });

    describe('Function: getTooltipText()', () => {
        it('should be defined.', () => {
            expect(vm.getTooltipText).toBeDefined();
        });
        it('should build out an unordered list of supported file types.', () => {
            var tooltipHTML = vm.getTooltipText();
            expect(tooltipHTML).toBe('<ul><li>html</li><li>text</li><li>txt</li></ul>');
            vm.configuration.acceptedResumeTypes = ['html'];
            tooltipHTML = vm.getTooltipText();
            expect(tooltipHTML).toBe('<ul><li>html</li></ul>');
        });

    });

    describe('Function: formatResume(userProfile)', () => {
        it('should be defined.', () => {
            expect(vm.formatResume).toBeDefined();
        });

        beforeEach(() => {
            // Mock out i18n stuff
            spyOn(vm, '$filter').and.callFake(function () {
                return function (string) {
                    var localization = {
                        'Months': 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec',
                        'profileReceived': 'This LinkedIn resume information was received on',
                        'legal': 'It contains confidential information and is intended only for use within the Bullhorn platform as a part of the Career Portal app.',
                        'at': 'at',
                        'education': 'Education:',
                        'skillHeading': 'Skills:',
                        'workExperience': 'Work Experience:',
                        'present': 'Present',
                        'profileURL': 'LinkedIn Profile URL:'
                    };
                    string = string.replace('modal.', '');
                    return localization[string];
                };
            });
        });

        // Begin a million cases... *sigh*

        // Note: while the output verification matters, the real benefit of these tests is knowing that the parser
        // function doesn't throw an undefined error

        it('should format a resume with all fields.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume without the location field.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume without the country code field.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, ');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume without the country field.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {'_total': 1, 'values': []},
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\n');
        });

        it('should format a resume without the positions field.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\n');
        });

        it('should format a resume without the email address and formatted name fields.', () => {
            var mockResume = {
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\n\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should not duplicate data when called multiple times', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            vm.formatResume(mockResume);
            vm.formatResume(mockResume);
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should not return undefined when the industry is not set.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'}
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume with one school in the education section.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'},
                'educations': {
                    '_total': 1,
                    'values': [{
                        'degree': 'Bachelor of Arts (B.A.)',
                        'endDate': {'year': 2016},
                        'fieldOfStudy': 'Computer Science',
                        'id': 77777777,
                        'schoolName': 'College 1',
                        'startDate': {'year': 2012}
                    }]
                }
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Education:\nBachelor of Arts (B.A.) Computer Science \nCollege 1 2012 - 2016 \n\n\nWork Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume with two or more schools in the education section.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'},
                'educations': {
                    '_total': 1,
                    'values': [
                        {
                            'id': 99999999,
                            'schoolName': 'College 1'
                        },
                        {
                            'id': 88888888,
                            'schoolName': 'College 2'
                        }
                    ]
                }
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Education:\nCollege 1 \nCollege 2 \n\n\nWork Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\n');
        });

        it('should format a resume with two or more jobs in the position section.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 3,
                    'values': [
                        {
                            'company': {
                                'id': 18144,
                                'industry': 'Computer Software',
                                'name': 'Bullhorn',
                                'size': '501-1000 employees',
                                'type': 'Privately Held'
                            },
                            'id': 55555555,
                            'isCurrent': true,
                            'startDate': {
                                'month': 2,
                                'year': 2015
                            },
                            'summary': 'Description of job 1.',
                            'title': 'Software Development Manager'
                        },
                        {
                            'company': {
                                'id': 55555555,
                                'industry': 'Wireless',
                                'name': 'Bullhorn',
                                'size': '10,001+ employees',
                                'ticker': 'QCOM',
                                'type': 'Public Company'
                            },
                            'endDate': {
                                'month': 2,
                                'year': 2015
                            },
                            'id': 55555555,
                            'isCurrent': false,
                            'startDate': {
                                'month': 10,
                                'year': 2009
                            },
                            'summary': 'Description of job 2',
                            'title': 'Senior Staff Engineer'
                        },
                        {
                            'company': {
                                'id': 55555555,
                                'industry': 'Telecommunications',
                                'name': 'Company 3',
                                'size': '51-200 employees',
                                'ticker': '',
                                'type': 'Privately Held'
                            },
                            'endDate': {
                                'month': 9,
                                'year': 2009
                            },
                            'id': 55555555,
                            'isCurrent': false,
                            'startDate': {
                                'month': 8,
                                'year': 2007
                            },
                            'summary': 'Description of job 3',
                            'title': 'Software Engineer'
                        }
                    ]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'},
                'educations': {
                    '_total': 1,
                    'values': [
                        {
                            'id': 99999999,
                            'schoolName': 'College 1'
                        },
                        {
                            'id': 88888888,
                            'schoolName': 'College 2'
                        }
                    ]
                }
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Education:\nCollege 1 \nCollege 2 \n\n\nWork Experience:\nBullhorn Feb 2015 - Present\nSoftware Development Manager\nComputer Software\nDescription of job 1.\n\n\n\nBullhorn Oct 2009 - Feb 2015\nSenior Staff Engineer\nWireless\nDescription of job 2\n\n\n\nCompany 3 Aug 2007 - Sep 2009\nSoftware Engineer\nTelecommunications\nDescription of job 3\n\n\n\n');
        });

        it('should format a resume with multiple skills.', () => {
            var mockResume = {
                'emailAddress': 'email@bullhorn.com',
                'firstName': 'John',
                'formattedName': 'John Stamos',
                'lastName': 'Stamos',
                'location': {'country': {'code': 'us'}, 'name': 'Greater Boston Area'},
                'positions': {
                    '_total': 1,
                    'values': [{
                        'company': {
                            'id': 18144,
                            'industry': 'Computer Software',
                            'name': 'Bullhorn',
                            'size': '501-1000 employees',
                            'type': 'Privately Held'
                        },
                        'id': 725128063,
                        'isCurrent': true,
                        'location': {'country': {'code': 'us', 'name': 'United States'}, 'name': 'Greater Boston Area'},
                        'startDate': {'month': 10, 'year': 2015},
                        'title': 'Sr. Engineer'
                    }]
                },
                'publicProfileUrl': 'https://www.linkedin.com/in/stamosforreal',
                'siteStandardProfileRequest': {'url': 'https://www.linkedin.com/profile/view?id=datstamosthooo'},
                'skills': {
                    '_total': 3,
                    'values': [
                        {
                            'id': 1,
                            'skill': {
                                'name': 'Skill 1'
                            }
                        },
                        {
                            'id': 2,
                            'skill': {
                                'name': 'Skill 2'
                            }
                        },
                        {
                            'id': 3,
                            'skill': {
                                'name': 'Skill 3'
                            }
                        }
                    ]
                }
            };
            vm.formatResume(mockResume);
            expect(vm.linkedInData.header).toBe('John Stamos\nemail@bullhorn.com\nGreater Boston Area, US\n\n\n');
            expect(vm.linkedInData.resume).toBe('Work Experience:\nBullhorn Oct 2015 - Present\nSr. Engineer\nComputer Software\nGreater Boston Area\n\n\n\nSkills:\nSkill 1, Skill 2, Skill 3\n\n\n');
        });

    });

    describe('Function: applySuccess()', () => {
        it('should be defined.', () => {
            expect(vm.applySuccess).toBeDefined();
        });
    });

    describe('Function: submit(applyForm)', () => {

        // Mock out the Blob function because Phantom doesn't have one. #lame
        beforeEach(() => {
            spyOn(window, 'Blob').and.callFake((collection, properties) => {
                return {
                    size: collection[0].length || 0,
                    type: properties.type || 'text/plain'
                };
            });
        });

        it('should be defined.', () => {
            expect(vm.submit).toBeDefined();
        });
        it('should open an email if the user hasn\'t uploaded a binary or has entered an email address.', () => {
            let mockApplyForm = {$valid: false};
            vm.hasAttemptedLIApply = false;
            vm.email = 'email@address.com';
            vm.SearchService.currentDetailData = 'details';
            spyOn(vm.$window, 'open').and.callFake(() => {
                return true;
            });
            vm.submit(mockApplyForm);
            expect(vm.$window.open).toHaveBeenCalledWith('mailto:email@address.com?subject=undefined&body=Check out this undefined job: http%3A%2F%2Flocalhost%3A9876%2Fcontext.html%0A', '_self');
        });
        it('should create a binary from the linkedInData object when the user applies with LinkedIn.', () => {
            let mockApplyForm = {$valid: false, $submitted: false};
            vm.linkedInData = {
                header: 'Header',
                resume: 'Resume',
                footer: 'Footer'
            };

            vm.hasAttemptedLIApply = true;
            vm.submit(mockApplyForm);
            expect(mockApplyForm.$submitted).toBeTruthy();
            expect(vm.ApplyService.form.resumeInfo.size).toBe(vm.linkedInData.header.length + vm.linkedInData.resume.length + vm.linkedInData.footer.length);
            expect(vm.ApplyService.form.resumeInfo.type).toBe('text/plain');
        });

        it('should validate a binary when the user uploads one.', () => {
            let mockApplyForm = {$valid: false, $submitted: false};
            spyOn(vm, 'validateResume').and.callThrough();
            spyOn(vm, 'updateUploadClass').and.callThrough();
            // Create a 'file' (kind of)
            vm.ApplyService.form.resumeInfo = {};
            vm.submit(mockApplyForm);
            expect(mockApplyForm.$submitted).toBeTruthy();
            expect(vm.validateResume).toHaveBeenCalled();
            // Just because we know this file isn't valid
            expect(vm.updateUploadClass).toHaveBeenCalledWith(false);
        });

    });

});
