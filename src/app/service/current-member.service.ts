import {Member} from "../model/member";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CurrentMemberService {
  private counter: number = 0;

  private _user!: Member | undefined;

  private mainPromise!: Promise<boolean>;

  constructor() {
  }

  public getCounter(): number {
    return this.counter;
  }

  public incrementCounter(): void {
    this.counter++;
  }

  isLoggedIn(): boolean {
    return this._user !== undefined && this._user !== null;
  }

  getMainPromise(): Promise<boolean> {
    return this.mainPromise;
  }

  setMainPromise(mainPromise: Promise<boolean>): void {
    this.mainPromise = mainPromise;
  }

  get user(): Member | undefined {
    return this._user;
  }

  set user(user: Member | undefined) {
    this._user = user;
  }

  setUserToNull() {
    this.user = undefined;
  }
}
