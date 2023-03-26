import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client, over } from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  static stompClient: Client;
  static publicChats = [];
  static privateChats = new Map();

  private static privateChatSubject = new BehaviorSubject(ChatSocketService.privateChats);
  private static publicChatSubject = new BehaviorSubject(ChatSocketService.publicChats);
  public privateChats$ = ChatSocketService.privateChatSubject.asObservable();
  public publicChats$ = ChatSocketService.publicChatSubject.asObservable();

  static userData = {
    username: '',
    receivername: '',
    connected: false,
    message: ''
  };

  constructor() { }

  static setPublicChats(chats: any) {
    ChatSocketService.publicChats = chats;
    ChatSocketService.publicChatSubject.next(chats);
  }

  static setPrivateChats(chats: any) {
    ChatSocketService.privateChats = chats;
    ChatSocketService.privateChatSubject.next(chats);
  }

  static setUserData(data: any) {
    ChatSocketService.userData = data;
  }

  static connect() {
    let sock = new SockJS('http://localhost:9090/ws');
    ChatSocketService.stompClient = over(sock);
    ChatSocketService.stompClient.connect({}, ChatSocketService.onConnected, ChatSocketService.onError);
  }

  static onConnected() {
    ChatSocketService.setUserData({ ...ChatSocketService.userData, "connected": true });
    ChatSocketService.stompClient.subscribe('/chatroom/public', ChatSocketService.onMessageReceived);
    ChatSocketService.stompClient.subscribe('/user/' + ChatSocketService.userData.username + '/private', ChatSocketService.onPrivateMessage);
    ChatSocketService.userJoin();
  }

  static onError(err: any) {
    console.log(err);
  }

  static userJoin() {
    let chatMessage = {
      senderName: ChatSocketService.userData.username,
      status: "JOIN"
    };
    ChatSocketService.stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  }

  static onMessageReceived(payload: any) {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!ChatSocketService.privateChats.get(payloadData.senderName)) {
          ChatSocketService.privateChats.set(payloadData.senderName, []);
          ChatSocketService.setPrivateChats(new Map(ChatSocketService.privateChats));
        }
        break;
      case "MESSAGE":
        ChatSocketService.publicChats.push(payloadData);
        ChatSocketService.setPublicChats([...ChatSocketService.publicChats]);
        break;
    }
  }

  static onPrivateMessage(payload: any) {
    let payloadData = JSON.parse(payload.body);
    if (ChatSocketService.privateChats.get(payloadData.senderName)) {
      ChatSocketService.privateChats.get(payloadData.senderName).push(payloadData);
      ChatSocketService.setPrivateChats(new Map(ChatSocketService.privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      ChatSocketService.privateChats.set(payloadData.senderName, list);
      ChatSocketService.setPrivateChats(new Map(ChatSocketService.privateChats));
    }
  }

  static handleMessage(value: any) {
    ChatSocketService.setUserData({ ...ChatSocketService.userData, "message": value });
  }

  static sendValue() {
    if (ChatSocketService.stompClient) {
      let chatMessage = {
        senderName: ChatSocketService.userData.username,
        message: ChatSocketService.userData.message,
        status: "MESSAGE"
      };
      console.log(chatMessage);
      ChatSocketService.stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      ChatSocketService.setUserData({ ...ChatSocketService.userData, "message": "" });
    }
  }

  static sendPrivateValue(tab: any) {
    if (ChatSocketService.stompClient) {
      let chatMessage = {
        senderName: ChatSocketService.userData.username,
        receiverName: tab,
        message: ChatSocketService.userData.message,
        status: "MESSAGE"
      };

      if (ChatSocketService.userData.username !== tab) {
        ChatSocketService.privateChats.get(tab).push(chatMessage);
        ChatSocketService.setPrivateChats(new Map(ChatSocketService.privateChats));
      }
      ChatSocketService.stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      ChatSocketService.setUserData({ ...ChatSocketService.userData, "message": "" });
    }
  }
}
