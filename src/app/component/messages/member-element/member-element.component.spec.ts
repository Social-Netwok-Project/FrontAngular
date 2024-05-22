import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberElementComponent } from './member-element.component';

describe('MemberElementComponent', () => {
  let component: MemberElementComponent;
  let fixture: ComponentFixture<MemberElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
