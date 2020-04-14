import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './user/chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ChatroomComponent } from './user/chatroom/chatroom.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignComponent } from './user/sign/sign.component';
import { RegistrationComponent } from './registration/registration.component';


const routes: Routes = [
  { path: '', component: NavbarComponent, children: [
    { path: '', component: HomeComponent},
    { path: 'sign', component: SignComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'user', component: ChatComponent},
    { path: 'chat/:id', component: ChatroomComponent}

  ] },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
