import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../model/tag";

@Injectable({
  providedIn: 'root'
})
export abstract class TagService extends EntityService<Tag> {
  protected constructor(http: HttpClient) {
    super(http, "tag");
  }
}
