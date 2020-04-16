import { UserService } from './userService';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate() {
        if (this.userService.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/sign']);
            return false;
        }
    }
}
