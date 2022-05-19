import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthStore, LayoutFacade, ProfileStore} from "@hello-spring-client/data-access";
import {filter, take} from "rxjs/operators";
import {MenuItem} from "primeng/api";
import {Observable} from "rxjs";
import {UserProfile} from "@hello-spring-client/data-generated";

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
  isLoggedIn$ = this.auth.loggedIn$;
  profileVm$: Observable<{ isLoading: boolean, isLoaded: boolean, profile?: UserProfile }> = this.profileStore.vm$;
  userItems: MenuItem[];

  constructor(
    private auth: AuthStore,
    private facade: LayoutFacade,
    private profileStore: ProfileStore
  ) {
    this.userItems = [
      {label: 'User Information'},
      {label: 'Logout', command: () => this.logout()}
    ];
  }

  ngOnInit(): void {
    this.auth.login();
    this.auth.tokenReceived$.pipe(
      filter((token) => !!token),
      take(1)
    ).subscribe(() => {
      this.facade.loadMenu();
      this.profileStore.loadProfile();
    });
  }

  logout() {
    this.profileStore.profile$.pipe(
      take(1)
    ).subscribe((profile) => {
      this.facade.loadGuestMenu();
      this.auth.logout({ username: profile.id });
    });
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

  login() {
    this.auth.login();
  }
}
