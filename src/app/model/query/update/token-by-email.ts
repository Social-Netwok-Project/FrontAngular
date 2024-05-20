export class TokenByEmail {
  email: string;
  newToken: string;

  constructor(email: string, newToken: string) {
    this.email = email;
    this.newToken = newToken;
  }
}
