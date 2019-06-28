import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomeDashboardComponent } from './user-home-dashboard.component';

describe('UserHomeDashboardComponent', () => {
  let component: UserHomeDashboardComponent;
  let fixture: ComponentFixture<UserHomeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHomeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHomeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
