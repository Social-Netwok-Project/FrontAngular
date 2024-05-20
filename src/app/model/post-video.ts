export class PostVideo {
  postVideoId!: number;
  name!: string;
  length!: number;
  size!: number;

  constructor(postVideoId: number, name: string, length: number, size: number) {
    this.postVideoId = postVideoId;
    this.name = name;
    this.length = length;
    this.size = size;
  }

  public static fromJson(jsonPostVideo: PostVideo): PostVideo {
    return new PostVideo(jsonPostVideo.postVideoId, jsonPostVideo.name, jsonPostVideo.length, jsonPostVideo.size);
  }
}
