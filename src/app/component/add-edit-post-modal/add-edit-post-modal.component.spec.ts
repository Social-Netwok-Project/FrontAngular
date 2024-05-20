import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPostModalComponent } from './add-edit-post-modal.component';

describe('AddEditProductModalComponent', () => {
  let component: AddEditPostModalComponent;
  let fixture: ComponentFixture<AddEditPostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPostModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
