import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldsReadyPage } from './holds-ready.page';

describe('HoldsReadyPage', () => {
  let component: HoldsReadyPage;
  let fixture: ComponentFixture<HoldsReadyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldsReadyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldsReadyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
