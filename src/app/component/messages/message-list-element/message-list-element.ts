import {Message} from "../../../model/message";
import {Member} from "../../../model/member";

export class MessageListElement {
  message: Message;
  memberOwner: Member;
  messageType: MessageType;
  position: MessagePosition;

  constructor(message: Message, memberOwner: Member) {
    this.message = message;
    this.memberOwner = memberOwner;
    this.messageType = this.setMessageType();
    this.position = this.setPosition()
  }

  private setMessageType() {
    if(this.message.memberId == this.memberOwner.getMemberId()) {
      return ownerMessageType;
    } else {
      return friendMessageType;
    }
  }

  private setPosition() {
    if(this.message.memberId == this.memberOwner.getMemberId()) {
      return MessagePosition.END;
    } else {
      return MessagePosition.START;
    }

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
