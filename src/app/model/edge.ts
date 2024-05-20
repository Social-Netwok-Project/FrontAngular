export class Edge {
  edgeId: number;
  memberId: number;
  friendId: number;

  constructor(edgeId: number, memberId: number, friendId: number) {
    this.edgeId = edgeId;
    this.memberId = memberId;
    this.friendId = friendId;
  }

  public static fromJson(jsonEdge: Edge): Edge {
    return new Edge(jsonEdge.edgeId, jsonEdge.memberId, jsonEdge.friendId);
  }
}
