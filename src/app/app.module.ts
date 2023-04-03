import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache, ApolloLink} from '@apollo/client/core';

import { environment } from './../environments/environment';


// Modules
import { LoginComponent } from './components/login/login.component';
import { DemoFlexyModule } from './flexy/demo-flexy-module';
import { DashboardModule } from './flexy/dashboard/dashboard.module';
import { ComponentsModule } from './flexy/components/components.module';
import { FullComponent } from './flexy/layouts/full/full.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { setContext } from '@apollo/client/link/context';
import { UsersComponent } from './components/control-panel/users/users.component';
import { UserComponent } from './components/control-panel/user/user.component';
import { AlertsComponent } from './components/shared/alerts/alerts.component';
import { RecipesComponent } from './components/control-panel/recipes/recipes.component';
import { PlanAlimenticioModalComponent } from './components/control-panel/recipes/modals/plan-alimenticio-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    LoginComponent,
    ControlPanelComponent,
    UsersComponent,
    UserComponent,
    AlertsComponent,
    RecipesComponent,
    PlanAlimenticioModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    DashboardModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    ApolloModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const basic = setContext((operation, context) => ({
          headers: {
            Accept: 'charset=utf-8'
          }
        }));

        const auth = setContext((operation, context) => {
          const token = localStorage.getItem('accessToken');
          const refresh = localStorage.getItem('refreshToken');
          if (token === null) {
              return {};
          } else {
              return {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    refresh: refresh
                  }
              };
          }
        });

        const link = ApolloLink.from([basic, auth, httpLink.create(
          { uri:
            environment.backendUri
          }
        )]);
        const cache = new InMemoryCache();

        return {
          link,
          cache
        }
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
