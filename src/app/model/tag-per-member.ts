export class TagPerMember {
  tagPerMemberId!: number | undefined;
  tagId!: number;
  memberId!: number;

  constructor(tagId: number, memberId: number, tagPerMemberId?: number) {
    this.tagPerMemberId = tagPerMemberId;
    this.tagId = tagId;
    this.memberId = memberId;
  }

  public static fromJson(jsonTagPerMember: TagPerMember): TagPerMember {
    return new TagPerMember(jsonTagPerMember.tagId, jsonTagPerMember.memberId, jsonTagPerMember.tagPerMemberId);
  }

  static initializeTagPerMembers(tagPerMemberList: TagPerMember[]) {
    let tagPerMembers: TagPerMember[] = [];
    if (tagPerMemberList != undefined) {
      for (let jsonTagPerMember of tagPerMemberList) {
        tagPerMembers.push(TagPerMember.fromJson(jsonTagPerMember));
      }
    }
    return tagPerMembers;
  }
}
