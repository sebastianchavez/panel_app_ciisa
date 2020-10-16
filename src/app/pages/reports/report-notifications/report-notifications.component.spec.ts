import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNotificationsComponent } from './report-notifications.component';

describe('ReportNotificationsComponent', () => {
  let component: ReportNotificationsComponent;
  let fixture: ComponentFixture<ReportNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
