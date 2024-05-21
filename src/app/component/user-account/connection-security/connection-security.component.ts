import {Component, ElementRef, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ConnectionSecurityFieldComponent} from "./connection-security-field/connection-security-field.component";
import {FooterComponent} from "../../footer/footer.component";
import {CookieService} from "ngx-cookie-service";
import {CurrentMemberService} from "../../../service/current-member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../../model/member";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {ConnectionSecurityElementComponent} from "./connection-security-element/connection-security-element.component";
import {CookieComponent} from "../../misc/cookie-component";
import {MemberService} from "../../../service/member.service";

@Component({
  selector: 'app-connection-security',
  standalone: true,
  imports: [
    NgForOf,
    ConnectionSecurityFieldComponent,
    FooterComponent,
    NgIf,
    NgxResizeObserverModule,
    ConnectionSecurityElementComponent
  ],
  templateUrl: './connection-security.component.html',
  styleUrl: './connection-security.component.scss'
})
export class ConnectionSecurityComponent extends CookieComponent implements OnInit {

  user!: Member;

  constructor(private el: ElementRef,
              protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.initializeUserByToken().then(() => {
      this.loggedInPage();
    });

    this.user = this.currentMemberService.member!;
  }
}
