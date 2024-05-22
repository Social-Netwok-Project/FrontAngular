import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {LikedPost} from "../model/liked-post";
import {Observable} from "rxjs";
import {TwoIds} from "../model/query/delete/two-ids";

@Injectable({
  providedIn: 'root'
})
export abstract class LikedPostService extends EntityService<LikedPost> {
  protected constructor(http: HttpClient) {
    super(http, "liked-post");
  }

  public deleteByMemberIdAndPostId(twoIds: TwoIds): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/delete-by-member-id-and-post-id`, twoIds);
  }
}
