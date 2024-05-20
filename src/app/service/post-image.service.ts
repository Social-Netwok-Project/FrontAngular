import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {PostImage} from "../model/post-image";

@Injectable({
  providedIn: 'root'
})
export abstract class PostImageService extends EntityService<PostImage> {
  protected constructor(http: HttpClient) {
    super(http, "post-image");
  }
}
