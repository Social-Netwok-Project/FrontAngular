import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {CookieComponent} from "../misc/cookie-component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faBars, faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import {CurrentMemberService} from "../../service/current-member.service";
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule} from 'primeng/autocomplete';
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {logout, ProfileMenuItem, profileMenuItems} from "../user-account/profile-menu-item/profile-menu-item";
import {MemberService} from "../../service/member.service";
import {navigationItems} from "./navigation-item";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,
    FontAwesomeModule, NgStyle,
    FormsModule, AutoCompleteModule,
    NgxResizeObserverModule, NgIf, NgForOf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[header-body]': 'true'
  }
})
export class HeaderComponent extends CookieComponent implements OnInit {
  profileMenuItems = profileMenuItems;


  // Logic Fields
  showMenu: boolean = false;

  dropDownMenuTop: number = 0;
  // Font Awesome Icons
  faBars = faBars;

  faXmark = faXmark;
  navigationItems = navigationItems;

  // DOM Elements

  @ViewChild('headerBody') headerBody!: ElementRef;

  constructor(protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initializeUserByToken().then();
  }

  routeToAndCloseBurgerMenu(profileMenuItem: ProfileMenuItem) {
    if (profileMenuItem != logout) {
      this.routeTo(profileMenuItem.link)
      this.currentMemberService.setUserToNull();
    } else {
      this.loginOnClick();
    }

    this.showMenu = false;
  }

  loginOnClick() {
    this.routeTo("login");
  }

  burgerMenuOnClick() {
    this.showMenu = !this.showMenu;
  }

  xMarkOnClick() {
    this.showMenu = false;
  }

  handleResize(entry: ResizeObserverEntry) {
    this.dropDownMenuTop = entry.contentRect.height + 10;
  }

  registerOnClick() {
    this.routeTo("register");
  }

  tweetOnClick() {

  }

  protected readonly faPlus = faPlus;
}
