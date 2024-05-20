export class TagPerMember {
  tagPerMemberId!: number;
  tagId!: number;
  memberId!: number;

  constructor(tagPerMemberId: number, tagId: number, memberId: number) {
    this.tagPerMemberId = tagPerMemberId;
    this.tagId = tagId;
    this.memberId = memberId;
  }

  public static fromJson(jsonTagPerMember: TagPerMember): TagPerMember {
    return new TagPerMember(jsonTagPerMember.tagPerMemberId, jsonTagPerMember.tagId, jsonTagPerMember.memberId);
  }
}
