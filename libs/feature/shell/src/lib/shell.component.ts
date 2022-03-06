import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthStore, LayoutFacade} from "@hello-spring-client/data-access";
import {filter, take, tap} from "rxjs/operators";

@Component({
  selector: 'hsc-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit {

  navList$ = this.facade.navItems$;
  staticMenuDesktopInactive$ = this.facade.isMenuDesktopInactive$;
  staticMenuMobileActive$ = this.facade.isMenuMobileActive$;
  isLoadingMenu$ = this.facade.isLoadingMenu$;

  constructor(
    private auth: AuthStore,
    private facade: LayoutFacade
  ) {}

  ngOnInit(): void {
    this.auth.login();
    this.auth.tokenReceived$.pipe(
      filter((token) => !!token),
      take(1),
      tap(() => this.facade.loadMenu())
    ).subscribe();
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
