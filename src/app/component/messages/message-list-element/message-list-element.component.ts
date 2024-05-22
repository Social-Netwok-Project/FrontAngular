import {Component, Input, OnInit} from '@angular/core';
import {MessageListElement} from "./message-list-element";
import {getCurrentDate, getDateTime} from "../../misc/functions";

@Component({
  selector: 'app-message-list-element',
  standalone: true,
  imports: [],
  templateUrl: './message-list-element.component.html',
  styleUrl: './message-list-element.component.scss'
})
export class MessageListElementComponent {
  @Input() messageListElement!: MessageListElement | undefined;

  constructor() {}

  protected readonly getCurrentDate = getCurrentDate;
  protected readonly getDateTime = getDateTime;
}
