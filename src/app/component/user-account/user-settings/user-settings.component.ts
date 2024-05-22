import {Component, ElementRef, OnInit} from '@angular/core';
import {faCamera, faPenToSquare, faUser} from "@fortawesome/free-solid-svg-icons";
import {UploadPfpModalComponent} from "../upload-pfp-modal/upload-pfp-modal.component";
import {CurrentMemberService} from "../../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieComponent} from "../../misc/cookie-component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {Member} from "../../../model/member";
import {MemberService} from "../../../service/member.service";

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    UploadPfpModalComponent,
    FaIconComponent,
    NgIf,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent extends CookieComponent implements OnInit {

  hasAddresses: boolean = false;
  isModalOpen: boolean = false;

  user!: Member;

  faUser = faUser;
  faCamera = faCamera;
  faPenToSquare = faPenToSquare;

  constructor(private el: ElementRef,
              protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.initializeMemberByToken().then(() => {
      this.loggedInPage();

      this.user = this.currentMemberService.member!;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(newVal: boolean) {
    this.isModalOpen = newVal;
  }
}
