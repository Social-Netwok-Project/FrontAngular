import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchUsersComponent } from './switch-users.component';

describe('SwitchUsersComponent', () => {
  let component: SwitchUsersComponent;
  let fixture: ComponentFixture<SwitchUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwitchUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
