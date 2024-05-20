import {StorageKeys} from "./storage-keys";
import {CookieService} from "ngx-cookie-service";
import {MemberService} from "../../service/member.service";
import {generateRandomToken} from "./functions";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {TokenByEmail} from "../../model/query/update/token-by-email";
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../model/member";
import {CurrentMemberService} from "../../service/current-member.service";
import {Observable} from "rxjs";

export abstract class CookieComponent {
  // Services
  protected cookieService!: CookieService;
  protected currentMemberService!: CurrentMemberService;
  protected memberService!: MemberService;

  protected router!: Router;
  protected route!: ActivatedRoute;

  // Footer variable
  protected footerTopMinValue: number = 0;
  protected position: string = "static";

  constructor() {

  }

  loggedInPage() {
    if (!this.currentMemberService.isLoggedIn()) {
      this.routeToHome().then();
    }
  }

  routeToHome(): Promise<boolean> {
    return this.router.navigate(['/home'], {relativeTo: this.route});
  }

  routeTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route}).then();
  }

  setUserToken(token: string): void {
    this.cookieService.set(StorageKeys.USER_TOKEN, token, 1, '/');
  }

  getUserToken(): string {
    return this.cookieService.get(StorageKeys.USER_TOKEN);
  }

  hasUserToken(): boolean {
    return this.cookieService.check(StorageKeys.USER_TOKEN);
  }

  deleteUserToken(): void {
    this.cookieService.delete(StorageKeys.USER_TOKEN, '/');
  }

  initializeUserByToken(): Promise<boolean> {
    this.currentMemberService.incrementCounter();
    return new Promise<boolean>((resolve, reject) => {
      if (this.currentMemberService.user != undefined) {
        resolve(true)
      } else if (this.hasUserToken() && this.currentMemberService.getCounter() == 1) {
        this.currentMemberService.setMainPromise(new Promise<boolean>((resolve_sub, reject) => {
          this.memberService.findMemberByToken({token: this.getUserToken()})
            .subscribe({
              next: (jsonUser: Member) => {
                if (jsonUser != null) {
                  this.initializeUser(jsonUser);

                  resolve_sub(true);
                  resolve(true);
                } else {
                  console.log('User not found');
                  resolve_sub(false);
                  resolve(false);
                }
              },
              error: (error: HttpErrorResponse) => {
                resolve_sub(false);
                resolve(false);
                console.log('HTTP Error: User not found');
              }
            });
        }));
      } else if (this.hasUserToken() && this.currentMemberService.getCounter() > 1) {
        this.currentMemberService.getMainPromise()?.then((success) => {
          resolve(success);
        });
      } else {
        resolve(false);
      }
    });
  }

  initializeUser(jsonUser: Member) {
    this.currentMemberService.user = Member.fromJson(jsonUser);
    this.initializeUserPfpImgUrl().then();

    console.log(this.currentMemberService.user!)
  }

  resetTokenByOldToken(): Promise<boolean> {
    let currentToken = this.cookieService.get(StorageKeys.USER_TOKEN);
    return new Promise<boolean>((resolve, reject) => {
      this.memberService.updateTokenByOldToken({oldToken: currentToken, newToken: generateRandomToken()})
        .subscribe({
          next: (success: number) => {
            if (success == 1) {
              console.log('Token updated');
              this.setUserToken(generateRandomToken());
              resolve(true);
            } else {
              console.error('Token not updated');
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('HTTP Error: Token not updated');
            resolve(false);
          }
        });
    });
  }

  resetTokenByEmail(email: string, newToken?: string): Promise<boolean> {
    let thisToken = "";
    if (newToken == null) {
      thisToken = generateRandomToken();
    } else {
      thisToken = newToken;
    }
    return new Promise<boolean>((resolve, reject) => {
      this.memberService.updateTokenByEmail(new TokenByEmail(email, thisToken)).subscribe({
        next: (success: number) => {
          if (success == 1) {
            this.setUserToken(thisToken);
            console.log('Token updated');
            resolve(true);
          } else {
            console.error('Token not updated');
            resolve(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('HTTP Error: Token not updated');
          resolve(false);
        }
      });
    });
  }

  getUserByEmail(email: string): Promise<Member | null> {
    return new Promise<Member | null>((resolve, reject) => {
      this.memberService.findMemberByEmail(email).subscribe({
        next: (user: Member) => {
          resolve(user);
        },
        error: (error: HttpErrorResponse) => {
          resolve(null);
        }
      });
    });
  }

  handleFooterTopMinValue(entry: ResizeObserverEntry, staticVal: number = 0) {
    let calculatedValue = entry.contentRect.height + staticVal;

    if (calculatedValue > window.innerHeight) {
      this.position = 'static';
    } else {
      this.position = 'absolute';
      this.footerTopMinValue = Math.max(calculatedValue, window.innerHeight);
    }
  }

  private initializeUserPfpImgUrl(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.currentMemberService.user?.hasPfpImg()) {
        this.memberService.downloadFiles(this.currentMemberService.user?.pfpImageName!).subscribe({
          next: (httpEvent: HttpEvent<Blob>) => {
            if (httpEvent.type === HttpEventType.Response) {
              const file: File = new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
                {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`});
              this.currentMemberService.user?.setPfpImgUrl(URL.createObjectURL(file));
              resolve(true);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log("Error downloading file");
            resolve(false);
          }
        });
      } else {
        console.log("User does not have pfp img");
        resolve(false);
      }
    });
  }

  initializeUsersPfpImgUrl(users: Member[] | undefined): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      new Observable<number>((observer) => {
        let count = 0;
        if (users == undefined || users.length == 0) observer.next(count)

        for (let user of users!) {
          if (user != undefined && user.pfpImageName! != undefined && user.pfpImageName.length > 0) {
            this.memberService.downloadFiles(user.pfpImageName).subscribe({
              next: (httpEvent: HttpEvent<Blob>) => {
                if (httpEvent.type === HttpEventType.Response) {
                  const file: File = new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
                    {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`});
                  user.setPfpImgUrl(URL.createObjectURL(file));
                  observer.next(count++);
                }
              },
              error: (error: HttpErrorResponse) => {
                console.log("Error downloading file");
                observer.next(count++);
              }
            });
          } else {
            console.log("User does not have pfp img");
            observer.next(count++);
          }
        }
      }).subscribe({
        next: (count: number) => {
          if (count == users?.length || users == undefined) {
            resolve(true);
          }
        }
      });
    });
  }

  logoutOnClick() {
    this.deleteUserToken();
    this.currentMemberService.setUserToNull();
    this.routeToHome().then(() => {
      window.location.reload();
    });
  }
}
