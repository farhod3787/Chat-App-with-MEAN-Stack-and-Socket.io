import { HttpModule, Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: Http) { }

  url = environment.Url + '/api/users';

  saveUser(
    name: string,
    login: string,
    password: string,
    image: File
  ) {
    const User: any = new FormData();
    User.append('name', name);
    User.append('login', login);
    User.append('password', password);
    User.append('image', image);

    return this.http.post( this.url, User);
  }

  getUser(id) {
    return this.http.get(this.url + '/' + id);
  }

  login(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.url}/login`, user, {headers: headers});
  }

  loggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user != null ? true : false;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getUsers() {
    return this.http.get(this.url + '/persons/' + localStorage.getItem('token') );
  }

  getChatRoomsChat(chatRoom) {
    return this.http.get(this.url + '/chatRoom/' +  chatRoom);
  }

  updateInformations(id, name, password) {
    const body = {
      name,
      password
    };
    return this.http.patch(this.url + '/' + id, body);
  }
}
