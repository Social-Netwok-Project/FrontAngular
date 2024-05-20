import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {environment} from "../../../environment/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  protected apiBackendUrl = environment.apiBackendUrl;
  constructor(private http: HttpClient) {

  }

  uploadFiles(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiBackendUrl}/file/upload-files`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadFiles(fileName: string): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiBackendUrl}/file/download-file/${fileName}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }

  deleteFile(fileName: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiBackendUrl}/file/delete-file/${fileName}`);
  }
}
