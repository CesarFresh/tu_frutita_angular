import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { user } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { loginMutationResponse } from 'src/app/models/login';

type graphqlMutation<T> = Record<string, T>;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  idUser: any;
  user: user = {
    nombre : "",
    apellido : "",
    password: ""
  };
  actionName: string = "Nuevo";
  password: string = "";
  password1: string = "";
  userForm!: FormGroup;
  canDelete: boolean = false;
  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private _userService: UsersService,
    private _authService: AuthService,
    private _router: Router,
  ) { 
  }

  ngOnInit(): void {
    this.getUser();
    this.validateFields();
    this.isTheSameUser();
  }

  ngOnDestroy(): void {
  }

  isTheSameUser(){
    let flag: boolean = this._userService.isTheSameUser(this.idUser);
    this.canDelete =  flag;
  }

  validateFields(){
    let validators = {
      nombre: new FormControl(this.user.nombre,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(3),
          Validators.pattern("^([a-zA-Z])+$")
        ]
      ),
      apellido: new FormControl(this.user.apellido,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(3),
          Validators.pattern("^([a-zA-Z])+$")
        ]
      )
    };
    if(this.actionName === 'Nuevo'){
      let extraValidators = {
        username: new FormControl(this.user.username,
          [
            Validators.required,
            Validators.maxLength(15),
            Validators.minLength(3),
            Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9._'\-])+$")
          ]
        ),
        correo: new FormControl(this.user.correo,
          [
            Validators.required,
            Validators.maxLength(45),
            Validators.minLength(5),
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ]
        ),
        password: new FormControl('',
          [
            Validators.required,
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"),
          ]
        ),
        password1: new FormControl('',
          [
            Validators.required,
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"),
          ]
        )
      }
      validators =  { ...validators, ...extraValidators };
    }
    this.userForm = new FormGroup(validators);
  }

  getSessionUser(){
    let idUser: any = 0;
    let userData: graphqlMutation<loginMutationResponse> = this._authService.getUserData();
    if(typeof userData === "object" && Object.keys(userData).length !== 0){
      let idUsuario = userData["login"].user.idUsuario;
      idUser = idUsuario;
    }

    return idUser;
  }
  
  getUser(){
    this.idUser = this.activatedRoute.snapshot.paramMap.get("user");
    if(this.idUser !== null && typeof this.idUser !== "object" && typeof this.idUser !== undefined){
      this.actionName = "Actualizar";
      if(typeof this.idUser === "string") {
        this.idUser = parseInt(this.idUser);
      }
      this._userService.getUser(this.idUser).valueChanges.subscribe(
        (data: MutationResult) => {
          const query: graphqlMutation<user> = data.data;
          this.user = query["user"];
          this.validateFields();
        },
        (error: any) => {
          let stringError: any = JSON.parse(JSON.stringify(error));
          let isUnauth: boolean = false;
          for (const key in stringError.graphQLErrors) {
            if(stringError.graphQLErrors[key].message === "Unauthorized"){
              isUnauth = true;
              break;
            }
          }
          if(isUnauth) this._authService.logout();
        }
      );
    }
  }

  back(){
    location.href = '/dashboard/users';
  }

  hasError = (controlName: string, errorName: string) =>{
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void{
    if(this.password === this.password1){
      if(this.userForm.valid){
        if(this.userForm.value.password1 !== undefined) delete this.userForm.value.password1;
        this.user = this.userForm.value;
        if(this.actionName === "Actualizar"){
          this.user.idUsuario = this.idUser;
          this.updateUser(this.user).then(
            (result) => {
              this.validateFields();
            }
          );
        } 
        else if(this.actionName === "Nuevo") {
          this.signUp(this.user).then(
            (result) => {
              this._router.navigate(['/dashboard/users/user',this.user.idUsuario]);
            }
          );
        }
      }
    } else {
      this._authService.logout();
    }
  }

  async updateUser(user: user){
    return this._userService.updateUser(user);
  }

  async signUp(user: user){
    return this._userService.signUp(user);
  }

  deleteUser(idUser: Number){
    this._userService.removeUser(idUser);
  }
}
