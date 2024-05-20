import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {TagPerMember} from "../model/tag-per-member";

@Injectable({
  providedIn: 'root'
})
export abstract class TagPerMemberService extends EntityService<TagPerMember> {
  protected constructor(http: HttpClient) {
    super(http, "tag-per-member");
  }
}
