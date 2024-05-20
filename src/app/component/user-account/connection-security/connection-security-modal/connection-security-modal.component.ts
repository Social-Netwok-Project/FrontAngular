import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {ConnectionSecurityElementComponent} from "../connection-security-element/connection-security-element.component";
import {ModalComponent} from "../../../misc/modal-component";
import {User} from "../../../../model/user/user";
import {MemberService} from "../../../../service/member.service";
import {UserCategory} from "../../../../service/user/userCategories";
import {EditingUserType} from "../../../misc/editing-user-type";
import {Subject} from "rxjs";

@Component({
  selector: 'app-connection-security-modal',
  standalone: true,
  imports: [
    NgIf,
    ConnectionSecurityElementComponent
  ],
  templateUrl: './connection-security-modal.component.html',
  styleUrl: './connection-security-modal.component.css'
})
export class ConnectionSecurityModalComponent extends ModalComponent {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>()

  @Input() editingUserSubject!: Subject<User>;
  @Input() editingUser!: User;
  @Input() editingUserService!: MemberService<any>;
  @Input() editingUserCategory!: UserCategory;
  @Input() editingUserType: EditingUserType = EditingUserType.USER;

  override isFormValid(): boolean {
    throw new Error('Method not implemented.');
  }

  constructor() {
    super();
  }

  onCloseModal(isModalOpen: boolean) {
    this.isModalOpen = isModalOpen;
    this.onModalChangeEmitter.emit(isModalOpen);
  }
}
