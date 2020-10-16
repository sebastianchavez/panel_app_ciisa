import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNewsComponent } from './report-news.component';

describe('ReportNewsComponent', () => {
  let component: ReportNewsComponent;
  let fixture: ComponentFixture<ReportNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
