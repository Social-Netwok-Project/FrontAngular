import {Component, ElementRef, OnInit} from '@angular/core';
import {faCamera, faFloppyDisk, faPenToSquare, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {UploadPfpModalComponent} from "../upload-pfp-modal/upload-pfp-modal.component";
import {CurrentMemberService} from "../../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieComponent} from "../../misc/cookie-component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {Member} from "../../../model/member";
import {MemberService} from "../../../service/member.service";
import {PaginatorModule} from "primeng/paginator";
import {Tag} from "../../../model/tag";
import {TagPerMember} from "../../../model/tag-per-member";
import {HttpErrorResponse} from "@angular/common/http";
import {TagService} from "../../../service/tag.service";
import {TagPerMemberService} from "../../../service/tag-per-member.service";
import {Observable} from "rxjs";
import {TagPerPost} from "../../../model/tag-per-post";

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    UploadPfpModalComponent,
    FaIconComponent,
    NgIf,
    NgForOf,
    PaginatorModule,
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
  faFloppyDisk = faFloppyDisk;

  faXmark = faXmark;
  availableTags: Tag[] = [];
  selectedTagId!: string;

  constructor(private el: ElementRef,
              protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override cookieService: CookieService,
              protected override tagService: TagService,
              protected override tagPerMemberService: TagPerMemberService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.initializeMemberByToken().then(() => {
      this.loggedInPage();

      this.user = this.currentMemberService.member!;
      this.tagService.getAllEntities().subscribe({
        next: (jsonTags: Tag[]) => {
          this.availableTags = Tag.initializeTags(jsonTags);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      });
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(newVal: boolean) {
    this.isModalOpen = newVal;
  }

  onTagSelected() {
    let selectedTagId = parseInt(this.selectedTagId);
    if (!this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tagPerMember.tagId == selectedTagId) && this.selectedTagId != undefined) {
      let tagPerMember = new TagPerMember(selectedTagId, this.currentMemberService.member?.getMemberId()!);
      this.currentMemberService.member?.tagPerMemberList.push(tagPerMember);
    }
  }

  getSelectedTags() {
    return this.availableTags.filter(tag => {
      return this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tag.tagId == tagPerMember.tagId) != undefined;
    })
  }

  onDeleteTag(tag: Tag) {

    new Promise<boolean>((resolve, reject) => {
      if(tag.tagId != undefined) {
        let tagPerMember = this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tagPerMember.tagId == tag.tagId);
        this.tagPerMemberService.deleteEntityById(tagPerMember?.tagPerMemberId!).subscribe({
          next: () => {
            console.log("Deleted tag per member with id: " + (tagPerMember?.tagPerMemberId!));
            resolve(true)
          },
          error: (error: HttpErrorResponse) => {
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    }).then((success: boolean) => {
      if(success) {
        this.currentMemberService.member?.tagPerMemberList.splice(this.currentMemberService.member?.tagPerMemberList
          .findIndex((tagPerMember: TagPerMember) => tagPerMember.tagId == tag.tagId), 1);
      }
    });
  }

  saveOnClick() {
    this.currentMemberService.member?.tagPerMemberList.forEach((tagPerMember: TagPerMember) => {
      if(tagPerMember.tagPerMemberId == undefined) {

        this.tagPerMemberService.addEntity(tagPerMember).subscribe({
          next: (jsonTagPerMember: TagPerMember) => {
            tagPerMember.tagPerMemberId = jsonTagPerMember.tagPerMemberId;
            console.log("Added tag per post with id: " + tagPerMember.tagPerMemberId);
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          }
        });
      }
    });
  }
}
