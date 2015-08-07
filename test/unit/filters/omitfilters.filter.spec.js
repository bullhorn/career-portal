'use strict';

describe('Filter: OmitFilters', function () {
    beforeEach(function () {
        // Mock configuration
        module(function ($provide) {
            $provide.constant('configuration', {
                "acceptedResumeTypes": [
                    "html",
                    "text",
                    "txt",
                    "pdf",
                    "doc",
                    "docx",
                    "rtf",
                    "odt"
                ],
                "companyName": "Karma Company",
                "defaultLocale": "en-US",
                "localeSupported": [
                    "en-US",
                    "fr-FR"
                ],
                "minUploadSize": 1024,
                "maxRelatedJobs": 5,
                "maxUploadSize": 204800,
                "service": {
                    "batchSize": 500,
                    "corpToken": "1hs",
                    "port": 8181,
                    "swimlane": "-qa"
                }
            });
        });

        module('CareerPortal');
    });

    it('should be defined', function () {
        return true;
    });
});
