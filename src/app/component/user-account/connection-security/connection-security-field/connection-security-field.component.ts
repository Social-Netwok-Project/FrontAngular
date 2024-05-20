import {Component, Input, OnInit} from '@angular/core';
import {EditableElement} from "../../../misc/editable-element";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {EditableElementType} from "../../../misc/editable-element-type";
import {AuthenticationComponent} from "../../../authentication/authentication-component";
import bcrypt from "bcryptjs";
import {CurrentMemberService} from "../../../../service/current-member.service";
import {EditingUserType} from "../../../misc/editing-user-type";

@Component({
  selector: 'app-cs-elem',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './connection-security-field.component.html',
  styleUrl: './connection-security-field.component.scss'
})
export class ConnectionSecurityFieldComponent extends AuthenticationComponent implements OnInit {
  @Input() editableElement!: EditableElement;
  @Input() editingUserType!: EditingUserType;

  newValue: string = "";
  passwordConfirmation: string = "";
  oldPassword: string = "";

  isEditingField = false;
  isEditingPassword = false;

  isOldPasswordValid = false;
  isOldPasswordChecked = false;
  isEditable: boolean = true;

  constructor(protected override currentMemberService: CurrentMemberService) {
    super();
  }

  ngOnInit(): void {
    this.isEditable = this.editableElement.isEditable || this.isEditingUserTypeAdmin();
  }

  isEditingUserTypeAdmin() {
    return this.editingUserType === EditingUserType.ADMIN
  }

  setEditing(isEditing: boolean) {
    this.isEditingField = isEditing;
  }

  onConfirm() {
    if (this.isPasswordElement() && !this.isEditingUserTypeAdmin()) {
      this.isEditingPassword = true;
      if (this.isPasswordProper(this.newValue)) {
        if (!(this.newValue === this.passwordConfirmation)) {
          console.log("Passwords do not match.")
          return;
        }

        // COMPARE OLD PASSWORD WITH STORED HASH
        bcrypt.compare(this.oldPassword, this.currentMemberService.user?.password!, (err, success) => {
          if (success) {
            // HASH NEW PASSWORD
            bcrypt.hash(this.newValue, this.hashSalt, (err, hash) => {
              console.log("Password changed.")
              this.editableElement.value = hash;
            });
          } else {
            this.isOldPasswordValid = false;
            this.isOldPasswordChecked = true;
            console.log("Old password is incorrect.")
            return;
          }
        });
      } else {
        console.log("Password is not proper.")
        return;
      }
    } else if(this.isPasswordElement() && this.isEditingUserTypeAdmin()) {
      this.isEditingPassword = true;
      if (this.isPasswordProper(this.newValue)) {
        // HASH NEW PASSWORD
        bcrypt.hash(this.newValue, this.hashSalt, (err, hash) => {
          console.log("Password changed.")
          this.editableElement.value = hash;
        });
      } else {
        console.log("Password is not proper.")
        return;
      }

    } else {
      if (this.isFieldProper(this.newValue)) {
        this.editableElement.value = this.newValue;
      } else {
        return;
      }
    }

    this.setEditing(false);
  }

  onEdit() {
    this.setEditing(true);

    if (!this.isPasswordElement()) {
      this.newValue = this.editableElement.value;
    } else {
      this.newValue = "";
    }
  }

  onCancel() {
    this.newValue = this.editableElement.value;
    this.setEditing(false);
  }

  getValue() {
    if (!this.isPasswordElement()) {
      return this.editableElement.value;
    } else {
      return "************";
    }
  }

  resetValues() {
    this.newValue = "";
    this.passwordConfirmation = "";
    this.oldPassword = "";

    this.isEditingField = false;
    this.isEditingPassword = false;

    this.isOldPasswordValid = false;
    this.isOldPasswordChecked = false;
  }


  isPasswordElement() {
    return this.editableElement.editableElementType === EditableElementType.PASSWORD;
  }

  isEditingPasswordElement() {
    return this.isPasswordElement() && this.isEditingField && !this.isEditingUserTypeAdmin();
  }

  isFormValid(): boolean {
    return false;
  }

  isFieldInvalid() {
    return this.isEditingField && !this.isFieldProper(this.newValue) && !this.isPasswordElement();
  }

  isPasswordInvalid(): boolean {
    return this.isEditingPassword && !this.isPasswordProper(this.newValue) && this.isPasswordElement();
  }

  isPasswordsNotMatch(): boolean {
    return this.isEditingPassword && this.newValue !== this.passwordConfirmation;
  }

  isOldPasswordInvalid() {
    return this.isEditingPassword && !this.isOldPasswordValid && this.isOldPasswordChecked;
  }
}
