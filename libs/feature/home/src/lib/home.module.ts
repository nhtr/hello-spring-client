import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ]),
    CardModule,
    SkeletonModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {}
