import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Comida } from 'src/app/models/comida.model';
@Component({
  selector: 'app-plan-alimenticio-modal',
  templateUrl: './plan-alimenticio-modal.component.html',
  styleUrls: ['./plan-alimenticio-modal.component.scss'],
})
export class PlanAlimenticioModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PlanAlimenticioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comida[]
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'idReceta',
    'planAlimenticio',
    'usuarios',
    'creadoEn',
    'acciones',
  ];

  async populateTable() {
    const tableDataSource = new MatTableDataSource<Comida>(this.data);
    tableDataSource.paginator = this.paginator;
    tableDataSource.sort = this.sort;
  }
}
