import {FormComponent} from "../misc/form-component";
import {EmailService} from "../../service/misc/email.service";
import {HttpErrorResponse} from "@angular/common/http";
import bcrypt from "bcryptjs";
import {Email} from "../../model/misc/email";
import {makeRandomNumber} from "../misc/functions";

export abstract class AuthenticationComponent extends FormComponent {
  protected captcha: string | null = "";

  // Validation messages
  protected passwordInvalidMessage: String = "Password must have at least one lowercase and uppercase letter, one number, and 8 characters long.";
  protected oldPasswordInvalidMessage: String = "Old Password is incorrect.";
  protected passwordsNotMatchMessage: String = "Passwords do not match.";
  protected fieldInvalidMessage: String = "Field is invalid.";
  protected notRobotMessage: string = "Please verify that you're not a robot."

  // Static vars
  protected hashSalt: number = 10;

  // Services
  protected emailService!: EmailService;

  protected constructor() {
    super();
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

  isCaptchaInvalid(): boolean {
    return !this.isCaptchaValid() && this.isSubmitted;
  }

  isCaptchaValid(): boolean {
    return this.captcha != null && this.captcha.length > 0;
  }

  isEmailProper(email: string): boolean {
    let regex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    return regex.test(email)
  }

  isPasswordProper(password: string): boolean {
    // Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters
    let regex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$");
    return regex.test(password);
  }

  isFieldProper(field: string): boolean {
    return field.length > 0;
  }
}
