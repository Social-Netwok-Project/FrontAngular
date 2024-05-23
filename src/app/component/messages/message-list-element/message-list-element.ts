import {Message} from "../../../model/message";
import {Member} from "../../../model/member";

export class MessageListElement {
  message: Message;
  currentMember: Member;
  friendMember: Member;

  messageType!: MessageType;
  position!: MessagePosition;
  ownerMember!: Member;

  constructor(message: Message, currentMember: Member, friendMember: Member) {
    this.message = message;
    this.currentMember = currentMember;
    this.friendMember = friendMember;
    this.setMessageParams();
  }

  private setMessageParams() {
    if(this.message.memberId == this.currentMember.getMemberId()) {
      this.messageType = ownerMessageType;
      this.position = MessagePosition.END;
      this.ownerMember = this.currentMember;
    } else {
      this.messageType = friendMessageType;
      this.position = MessagePosition.START;
      this.ownerMember = this.friendMember;
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
