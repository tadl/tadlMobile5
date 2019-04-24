import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerDetailPage } from './summer-detail.page';

describe('SummerDetailPage', () => {
  let component: SummerDetailPage;
  let fixture: ComponentFixture<SummerDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummerDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
