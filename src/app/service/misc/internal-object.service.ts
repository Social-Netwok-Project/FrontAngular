import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class InternalObjectService<T> {
  private object!: T;

  protected constructor() {
  }

  setObject(object: T) {
    this.object = object;
  }

  getObject(): T {
    return this.object;
  }
}
