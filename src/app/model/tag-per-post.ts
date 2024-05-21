import {Tag} from "./tag";

export class TagPerPost {
  postId: number;
  tagId: number;

  tagPerPostId!: number | undefined;

  tag!: Tag;

  constructor(postId: number, tagId: number, tagPerPostId?: number) {
    this.tagPerPostId = tagPerPostId;
    this.postId = postId;
    this.tagId = tagId;
  }

  public static fromJson(jsonTagPerPost: TagPerPost): TagPerPost {
    let tagPerPost = new TagPerPost(jsonTagPerPost.postId, jsonTagPerPost.tagId, jsonTagPerPost.tagPerPostId);

    if(jsonTagPerPost.tag != undefined) {
      tagPerPost.tag = Tag.fromJson(jsonTagPerPost.tag)
    }

    return tagPerPost;
  }

  static initializeTagPerPostList(jsonTagPerPostList: TagPerPost[]) {
    let tagsPerPostList: TagPerPost[] = [];
    if (jsonTagPerPostList != undefined) {
      for (let jsonTagPerPost of jsonTagPerPostList) {
        tagsPerPostList.push(TagPerPost.fromJson(jsonTagPerPost));
      }
    }
    return tagsPerPostList;
  }
}
