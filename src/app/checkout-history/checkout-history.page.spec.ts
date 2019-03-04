import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHistoryPage } from './checkout-history.page';

describe('CheckoutHistoryPage', () => {
  let component: CheckoutHistoryPage;
  let fixture: ComponentFixture<CheckoutHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
