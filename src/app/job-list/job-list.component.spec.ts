/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { JobListComponent } from './job-list.component';

describe('JobListComponent', () => {
  let component: JobListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ JobListComponent ],
    });
  });

  beforeEach(inject([JobListComponent], (_component: any) => {
    component = _component;

  }));

  describe('app component', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });
  });
});
