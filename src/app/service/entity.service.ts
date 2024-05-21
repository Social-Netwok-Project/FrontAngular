import {Observable} from "rxjs";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {environment} from "../../environment/environment.prod";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T> {
  protected apiBackendUrl = environment.apiBackendUrl;
  protected readonly entityName: String;

  protected constructor(protected http: HttpClient, entityName: String) {
    this.entityName = entityName;
  }

  public getAllEntities(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiBackendUrl}/${this.entityName}/all`);
  }

  public addEntity(entity: T): Observable<T> {
    return this.http.post<T>(`${this.apiBackendUrl}/${this.entityName}/add`, entity);
  }

  public updateEntity(entity: T): Observable<T> {
    return this.http.put<T>(`${this.apiBackendUrl}/${this.entityName}/update`, entity);
  }

  public deleteEntityById(entityId: number): Observable<void> {
    return this.http.get<void>(`${this.apiBackendUrl}/${this.entityName}/delete/${entityId}`);
  }

  public findEntityById(entityId: number): Observable<T> {
    return this.http.get<T>(`${this.apiBackendUrl}/${this.entityName}/find-by-id/${entityId}`);
  }

  public uploadFiles(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiBackendUrl}/${this.entityName}/upload-files`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  public downloadFiles(fileName: string): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiBackendUrl}/${this.entityName}/download-file/${fileName}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
      // transferCache: {
      //   includeHeaders: ['Content-Type', 'File-Name', 'Content-Disposition']
      // }
    });
  }

  public deleteFile(fileName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBackendUrl}/${this.entityName}/delete-file/${fileName}`);
  }
}

