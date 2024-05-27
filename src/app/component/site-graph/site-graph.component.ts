import {Component, OnInit} from '@angular/core';

import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {MessageListElementComponent} from "../messages/message-list-element/message-list-element.component";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {siteGraphNavigationItem} from "../header/navigation-item";
import {CookieComponent} from "../misc/cookie-component";
import * as d3 from 'd3';
import {BaseType} from 'd3';
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {MemberService} from "../../service/member.service";
import {EdgeService} from "../../service/edge.service";
import {Member} from "../../model/member";
import {Edge} from "../../model/edge";
import {Observable} from "rxjs";
import {TwoIds} from "../../model/query/delete/two-ids";
import {HttpErrorResponse} from "@angular/common/http";
import {AutoCompleteModule} from "primeng/autocomplete";

@Component({
  selector: 'app-site-graph',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MessageListElementComponent,
    NgForOf,
    PaginatorModule,
    NgxResizeObserverModule,
    AutoCompleteModule
  ],
  templateUrl: './site-graph.component.html',
  styleUrl: './site-graph.component.scss'
})
export class SiteGraphComponent extends CookieComponent implements OnInit {

  siteGraphNavigationItem = siteGraphNavigationItem;

  allMembers: Member[] = [];
  allEdges: Edge[] = []

  svgSizeMain: number = 1500;
  svgSizeShortestPath: number = 300;

  errorMsg: string = "";

  selectedMemberStart: Member | string | undefined;
  selectedMemberEnd: Member | string | undefined;

  foundMembersStart: Member[] = [];
  foundMembersEnd: Member[] = [];

  constructor(protected override memberService: MemberService,
              protected override edgeService: EdgeService) {
    super();
  }

  ngOnInit(): void {
    new Observable<Member[] | Edge[]>(observer => {
      this.memberService.getAllEntities().subscribe({
        next: (jsonMembers: Member[]) => {
          this.allMembers = Member.initializeMembers(jsonMembers);

          observer.next(this.allMembers)
        },
        error: (error) => console.log(error)
      });
      this.edgeService.getAllEntities().subscribe({
        next: (jsonEdges: Edge[]) => {
          this.allEdges = Edge.initializeEdges(jsonEdges)
          observer.next(this.allEdges)
        },
        error: (error) => console.log(error)
      });
    }).subscribe({
      next: (value: Member[] | Edge[]) => {
        if (this.allMembers.length > 0 && this.allEdges.length > 0) {
          this.renderGraph(this.allMembers, this.allEdges, "#site-graph-main", this.svgSizeMain);
          this.renderGraph(this.allMembers, this.allEdges, "#site-graph", this.svgSizeShortestPath);
        }
      }
    });
  }

  parseData(members: Member[], edges: Edge[]) {
    let nodes = [];
    for (let i = 0; i < members.length; i++) {
      nodes.push(new MySimulationNodeDatum(members[i].getMemberId()!.toString(), members[i].username, i))
    }

    let links = [];
    for (let i = 0; i < edges.length; i++) {
      let color = [edges[i].memberId, edges[i].friendId].sort((a, b) => a - b).toString();

      links.push(new MySimulationLinkDatum(
        nodes.find(datum => parseInt(datum.id) == edges[i].memberId)!,
        nodes.find(datum => parseInt(datum.id) == edges[i].friendId)!,
        i,
        color
      ))
    }

    return {nodes, links}
  }

  renderGraph(members: Member[], edges: Edge[], divId: string, svgSize: number) {
    let data = this.parseData(members, edges)

    if (data) {
      const {nodes, links} = data;
      const types = Array.from(new Set(links.map(d => d.color)));

      let color = d3.scaleOrdinal(types, d3.schemeCategory10);

      let simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.index!).distance(100))
        .force("charge", d3.forceManyBody().strength(-700))
        .force("center", d3.forceCenter(0, 0))
        .force("x", d3.forceX())
        .force("y", d3.forceY());


      d3.select(divId).select('svg').remove()

