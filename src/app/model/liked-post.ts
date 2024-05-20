export class LikedPost {
  likedPostId!: number;
  postId!: number;
  userId!: number;

  constructor(likedPostId: number, postId: number, userId: number) {
    this.likedPostId = likedPostId;
    this.postId = postId;
    this.userId = userId;
  }

  public static fromJson(jsonLikedPost: LikedPost): LikedPost {
    return new LikedPost(jsonLikedPost.likedPostId, jsonLikedPost.postId, jsonLikedPost.userId);
  }
}
