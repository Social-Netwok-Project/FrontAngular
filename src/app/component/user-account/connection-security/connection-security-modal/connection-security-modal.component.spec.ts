import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSecurityModalComponent } from './connection-security-modal.component';

describe('ConnectionSecurityModalComponent', () => {
  let component: ConnectionSecurityModalComponent;
  let fixture: ComponentFixture<ConnectionSecurityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionSecurityModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionSecurityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
