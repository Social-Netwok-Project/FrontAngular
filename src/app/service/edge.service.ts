import {Injectable} from "@angular/core";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import {Edge} from "../model/edge";

@Injectable({
  providedIn: 'root'
})
export abstract class EdgeService extends EntityService<Edge> {
  protected constructor(http: HttpClient) {
    super(http, "edge");
  }
}
