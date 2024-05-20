export class PostVideo {
  postVideoId!: number | undefined;
  name: string;
  fileName: string;

  length: number;
  size: number;

  postId: number;

  videoUrl: string | undefined;
  mightDelete: boolean = false;

  constructor(name: string, fileName: string, length: number, size: number, postId: number, postVideoId?: number) {
    this.name = name;
    this.fileName = fileName;
    this.length = length;
    this.size = size;
    this.postId = postId;

    this.postVideoId = postVideoId;
  }

  public static fromJson(jsonPostVideo: PostVideo): PostVideo {
    return new PostVideo(jsonPostVideo.name, jsonPostVideo.fileName, jsonPostVideo.length, jsonPostVideo.size, jsonPostVideo.postId, jsonPostVideo.postVideoId);
  }
}
