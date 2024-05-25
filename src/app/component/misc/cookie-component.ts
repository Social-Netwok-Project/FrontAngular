import {StorageKeys} from "./storage-keys";
import {CookieService} from "ngx-cookie-service";
import {MemberService} from "../../service/member.service";
import {generateRandomToken} from "./functions";
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";
import {TokenByEmail} from "../../model/query/update/token-by-email";
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../model/member";
import {CurrentMemberService} from "../../service/current-member.service";
import {Observable} from "rxjs";
import {PostService} from "../../service/post.service";
import {PostImageService} from "../../service/post-image.service";
import {PostVideoService} from "../../service/post-video.service";
import {Post} from "../../model/post";
import {PostImage} from "../../model/post-image";
import {PostVideo} from "../../model/post-video";
import {TagService} from "../../service/tag.service";
import {TagPerPostService} from "../../service/tag-per-post.service";
import {EdgeService} from "../../service/edge.service";
import {FollowersInfo} from "../../model/query/get/followers-info";
import {LikedPostService} from "../../service/liked-post.service";
import {TagPerMemberService} from "../../service/tag-per-member.service";
import {TwoIds} from "../../model/query/delete/two-ids";
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message";

export abstract class CookieComponent {
  // Services
  protected cookieService!: CookieService;
  protected currentMemberService!: CurrentMemberService;
  protected memberService!: MemberService;
  protected postService!: PostService;
  protected postImageService!: PostImageService;
  protected postVideoService!: PostVideoService;
  protected tagService!: TagService;
  protected tagPerPostService!: TagPerPostService;
  protected tagPerMemberService!: TagPerMemberService;
  protected edgeService!: EdgeService;
  protected likedPostService!: LikedPostService;
  protected messageService!: MessageService;

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

