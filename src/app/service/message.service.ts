import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {Message} from "../model/message";

@Injectable({
  providedIn: 'root'
})
export abstract class MessageService extends EntityService<Message> {
  protected constructor(http: HttpClient) {
    super(http, "message");
  }
}
