import {PostImage} from "./post-image";
import {PostVideo} from "./post-video";
import {TagPerPost} from "./tag-per-post";

export class Post {
  postId: number | undefined;
  title: string;
  creationDate: string;
  body: string;

  memberId: number;

  postImageList: PostImage[] = [];
  postVideoList: PostVideo[] = [];

  tagsPerPostList: TagPerPost[] = [];

  constructor(title: string, creationDate: string, body: string, memberId: number, postId?: number) {
    this.postId = postId;
    this.title = title;
    this.creationDate = creationDate;
    this.body = body;
    this.memberId = memberId;
  }

  static fromJson(jsonPost: Post): Post {
    let post = new Post(jsonPost.title, jsonPost.creationDate, jsonPost.body, jsonPost.memberId, jsonPost.postId);
    post.tagsPerPostList = TagPerPost.initializeTagsPerPost(jsonPost.tagsPerPostList);
    post.postImageList = PostImage.initializePostImages(jsonPost.postImageList);
    post.postVideoList = PostVideo.initializePostVideos(jsonPost.postVideoList);

    return post;
  }

  static initializePosts(jsonPosts: Post[]) {
    let posts: Post[] = [];
    if (jsonPosts != undefined) {
      for (let jsonPost of jsonPosts) {
        posts.push(Post.fromJson(jsonPost));
      }
    }
    return posts;
  }
}
