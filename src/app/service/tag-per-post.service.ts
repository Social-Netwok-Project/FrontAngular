import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {Post} from "../model/post";
import {HttpClient} from "@angular/common/http";
import {TagPerPost} from "../model/tag-per-post";

@Injectable({
  providedIn: 'root'
})
export abstract class TagPerPostService extends EntityService<TagPerPost> {
  protected constructor(http: HttpClient) {
    super(http, "tag-per-post");
  }
}
