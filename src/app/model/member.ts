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
    return new Member(jsonMember.username, jsonMember.email, jsonMember.password, jsonMember.birthdate, jsonMember.creationDate, jsonMember.memberId, jsonMember.token, jsonMember.pfpImageName);
  }

  getUserId(): number {
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

  clearLists() {

  }

  toString() {
    return this.username;
  }

  setBirthDate(birthdate: string) {
    this.birthdate = birthdate;
  }
}
