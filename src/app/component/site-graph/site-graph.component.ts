import {Component} from '@angular/core';

import * as d3 from 'd3';
import {SimulationNodeDatum} from "d3";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MessageListElementComponent} from "../messages/message-list-element/message-list-element.component";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {faDiagramProject} from "@fortawesome/free-solid-svg-icons";

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


}

