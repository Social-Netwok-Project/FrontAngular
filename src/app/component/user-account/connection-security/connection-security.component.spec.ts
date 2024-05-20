import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSecurityComponent } from './connection-security.component';

describe('ConnectionSecurityComponent', () => {
  let component: ConnectionSecurityComponent;
  let fixture: ComponentFixture<ConnectionSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionSecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
