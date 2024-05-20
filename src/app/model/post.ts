export class Post {
  postId: number;
  title: string;
  creation_date: string;
  body: string;

  memberId: number | undefined;

  constructor(postId: number, title: string, creation_date: string, body: string, memberId?: number) {
    this.postId = postId;
    this.title = title;
    this.creation_date = creation_date;
    this.body = body;
    this.memberId = memberId;
  }

  static fromJson(jsonPost: Post): Post {
    return new Post(jsonPost.postId, jsonPost.title, jsonPost.creation_date, jsonPost.body, jsonPost.memberId);
  }
}
