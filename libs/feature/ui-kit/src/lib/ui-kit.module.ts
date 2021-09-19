import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiInputComponent } from './ui-input/ui-input.component';
import { UiTableComponent } from './ui-table/ui-table.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [UiTableComponent, UiInputComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'ui-table',
        component: UiTableComponent
      },
      {
        path: 'ui-input',
        component: UiInputComponent
      }
    ]),
    CardModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule
  ]
})
export class UiKitModule {}
