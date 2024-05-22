import {Component, ElementRef, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {researchNavigationItem} from "../header/navigation-item";
import {MemberBannerComponent} from "../member-banner/member-banner.component";
import {NgForOf} from "@angular/common";
import {CookieComponent} from "../misc/cookie-component";
import {Member} from "../../model/member";
import {CookieService} from "ngx-cookie-service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {CurrentMemberService} from "../../service/current-member.service";
import {EdgeService} from "../../service/edge.service";
import {MemberService} from "../../service/member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [
    FaIconComponent,
    MemberBannerComponent,
    NgForOf,
    FormsModule
  ],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss'
})
export class ResearchComponent extends CookieComponent implements OnInit {
  researchNavigationItem = researchNavigationItem;

  foaf: Member[] = [];
  searchString: string = '';

  constructor(protected override cookieService: CookieService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override currentMemberService: CurrentMemberService,
              protected override edgeService: EdgeService,
              protected override memberService: MemberService,
              protected override route: ActivatedRoute,
              protected override router: Router) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then(() => {
      this.loggedInPage();
      this.memberService.getFriendsOfAFriend(this.currentMemberService.member?.getMemberId()!).subscribe({
        next: (jsonMembers: Member[]) => {
          this.foaf = Member.initializeMembers(jsonMembers);
          this.initializeMembersPfpImgUrl(this.foaf).then();
        },
        error: (error: HttpErrorResponse) => console.log(error)
      });
    })
  }

  getFilteredFoaf() {
    return this.foaf.filter(member => member.username.toLowerCase().includes(this.searchString.toLowerCase()));
  }
}
