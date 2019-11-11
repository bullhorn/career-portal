/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';

describe('JobListComponent', () => {
  let component: MainPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MainPageComponent ],
    });
  });

  beforeEach(inject([MainPageComponent], (_component: any) => {
    component = _component;

  }));

  describe('app component', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });
  });
});
