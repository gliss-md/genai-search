import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyDashboard } from './weekly-dashboard';

describe('WeeklyDashboard', () => {
  let component: WeeklyDashboard;
  let fixture: ComponentFixture<WeeklyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
