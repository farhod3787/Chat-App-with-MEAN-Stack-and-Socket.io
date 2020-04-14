import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'button'];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private router: Router,
    private userService: UserService
  ) {
      this.auth();
      this.getUsers();
   }

   auth() {
     const token = localStorage.getItem('token');
     if (!token) {
        this.router.navigate(['sign']);
     }
   }
   getUsers() {
     this.userService.getUsers().subscribe( res => {
      this.dataSource = new MatTableDataSource(res.json());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
   }

   logout() {
    Swal.fire(
      'Done',
      'You signed successfully!',
      'success'
    );
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
   }

  ngOnInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
