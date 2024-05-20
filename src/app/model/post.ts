import {PostImage} from "./post-image";
import {PostVideo} from "./post-video";

export class Post {
  postId: number | undefined;
  title: string;
  creation_date: string;
  body: string;

  memberId: number;

  postImages: PostImage[] = [];
  postVideos: PostVideo[] = [];

  constructor(title: string, creation_date: string, body: string, memberId: number, postId?: number) {
    this.postId = postId;
    this.title = title;
    this.creation_date = creation_date;
    this.body = body;
    this.memberId = memberId;
  }

  static fromJson(jsonPost: Post): Post {
    return new Post(jsonPost.title, jsonPost.creation_date, jsonPost.body, jsonPost.memberId, jsonPost.postId);
  }
}
