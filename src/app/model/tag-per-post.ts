export class TagPerPost {
  tagPerPostId!: number;
  postId!: number;
  tagId!: number;

  constructor(tagPerPostId: number, postId: number, tagId: number) {
    this.tagPerPostId = tagPerPostId;
    this.postId = postId;
    this.tagId = tagId;
  }

  public static fromJson(jsonTagPerPost: TagPerPost): TagPerPost {
    return new TagPerPost(jsonTagPerPost.tagPerPostId, jsonTagPerPost.postId, jsonTagPerPost.tagId);
  }
}
