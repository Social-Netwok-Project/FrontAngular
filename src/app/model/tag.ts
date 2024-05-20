export class Tag {
  tagId: number;
  name: string;

  constructor(tagId: number, name: string) {
    this.tagId = tagId;
    this.name = name;
  }

  public static fromJson(jsonTag: Tag): Tag {
    return new Tag(jsonTag.tagId, jsonTag.name);
  }
}
