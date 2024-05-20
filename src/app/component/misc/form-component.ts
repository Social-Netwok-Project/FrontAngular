import {CookieComponent} from "./cookie-component";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {Observable} from "rxjs";
import {EntityService} from "../../service/entity.service";

export abstract class FormComponent extends CookieComponent {
  protected isSubmitted: boolean = false;

  onSubmit() {
    this.isSubmitted = true;
  };

  abstract isFormValid(): boolean;

  protected uploadFiles(entityService: EntityService<any>, formData: FormData): Observable<UploadStatus> {
    return new Observable<UploadStatus>(subscriber => {
      entityService.uploadFiles(formData).subscribe({
        next: (httpEvent: HttpEvent<string[]>) => {
          switch (httpEvent.type) {
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received');
              break;
            case HttpEventType.Response:
              subscriber.next(new UploadStatus('Your file(s) have been uploaded successfully!', true));
              break;
            case HttpEventType.Sent:
              console.log('Request has been made!');
              subscriber.next(new UploadStatus('Uploading...', false));
              break;
            default:
              // console.log('Event: ', httpEvent);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log("Error uploading file: ", error);
          subscriber.next(new UploadStatus('An error occurred while uploading your profile picture.', false));
        }
      });
    });
  }
}

export class UploadStatus {
  statusMsg: string = '';
  isSuccessful: boolean = false;

  constructor(statusMessage: string, isSuccessful: boolean) {
    this.statusMsg = statusMessage;
    this.isSuccessful = isSuccessful;
  }
}


