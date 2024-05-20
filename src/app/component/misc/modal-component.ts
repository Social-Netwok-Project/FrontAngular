import {EventEmitter} from "@angular/core";
import {FormComponent} from "./form-component";

export abstract class ModalComponent extends FormComponent {
  isModalOpen: boolean = false;
  onModalChangeEmitter = new EventEmitter<boolean>();

  protected constructor() {
    super();
  }

  closeModal() {
    this.isModalOpen = false;
    this.onModalChangeEmitter.emit(this.isModalOpen);
  }
}
