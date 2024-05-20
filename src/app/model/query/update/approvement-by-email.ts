export class ApprovementByEmail {
  approved: boolean;
  email: string;

  constructor(email: string, approve: boolean) {
    this.email = email;
    this.approved = approve;
  }
}
