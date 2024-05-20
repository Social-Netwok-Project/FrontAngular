import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {PostVideo} from "../model/post-video";

@Injectable({
  providedIn: 'root'
})
export abstract class PostVideoService extends EntityService<PostVideo> {
  protected constructor(http: HttpClient) {
    super(http, "post-video");
  }
}
