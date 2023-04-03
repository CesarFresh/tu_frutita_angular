import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { loginMutationResponse } from 'src/app/models/login';
import { user } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';

type graphqlMutation<T> = Record<string, T>;

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  search: boolean = false;
  routerActive: string = "activelink";
  user: user = {
    apellido: "",
    correo: "",
    idUsuario: 0,
    nombre: "",
    username: ""
  };
  errors: Array<any> = [];
  idUser:any  = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/designer/home",
      icon: "home",
      menu: "Diseñador"
    },
    {
      link: "/dashboard/users",
      icon: "users",
      menu: "Usuarios"
    },
    {
      link: "/dashboard/recipes",
      icon: "file-text",
      menu: "Recetas"
    }
  ]

  getUserInfo(){
    let userData: graphqlMutation<loginMutationResponse> = this._authService.getUserData();
    if(typeof userData === "object" && Object.keys(userData).length !== 0){
      this.user = userData['login'].user;
      this.idUser = this.user.idUsuario;
    } else {
      this.logout();
    }
  }

  gotToEdit(){
    this._router.navigate(
      ['/dashboard/users/user' , this.idUser]
    );
  }

  logout(){
    this._authService.logout();
  }
}
