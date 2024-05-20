import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {faCheck, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModalComponent} from "../misc/modal-component";
import {ModalOpenType} from "../misc/modal-open-type";
import {CurrentMemberService} from "../../service/current-member.service";
import {generateRandomString} from "../misc/functions";

@Component({
  selector: 'app-add-edit-product-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-edit-post-modal.component.html',
  styleUrl: './add-edit-post-modal.component.scss'
})
export class AddEditPostModalComponent extends ModalComponent {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>()

  faXmark = faXmark;
  faCheck = faCheck;

  files: File[] = [];
  statusMsg: string = "";

  productImagesIdsToDelete: number[] = [];

  isSuccess: boolean = false;

  faTrash = faTrash;

  @ViewChild('imageInput') imageInput!: ElementRef;

  @Input() modalOpenType: ModalOpenType = ModalOpenType.NONE;

  constructor(protected override currentMemberService: CurrentMemberService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  override isFormValid(): boolean {
    let checkedFileTypes: boolean = true;

    for (let i = 0; i < this.files.length; i++) {
      checkedFileTypes = this.files[i].type == 'image/png' || this.files[i].type == 'image/jpeg';
      if (!checkedFileTypes) break;
    }

    return true
    // this.editingProduct.name.length > 0 &&
    //   this.editingProduct.price > 0 &&
      checkedFileTypes
  }

  onImageSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
      let newFileName = `${generateRandomString(10)}-${i}-${this.files[i].name}`

      // let productImage = new ProductImage(
      //   event.target.files[i].name, newFileName,
      //   this.editingProduct.productId!, event.target.files[i].name
      // );
      // productImage.imageUrl = URL.createObjectURL(event.target.files[i]);

      // this.editingProduct.productImages.push(productImage);
    }
  }

  onAcceptClick() {
    if (!this.isFormValid()) {
      this.statusMsg = "Invalid form data!";
      return;
    }

    // if (this.modalOpenType == ModalOpenType.ADD) {
    //   let productImagesToAdd = this.editingProduct.productImages
    //   this.editingProduct.productImages = [];
    //
    //   this.productService.addEntity(this.editingProduct).subscribe({
    //     next: (jsonProduct: Product) => {
    //       let product = Product.fromJson(jsonProduct);
    //       this.editingProduct.productId = product.productId;
    //
    //       new Observable<number>((observer) => {
    //         let count = 1;
    //         if(productImagesToAdd.length == 0) observer.next(0);
    //
    //         productImagesToAdd.forEach((productImage: ProductImage) => {
    //           productImage.productId = product.productId!;
    //           this.productImageService.addEntity(productImage).subscribe({
    //             next: (jsonProductImage: ProductImage) => {
    //               let productImage = ProductImage.fromJson(jsonProductImage);
    //               console.log("Added product image with id: " + productImage.productImageId);
    //               product.productImages.push(productImage);
    //               observer.next(count++);
    //             },
    //             error: (error: HttpErrorResponse) => {
    //               observer.error(error);
    //               console.error(error);
    //             }
    //           });
    //         });
    //       }).subscribe({
    //         next: (count: number) => {
    //           if (count === productImagesToAdd.length) {
    //             console.log("done adding product images")
    //             this.editingProduct.productImages = productImagesToAdd;
    //             this.uploadProductImages(product);
    //           }
    //         },
    //         error: (error: HttpErrorResponse) => {
    //           console.error(error);
    //         }
    //
    //       });
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       console.error(error);
    //     }
    //   });
    // }
    // else if (this.modalOpenType == ModalOpenType.EDIT) {
    //   console.log(this.editingProduct)
    //
    //   this.productService.updateEntity(this.editingProduct).subscribe({
    //     next: (product: Product) => {
    //       this.uploadProductImages(Product.fromJson(product));
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       console.error(error);
    //     }
    //   });
    //
    //   this.productImagesIdsToDelete.forEach((productImageId: number) => {
    //     this.productImageService.deleteEntity(productImageId).subscribe({
    //       next: () => {
    //         console.log("Deleted product image with id: " + productImageId);
    //         let productImageToRemove = this.editingProduct.productImages
    //           .find((productImage: ProductImage) => productImage.productImageId === productImageId);
    //
    //         this.editingProduct.productImages.splice(this.editingProduct.productImages.indexOf(productImageToRemove!), 1)
    //
    //         this.productImageService.deleteFile(productImageToRemove!.path).subscribe({
    //           next: () => {
    //             console.log("Deleted product image file with path: " + productImageToRemove!.path);
    //           },
    //           error: (error: HttpErrorResponse) => {
    //             console.error(error);
    //           }
    //         });
    //       },
    //       error: (error: HttpErrorResponse) => {
    //         console.error(error);
    //       }
    //     });
    //   });
    // }
  }
  // uploadProductImages(product: Product) {
  //   let formData = new FormData();
  //
  //   for (let i = 0; i < this.files.length; i++) {
  //     let currentProductImage = this.editingProduct.productImages
  //       .find((productImage: ProductImage) => productImage.name === this.files[i].name)!;
  //
  //     let newProductImage = product.productImages
  //       .find((productImage: ProductImage) => productImage.path === currentProductImage.path)!;
  //
  //     currentProductImage.productImageId = newProductImage.productImageId;
  //
  //     formData.append('files', this.files[i], currentProductImage.path);
  //   }
  //
  //   if (this.files.length > 0) {
  //     this.uploadFiles(this.productImageService, formData).subscribe({
  //       next: (uploadStatus: UploadStatus) => {
  //         this.statusMsg = uploadStatus.statusMsg;
  //         if (uploadStatus.isSuccessful) {
  //           this.isSuccess = true;
  //           this.resetValues();
  //         }
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         console.error(error);
  //       }
  //     });
  //   } else {
  //     this.isSuccess = true;
  //   }
  //
  //   if (this.modalOpenType == ModalOpenType.ADD) {
  //     this.currentUserService.user?.products!.push(this.editingProduct);
  //     this.resetValues();
  //   }

  // }
  // private resetValues() {
  //   if (this.modalOpenType == ModalOpenType.ADD) {
  //     this.editingProduct = new Product("", false, 0, this.currentUserService.user?.getUserId()!, "");
  //   }
  //
  //   for (let i = this.editingProduct.productImages.length - 1; i >= 0; i--) {
  //     if (this.editingProduct.productImages[i].productImageId == undefined) {
  //       this.editingProduct.productImages.splice(i, 1);
  //     } else if (this.editingProduct.productImages[i].mightDelete) {
  //       this.editingProduct.productImages[i].mightDelete = false;
  //     }
  //   }
  //
  //   this.files = [];
  //   this.productImagesIdsToDelete = [];

  // }

  // onDeleteImage(productImage: ProductImage) {
  //   let isInDeletingList: boolean = productImage.productImageId != undefined &&
  //     this.productImagesIdsToDelete.includes(productImage.productImageId);
  //
  //   // IF NOT IN PRODUCT IMAGES TO DELETE AND NOT ORIGINAL PRODUCT IMAGE
  //   if (!isInDeletingList && productImage.productImageId == undefined) {
  //     console.log("removed from potential list")
  //     // REMOVE FROM PRODUCT IMAGES
  //     this.editingProduct?.productImages.splice(this.editingProduct?.productImages
  //       .findIndex((productImage1: ProductImage) => productImage1.imageUrl == productImage.imageUrl), 1);
  //
  //     // REMOVE FROM FILES
  //     let indexFiles = this.files.findIndex((file: File) => URL.createObjectURL(file) == productImage.imageUrl);
  //     this.files.splice(indexFiles, 1);
  //   }
  //   // IF NOT IN DELETING BUT ORIGINAL PRODUCT IMAGE
  //   else if (!isInDeletingList && productImage.productImageId != undefined) {
  //     // ADD TO PRODUCT IMAGES TO DELETE
  //     productImage.mightDelete = true;
  //     this.productImagesIdsToDelete.push(productImage.productImageId);
  //   }
  //   // IF ALREADY IN DELETING AND ORIGINAL PRODUCT IMAGE
  //   else if (isInDeletingList && productImage.productImageId != undefined) {
  //     // REMOVE FROM PRODUCT IMAGES TO DELETE
  //     productImage.mightDelete = false;
  //     this.productImagesIdsToDelete.splice(this.productImagesIdsToDelete
  //       .findIndex((productImageId: number) => productImageId === productImage.productImageId), 1);
  //   }
  // }

  override closeModal() {
    this.statusMsg = "";
    this.isSuccess = false;
    // this.resetValues();
    super.closeModal();
  }
}
