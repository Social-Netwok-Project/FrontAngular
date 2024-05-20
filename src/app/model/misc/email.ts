import {environment} from "../../../environment/environment.prod";

export class Email {
  to: string;
  subject: string;
  body: string;
  is_html: boolean;

  constructor(to: string, subject: string, body: string, html: boolean) {
    this.to = to;
    this.subject = subject;
    this.body = body;
    this.is_html = html;
  }

  static recoveryEmail(to: string, token: string) : Email {
    console.log("recovery link: " + `${environment.apiFrontEndUrl}/password-reset/${token}`)
    return new Email(to, "Recovery Email", `${environment.apiFrontEndUrl}/password-reset/${token}`, true);
  }
}
