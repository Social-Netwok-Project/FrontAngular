import {Component, Input, OnInit} from '@angular/core';
import {MemberElement} from "./member-element";
import {CookieComponent} from "../../misc/cookie-component";
import {MemberBannerComponent} from "../../member-banner/member-banner.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-member-element',
  standalone: true,
  imports: [
    MemberBannerComponent,
    NgIf
  ],
  templateUrl: './member-element.component.html',
  styleUrl: './member-element.component.scss'
})
export class MemberElementComponent extends CookieComponent implements OnInit {
  @Input() memberElement!: MemberElement | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {

  }
}
