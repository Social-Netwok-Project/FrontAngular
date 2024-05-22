import {Member} from "../../../model/member";

export class MemberElement {
  member: Member;
  class: string;

  constructor(member: Member) {
    this.member = member;
    this.class = "member-banner-body-div"
  }


  setClicked() {
    this.class = "member-banner-body-div-clicked";
  }

  setUnclicked() {
    this.class = "member-banner-body-div";
  }
}
