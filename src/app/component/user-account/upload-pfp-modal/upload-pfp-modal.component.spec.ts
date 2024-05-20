import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPfpModalComponent } from './upload-pfp-modal.component';

describe('UploadPfpComponent', () => {
  let component: UploadPfpModalComponent;
  let fixture: ComponentFixture<UploadPfpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPfpModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPfpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
