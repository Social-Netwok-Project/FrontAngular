import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {PostComponent} from "../post/post.component";
import {CookieComponent} from "../misc/cookie-component";
import {Post} from "../../model/post";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {PostService} from "../../service/post.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CurrentMemberService} from "../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {MemberService} from "../../service/member.service";
import {discoverNavigationItem, interestsNavigationItem} from "../header/navigation-item";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [
    FaIconComponent,
    FooterComponent,
    NgForOf,
    PostComponent,
    NgxResizeObserverModule,
    NgIf
  ],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.scss'
})
export class InterestsComponent extends CookieComponent implements OnInit {

  recommendPostsByTags: Post[] = [];
  allPosts: Post[] = [];

  constructor(protected override postService: PostService,
              protected override cookieService: CookieService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then((success) => {
      this.loggedInPage();
      if(success) {
        this.postService.getRecommendedPostsByTags(this.currentMemberService.member?.getMemberId()!).subscribe({
          next: (jsonPosts: Post[]) => {
            this.recommendPostsByTags = Post.initializePosts(jsonPosts);
            this.initializePostsMedia(this.recommendPostsByTags).then();

            if(this.recommendPostsByTags.length == 0) {
              this.postService.getAllEntities().subscribe({
                next: (jsonPosts: Post[]) => {
                  this.allPosts = Post.initializePosts(jsonPosts);
                  this.initializePostsMedia(this.allPosts).then();
                },
                error: (error: HttpErrorResponse) => console.error(error)
              });
            }
          },
          error: (error: HttpErrorResponse) => console.error(error)
        });
      }

    })
  }

  protected readonly discoverNavigationItem = discoverNavigationItem;
  protected readonly interestsNavigationItem = interestsNavigationItem;
}
