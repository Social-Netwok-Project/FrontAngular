export class Edge {
  edgeId: number | undefined;
  memberId: number;
  friendId: number;

  constructor(memberId: number, friendId: number, edgeId?: number) {
    this.edgeId = edgeId;
    this.memberId = memberId;
    this.friendId = friendId;
  }

  public static fromJson(jsonEdge: Edge): Edge {
    return new Edge(jsonEdge.memberId, jsonEdge.friendId, jsonEdge.edgeId);
  }

  static initializeEdges(jsonEdges: Edge[]) {
    let edges: Edge[] = [];
    if(jsonEdges != undefined) {
      for (let jsonEdge of jsonEdges) {
        edges.push(Edge.fromJson(jsonEdge));
      }
    }
    return edges;
  }
}