      let svg = d3.select(divId).append("svg")
        .attr("viewBox", [-svgSize / 2, -svgSize / 2, svgSize, svgSize])
        .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;")

      svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5")


      let link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => color(d.color))
        .attr("marker-end", d => `url(#arrow-${d.color})`);

      let node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(this.test(simulation), "")

      node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 4)
      // .call(this.test(simulation), "")

      node.append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => d.username)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

      simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
    }

    function drag(simulation: d3.Simulation<MySimulationNodeDatum, MySimulationLinkDatum>) {
      function dragStarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragEnded(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
    }

    function linkArc(d: any) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      return `
                M${d.source.x},${d.source.y}
                A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
            `;
    }
  }

  private test(simulation: d3.Simulation<MySimulationNodeDatum, MySimulationLinkDatum>) {
    return function (p1: d3.Selection<BaseType, any, BaseType, any>, p2: any) {


    };
  }

  onReload(svgName: string, svgSize: number) {
    this.resetValues()
    this.renderGraph(this.allMembers, this.allEdges, svgName, svgSize)
  }

  onFindShortestPath() {
    this.errorMsg = "";

    if (this.selectedMemberStart != undefined && this.selectedMemberEnd != undefined &&
        this.selectedMemberStart instanceof Member && this.selectedMemberEnd instanceof Member) {

      this.edgeService.getShortestPath(new TwoIds(this.selectedMemberStart.getMemberId(), this.selectedMemberEnd.getMemberId())).subscribe({
        next: (data: { path: Member[], length: number }) => {
          if(data != null && data.path.length > 0) {
            let members: Member[] = Member.initializeMembers(data.path);
            let edges: Edge[] = []

            for (let i = 0; i < members.length; i++) {
              if(i + 1 < members.length) {
                edges.push(new Edge(members[i].getMemberId(), members[i + 1].getMemberId()))
              }
            }

            this.renderGraph(members, edges, "#site-graph", this.svgSizeShortestPath)
          } else {
            this.errorMsg = `No Path Found`
          }
        },
        error: (error: HttpErrorResponse) => console.log(error)
      })
    } else {
      this.errorMsg = `No Path Found`
    }
  }

  private resetValues() {
    this.selectedMemberStart = undefined;
    this.selectedMemberEnd = undefined;
    this.errorMsg = "";
  }

  onSubmitStartMember(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.key === 'Enter') {
      if(this.selectedMemberStart != undefined) {
        this.memberService.findMembersByUsername(this.selectedMemberStart ?.toString()).subscribe({
          next: (jsonMembers: Member[]) => {
            this.foundMembersStart = Member.initializeMembers(jsonMembers)
          },
          error: (error: HttpErrorResponse) => console.log(error)
        })
      }
    }
  }

  onSubmitMemberEnd(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.key === 'Enter') {
      if(this.selectedMemberEnd != undefined) {
        this.memberService.findMembersByUsername(this.selectedMemberEnd ?.toString()).subscribe({
          next: (jsonMembers: Member[]) => {
            this.foundMembersEnd = Member.initializeMembers(jsonMembers)
          },
          error: (error: HttpErrorResponse) => console.log(error)
        })
      }
    }
  }
}

class MySimulationNodeDatum implements d3.SimulationNodeDatum {
  id: string;
  username: string;
  index?: number | undefined;

  x?: number | undefined;
  y?: number | undefined;
  vx?: number | undefined;
  vy?: number | undefined;
  fx?: number | undefined;
  fy?: number | undefined;

  constructor(id: string, username: string, index: number) {
    this.id = id;
    this.username = username;
    this.index = index;
  }
}

class MySimulationLinkDatum implements d3.SimulationLinkDatum<MySimulationNodeDatum> {
  source: MySimulationNodeDatum;
  target: MySimulationNodeDatum;
  index: number;
  color: string;

  constructor(source: MySimulationNodeDatum, target: MySimulationNodeDatum, index: number, color: string) {
    this.source = source;
    this.target = target;
    this.index = index;
    this.color = color;
  }
}





