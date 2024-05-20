import {Component, ElementRef, OnInit} from '@angular/core';
import {CookieComponent} from "../misc/cookie-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {PostComponent} from "../post/post.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    FooterComponent,
    PostComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends CookieComponent implements OnInit {

  constructor(private el: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }
}
