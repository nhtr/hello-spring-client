import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import {Route, RouterModule} from "@angular/router";

export const publicRoutes: Route[] = [
  {
    path: 'not-found',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(publicRoutes)
  ],
  declarations: [
    NotFoundComponent
  ],
})
export class PublicModule {}
