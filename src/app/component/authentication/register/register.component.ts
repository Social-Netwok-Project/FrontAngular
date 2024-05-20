import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaModule} from "ng-recaptcha";
import {FormsModule} from "@angular/forms";
import {LogoComponent} from "../../logo/logo.component";
import {FooterComponent} from "../../footer/footer.component";
import {MemberService} from "../../../service/member.service";
import {CurrentMemberService} from "../../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../../model/member";
import {EmailService} from "../../../service/misc/email.service";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import bcrypt from "bcryptjs";
import {environment} from "../../../../environment/environment.prod";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {emailElement, usernameElement} from "../../misc/editable-element";
import {AuthenticationComponent} from "../authentication-component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    RecaptchaModule,
    FormsModule,
    LogoComponent,
    FooterComponent
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends AuthenticationComponent implements OnInit {
  faXmark = faXmark;

  // Form fields
  emailInput: string = "";
  usernameInput: string = "";
  birthDateInput: string = "";
  passwordInput: string = "";
  confirmPasswordInput: string = "";

  // Logic Fields
  isEmailExists: boolean = false;
  isMemberAdded: boolean = false;

  @Output() onCloseModalEmitter = new EventEmitter<boolean>();
  @Output() onUserAddedEmitter = new EventEmitter<Member>();

  constructor(protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override cookieService: CookieService,
              protected override emailService: EmailService,
              protected override router: Router, protected override route: ActivatedRoute,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                user: Member
              }>) {
    super();
  }

  ngOnInit(): void {
    this.initializeUserByToken().then();
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      if (this.isFormValid()) {
        console.log("Form is valid")
        this.getUserByEmail(this.emailInput).then((user) => {
          this.isEmailExists = (user !== null) && (user !== undefined);
          // Generating hash from password with bcrypt (one of the packages that is used for hashing passwords)
          if (!this.isEmailExists) {
            bcrypt.hash(this.passwordInput, this.hashSalt, (err, hashPassword) => {
              let creationDate = new Date().toISOString().slice(0, 10).replace('T', ' ');
              console.log(creationDate)

              let newMember: Member = new Member(this.usernameInput, this.emailInput, hashPassword, this.birthDateInput, creationDate)
              console.log(newMember)
              this.memberService.addEntity(newMember).subscribe({
                next: (jsonMember: Member) => {
                  if (jsonMember != null) {
                    console.log("User added: ", jsonMember);
                    this.router.navigate(['/home'], {relativeTo: this.route}).then();
                    resolve(true);
                  } else {
                    console.log("Error, user is null");
                    resolve(false);
                  }
                },
                error: (error: HttpErrorResponse) => {
                  console.log("Error in adding new user: ", error);
                  resolve(false);
                }
              });
            });
          } else {
            console.log("Email already exists")
            resolve(false)
          }
        });
      } else {
        console.log("Form is invalid")
        resolve(false)
      }
    }).then(success => {
      if (!success) super.onSubmit();
    });
  }

  override isFormValid(): boolean {
    return this.isCaptchaValid() &&
      this.isUsernameValid() &&
      this.isBirthDateValid() &&
      this.isEmailProper(this.emailInput) &&
      this.isPasswordsMatch() &&
      this.isPasswordProper(this.passwordInput);
  }

  isEmailInvalid(): boolean {
    return !this.isEmailProper(this.emailInput) && this.isSubmitted;
  }

  isUsernameInvalid(): boolean {
    return !this.isUsernameValid() && this.isSubmitted;
  }

  isUsernameValid(): boolean {
    return this.usernameInput.length > 0;
  }

  isBirthDateInvalid() {
    return !this.isBirthDateValid() && this.isSubmitted;
  }

  isBirthDateValid() {
    return this.birthDateInput.length > 0;
  }

  isPasswordInvalid(): boolean {
    return !(this.isPasswordProper(this.passwordInput)) && this.isSubmitted;
  }

  isPasswordsNotMatch(): boolean {
    return !this.isPasswordsMatch() && this.isSubmitted;
  }

  isPasswordsMatch(): boolean {
    return this.passwordInput === this.confirmPasswordInput;
  }

  isUserNotAdded(): boolean {
    return !this.isMemberAdded && this.isSubmitted;
  }

  override isCaptchaValid(): boolean {
    return super.isCaptchaValid();
  }

  closeModal() {
    this.onCloseModalEmitter.emit(false);
  }

  private clearValues() {
    this.isSubmitted = false;
    this.isEmailExists = false;
    this.emailInput = "";
    this.usernameInput = "";
    this.passwordInput = "";
    this.confirmPasswordInput = "";
  }
}
