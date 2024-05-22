import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {Message} from "../model/message";
import {TwoIds} from "../model/query/delete/two-ids";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class MessageService extends EntityService<Message> {
  protected constructor(http: HttpClient) {
    super(http, "message");
  }

  public getMessagesByMemberIdAndFriendId(twoIds: TwoIds): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.apiBackendUrl}/${this.entityName}/get-messages-by-member-id-and-friend-id`, twoIds);
  }
}
