import { RecipesComponent } from './components/control-panel/recipes/recipes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { UserComponent } from './components/control-panel/user/user.component';
import { UsersComponent } from './components/control-panel/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { AlertsComponent } from './flexy/components/alerts/alerts.component';
import { ButtonsComponent } from './flexy/components/buttons/buttons.component';
import { ChipsComponent } from './flexy/components/chips/chips.component';
import { ExpansionComponent } from './flexy/components/expansion/expansion.component';
import { FormsComponent } from './flexy/components/forms/forms.component';
import { GridListComponent } from './flexy/components/grid-list/grid-list.component';
import { MenuComponent } from './flexy/components/menu/menu.component';
import { ProgressSnipperComponent } from './flexy/components/progress-snipper/progress-snipper.component';
import { ProgressComponent } from './flexy/components/progress/progress.component';
import { SlideToggleComponent } from './flexy/components/slide-toggle/slide-toggle.component';
import { SliderComponent } from './flexy/components/slider/slider.component';
import { SnackbarComponent } from './flexy/components/snackbar/snackbar.component';
import { TabsComponent } from './flexy/components/tabs/tabs.component';
import { ToolbarComponent } from './flexy/components/toolbar/toolbar.component';
import { TooltipsComponent } from './flexy/components/tooltips/tooltips.component';
import { ProductComponent } from './flexy/dashboard/dashboard-components/product/product.component';
import { DashboardComponent } from './flexy/dashboard/dashboard.component';
import { FullComponent } from './flexy/layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';
import { DesignerGuard } from './guards/designer.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: ControlPanelComponent,
    canActivateChild: [AuthGuard],
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'users/user/:user', component: UserComponent},
      {path: 'users/user', component: UserComponent},
      {path: 'recipes', component: RecipesComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: "designer",
    component: FullComponent,
    canActivateChild: [AuthGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path:"home", component:DashboardComponent},
      {path:"alerts", component:AlertsComponent},
      {path:"forms", component:FormsComponent},
      {path:"table", component:ProductComponent},
      {path:"grid-list", component:GridListComponent},
      {path:"menu", component:MenuComponent},
      {path:"tabs", component:TabsComponent},
      {path:"expansion", component:ExpansionComponent},
      {path:"chips", component:ChipsComponent},
      {path:"progress", component:ProgressComponent},
      {path:"toolbar", component:ToolbarComponent},
      {path:"progress-snipper", component:ProgressSnipperComponent},
      {path:"snackbar", component:SnackbarComponent},
      {path:"slider", component:SliderComponent},
      {path:"slide-toggle", component:SlideToggleComponent},
      {path:"tooltip", component:TooltipsComponent},
      {path:"button", component:ButtonsComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    DesignerGuard
  ]
})
export class AppRoutingModule { }
