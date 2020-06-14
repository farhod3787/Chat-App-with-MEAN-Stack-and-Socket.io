import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/userService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

     name: String;
     password: String;
     login: String;
     image; String;
     id: String
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.getInformation();
   }
   getInformation() {
       const profile = JSON.parse(localStorage.getItem('user'));
       this.id = profile.userId;
       this.userService.getUser(profile.userId).subscribe(result => {
       const user = result.json();
       this.login =  user.login;
       this.name =  user.name;
       this.password =  user.password;
       this.image = user.image;
     });

   }

   update(name, password) {
      this.userService.updateInformations(this.id, name, password).subscribe( res => {
        if (res.json()) {
          Swal.fire(
            'Done',
            'You updated your informations!',
            'success'
          );
          this.router.navigate(['/user']);
        } else {
          Swal.fire(
            'Error',
            'Error in update informations',
            'error'
          );
        }
      });
   }


  ngOnInit() {
  }

}
