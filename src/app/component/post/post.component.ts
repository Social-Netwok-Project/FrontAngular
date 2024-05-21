import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {CookieComponent} from "../misc/cookie-component";
import {Post} from "../../model/post";
import {Member} from "../../model/member";
import {NgForOf, NgIf} from "@angular/common";
import {NgxResizeObserverModule} from "ngx-resize-observer";

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

  @Input() member!: Member;
  @Input() post!: Post;

  hasImages: boolean = false;
  hasVideos: boolean = false;

  justify: string = 'center';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.hasImages = this.post.postImageList.length > 0;
    this.hasVideos = this.post.postVideoList.length > 0;
  }

  onResize(entry: ResizeObserverEntry) {
    let height = entry.contentRect.height;
    let width = entry.contentRect.width;

    if((width / 2) < height) {
      this.justify = 'start';
    } else {
      this.justify = 'center';
    }
  }
}
