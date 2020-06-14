import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/shared/services/webSocketService';
import { UserService } from 'src/app/shared/services/userService';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  messageArray = [];
  private isTyping = false;
  private chatroom;
  private username: String;
  private selectedUserName: String;
  private id: any;
  image: String;
  warn: String;
  status = false;
  constructor(
    private userService: UserService,
    private webSocketService: WebsocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.webSocketService.newMessageReceived().subscribe(data => {
      this.messageArray.push(data);
      this.isTyping = false;
    });
    this.webSocketService.receivedTyping().subscribe(bool => {
      this.isTyping = bool.isTyping;
    });
   }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.userService.getUser(this.id).subscribe(res => {
          const user = res.json();
          this.selectedUserName = res.json().name;
          this.image = res.json().image;
          const currentUser = this.userService.getLoggedInUser();
          this.username = currentUser.username;

          if (this.selectedUserName < currentUser.username ) {
            this.chatroom = this.selectedUserName + currentUser.username;
          } else {
            this.chatroom = currentUser.username + this.selectedUserName;
          }
          this.webSocketService.joinRoom({
            user: this.userService.getLoggedInUser().username,
            room: this.chatroom
          });

          this.userService.getChatRoomsChat(this.chatroom).subscribe(messages => {
            if (!messages.json().ok) {
              this.status = true;
              this.warn = 'Здес пока не чего нет';
            } else {
            this.messageArray = messages.json().msg;
            }
          });
        });
      } else {
        this.router.navigate(['/user']);
      }
    });
  }


  sendMessage(text) {
    this.webSocketService.sendMessage({
      room: this.chatroom,
      user: this.userService.getLoggedInUser().username,
      message: text
    });
  }

  typing() {
    this.webSocketService.typing({
      room: this.chatroom,
      user: this.userService.getLoggedInUser().username
    });
  }

}
