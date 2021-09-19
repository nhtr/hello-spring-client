import { Component, OnInit } from '@angular/core';
import {LayoutFacade} from "@hello-spring-client/data-access";

@Component({
  selector: 'hsc-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  navList$ = this.facade.navItems$;
  staticMenuDesktopInactive$ = this.facade.isMenuDesktopInactive$;
  staticMenuMobileActive$ = this.facade.isMenuMobileActive$;
  isLoadingMenu$ = this.facade.isLoadingMenu$;

  constructor(
    private facade: LayoutFacade
  ) {}

  ngOnInit(): void {
    this.facade.loadMenu();
  }

  doLayoutClick(): void {
    this.facade.layoutClick();
  }

  doToggleMenuLeft(evt: MouseEvent): void {
    this.facade.toggleMenu(this.isDesktop());
    evt.preventDefault();
  }

  doMenuClick(): void {
    this.facade.menuClick();
  }

  isDesktop(): boolean {
    return window.innerWidth >= 768;
  }

}
