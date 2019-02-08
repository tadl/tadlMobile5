import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldsPage } from './holds.page';

describe('HoldsPage', () => {
  let component: HoldsPage;
  let fixture: ComponentFixture<HoldsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
