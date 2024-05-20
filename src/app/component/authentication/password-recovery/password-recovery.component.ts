import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthenticationComponent} from "../authentication-component";
import {FormsModule} from "@angular/forms";
import {RECAPTCHA_SETTINGS, RecaptchaModule} from "ng-recaptcha";
import {environment} from "../../../../environment/environment.prod";
import {MemberService} from "../../../service/member.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EmailService} from "../../../service/misc/email.service";
import {Email} from "../../../model/misc/email";
import {HttpErrorResponse} from "@angular/common/http";
import {generateRandomToken} from "../../misc/functions";
import {LogoComponent} from "../../logo/logo.component";
import {CookieService} from 'ngx-cookie-service';
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {Member} from "../../../model/member";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    NgIf,
    RecaptchaModule,
    FormsModule, LogoComponent, FooterComponent, NgxResizeObserverModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css', '../auth.styles.scss', '../../main/main.component.scss']
})
export class PasswordRecoveryComponent extends AuthenticationComponent {
  // Form fields
  emailInput: string = "";

  // Logic Fields
  isEmailExist: boolean = false;
  isEmailChecked: boolean = false;
  _isEmailSent: boolean = false;

  constructor(protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override emailService: EmailService,
              protected override router: Router, protected override route: ActivatedRoute) {
    super();
  }

  override isFormValid(): boolean {
    return this.isEmailProper(this.emailInput) && this.isCaptchaValid();
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      if (this.isFormValid()) {
        this.memberService.findMemberByEmail(this.emailInput).subscribe({
          next: (jsonMember: Member) => {
            if (jsonMember != null) {
              this.isEmailExist = true;
              let newToken = generateRandomToken();
              this.emailService.sendEmail(Email.recoveryEmail(jsonMember.email, newToken)).subscribe({
                  next: (success: boolean) => {
                    if (success) {
                      this.resetTokenByEmail(jsonMember.email, newToken).then((success) => {
                        resolve(success);
                      });
                      console.log('Email sent');
                    } else {
                      console.error('Email not sent');
                      resolve(false);
                    }
                  },
                  error: (error: HttpErrorResponse) => {
                    console.error("HTTP ERROR: Email not sent");
                    resolve(false);
                  }
                }
              )
            } else {
              console.log('Email does not exist');
              resolve(false);
            }
            this.isEmailChecked = true;
          },
          error: (error: HttpErrorResponse) => {
            console.error("HTTP ERROR: Email does not exist");
            resolve(false);
          }
        });
      } else {
        console.log('Form not valid');
        resolve(false);
      }
    }).then(success => {
      this._isEmailSent = success;
      super.onSubmit();
    });
  }

  isEmailNotExist(): boolean {
    return !this.isEmailExist &&
      !this.isEmailInvalid() &&
      this.isSubmitted &&
      this.isEmailChecked;
  }

  isEmailInvalid(): boolean {
    return !(this.isEmailProper(this.emailInput) && this.emailInput.length > 0) && this.isSubmitted;
  }

  isEmailSent() {
    return this._isEmailSent && this.isSubmitted;
  }
}
