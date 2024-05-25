import {Component, Input, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faThumbsUp, faUser} from "@fortawesome/free-solid-svg-icons";
import {CookieComponent} from "../misc/cookie-component";
import {Post} from "../../model/post";
import {Member} from "../../model/member";
import {NgForOf, NgIf} from "@angular/common";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentMemberService} from "../../service/current-member.service";
import {PostService} from "../../service/post.service";
import {LikedPostService} from "../../service/liked-post.service";
import {HttpErrorResponse} from "@angular/common/http";
import {TwoIds} from "../../model/query/delete/two-ids";
import {LikedPost} from "../../model/liked-post";
import {MemberService} from "../../service/member.service";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgForOf,
    NgxResizeObserverModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent extends CookieComponent implements OnInit {

  faThumbsUp = faThumbsUp;

  @Input() postOwner!: Member | undefined;
  @Input() post!: Post;

  hasImages: boolean = false;
  hasVideos: boolean = false;

  justify: string = 'center';
  isPostLiked: boolean = false;

  constructor(protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override postService: PostService, protected override likedPostService: LikedPostService,
              protected override route: ActivatedRoute, protected override router: Router) {
    super();
  }

  ngOnInit(): void {
    this.hasImages = this.post.postImageList.length > 0;
    this.hasVideos = this.post.postVideoList.length > 0;

    this.initializePostLikesCount(this.post);
    this.postService.isPostLikedByMember(
      new TwoIds(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
    ).subscribe({
      next: (isLiked: boolean) => {
        this.isPostLiked = isLiked;
      },
      error: (error: HttpErrorResponse) => console.error(error)
    });

    if(this.postOwner == undefined) {
      this.memberService.findEntityById(this.post.memberId!).subscribe({
        next: (jsonMember: Member) => {
          this.postOwner = Member.fromJson(jsonMember);
          this.initializeMembersPfpImgUrl([this.postOwner]).then();
        }, error: (error: HttpErrorResponse) => console.error(error)
      });
    }
  }

  onResize(entry: ResizeObserverEntry) {
    let height = entry.contentRect.height;
    let width = entry.contentRect.width;

    if ((width / 2) < height) {
      this.justify = 'start';
    } else {
      this.justify = 'center';
    }
  }

  sendToMemberPage() {
    this.routeTo(`/my-posts/${this.post?.memberId}`);
  }

  onLikeClick() {
    if(this.isPostLiked) {
      this.likedPostService.deleteByMemberIdAndPostId(
        new TwoIds(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
      ).subscribe({
        next: (deleted: number) => {
          if(deleted == 1) {
            this.isPostLiked = false;
            this.post.setLikesCount(this.post.getLikesCount()! - 1);
            console.log("Post has been disliked");
          } else {
            console.error("Post could not be disliked");
          }
        }, error: (error: HttpErrorResponse) => console.error(error)
      });
    } else {
      let likedPost = new LikedPost(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
      this.likedPostService.addEntity(likedPost).subscribe({
        next: (added: LikedPost) => {
          if(added) {
            this.isPostLiked = true;
            this.post.setLikesCount(this.post.getLikesCount()! + 1);
            console.log("Post has been liked");
          } else {
            console.error("Post could not be liked");
          }
        }, error: (error: HttpErrorResponse) => console.error(error)
      });
    }
  }

  protected readonly faUser = faUser;
}
