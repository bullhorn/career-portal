/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InfoChipsComponent } from './info-chips.component';

describe('InfoChipsComponent', () => {
  let component: InfoChipsComponent;
  let fixture: ComponentFixture<InfoChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoChipsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
