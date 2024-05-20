import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {Post} from "../model/post";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export abstract class PostService extends EntityService<Post> {
  protected constructor(http: HttpClient) {
    super(http, "post");
  }
}
