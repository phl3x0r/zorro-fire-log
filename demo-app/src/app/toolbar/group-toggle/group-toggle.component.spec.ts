import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupToggleComponent } from './group-toggle.component';

describe('GroupToggleComponent', () => {
  let component: GroupToggleComponent;
  let fixture: ComponentFixture<GroupToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