  initializeMemberByToken(): Promise<boolean> {
    this.currentMemberService.incrementCounter();
    return new Promise<boolean>((resolve, reject) => {
      if (this.hasUserToken() && this.currentMemberService.getCounter() == 1) {
        this.currentMemberService.setMainPromise(new Promise<boolean>((resolve_sub, reject) => {
          this.memberService.findMemberByToken({token: this.getUserToken()})
            .subscribe({
              next: (jsonUser: Member) => {
                if (jsonUser != null) {
                  this.initializeMember(jsonUser);
                  this.currentMemberService.setCounter(0);

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

  initializeMember(jsonMember: Member) {
    this.currentMemberService.member = Member.fromJson(jsonMember);
    this.initializeMemberPfpImgUrl().then();

    console.log(this.currentMemberService.member!)
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

  private initializeMemberPfpImgUrl(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.currentMemberService.member?.hasPfpImg()) {
        this.memberService.downloadFiles(this.currentMemberService.member?.pfpImageName!).subscribe({
          next: (httpEvent: HttpEvent<Blob>) => {
            if (httpEvent.type === HttpEventType.Response) {
              const file: File = this.getFile(httpEvent);
              this.currentMemberService.member?.setPfpImgUrl(URL.createObjectURL(file));
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

  initializeMembersPfpImgUrl(users: Member[] | undefined): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let count = 0;
      new Observable<number>((observer) => {
        if (users == undefined || users.length == 0) observer.next(count)

        for (let user of users!) {
          if (user != undefined && user.pfpImageName! != undefined && user.pfpImageName.length > 0) {
            this.memberService.downloadFiles(user.pfpImageName).subscribe({
              next: (httpEvent: HttpEvent<Blob>) => {
                if (httpEvent.type === HttpEventType.Response) {
                  const file: File = this.getFile(httpEvent);
                  user.setPfpImgUrl(URL.createObjectURL(file));
                  observer.next(++count);
                }
              },
              error: (error: HttpErrorResponse) => {
                console.log("Error downloading file");
                observer.next(++count);
              }
            });
          } else {
            observer.next(++count);
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

  initializeCurrentMemberFriends() {
    return this.initializeMemberFriends(this.currentMemberService.member!)
  }

  initializeMemberFriends(member: Member) {
    return new Promise<boolean>((resolve, reject) => {
      if(member != undefined) {
        this.memberService.getFriends(member.getMemberId()!).subscribe({
          next: (jsonFriends: Member[]) => {
            let friends: Member[] = Member.initializeMembers(jsonFriends);
            member.setFriends(friends)
            this.initializeMembersPfpImgUrl(member.friends).then((success) => {
              resolve(success);
            });
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            resolve(false);
          }
        })
      } else {
        resolve(true);
      }
    });
  }

  initializeMembersPostsMedia(members: Member[]) {
    let count = 0;
    return new Promise<boolean>((resolve, reject) => {
      if(members != undefined) {
        new Observable<number>(observer => {
          for (let member of members) {
            this.initializePostsMedia(member.posts).then(() => {
              observer.next(++count);
            });
          }
        }).subscribe({
          next: (count: number) => {
            if (count == members.length) {
              console.log("All posts media initialized");
              resolve(true);
            }
          }
        });
      } else {
        resolve(true);
      }
    })
  }

  initializePostsMedia(posts: Post[]) {
    return new Promise<boolean>( (resolve, reject) =>{
      if(posts != undefined) {
        let count = 0;

        new Observable<number>((observer) => {
          for (let post of posts) {
            this.initializePostImages(post.postImageList).then(() => {
              observer.next(++count);
            });
            this.initializePostVideos(post.postVideoList).then(() => {
              observer.next(++count);
            });
          }
        }).subscribe({
          next: (count: number) => {
            if (count == 2) {
              resolve(true);
            }
          }
        });

      } else {
        resolve(true)
      }
    })
  }

  initializeMemberFollowersInfo(member: Member) {
    return new Promise<boolean>((resolve, reject) => {
      this.memberService.getFollowersInfo(member.getMemberId()).subscribe({
        next: (followersInfo: FollowersInfo) => {
          member.setFollowersCount(followersInfo.followersCount);
          member.setFollowingCount(followersInfo.followingCount);
          resolve(true);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          resolve(false);
        }
      });
    });
  }

  private initializePostImages(postImages: PostImage[]) {
    return new Promise<boolean>((resolve, reject) => {
      if(postImages.length > 0) {
        let count = 0;

        new Observable<number>((observer) => {
          for (let postImage of postImages) {
            this.postImageService.downloadFiles(postImage.name).subscribe({
              next: (httpEvent: HttpEvent<Blob>) => {
                if (httpEvent.type === HttpEventType.Response) {
                  const file: File = this.getFile(httpEvent);
                  postImage.setImageUrl(URL.createObjectURL(file));
                  observer.next(++count);
                }
              },
              error: (error: HttpErrorResponse) => {
                observer.next(++count);
              }
            });
          }
        }).subscribe({
          next: (count: number) => {
            console.log(count)
            if (count == postImages.length) {
              resolve(true);
            }
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  private initializePostVideos(postVideos: PostVideo[]) {
    return new Promise<boolean>((resolve, reject) => {
      if (postVideos.length > 0) {
        let count = 0;
        new Observable<number>((observer) => {
          for (let postVideo of postVideos) {
            this.postVideoService.downloadFiles(postVideo.name).subscribe({
              next: (httpEvent: HttpEvent<Blob>) => {
                if (httpEvent.type === HttpEventType.Response) {
                  const file: File = this.getFile(httpEvent);
                  postVideo.setVideoUrl(URL.createObjectURL(file));
                  observer.next(++count);
                }
              },
              error: (error: HttpErrorResponse) => {
                console.log(error);
              }
            });
          }
        }).subscribe({
          next: (count: number) => {
            if (count == postVideos.length) {
              resolve(true);
            }
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  initializePostLikesCount(post: Post) {
    this.postService.getLikesCount(post.postId!).subscribe({
      next: (count: number) => {
        post.setLikesCount(count);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  fetchMembersMessages(ownerMember: Member, members: Member[]) {
    return new Promise<boolean>((resolve, reject) => {
      let count = 0;

      new Observable<number>(observer => {
        if(members != undefined) {
          for (let member of members) {
            this.fetchMessages(ownerMember, member).then(() => {
              observer.next(++count);
            });
          }
        } else{
          resolve(true);
        }
      }).subscribe({
        next: (count: number) => {
          if (count == members.length) {
            resolve(true);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          resolve(false);
        }
      });
    });
  }

  fetchMessages(ownerMember: Member, member: Member) {
    return new Promise<boolean>((resolve, reject) => {
      this.messageService.getMessagesByMemberIdAndFriendId(new TwoIds(ownerMember.getMemberId(), member.getMemberId())).subscribe({
        next: (jsonMessages: Message[]) => {
          let messages: Message[] = Message.initializeMessages(jsonMessages);
          member.setMessages(messages);
          resolve(true);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          resolve(false);
        }
      });
    })
  }

  logoutOnClick() {
    this.deleteUserToken();
    this.currentMemberService.setMemberToNull();
    this.routeToHome().then(() => {
      window.location.reload();
    });
  }

  private getFile(httpEvent: HttpResponse<Blob>) {
    return new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
      {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`});
  }
}
