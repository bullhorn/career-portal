The portal is configurable without modifying code. The options are found in the `app.json` file found in the root directory of the portal.



| Option | Description |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| acceptedResumeTypes | This option defines the resume extensions that will be accepted when you attempt to upload a resume. The default options are "html", "text","txt","pdf","doc","docx","rtf","odt". |
| companyName | This is the company name that displays at the top of the portal and in the EEOC information on the apply modal |
| companyLogoPath | This is the image that will be displayed when shared on social media. (advanced hosting only) |
| companyUrl | URL of your main recruiting website |
| careersUrl | URL of the page that you are hosting the career portal on. |
| defaultLocale | This is the locale that will display on the portal if the browser does not request a specific look and feel. The ones that you can add are en-US,en-GB, and fr-FR. |
| supportedLocales | The locales that the browser will switch to if the browser requests a specific language The ones that you can add are en-US,en-GB,en-EU, and fr-FR. Ordered by preference. |
| minUploadSize | This is the smallest file size that is allowed by the portal. The default is 4096 (kb). |
| maxRelatedJobs | The amount of related jobs that displays below the apply section. The default is 5. |
| maxUploadSize | This is the largest file size that is allowed by the portal. The default is 5242880 (kb). |
| batchSize | This is the amount of jobs supported by the portal. The max is 500. This changes the count in the API queries |
| corpToken | The unique identifier for the corporation that is provided by Bullhorn Support |
| port | This is the port used to communicate with Bullhorn. When null the default is 443 |
| swimlane | The server cluster that the corporation is located on. This is provided by Bullhorn Support. |
| fields | Fields that are requested from Bullhorn in API calls.|
| jobInfoChips | list of fields displayed on the job as the grey "chips". If the field is not available from the API request, please add it to the "fields" option. If the field does not display in the API request, please contact Bullhorn Support so they can complete the necessary steps on their end to get the fields to display|
| fields | Fields that are requested from Bullhorn in API calls.|
| showCategory | Determines whether or not the category field will show on the job list entry/job .|
| keywordSearchFields | allows you to change which fields are available to keyword search. |
| field | Additional field to narrow down the jobs in the job list. Example: If you wanted to use two portals and each with different jobs, you can have one portal use customText2 with values A, B, and C and the other use customText2 with values C, D, and E |
| values | For use with the additional criteria field option. This is the value it will look for in the field specified above |
| sort | order that the fields appear in the list. Prepend either a + or - to determine if the field is descending or ascending respectively (ex `-dateLastPublished` or `+address.city`) |
| googleAnalytics >tracking Id | Field to enter in your google analytics tracking ID |
| googleSiteVerification > verification code | Adds meta tag to your header for google site verification |
| genderRaceEthnicity | Adds the prompt to ask for ethnicity on the apply popup. |
| veteran | Adds the prompt to ask for veteran status on the apply popup. |
| disability | Adds the prompt to ask about disability on the apply popup. |
| consentCheckbox | Enables whether or not a checkbox that states consent of the privacy policy restricts applying to the career portal or not |
| privacyPolicyUrl | Url for the privacy policy link. |
| usePrivacyPolicyUrl | Enables or disables use of the privacy policy url when the linked is clicked. When disabled and the consent checkbox is enabled, when the link is clicked a tooltip opens |
