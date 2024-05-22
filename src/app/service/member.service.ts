import {HttpClient} from "@angular/common/http";
import {EntityService} from "./entity.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TokenByEmail} from "../model/query/update/token-by-email";
import {TokenByOldToken} from "../model/query/update/token-by-old-token";
import {PasswordByEmail} from "../model/query/update/password-by-email";
import {ByToken} from "../model/query/select/by-token";
import {Member} from "../model/member";
import {PfpImgPathByEmail} from "../model/query/update/pfp-img-path-by-email";
import {FollowersInfo} from "../model/query/get/followers-info";
import {TwoIds} from "../model/query/delete/two-ids";

@Injectable({
  providedIn: 'root'
})
export abstract class MemberService extends EntityService<Member> {

  protected constructor(http: HttpClient) {
    super(http, "member");
  }

  public getFollowersInfo(memberId: number): Observable<FollowersInfo> {
    return this.http.get<FollowersInfo>(`${this.apiBackendUrl}/${this.entityName}/followers-info/${memberId}`);
  }

  public getFriendsOfAFriend(memberId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiBackendUrl}/${this.entityName}/foaf/${memberId}`);
  }

  public getFriends(memberId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiBackendUrl}/${this.entityName}/friends/${memberId}`);
  }

  public getBiDirectionalFriends(memberId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiBackendUrl}/${this.entityName}/bi-directional-friends/${memberId}`);
  }

  public findMemberByEmail(email: String): Observable<Member> {
    return this.http.get<Member>(`${this.apiBackendUrl}/${this.entityName}/select-member-by-email/${email}`);
  }

  public findMemberByToken(byToken: ByToken): Observable<Member> {
    return this.http.post<Member>(`${this.apiBackendUrl}/${this.entityName}/select-member-by-token`, byToken);
  }

  public updatePasswordByEmail(passwordByEmail: PasswordByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-password-by-email`, passwordByEmail);
  }

  public updateTokenByEmail(tokenByEmail: TokenByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-token-by-email`, tokenByEmail);
  }

  public updateTokenByOldToken(tokenByOldToken: TokenByOldToken): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-token-by-old-token`, tokenByOldToken);
  }

  public updatePfpImgNameByEmail(pfpImgPathByEmail: PfpImgPathByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-pfp-img-path-by-email`, pfpImgPathByEmail);
  }
}
