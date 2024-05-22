import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {faCheck, faMessage, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {Member} from "../../model/member";
import {TwoIds} from "../../model/query/delete/two-ids";
import {HttpErrorResponse} from "@angular/common/http";
import {Edge} from "../../model/edge";
import {CookieService} from "ngx-cookie-service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {CurrentMemberService} from "../../service/current-member.service";
import {EdgeService} from "../../service/edge.service";
import {MemberService} from "../../service/member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieComponent} from "../misc/cookie-component";

@Component({
  selector: 'app-member-banner',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './member-banner.component.html',
  styleUrl: './member-banner.component.scss'
})
export class MemberBannerComponent extends CookieComponent implements OnInit {

  @Input() member!: Member | undefined;
  @Input() actions: boolean = true;

  isNotCurrentMember: boolean = false;
  isFriend: boolean = false;
  isFollowing: boolean = false;

  protected readonly faMessage = faMessage;
  protected readonly faPlus = faPlus;
  protected readonly faCheck = faCheck;

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
    if(this.member != undefined) this.initFriends();
  }

  followOnClick() {
    new Promise<boolean>((resolve, reject) => {
      if (this.isFollowing) {
        let twoIds: TwoIds = new TwoIds(this.currentMemberService.member!.getMemberId(), this.member!.getMemberId())
        this.edgeService.deleteByMemberIdAndFriendId(twoIds).subscribe({
          next: (success: number) => {
            if (success == 1) {
              this.isFollowing = false;
              this.isFriend = false;
              this.member?.setFollowersCount(this.member?.getFollowersCount() - 1);

              console.log(`No Longer Following ${this.member?.username}`)
              resolve(true);
            } else {

              console.log(`Failed to Unfollow ${this.member?.username}`)
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false);
            console.log(error)
          }
        })
      } else {
        let edge: Edge = new Edge(this.currentMemberService.member!.getMemberId(), this.member!.getMemberId())
        this.edgeService.addEntity(edge).subscribe({
          next: (jsonEdge: Edge) => {
            let edge: Edge = Edge.fromJson(jsonEdge);
            if (edge != undefined) {

              this.member?.setFollowersCount(this.member?.getFollowersCount() + 1);
              console.log(`Now Following ${this.member?.username}`)
              resolve(true);
            } else {

              console.log(`Failed to Follow ${this.member?.username}`)
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false);
            console.log(error);
          }
        })
      }
    }).then((success) => {
      if (success) {
        this.initFriends();
      }
    });
  }

  private initFriends() {
    this.initializerMemberFriends().then((success) => {
      if (success) {
        this.isNotCurrentMember = this.member?.getMemberId() != this.currentMemberService.member?.getMemberId();
        let followingMember = this.currentMemberService.member?.friends.find((friend) => friend.getMemberId() == this.member?.getMemberId());
        this.isFollowing = followingMember != undefined;
        if (followingMember != undefined) {
          this.isFriend = followingMember.friends.find((friend) => friend.getMemberId() == this.member?.getMemberId()) != undefined;
        }
      }
    });

    this.initializeMemberFollowersInfo(this.member!).then();
  }

  onProfileClick() {
    if(this.actions) this.routeTo(`/my-posts/${this.member?.getMemberId()}`)
  }
}
