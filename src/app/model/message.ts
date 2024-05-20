export class Message {
  message: string;
  timestamp: string;
  read: boolean;
  memberId: number;
  friendId: number;

  constructor(message: string, timestamp: string, read: boolean, memberId: number, friendId: number) {
    this.message = message;
    this.timestamp = timestamp;
    this.read = read;
    this.memberId = memberId;
    this.friendId = friendId;
  }

  static fromJson(jsonMessage: Message): Message {
    return new Message(jsonMessage.message, jsonMessage.timestamp, jsonMessage.read, jsonMessage.memberId, jsonMessage.friendId);
  }
}
