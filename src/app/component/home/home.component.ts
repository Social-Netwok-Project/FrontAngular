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
import {ActivatedRoute, Router} from "@angular/router";

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
  hasFriends: boolean = false;
  friendsHaveNoPosts: boolean = true;

  constructor(private el: ElementRef,
              protected override cookieService: CookieService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override postService: PostService,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then((success) => {
      if(this.currentMemberService.isLoggedIn()) {
        this.initializeCurrentMemberFriends().then((success) => {
          if(success) {
            this.initializeMembersPostsMedia(this.currentMemberService.member?.friends!).then();
            this.hasFriends = this.currentMemberService.member?.friends?.length! > 0;
            if(this.hasFriends) {
              this.currentMemberService.member?.friends?.forEach(friend => {
                if(friend.posts?.length > 0) {
                  this.friendsHaveNoPosts = false;
                }
              })
            }
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
