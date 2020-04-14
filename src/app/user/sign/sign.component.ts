import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/userService';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  sign(log, pass) {
    const user = {
      login: log,
      password: pass
    };
    this.userService.login(user).subscribe(response => {
      const res = response.json();
      if (res.isPresent === true) {
        if ( res.correctPassword === true ) {
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          Swal.fire(
            'Done',
            'You signed successfully!',
            'success'
          );
          this.router.navigate(['/user']);
        } else {
          Swal.fire(
            'Error',
            'Login or password incorrect',
            'error'
          );
        }
      } else {
        Swal.fire(
          'Error',
          'User not found',
          'error'
        );
      }
    });
  }

  ngOnInit() {
  }

}
