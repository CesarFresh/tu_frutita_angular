import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['idUsuario', 'username', 'creadoEn', 'modificadoEn','acciones'];
  dataSource = new MatTableDataSource();
  searchInput: string = "";
  idUser: any = 0;
  options = {
    autoClose: false,
    keepAfterRouteChange: true,
  };
  hasError: boolean = false;

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('inputSearch') userInput!: ElementRef;

  loading: boolean = false;

  constructor(
    private _userService: UsersService,
    private _router: Router,
    private _authService: AuthService,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getUsers();
  }

  applyFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
  }

  getCurrentUser(){
    let userData = this._authService.getUserData();
    let idUsuario = userData["login"].user.idUsuario;
    this.idUser = idUsuario;
  }

  getUsers(){
    this._userService.getUsers().valueChanges.subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data.data.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.dataSource = new MatTableDataSource();
        let stringError: any = JSON.parse(JSON.stringify(error));
        this.alertsService.warn(stringError.message, this.options);
        let isUnauth: boolean = false;
        this.hasError = true;
        for (const key in stringError.graphQLErrors) {
          if(stringError.graphQLErrors[key].message === "Unauthorized"){
            isUnauth = true;
            break;
          }
        }
        if(isUnauth){
          this._authService.logout();
        }
      }
    )
  }

  deleteUser(idUser: Number){
    this._userService.removeUser(idUser);
  }

  goToEdit(idUser: number){
    this._router.navigate(
      ['/dashboard/users/user' , idUser]
    );
  }

  goToCreate(){
    this._router.navigate(
      ['/dashboard/users/user']
    );
  }
}
