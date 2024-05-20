import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  birthdateElement,
  editableElements,
  emailElement,
  passwordElement,
  usernameElement
} from "../../../misc/editable-element";
import {ConnectionSecurityFieldComponent} from "../connection-security-field/connection-security-field.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormComponent} from "../../../misc/form-component";
import {Member} from "../../../../model/member";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MemberService} from "../../../../service/member.service";
import {EditingUserType} from "../../../misc/editing-user-type";
import {Subject} from "rxjs";

@Component({
  selector: 'app-connection-security-element',
  standalone: true,
  imports: [
    ConnectionSecurityFieldComponent,
    NgForOf,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './connection-security-element.component.html',
  styleUrl: './connection-security-element.component.scss'
})
export class ConnectionSecurityElementComponent extends FormComponent implements OnInit {
  faXmark = faXmark;

  editableElements = editableElements;
  changesSuccess: boolean = false;

  @Input() user!: Member;

  @Input() userSubject!: Subject<Member>;

  @Input() editingUserType: EditingUserType = EditingUserType.USER;
  @Input() isModal: boolean = false
  @Output() onCloseModal = new EventEmitter<boolean>();

  constructor(protected override memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    this.setEditableElementValues();

    if (this.userSubject !== undefined) this.userSubject.subscribe({
      next: (user: Member) => {
        this.user = user;
      }
    });
  }

  override isFormValid(): boolean {
    throw new Error('Method not implemented.');
  }

  setEditableElementValues() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          editableElement.value = this.user?.username!;
          break;
        case emailElement.name:
          editableElement.value = this.user?.email!;
          break;
        case birthdateElement.name:
          editableElement.value = this.user?.birthdate!;
          break;
        case passwordElement.name:
          editableElement.value = this.user?.password!;
          break;
      }
    });
  }

  private setUserFields() {
    this.editableElements.forEach((editableElement) => {
      switch (editableElement.name) {
        case usernameElement.name:
          this.user.setUsername(editableElement.value);
          break;
        case emailElement.name:
          this.user.setEmail(editableElement.value);
          break;
        case birthdateElement.name:
          this.user.setBirthDate(editableElement.value);
          break;
        case passwordElement.name:
          this.user.setPassword(editableElement.value);
          break;
      }
    });
  }

  onApplyChanges() {
    this.setUserFields();
    let member: Member = Member.fromJson(this.user)
    console.log(member)
    member.clearLists();

    this.memberService.updateEntity(member).subscribe({
      next: (jsonUser: Member) => {
        console.log("Updated member.")
        this.changesSuccess = true;
      },
      error: (error) => {
        this.changesSuccess = false;
        console.log("HTTP ERROR: Failed to update member.");
      },
      complete: () => {
        super.onSubmit();
      }
    });
  }

  onCancel() {
    this.setEditableElementValues();
    this.isSubmitted = false;
  }

  isNotSuccess() {
    return !this.changesSuccess && this.isSubmitted;
  }

  isSuccess() {
    return this.changesSuccess && this.isSubmitted;
  }

  closeModal() {
    this.onCloseModal.emit(false);
  }
}
