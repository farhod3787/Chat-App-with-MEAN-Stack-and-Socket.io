import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/userService';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  submitForm(username, log , pass) {
      const user = {
        name: username,
        login: log,
        password: pass
      };
      this.userService.saveUser(user).subscribe(response => {
        if (response.json().user_already_signed_up === true) {
          Swal.fire(
            'Error',
            'This login busy',
            'error'
          );
        } else {
          this.router.navigate(['/sign']);
        }
      });
  }
  ngOnInit() {
  }

}
