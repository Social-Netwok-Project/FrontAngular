import {Component, ElementRef, OnInit} from '@angular/core';
import {CookieComponent} from "../misc/cookie-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {PostComponent} from "../post/post.component";
import {CurrentMemberService} from "../../service/current-member.service";
import {MemberService} from "../../service/member.service";
import {CookieService} from "ngx-cookie-service";
import {NgForOf} from "@angular/common";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    FooterComponent,
    PostComponent,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends CookieComponent implements OnInit {

  constructor(private el: ElementRef,
              protected override cookieService: CookieService,
              protected override postImageService: PostImageService,
              protected override postVideoService: PostVideoService,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then((success) => {
      if(success) {
        this.initializerMemberFriends().then((success) => {
          if(success) {
            this.initializeMembersPostsMedia(this.currentMemberService.member?.friends!)
          }
        });
      }
    });

    this.el.nativeElement.style.width = `100%`;
  }
}
