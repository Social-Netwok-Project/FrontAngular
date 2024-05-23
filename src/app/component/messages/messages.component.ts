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
import {MemberElementComponent} from "./member-element/member-element.component";
import {MemberElement} from "./member-element/member-element";
import {Member} from "../../model/member";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message";
import {getCurrentDate, getCurrentTimeStamp} from "../misc/functions";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    MessageListElementComponent,
    FormsModule,
    NgIf,
    MemberElementComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent extends CookieComponent implements OnInit {
  messagesNavigationItem = messagesNavigationItem;

  messageListElements: MessageListElement[] = [];
  memberElements: MemberElement[] = [];
  selectedMemberElement: MemberElement | undefined;

  messageTyped: string = "";

  biDirectionalFriends: Member[] = [];

  @ViewChild('messageAreaDiv') messageAreaDiv!: ElementRef;

  constructor(private el: ElementRef,
              protected override messageService: MessageService,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      let id = params['id'];

      this.initializeMemberByToken().then(() => {
        this.loggedInPage();

        if(this.currentMemberService.isLoggedIn()) {
          this.memberService.getBiDirectionalFriends(this.currentMemberService.member?.getMemberId()!).subscribe({
            next: (jsonMembers: Member[]) => {
              this.biDirectionalFriends = Member.initializeMembers(jsonMembers);
              this.initializeMembersPfpImgUrl(this.biDirectionalFriends).then(() => {
                for (let member of this.biDirectionalFriends) {
                  this.memberElements.push(new MemberElement(member));
                }
                this.fetchMembersMessages(this.currentMemberService.member!, this.biDirectionalFriends).then(() => {
                  let memberElement = this.memberElements[0]

                  if(id != undefined && id.length > 0) {
                    let tempMemberElement = this.memberElements.find(memberElement => memberElement.member.getMemberId() == parseInt(id))
                    if(tempMemberElement != undefined) memberElement = tempMemberElement;
                  }
                  this.onMemberElementClick(memberElement);
                });
              });
            },
            error: (error: HttpErrorResponse) => console.log(error)
          });
        }
      })
    })



    this.el.nativeElement.style.width = `100%`;
  }

  onMemberElementClick(memberElement: MemberElement) {
    for (let memberElement of this.memberElements) {
      memberElement.setUnclicked();
    }

    memberElement.setClicked();
    this.selectedMemberElement = memberElement;

    this.messageListElements = [];
    if(memberElement.member?.messages != undefined) {
      for (let message of memberElement.member?.messages!) {
        this.messageListElements.push(new MessageListElement(message, this.currentMemberService.member!, memberElement.member));
      }
    }

    this.scrollToBottom();
  }

  onMessageEnter() {
    if (this.messageTyped.length > 0) {
      let message = new Message(this.messageTyped,
        this.currentMemberService.member!.getMemberId()!,
        this.selectedMemberElement?.member?.getMemberId()!,
        getCurrentTimeStamp());

      this.messageService.addEntity(message).subscribe({
        next: (jsonMessage: Message) => {
          this.updateMessageLists(Message.fromJson(jsonMessage));

          this.messageTyped = "";
        },
        error: (error) => {
          console.log(error);
        }

      })
    }
  }
  private updateMessageLists(message: Message) {
    this.selectedMemberElement?.member?.messages?.push(message);
    this.messageListElements.push(new MessageListElement(message, this.currentMemberService.member!, this.selectedMemberElement?.member!));

    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      let messageAreaDivEl = this.messageAreaDiv.nativeElement;
      messageAreaDivEl.scrollTop = Math.max(0, messageAreaDivEl.scrollHeight - messageAreaDivEl.offsetHeight);
    }, 5);
  }
}
