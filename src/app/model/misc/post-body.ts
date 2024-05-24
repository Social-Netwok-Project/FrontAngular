export class PostBody {
  memberId: number;
  tagNames: string[];
  excludeIds: number[];
  limit: number;

  constructor(memberId: number, excludeIds: number[], limit: number = 10, tagNames: string[] = []) {
    this.memberId = memberId;
    this.tagNames = tagNames;
    this.excludeIds = excludeIds;
    this.limit = limit;
  }
}
