import { TestBed, inject } from '@angular/core/testing';

import { ErrorModalComponent } from './error-modal.component';
import { NovoElementsModule, NovoModalModule, NovoModalParams, NovoModalRef } from 'novo-elements';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ChomskyModule, TranslateService } from 'chomsky';
import { BrowserModule } from '@angular/platform-browser';

describe('JobListComponent', () => {
  let component: ErrorModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ErrorModalComponent, NovoModalParams, NovoModalRef ],
      imports: [ChomskyModule, RouterTestingModule, NovoElementsModule, BrowserModule, HttpClientModule],
    });
  });

  beforeEach(inject([ErrorModalComponent], (_component: any) => {
    component = _component;

  }));

  describe('app component', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });
  });
});
