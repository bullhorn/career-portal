describe('Job Detail', () => {
  it('Should be able to open the apply modal and apply to the job', () => {
    cy.clearCookies()
    cy.visit('/');
    let jobInformation;
    cy.intercept({
      hostname: 'public-rest91.bullhornstaffing.com',
      method: 'GET',
      pathname: '/rest-services/1VCNF4/query/JobBoardPost',
      query: {
        fields: 'id,title,publishedCategory(id,name),address(city,state,zip),employmentType,dateLastPublished,publicDescription,isOpen,isPublic,isDeleted,publishedZip,salary,salaryUnit',
        where: '*id=*'
      },
    }).as('jobResponse');
    cy.get('novo-list>div.job-card').first().click();
    cy.url().should('include', '/jobs/');
    cy.wait('@jobResponse');
    cy.log(JSON.stringify(jobInformation));
    cy.get('[data-automation-id="apply-button"]').click();
    cy.get('[data-automation-id="firstName"]').type('Sample');
    cy.get('[data-automation-id="lastName"]').type('AutomationCandidate' + Date.now().toString());
    cy.get('[data-automation-id="email"]').type('Emasdjasdjsad@dkdkdk.' + Date.now().toString());

    cy.get('[data-automation-id="gender"]').click();
    cy.get('[data-automation-value="Male"]').click();

    cy.get('[data-automation-id="ethnicity"] input').focus();
    cy.get('picker-results novo-list-item').first().click();
    cy.get('novo-fieldset-header').first().click(); // close picker after selection

    cy.get('[data-automation-id="veteran"]').click();
    cy.get('[data-automation-value="Non-Veteran"]').click();

    cy.get('[data-automation-id="disability"]').click();
    cy.get('[data-automation-value="Disability"]').click();

    cy.get('[data-automation-id="consent"] novo-checkbox').click();
    cy.fixture('fakeResume.pdf', 'base64').as('resume');

    cy.get('[data-automation-id="resume"] input').attachFile('fakeResume.pdf');

    cy.intercept({
      hostname: 'public-rest91.bullhornstaffing.com',
      method: 'POST',
      pathname: '/rest-services/1VCNF4/apply/12540/raw',
    }).as('applyResponse');
    cy.get('[data-automation-id="apply-modal-save"]').click();

    cy.wait('@applyResponse');

    cy.get('[data-automation-id="applied-button"]').should('be.visible');
    cy.get('[data-automation-id="back-button"]').click();
    cy.url().should('not.include', '/jobs/');
  });
});
