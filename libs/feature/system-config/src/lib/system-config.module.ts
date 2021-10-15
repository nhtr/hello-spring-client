import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { SystemConfigComponent } from './system-config.component';
import {CardModule} from "primeng/card";

export const systemConfigRoutes: Route[] = [
  {
    path: '',
    component: SystemConfigComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(systemConfigRoutes),
    CardModule
  ],
  declarations: [
    SystemConfigComponent
  ]
})
export class SystemConfigModule {}
