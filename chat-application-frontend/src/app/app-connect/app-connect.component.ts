import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatSocketService } from '../chat-socket.service';

@Component({
  selector: 'app-app-connect',
  templateUrl: './app-connect.component.html',
  styleUrls: ['./app-connect.component.css']
})
export class AppConnectComponent implements OnInit {

  userData: any;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userData = ChatSocketService.userData;
  }

  handleUsername(event: any) {
    const value = event.target.value;
    ChatSocketService.setUserData({ ...ChatSocketService.userData, "username": value });
  }

  registerUser() {
    ChatSocketService.connect();
    this.router.navigate(['chat-window']);
  }
}
