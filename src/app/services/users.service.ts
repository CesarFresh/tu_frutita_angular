import { Injectable } from '@angular/core';
import {Apollo, gql, MutationResult} from 'apollo-angular';
import { loginMutationResponse } from '../models/login';
import { user } from '../models/users';
import { AuthService } from './auth.service';
import { AlertsService } from 'src/app/services/alerts.service';

type graphqlMutation<T> = Record<string, T>;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  options = {
    autoClose: true,
    keepAfterRouteChange: true
  };

  constructor(
    private apollo: Apollo,
    private _authService: AuthService,
    private alertsService: AlertsService,
  ) { }

  getUser(id: Number){
    return this.apollo.watchQuery({
      query: gql`
        query user($id: Int!) {
          user(id: $id){
            activo
            apellido
            correo
            creadoEn
            idUsuario
            modificadoEn
            nombre
            username
          }
        }
      `,
      variables: {
        "id": id
      }
    });
  }

  getUsers(){
    return this.apollo.watchQuery({
      query: gql`
        query users {
          users {
            activo
            apellido
            correo
            creadoEn
            idUsuario
            modificadoEn
            nombre
            username
          }
        }`,
      variables: {

      }
    });
  }

  signUp(user: user){
    return this.apollo.mutate({
      mutation: gql`
        mutation singup($singupInput: CreateUserInput!)
          {
            singup(createUserInput: $singupInput)
            {
              idUsuario,
              nombre,
              apellido,
              correo,
              username,
              activo
            }
          }
      `,
      variables: {
        "singupInput": user
      }
    }).subscribe(
      (data: MutationResult) => {
        const mutation: graphqlMutation<user> = data.data;
        const user: user = mutation["singup"];
        this.alertsService.success("Usuario creado exitosamente!", this.options);
      },
      (error: any) => {
        let stringError: any = JSON.parse(JSON.stringify(error));
        this.alertsService.error(stringError.message, this.options);
      }
    );
  }

  updateUser(user: user){
    return this.apollo.mutate({
      mutation: gql`
        mutation updateUser($updateUserInput: UpdateUserInput!)
        {
          updateUser(updateUserInput: $updateUserInput){
            activo
            apellido
            correo
            idUsuario
            nombre
            username
          }
        }
      `,
      variables: {
        'updateUserInput': user
      }
    }).subscribe(
      (data: MutationResult) => {
        const mutation: graphqlMutation<user> = data.data;
        const user: user = mutation["updateUser"];
        this.alertsService.success("Usuario actualizado exitosamente!", this.options);
      },
      (error: any) => {
        let stringError: any = JSON.parse(JSON.stringify(error));
        this.alertsService.error(stringError.message, this.options);
      }
    );
  }

  removeUser(id: Number){
    return this.apollo.mutate({
      mutation: gql`
        mutation removeUser($id: Int!){
          removeUser(id: $id){
            idUsuario
            activo
          }
        }
      `,
      variables: {
        'id' : id
      }
    }).subscribe(
      (data: MutationResult) => {
        const mutation: graphqlMutation<user> = data.data;
        const user: user = mutation["removeUser"];
        this.alertsService.success("Usuario eliminado exitosamente!");
      },
      (error) => {
        let stringError: any = JSON.parse(JSON.stringify(error));
        this.alertsService.warn(stringError.message);
      }
    )
  }

  isTheSameUser(idUser: Number): boolean{
    let userData: graphqlMutation<loginMutationResponse> = this._authService.getUserData();
    let currentIdUser: any = userData["login"].user.idUsuario;
    if(typeof currentIdUser !== undefined){
      currentIdUser = parseInt(currentIdUser);
      if(currentIdUser === idUser) return true;
    }
    return false;
  }

}
