import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaModule} from "ng-recaptcha";
import {FormsModule} from "@angular/forms";
import {environment} from "../../../../environment/environment.prod";
import {AuthenticationComponent} from "../authentication-component";
import bcrypt from "bcryptjs";
import {LogoComponent} from "../../logo/logo.component";
import {EmailService} from "../../../service/misc/email.service";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {CurrentMemberService} from "../../../service/current-member.service";
import {MemberService} from "../../../service/member.service";
import {Member} from "../../../model/member";

// @ts-ignore
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf, HttpClientModule,
    FormsModule,
    RecaptchaModule, NgIf, LogoComponent, FooterComponent, NgxResizeObserverModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.styles.scss', '../../main/main.component.scss']
})
export class LoginComponent extends AuthenticationComponent implements OnInit {
  // Form fields
  emailInput: string = "";
  passwordInput: string = "";

  // Logic Fields
  isLoginValid: boolean = false;
  isLoginChecked: boolean = false;

  constructor(protected override memberService: MemberService,
              protected override cookieService: CookieService,
              protected override emailService: EmailService,
              protected override currentMemberService: CurrentMemberService,
              protected override router: Router, protected override route: ActivatedRoute,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                member: Member
              }>) {
    super();
  }

  ngOnInit(): void {
    console.log("here")
    if (this.hasUserToken()) {
      this.deleteUserToken();
    }
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      if (this.isFormValid()) {
        this.memberService.findMemberByEmail(this.emailInput).subscribe({
          next: (jsonMember: Member) => {
            if (jsonMember != null) {
              bcrypt.compare(this.passwordInput, jsonMember.password).then(success => {
                if (success) {
                  this.resetTokenByEmail(jsonMember.email).then((success) => {
                    resolve(success);
                    if (success) {
                      this.initializeUser(jsonMember);
                    }
                  });
                  this.isLoginValid = true;
                  console.log('Login is valid');
                } else {
                  console.log('Login is invalid');
                  resolve(false);
                }
                this.isLoginChecked = true;
              });
            } else {
              console.log('Json User is null');
              this.isLoginChecked = true;
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log('Login is invalid, HTTP ERROR');
            resolve(false);
          }
        });
      } else {
        console.log('Form is invalid');
        resolve(false);
      }
    }).then(success => {
      super.onSubmit();

      if (success && this.isLoginValid) {
        this.routeToHome().then();
      }
    });
  }

  override isFormValid(): boolean {
    return this.isEmailValid() &&
      this.isPasswordValid() &&
      this.isCaptchaValid();
  }

  isEmailInvalid(): boolean {
    return !this.isEmailValid() && this.isSubmitted;
  }

  isEmailValid(): boolean {
    return this.isEmailProper(this.emailInput) && this.emailInput.length > 0;
  }

  isPasswordInvalid(): boolean {
    return !this.isPasswordValid() && this.isSubmitted;
  }

  isPasswordValid(): boolean {
    return this.passwordInput.length > 0;
  }

  isLoginInvalid(): boolean {
    return !this.isLoginValid && this.isLoginChecked && this.isSubmitted;
  }


}
