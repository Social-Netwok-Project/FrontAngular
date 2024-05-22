import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {Edge} from "../model/edge";
import {TwoIds} from "../model/query/delete/two-ids";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class EdgeService extends EntityService<Edge> {
  protected constructor(http: HttpClient) {
    super(http, "edge");
  }

  public deleteByMemberIdAndFriendId(twoIds: TwoIds): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/delete-by-member-id-and-friend-id`, twoIds);
  }
}
