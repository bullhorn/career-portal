/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApplyModalComponent } from './apply-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { NovoElementsModule } from 'novo-elements';
import { RouterTestingModule } from '@angular/router/testing';
import { ChomskyModule } from 'chomsky';

describe('ApplyModalComponent', () => {
  let component: ApplyModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ApplyModalComponent ],
      imports: [ChomskyModule, RouterTestingModule, NovoElementsModule, BrowserModule, HttpClientModule],
    });
  });

  beforeEach(inject([ApplyModalComponent], (_component: any) => {
    component = _component;

  }));

  describe('app component', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });
  });
});
