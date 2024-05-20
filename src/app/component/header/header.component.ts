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
import {AddEditPostModalComponent} from "../add-edit-post-modal/add-edit-post-modal.component";
import {ModalOpenType} from "../misc/modal-open-type";
import {Post} from "../../model/post";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,
    FontAwesomeModule, NgStyle,
    FormsModule, AutoCompleteModule,
    NgxResizeObserverModule, NgIf, NgForOf, AddEditPostModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[header-body]': 'true'
  }
})
export class HeaderComponent extends CookieComponent implements OnInit {
  // Logic Fields
  showMenu: boolean = false;

  dropDownMenuTop: number = 0;
  // Font Awesome Icons
  faBars = faBars;
  faXmark = faXmark;
  faPlus = faPlus;

  navigationItems = navigationItems;
  profileMenuItems = profileMenuItems;

  // DOM Elements
  @ViewChild('headerBody') headerBody!: ElementRef;

  isAddEditTweetModalOpen: boolean = false;
  modalOpenType: ModalOpenType = ModalOpenType.NONE;
  editingPost!: Post;

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
    } else {
      this.currentMemberService.setUserToNull();
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
    this.isAddEditTweetModalOpen = true;
    this.modalOpenType = ModalOpenType.ADD;
    this.editingPost = new Post("", "", "", this.currentMemberService.user?.getUserId()!)
  }

  onAddEditTweetModalChange(newVal: boolean) {
    this.isAddEditTweetModalOpen = newVal;
  }
}
