export class FollowersInfo {
  followersCount: number;
  followingCount: number;

  constructor(followersCount: number, followingCount: number) {
    this.followersCount = followersCount;
    this.followingCount = followingCount;
  }
}
