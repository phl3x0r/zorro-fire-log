import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSettingsComponent } from './portfolio-settings.component';

describe('PortfolioSettingsComponent', () => {
  let component: PortfolioSettingsComponent;
  let fixture: ComponentFixture<PortfolioSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
