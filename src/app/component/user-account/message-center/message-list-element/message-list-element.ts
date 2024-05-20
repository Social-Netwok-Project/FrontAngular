import {Message} from "../../../../model/message";

export class MessageListElement {
  message: Message;
  messageType: MessageType | undefined
  position: MessagePosition;

  constructor(messageList: Message, currentUserId: number) {
    this.message = messageList;
    this.messageType = this.setMessageType(messageList);
    this.position = this.setPosition(messageList, currentUserId)
  }

  private setMessageType(message: Message) {
    return undefined;
  }

  private setPosition(message: Message, currentUserId: number) {
    // return MessagePosition.START;
    return MessagePosition.END;
  }
}

class MessageType {
  backgroundClass: string;

  constructor(backgroundClass: string) {
    this.backgroundClass = backgroundClass;
  }
}

enum MessagePosition {
  START = "start",
  END = "end",
}

export const ownerMessageType = new MessageType("owner-message-type");
export const friendMessageType = new MessageType("friend-message-type");
