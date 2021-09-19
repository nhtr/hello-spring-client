import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { ShellComponent } from './shell.component';
import { HttpClientModule } from '@angular/common/http';
import {layoutFeatureKey, layoutReducer} from "@hello-spring-client/data-access";
import {NavBarModule} from "@hello-spring-client/shared/ui/nav-bar";

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@hello-spring-client/feature/home').then(m => m.HomeModule)
      },
      {
        path: 'ui-kit',
        loadChildren: () => import('@hello-spring-client/feature/ui-kit').then(m => m.UiKitModule)
      },
      {
        path: 'knowledge',
        loadChildren: () => import('@hello-spring-client/feature/knowledge').then(m => m.KnowledgeModule)
      }
    ]
  },
  {
    path: 'public',
    loadChildren: () => import('@hello-spring-client/feature/public').then(m => m.PublicModule)
  },
  {
    path: '**',
    redirectTo: 'public/not-found'
  }
];

const rootReducers = {
  [layoutFeatureKey]: layoutReducer,
};

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(shellRoutes),
    NavBarModule,
    StoreModule.forRoot(rootReducers),
    HttpClientModule
  ],
  declarations: [
    ShellComponent
  ],
  exports: [RouterModule]
})
export class ShellModule {}
