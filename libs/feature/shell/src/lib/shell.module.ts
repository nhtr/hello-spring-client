import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { ShellComponent } from './shell.component';
import { HttpClientModule } from '@angular/common/http';
import {LayoutEffect, layoutFeatureKey, layoutReducer} from "@hello-spring-client/data-access";
import {NavBarModule} from "@hello-spring-client/shared/ui/nav-bar";
import {EffectsModule} from "@ngrx/effects";
import {SkeletonModule} from "primeng/skeleton";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";

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
      },
      {
        path: 'role',
        loadChildren: () => import('@hello-spring-client/feature/role-management').then(m => m.RoleManagementModule)
      },
      {
        path: 'system-config',
        loadChildren: () => import('@hello-spring-client/feature/system-config').then(m => m.SystemConfigModule)
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
    EffectsModule.forRoot([LayoutEffect]),
    HttpClientModule,
    SkeletonModule,
    ButtonModule,
    MenuModule
  ],
  declarations: [
    ShellComponent
  ],
  exports: [RouterModule]
})
export class ShellModule {}
