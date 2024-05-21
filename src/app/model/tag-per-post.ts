import {Tag} from "./tag";

export class TagPerPost {
  tagPerPostId!: number;
  postId!: number;
  tagId!: number;

  tagList: Tag[] = [];

  constructor(tagPerPostId: number, postId: number, tagId: number) {
    this.tagPerPostId = tagPerPostId;
    this.postId = postId;
    this.tagId = tagId;
  }

  public static fromJson(jsonTagPerPost: TagPerPost): TagPerPost {
    let tagPerPost = new TagPerPost(jsonTagPerPost.tagPerPostId, jsonTagPerPost.postId, jsonTagPerPost.tagId);
    tagPerPost.tagList = Tag.initializeTags(jsonTagPerPost.tagList);

    return tagPerPost;
  }

  static initializeTagsPerPost(tagsPerPostList: TagPerPost[]) {
    let tagsPerPost: TagPerPost[] = [];
    if (tagsPerPostList != undefined) {
      for (let jsonTagPerPost of tagsPerPostList) {
        tagsPerPost.push(TagPerPost.fromJson(jsonTagPerPost));
      }
    }
    return tagsPerPost;
  }
}
