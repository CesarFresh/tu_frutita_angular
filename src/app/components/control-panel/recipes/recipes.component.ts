import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Comida } from 'src/app/models/comida.model';
import { Recipe } from 'src/app/models/recipes.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { RecipesService } from 'src/app/services/recipes.service';
import { PlanAlimenticioModalComponent } from './modals/plan-alimenticio-modal.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  displayedColumns: string[] = [
    'idReceta',
    'planAlimenticio',
    'usuarios',
    'creadoEn',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Recipe>();
  searchInput: string = '';
  idUser: any = 0;
  options = {
    autoClose: false,
    keepAfterRouteChange: true,
  };
  hasError: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('inputSearch') userInput!: ElementRef;

  loading: boolean = false;

  constructor(
    private recipesService: RecipesService,
    private _router: Router,
    private _authService: AuthService,
    private alertsService: AlertsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getRecipes();
  }

  applyFilter() {
    this.dataSource.filter = this.searchInput.trim().toLowerCase();
  }

  getCurrentUser() {
    let userData = this._authService.getUserData();
    let idUsuario = userData['login'].user.idUsuario;
    this.idUser = idUsuario;
  }

  async getRecipes() {
    try {
      const data = (await this.recipesService.getRecipes()).data.recetas;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      this.handleGraphQLError(error);
    }
  }

  handleGraphQLError(error: unknown) {
    this.dataSource = new MatTableDataSource();
    let stringError: any = JSON.parse(JSON.stringify(error));
    this.alertsService.warn(stringError.message, this.options);
    let isUnauth: boolean = false;
    this.hasError = true;
    for (const key in stringError.graphQLErrors) {
      if (stringError.graphQLErrors[key].message === 'Unauthorized') {
        isUnauth = true;
        break;
      }
    }
    if (isUnauth) {
      this._authService.logout();
    }
  }

  deleteUser(idUser: Number) {
    this.recipesService.removeUser(idUser);
  }

  openPlanAlimenticio(data: Comida[]): void {
    console.log(data);
    this.dialog.open(PlanAlimenticioModalComponent, {
      width: '60%',
      height: '60%',
      data: data
    });
  }

  goToEdit(idUser: number) {
    this._router.navigate(['/dashboard/users/user', idUser]);
  }

  goToCreate() {
    this._router.navigate(['/dashboard/users/user']);
  }
}
