import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import {NavItemModule} from "@hello-spring-client/shared/ui/nav-item";

@NgModule({
  imports: [CommonModule, NavItemModule],
  declarations: [
    NavBarComponent
  ],
  exports: [NavBarComponent]
})
export class NavBarModule {}
