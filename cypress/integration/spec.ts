describe('Job List', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.get('novo-list>div.job-card').each(($el, index, $list)=>{
      expect($list.length).greaterThan(5);
    })
  })
  it('Filter Categories', () => {
    cy.visit('/')
    cy.get('app-sidebar [data-automation-id="category"] novo-check-list>div.check-box-group').each(($el, index, $list)=>{
      if (index < 10) {
        const automationId = $el.attr('data-automation-id');
        expect(!!automationId).eq(true, 'empty category in list')      ;
        $
        $el.trigger('click');
      } else {
        return false;
      }
    })
  })
  it('Filter States', () => {
    cy.visit('/')
    cy.get('novo-list>div.job-card').each(($el, index, $list)=>{
      expect($list.length).greaterThan(5);
    })
  })
  it('Filter Cities', () => {
    cy.visit('/')
    cy.get('novo-list>div.job-card').each(($el, index, $list)=>{
      expect($list.length).greaterThan(5);
    })
  })
})
