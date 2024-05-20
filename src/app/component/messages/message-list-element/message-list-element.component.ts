import {Component, Input, OnInit} from '@angular/core';
import {MessageListElement} from "./message-list-element";
import {getDateTime} from "../../misc/functions";

@Component({
  selector: 'app-message-list-element',
  standalone: true,
  imports: [],
  templateUrl: './message-list-element.component.html',
  styleUrl: './message-list-element.component.scss'
})
export class MessageListElementComponent implements OnInit {
  @Input() messageListElement!: MessageListElement | undefined;
  timeStamp: string = "";

  constructor() {
  }

  ngOnInit(): void {
    this.timeStamp = getDateTime(this.messageListElement?.message.timestamp!)
  }
}
