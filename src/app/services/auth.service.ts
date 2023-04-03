import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { loginMutationResponse } from '../models/login';
import { Router } from '@angular/router';
import { logoutMutationResponse } from '../models/logout';

type graphqlMutation<T> = Record<string, T>;
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{

  constructor(
    private apollo: Apollo,
    private _router: Router
    ) {}

  ngOnDestroy(): void {
  }

  login(username: string, password: string){
    return this.apollo.mutate({
      mutation: gql`
      mutation login($login: LoginInput!)
      {
        login(loginInput: $login)
        {
          access_token
          refresh_token
          user {
            idUsuario
            nombre
            apellido
            username
            correo
          }
        }
      }
    `,
      variables: {
        "login": {
          "password": password,
          "username": username
        }
      }
    });
  }

  logout() {
    let userData:graphqlMutation<loginMutationResponse> = this.getUserData();
    if(Object.keys(userData).length !== 0){
      let idUsuario = JSON.parse(JSON.stringify(userData["login"].user.idUsuario));
      return this.apollo.mutate({
        mutation: gql`
          mutation logout($idUsuario: Float!){
            logout(idUsuario: $idUsuario){
              success
            }
          }
        `,
        variables: {
          "idUsuario": idUsuario
        }
      }).subscribe(
        (result: MutationResult) => {
          const mutation: graphqlMutation<logoutMutationResponse> = result.data;
          const mutationResponse = mutation["logout"];
          if(mutationResponse !== undefined){
            if(mutationResponse.success){
              this.removeSession();
            }
          }
        },
        (error) => {
          this.removeSession();
          throw new Error(error);
        }
      );
    } else {
      return this.removeSession();
    }
  }

  refreshToken(idUser: Number){
    return this.apollo.mutate({
      mutation: gql`
        mutation refresh($refreshInput: RefreshInput!){
          refresh(refreshInput: $refreshInput){
            access_token,
            refresh_token,
            user {
              idUsuario
            }
          }
        }
      `,
      variables: {
        'refreshInput': {
          idUsuario: idUser
        }
      }
    });
  }

  saveSession(accessToken: string, refreshToken: string, user: string){
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', user);
  }

  removeSession(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    this._router.navigateByUrl('login');
  }

  getUserData(): graphqlMutation<loginMutationResponse>{
    let loginData: graphqlMutation<loginMutationResponse> = {};
    if(
        typeof localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== null &&
        typeof localStorage.getItem('refreshToken') !== undefined && localStorage.getItem('refreshToken') !== null &&
        typeof localStorage.getItem('userInfo') !== undefined && localStorage.getItem('userInfo') !== null
      )
    {
      let userData: any = localStorage.getItem('userInfo');
      let accessToken: string = JSON.stringify(localStorage.getItem('accessToken'));
      let refreshToken: string = JSON.stringify(localStorage.getItem('refreshToken'));
      if(userData !== null && accessToken !== null && refreshToken !== null){
        loginData = {
          login: {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: JSON.parse(userData)
          }
        };
      }
    }
    return loginData;
  }

  async autoLogin(): Promise<boolean>{
    let userData: graphqlMutation<loginMutationResponse> = this.getUserData();
    if (typeof userData === "object" && Object.keys(userData).length !== 0){
      return true;
    }
    return false;
  }
}
