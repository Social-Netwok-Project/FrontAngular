import {Component, ElementRef, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MessageListElementComponent} from "../messages/message-list-element/message-list-element.component";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {CookieComponent} from "../misc/cookie-component";
import {faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {switchUsersNavigationItem} from "../header/navigation-item";

@Component({
  selector: 'app-switch-users',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MessageListElementComponent,
    NgForOf,
    PaginatorModule
  ],
  templateUrl: './switch-users.component.html',
  styleUrl: './switch-users.component.scss'
})
export class SwitchUsersComponent extends CookieComponent implements OnInit {
  faArrowRightToBracket = faArrowRightToBracket;

  constructor(private el: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }

  protected readonly switchUsersNavigationItem = switchUsersNavigationItem;
}
