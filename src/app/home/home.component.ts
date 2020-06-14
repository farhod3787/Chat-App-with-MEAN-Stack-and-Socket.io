import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/userService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  constructor(
    private UserService: UserService
  ) {
    this.user = this.UserService.loggedIn();
  }

  ngOnInit() {
  }

}
