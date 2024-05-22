import {Component, ElementRef, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {PostComponent} from "../post/post.component";
import {CookieComponent} from "../misc/cookie-component";
import {CookieService} from "ngx-cookie-service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {CurrentMemberService} from "../../service/current-member.service";
import {MemberService} from "../../service/member.service";
import {faCheck, faMessage, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Member} from "../../model/member";
import {ActivatedRoute, Router} from "@angular/router";
import {EdgeService} from "../../service/edge.service";
import {TwoIds} from "../../model/query/delete/two-ids";
import {HttpErrorResponse} from "@angular/common/http";
import {Edge} from "../../model/edge";
import {MemberBannerComponent} from "../member-banner/member-banner.component";

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    PostComponent,
    NgIf,
    MemberBannerComponent
  ],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent extends CookieComponent implements OnInit {

  faPlus = faPlus
  faMessage = faMessage;

  member!: Member | undefined;

  // isNotCurrentMember: boolean = false;
  // isFriend: boolean = false;
  // isFollowing: boolean = false;

  constructor(private el: ElementRef,
              protected override cookieService: CookieService,
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
    this.initMember();

    this.el.nativeElement.style.width = `100%`;
  }

  private initMember() {
    this.route.params.subscribe((params) => {
      let id = "";
      if (params != undefined) {
        id = params['id'];
      }
      if (id == undefined || id == "") {
        this.initializeMemberByToken().then((success) => {
          if (success) {
            this.member = this.currentMemberService.member!;
            this.initializeMembersPostsMedia([this.member]);
          }
          this.loggedInPage();
        });
      } else {
        this.memberService.findEntityById(parseInt(id)).subscribe({
          next: (jsonMember: Member) => {
            this.member = Member.fromJson(jsonMember);
            this.initializeMembersPfpImgUrl([this.member]).then((success) => {
              if (success) this.initializeMembersPostsMedia([this.member!]);
            });
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    })
  }
}
