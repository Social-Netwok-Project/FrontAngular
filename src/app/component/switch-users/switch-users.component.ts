import {Component, ElementRef, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MessageListElementComponent} from "../messages/message-list-element/message-list-element.component";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {CookieComponent} from "../misc/cookie-component";
import {faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {switchUsersNavigationItem} from "../header/navigation-item";
import {MemberBannerComponent} from "../member-banner/member-banner.component";
import {Member} from "../../model/member";
import {HttpErrorResponse} from "@angular/common/http";
import {MemberService} from "../../service/member.service";
import {CurrentMemberService} from "../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-switch-users',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MessageListElementComponent,
    NgForOf,
    PaginatorModule,
    MemberBannerComponent,
    NgIf
  ],
  templateUrl: './switch-users.component.html',
  styleUrl: './switch-users.component.scss'
})
export class SwitchUsersComponent extends CookieComponent implements OnInit {
  switchUsersNavigationItem = switchUsersNavigationItem;

  allMembers: Member[] = [];

  searchString: String = "";

  constructor(private el: ElementRef,
              protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override cookieService: CookieService) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then(() => {
      this.memberService.getAllEntities().subscribe({
        next: (jsonMembers: Member[]) => {
          this.allMembers = Member.initializeMembers(jsonMembers);
          this.initializeMembersPfpImgUrl(this.allMembers).then();
        },
        error: (error: HttpErrorResponse) => console.log(error)
      });
    })


    this.el.nativeElement.style.width = `100%`;
  }

  getFilteredMembers() {
    return this.allMembers.filter(member => member.username.toLowerCase().includes(this.searchString.toLowerCase()));
  }
}
