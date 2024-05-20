import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {LikedPost} from "../model/liked-post";

@Injectable({
  providedIn: 'root'
})
export abstract class LikedPostService extends EntityService<LikedPost> {
  protected constructor(http: HttpClient) {
    super(http, "liked-post");
  }
}
