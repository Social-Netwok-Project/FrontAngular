import {Component} from '@angular/core';

import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MessageListElementComponent} from "../messages/message-list-element/message-list-element.component";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {faDiagramProject} from "@fortawesome/free-solid-svg-icons";
import {siteGraphNavigationItem} from "../header/navigation-item";

@Component({
  selector: 'app-site-graph',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MessageListElementComponent,
    NgForOf,
    PaginatorModule
  ],
  templateUrl: './site-graph.component.html',
  styleUrl: './site-graph.component.scss'
})
export class SiteGraphComponent {

  protected readonly faDiagramProject = faDiagramProject;


  protected readonly siteGraphNavigationItem = siteGraphNavigationItem;
}

