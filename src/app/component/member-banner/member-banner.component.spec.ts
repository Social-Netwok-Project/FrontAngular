import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBannerComponent } from './member-banner.component';

describe('MemberBannerComponent', () => {
  let component: MemberBannerComponent;
  let fixture: ComponentFixture<MemberBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
