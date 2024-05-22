export class Message {
  messageId: number | undefined;
  message: string;
  timestamp: string;
  read: boolean;
  memberId: number;
  friendId: number;

  constructor(message: string, memberId: number, friendId: number, timestamp: string, read: boolean = false, messagedId?: number) {
    this.message = message;
    this.timestamp = timestamp;
    this.read = read;
    this.memberId = memberId;
    this.friendId = friendId;
    this.messageId = messagedId;
  }

  static fromJson(jsonMessage: Message): Message {
    return new Message(jsonMessage.message, jsonMessage.memberId, jsonMessage.friendId, jsonMessage.timestamp, jsonMessage.read, jsonMessage.messageId);
  }

  static initializeMessages(jsonMessages: Message[]) {
    let messages: Message[] = [];
    if (jsonMessages) {
      for (let message of jsonMessages) {
        messages.push(Message.fromJson(message));
      }
    }
    return messages;
  }
}
