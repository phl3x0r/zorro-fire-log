import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoSelectorComponent } from './algo-selector.component';

describe('AlgoSelectorComponent', () => {
  let component: AlgoSelectorComponent;
  let fixture: ComponentFixture<AlgoSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgoSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
