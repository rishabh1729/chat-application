import { Component, OnInit } from '@angular/core';
import { ChatSocketService } from '../chat-socket.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  chatrooms = ['Chatroom'];
  selectedReceiver = "Chatroom";
  userData: any;
  messages = [];
  publicChats = [];
  privateChats = new Map();

  constructor(private service: ChatSocketService) { }

  ngOnInit(): void {
    this.userData = ChatSocketService.userData;
    this.service.publicChats$.subscribe((data: any) => {
      this.publicChats = data;
      this.getRoomList();
      this.getMessages();
    });
    this.service.privateChats$.subscribe((data: any) => {
      this.privateChats = data;
      this.getRoomList();
      this.getMessages();
    });
  }

  getRoomList() {
    this.chatrooms = ['Chatroom'];
    [...this.privateChats.keys()].forEach((room) => this.chatrooms.push(room));
  }

  getMessages() {
    if (this.selectedReceiver == "Chatroom") {
      this.messages = this.publicChats;
    } else {
      this.messages = this.privateChats.get(this.selectedReceiver);
    }
  }

  selectRoom(room: any) {
    this.selectedReceiver = room;
    this.getMessages();
  }

  handleMessage(event: any) {
    this.userData.message = event.target.value;
  }

  sendMessage() {
    ChatSocketService.handleMessage(this.userData.message);
    this.userData.message = '';
    if (this.selectedReceiver == "Chatroom") {
      ChatSocketService.sendValue();
    } else {
      ChatSocketService.sendPrivateValue(this.selectedReceiver);
    }
  }

}
