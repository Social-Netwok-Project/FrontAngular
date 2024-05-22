import {Post} from "./post";
import {join} from "@angular/compiler-cli";
import {TagPerPost} from "./tag-per-post";
import {TagPerMember} from "./tag-per-member";
import {Message} from "./message";

export class Member {
  protected memberId: number | undefined;

  email: string;
  username: string;
  password: string;
  birthdate: string;

  creationDate: string | undefined;
  token: string | undefined;
  pfpImageName: string | undefined;

  // PFP IMAGE URL (COMPUTED WHEN NEEDED)
  pfpImgUrl: string | undefined;

  posts: Post[] = [];
  friends: Member[] = [];
  tagPerMemberList: TagPerMember[] = [];
  messages: Message[] = [];

  followersCount: number | undefined;
  followingCount: number | undefined;

  constructor(username: string, email: string, password: string, birthdate: string,
              creationDate?: string, userId?: number,
              token?: string, pfpImgPath?: string) {
    this.memberId = userId;

    this.email = email;
    this.username = username;
    this.password = password;
    this.birthdate = birthdate;

    this.creationDate = creationDate;
    this.token = token;
    this.pfpImageName = pfpImgPath;
  }

  static fromJson(jsonMember: Member): Member {
    let member = new Member(jsonMember.username, jsonMember.email, jsonMember.password,
      jsonMember.birthdate, jsonMember.creationDate, jsonMember.memberId, jsonMember.token,
      jsonMember.pfpImageName);
    member.posts = Post.initializePosts(jsonMember.posts);
    member.tagPerMemberList = TagPerMember.initializeTagPerMembers(jsonMember.tagPerMemberList);


    return member;
  }

  getMemberId(): number {
    return this.memberId!;
  }

  setPfpImgName(pfpImgPath: string) {
    this.pfpImageName = pfpImgPath;
  }

  setToken(token: string) {
    this.token = token;
  }

  setUserId(userId: number) {
    this.memberId = userId;
  }

  setRegistrationDate(registrationDate: string) {
    this.creationDate = registrationDate;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPfpImgUrl(pfpImgUrl: string) {
    this.pfpImgUrl = pfpImgUrl;
  }

  hasPfpImg(): boolean {
    return this.pfpImageName !== null &&
      this.pfpImageName !== undefined &&
      this.pfpImageName.length > 0;
  }

  getPfpImgPrefix(): string {
    return this.memberId + "-";
  }

  setFriends(friends: Member[]) {
    this.friends = friends;
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
  }

  clearLists() {

  }

  toString() {
    return this.username;
  }

  setBirthDate(birthdate: string) {
    this.birthdate = birthdate;
  }

  getFollowersCount(): number {
    return this.followersCount!;
  }

  setFollowersCount(followersCount: number) {
    this.followersCount = followersCount;
  }

  getFollowingCount(): number {
    return this.followingCount!;
  }

  setFollowingCount(followingCount: number) {
    this.followingCount = followingCount;
  }

  setTagPerMemberList(tagPerMemberList: TagPerMember[]) {
    this.tagPerMemberList = tagPerMemberList;
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  static initializeMembers(jsonFriends: Member[]) {
    let friends: Member[] = [];
    if(jsonFriends != undefined) {
      for (let jsonFriend of jsonFriends) {
        friends.push(Member.fromJson(jsonFriend));
      }
    }
    return friends;
  }
}
