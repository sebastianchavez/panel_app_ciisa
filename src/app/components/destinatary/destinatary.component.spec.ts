import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinataryComponent } from './destinatary.component';

describe('DestinataryComponent', () => {
  let component: DestinataryComponent;
  let fixture: ComponentFixture<DestinataryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinataryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinataryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
