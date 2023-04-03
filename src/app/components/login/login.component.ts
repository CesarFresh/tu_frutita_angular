import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { loginMutationResponse } from 'src/app/models/login';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { Alert, AlertType } from 'src/app/models/alert';

type graphqlMutation<T> = Record<string, T>;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginValid: boolean = true;
  username: string = '';
  password: string = '';
  errors: Array<any> = [];
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private alertsService: AlertsService
  ) { 
  }

  ngOnInit(): void {
    let userData: graphqlMutation<loginMutationResponse> = this._authService.getUserData();
    if(typeof userData === "object" && Object.keys(userData).length !== 0){
      this._router.navigateByUrl('dashboard');
    } else {
      this._authService.logout();
    }
  }

  ngOnDestroy(): void {
    this.loginValid = false;
    this.errors = [];
    this.alertsService.clear();
  }

  onSubmit(): void {
    this.errors = [];
    this._authService.login(this.username, this.password)
      .subscribe(
        (result: MutationResult) => {
          const mutation: graphqlMutation<loginMutationResponse> = result.data;
          const mutationResponse = mutation["login"];
          if(mutationResponse !== undefined){
            let accessToken = mutationResponse.access_token;
            let refreshToken = mutationResponse.refresh_token;
            let user = JSON.stringify(mutationResponse.user);
            this._authService.saveSession(accessToken, refreshToken, user);
            this.loginValid = true;
            this._router.navigateByUrl('dashboard');
          } else {
            this.alertsService.error("Hubo un error, contacta con el soperte tecnico", this.options);
            this.loginValid = false;
          }
        },
        (error: any) => {
          let stringError: any = JSON.parse(JSON.stringify(error));
          if(stringError.message){
            let message = stringError.message;
            this.alertsService.error(message, this.options);
          }
          this.loginValid = false;
        }
      )
  }
}
