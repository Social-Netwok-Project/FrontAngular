import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListElementComponent } from './message-list-element.component';

describe('MessageListElementComponent', () => {
  let component: MessageListElementComponent;
  let fixture: ComponentFixture<MessageListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageListElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
