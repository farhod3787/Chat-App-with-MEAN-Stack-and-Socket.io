import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/userService';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;


  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      login: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSave() {
    this.userService.saveUser(
      this.form.value.name,
      this.form.value.login,
      this.form.value.password
    ).subscribe(response => {
      console.log(response.json());
      if (!response.json()) {
        Swal.fire(
          'Error',
          'This login busy',
          'error'
        );
      } else {
        Swal.fire(
          'Done',
          'Registration successfully',
          'success'
        );
        this.router.navigate(['/sign']);
      }
    });
  }


}
