import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {Post} from "../model/post";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TwoIds} from "../model/query/delete/two-ids";

@Injectable({
  providedIn: 'root'
})
export abstract class PostService extends EntityService<Post> {
  protected constructor(http: HttpClient) {
    super(http, "post");
  }

  public getLikesCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBackendUrl}/${this.entityName}/likes-count/${postId}`);
  }

  public isPostLikedByMember(twoIds: TwoIds): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiBackendUrl}/${this.entityName}/is-post-liked-by-member`, twoIds);
  }

  public getRecommendedPostsByLikes(memberId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiBackendUrl}/${this.entityName}/recommended-posts-by-likes/${memberId}`);
  }

  public getRecommendedPostsByTags(memberId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiBackendUrl}/${this.entityName}/recommended-posts-by-tags/${memberId}`);
  }
}
