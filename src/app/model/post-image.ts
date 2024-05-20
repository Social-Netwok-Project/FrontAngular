export class PostImage {
  postImageId: number | undefined;
  name: string;
  fileName: string;

  postId: number;

  imageUrl: string | undefined;
  mightDelete: boolean = false;

  constructor(name: string, fileName: string, postId: number, postImageId?: number) {
    this.postImageId = postImageId;
    this.postId = postId;
    this.name = name;
    this.fileName = fileName;
  }

  public static fromJson(jsonPostImage: PostImage): PostImage {
    return new PostImage(jsonPostImage.name, jsonPostImage.fileName, jsonPostImage.postId, jsonPostImage.postImageId);
  }
}
