import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CookieComponent} from "../../misc/cookie-component";
import {ActivatedRoute, Router} from "@angular/router";
import {logout, ProfileMenuItem, profileMenuItems} from "./profile-menu-item";
import {NgIf} from "@angular/common";
import {CookieService} from "ngx-cookie-service";
import {CurrentMemberService} from "../../../service/current-member.service";
import {EditableElement, editableElements, passwordElement, usernameElement} from "../../misc/editable-element";
import {MemberService} from "../../../service/member.service";

@Component({
  selector: 'app-profile-menu-item',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './profile-menu-item.component.html',
  styleUrl: './profile-menu-item.component.scss'
})
export class ProfileMenuItemComponent extends CookieComponent implements OnInit {
  @Input() profileMenuItem!: ProfileMenuItem;
  @Output() clickedOnEmitter = new EventEmitter<ProfileMenuItem>();

  borderRadius: string = '0';
  hasBorderBottom: boolean = true;

  constructor(protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override router: Router,
              protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    if (profileMenuItems.indexOf(this.profileMenuItem) == 0) {
      this.borderRadius = '10px 10px 0 0';
    } else if (profileMenuItems.indexOf(this.profileMenuItem) == profileMenuItems.length - 1) {
      this.borderRadius = '0 0 10px 10px';
      this.hasBorderBottom = false;
    }
  }

  onClick() {
    if (this.profileMenuItem == logout) {
      this.logoutOnClick();
    } else {
      this.routeTo(this.profileMenuItem.link)
    }
  }

  // private getEditableElements(userCategory: UserCategory) {
  //   let editableElementsChosen: EditableElement[] = [];
  //   editableElements.forEach(element => {
  //     if (element.userCategories.includes(userCategory) &&
  //       element !== passwordElement) {
  //       editableElementsChosen.push(element);
  //     }
  //   });
  //
  //   return editableElementsChosen;
  // }
}
