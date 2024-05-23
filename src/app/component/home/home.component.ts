import {Component, ElementRef, OnInit} from '@angular/core';
import {CookieComponent} from "../misc/cookie-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {PostComponent} from "../post/post.component";
import {CurrentMemberService} from "../../service/current-member.service";
import {MemberService} from "../../service/member.service";
import {CookieService} from "ngx-cookie-service";
import {NgForOf, NgIf} from "@angular/common";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {Post} from "../../model/post";
import {PostService} from "../../service/post.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    FooterComponent,
    PostComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends CookieComponent implements OnInit {

  allPosts: Post[] = [];

  constructor(private el: ElementRef,
              protected override cookieService: CookieService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override postService: PostService,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then((success) => {
      if(this.currentMemberService.isLoggedIn()) {
        this.initializeCurrentMemberFriends().then((success) => {
          if(success) {
            this.initializeMembersPostsMedia(this.currentMemberService.member?.friends!).then();
          }
        });
      }
      if(!this.currentMemberService.isLoggedIn() || this.currentMemberService.member?.friends?.length == 0){
        this.postService.getAllEntities().subscribe({
          next: (jsonPosts: Post[]) => {
            this.allPosts = Post.initializePosts(jsonPosts);
            this.initializePostsMedia(this.allPosts).then();
          }
        });
      }
    });

    this.el.nativeElement.style.width = `100%`;
  }
}
