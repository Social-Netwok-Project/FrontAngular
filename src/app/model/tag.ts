export class Tag {
  tagId: number;
  name: string;
  mightDelete: boolean = false;

  constructor(tagId: number, name: string) {
    this.tagId = tagId;
    this.name = name;
  }

  public static fromJson(jsonTag: Tag): Tag {
    return new Tag(jsonTag.tagId, jsonTag.name);
  }

  static initializeTags(tagList: Tag[]) {
    let tags: Tag[] = [];
    if (tagList != undefined) {
      for (let jsonTag of tagList) {
        tags.push(Tag.fromJson(jsonTag));
      }
    }
    return tags;
  }

  public toString() {
    return this.name;
  }
}
