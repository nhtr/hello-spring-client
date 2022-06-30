import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list/role-list.component';
import {RouterModule} from '@angular/router';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import { FeatureListComponent } from './feature-list/feature-list.component';
import { RoleManagementComponent } from './role-management.component';
import {DividerModule} from 'primeng/divider';
import {ButtonModule} from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoleManagementComponent
      }
    ]),
    CardModule,
    TableModule,
    SkeletonModule,
    DividerModule,
    ButtonModule
  ],
  declarations: [
    RoleListComponent,
    FeatureListComponent,
    RoleManagementComponent
  ],
})
export class RoleManagementModule {}
