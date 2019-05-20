import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerPage } from './summer.page';

describe('SummerPage', () => {
  let component: SummerPage;
  let fixture: ComponentFixture<SummerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
