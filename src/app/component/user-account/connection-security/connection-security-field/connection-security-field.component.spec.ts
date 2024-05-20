import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSecurityFieldComponent } from './connection-security-field.component';

describe('CsElemComponent', () => {
  let component: ConnectionSecurityFieldComponent;
  let fixture: ComponentFixture<ConnectionSecurityFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionSecurityFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionSecurityFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
