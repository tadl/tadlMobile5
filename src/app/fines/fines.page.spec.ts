import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesPage } from './fines.page';

describe('FinesPage', () => {
  let component: FinesPage;
  let fixture: ComponentFixture<FinesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
