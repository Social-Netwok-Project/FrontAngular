import {Component, OnInit} from '@angular/core';
import {discoverNavigationItem, myPostsNavigationItem} from "../header/navigation-item";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {PostComponent} from "../post/post.component";
import {Post} from "../../model/post";
import {PostService} from "../../service/post.service";
import {CookieService} from "ngx-cookie-service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {MemberService} from "../../service/member.service";
import {CurrentMemberService} from "../../service/current-member.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieComponent} from "../misc/cookie-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {ActivatedRoute, Router} from "@angular/router";
import {PostBody} from "../../model/misc/post-body";

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    FaIconComponent,
    FooterComponent,
    NgForOf,
    PostComponent,
    NgxResizeObserverModule,
    NgIf
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent extends CookieComponent implements OnInit {

  discoverNavigationItem = discoverNavigationItem;

  recommendPostsByLikes: Post[] = [];
  allPosts: Post[] = [];

  excludedIds: number[] = [];

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
        this.fetchPosts();
      }
    });
  }

  fetchPosts() {
    this.postService.getRecommendedPostsByLikes(new PostBody(this.currentMemberService.member?.getMemberId()!, this.excludedIds)).subscribe({
      next: (jsonPosts: Post[]) => {
        let newPosts = Post.initializePosts(jsonPosts);
        console.log(newPosts)
        this.initializePostsMedia(newPosts).then(() => {
          newPosts.forEach(post => {
            this.recommendPostsByLikes.push(post)
            this.excludedIds.push(post.postId!)
          });
        });

        if(this.recommendPostsByLikes.length == 0) {
          this.postService.getAllEntities().subscribe({
            next: (jsonPosts: Post[]) => {
              let newPosts = Post.initializePosts(jsonPosts);
              this.initializePostsMedia(newPosts).then(() => {
                newPosts.forEach(post => {
                  this.allPosts.push(post)
                  this.excludedIds.push(post.postId!)
                });
              });
            },
            error: (error: HttpErrorResponse) => console.error(error)
          });
        }
      },
      error: (error: HttpErrorResponse) => console.error(error)
    });
  }
}
