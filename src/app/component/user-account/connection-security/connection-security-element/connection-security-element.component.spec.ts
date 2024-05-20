import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSecurityElementComponent } from './connection-security-element.component';

describe('ConnectionSecurityElementComponent', () => {
  let component: ConnectionSecurityElementComponent;
  let fixture: ComponentFixture<ConnectionSecurityElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionSecurityElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionSecurityElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
