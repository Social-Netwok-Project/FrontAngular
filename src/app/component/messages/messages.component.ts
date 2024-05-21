import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {faMessage} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CurrentMemberService} from "../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";

import {CookieComponent} from "../misc/cookie-component";
import {NgForOf, NgIf} from "@angular/common";
import {MessageListElementComponent} from "./message-list-element/message-list-element.component";
import {MessageListElement} from "./message-list-element/message-list-element";
import {FormsModule} from "@angular/forms";
import {MemberService} from "../../service/member.service";
import {messagesNavigationItem} from "../header/navigation-item";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    MessageListElementComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent extends CookieComponent implements OnInit {
  faMessage = faMessage;
  messageListElements: MessageListElement[] = [];
  messageTyped: string = "";

  @ViewChild('messageAreaDiv') messageAreaDiv!: ElementRef;

  constructor(private el: ElementRef,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initializeUserByToken().then(() => {

    })

    this.el.nativeElement.style.width = `100%`;
  }

  onConversationClick() {


    this.scrollToBottom();
  }

  onMessageEnter() {
    if (this.messageTyped.length > 0) {
      // let messageList = new MessageList(this.messageTyped,
      //   this.selectedCustomerOrderElement?.customerOrder?.customerOrderId!,
      //   this.getUserSenderId(adminCategory),
      //   this.getUserSenderId(customerCategory),
      //   this.getUserSenderId(deliveryPersonCategory),
      //   this.getUserSenderId(deliveryServiceCategory),
      //   this.getUserSenderId(businessCategory))
      //
      // this.messageListService.addEntity(messageList).subscribe({
      //   next: (messageList) => {
      //     this.updateMessageLists(MessageList.fromJson(messageList));
      //
      //     this.messageTyped = "";
      //   },
      //   error: (error) => {
      //     console.log(error);
      //   }
      //
      // })
    }
  }

  private getUserSenderId() {
    // if (userCategory.name == this.getCurrentUserCategory().name) {
    //   return this.currentUserService.user?.getUserId()!;
    // } else if (userCategory.name == this.getCurrentUserCategory().name) {
    //   return this.currentUserService.user?.getUserId()!;
    // } else if (userCategory.name == this.getCurrentUserCategory().name) {
    //   return this.currentUserService.user?.getUserId()!;
    // } else if (userCategory.name == this.getCurrentUserCategory().name) {
    //   return this.currentUserService.user?.getUserId()!;
    // } else if (userCategory.name == this.getCurrentUserCategory().name) {
    //   return this.currentUserService.user?.getUserId()!;
    // } else {
    //   return 0;
    // }
  }

  private updateMessageLists() {
    // messageList.messageUserOwner = this.currentUserService.user;
    // this.selectedCustomerOrderElement?.customerOrder?.messageLists?.push(messageList);
    // this.messageListElements.push(new MessageListElement(messageList, this.currentUserService.user?.getUserId()!, this.getCurrentUserCategory()));

    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      let messageAreaDivEl = this.messageAreaDiv.nativeElement;
      messageAreaDivEl.scrollTop = Math.max(0, messageAreaDivEl.scrollHeight - messageAreaDivEl.offsetHeight);
    }, 5);
  }

  getConversations() {
    // let filteredCustomerOrderElements: CustomerOrderElement[] = [];
    //
    // filteredCustomerOrderElements = this.customerOrderElements.filter(customerOrderElement => {
    //   return (this.selectedStatusId == undefined || customerOrderElement.customerOrder?.status?.statusId == this.selectedStatusId) &&
    //     (this.selectedDeliveryPersonId == undefined || customerOrderElement.customerOrder?.deliveryPerson?.getUserId() == this.selectedDeliveryPersonId) &&
    //     (this.selectedDeliveryServiceId == undefined || customerOrderElement.customerOrder?.deliveryService?.getUserId() == this.selectedDeliveryServiceId) &&
    //     (this.selectedBusinessId == undefined || customerOrderElement.customerOrder?.business?.getUserId() == this.selectedBusinessId);
    // });
    //
    //
    // return filteredCustomerOrderElements;
  }

    protected readonly messagesNavigationItem = messagesNavigationItem;
}
