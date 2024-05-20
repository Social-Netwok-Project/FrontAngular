export class PostImage {
  postImageId: number;
  name: string;

  constructor(postImageId: number, name: string) {
    this.postImageId = postImageId;
    this.name = name;
  }

  public static fromJson(jsonPostImage: PostImage): PostImage {
    return new PostImage(jsonPostImage.postImageId, jsonPostImage.name);
  }
}
