export class LikedPost {
  likedPostId!: number | undefined;
  postId!: number;
  memberId!: number;

  constructor(postId: number, memberId: number, likedPostId?: number) {
    this.likedPostId = likedPostId;
    this.postId = postId;
    this.memberId = memberId;
  }

  public static fromJson(jsonLikedPost: LikedPost): LikedPost {
    return new LikedPost(jsonLikedPost.postId, jsonLikedPost.memberId, jsonLikedPost.likedPostId);
  }
}
