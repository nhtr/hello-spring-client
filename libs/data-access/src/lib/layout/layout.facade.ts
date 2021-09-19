import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as LayoutActions from './layout.action';
import * as fromLayout from './layout.selector';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  navItems$ = this.store.pipe(select(fromLayout.selectAll));
  isMenuDesktopInactive$ = this.store.pipe(select(fromLayout.selectStateMenuDesktopInactive));
  isMenuMobileActive$ = this.store.pipe(select(fromLayout.selectStateMenuMobileActive));
  isLoadingMenu$ = this.store.pipe(select(fromLayout.selectStateLoadingMenu));
  constructor(private store: Store) {
  }

  loadMenu(): void {
    this.store.dispatch(LayoutActions.loadMenu());
  }

  layoutClick(): void {
    this.store.dispatch(LayoutActions.layoutClick());
  }

  menuClick(): void {
    this.store.dispatch(LayoutActions.menuCLick());
  }

  toggleMenu(isDesktop: boolean): void {
    this.store.dispatch(LayoutActions.toggleMenu({ isDesktop }));
  }

}
