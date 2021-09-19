import {Action, createReducer, on} from '@ngrx/store';
import { adapter, initialState, LayoutState } from './layout.state';
import * as LayoutActions from './layout.action';

export const reducer = createReducer(
  initialState,
  on(LayoutActions.loadMenu, (state) => ({
    ...adapter.setAll([
      {id: '1', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/'},
      {
        id: '2', label: 'UI Kit', icon: 'pi pi-fw pi-star', routerLink: '/ui-kit', isHasChildren: true,
        items: [
          {id: '3', label: 'Ui-Table', icon: 'pi pi-fw pi-id-card', routerLink: '/ui-kit/ui-table'},
          {id: '4', label: 'Ui-Input', icon: 'pi pi-fw pi-check-square', routerLink: '/ui-kit/ui-input'}
        ]
      },
      {
        id: '5', label: 'Knowledge', icon: 'pi pi-fw pi-search', routerLink: '/knowledge', isHasChildren: false,
      }
    ], state),
    loaded: true,
    loggedIn: true,
    isInactiveMenuDesktop: false
  })),
  on(LayoutActions.loadGuestMenu, (state) => ({
    ...adapter.setAll([
      {id: '1', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/'}
    ], state),
    loaded: true,
    loggedIn: false,
    isInactiveMenuDesktop: true
  })),
  on(LayoutActions.layoutClick, (state) => ({
    ...state,
    isActiveMenuMobile: (!state.menuClick && state.isActiveMenuMobile) ? false : state.isActiveMenuMobile,
    menuClick: false
  })),
  on(LayoutActions.toggleMenu, (state, { isDesktop }) => ({
    ...state,
    menuClick: true,
    isInactiveMenuDesktop: isDesktop ? !state.isInactiveMenuDesktop : state.isInactiveMenuDesktop,
    isActiveMenuMobile: isDesktop ? state.isActiveMenuMobile : !state.isActiveMenuMobile
  })),
  on(LayoutActions.menuCLick, (state) => ({
    ...state,
    menuClick: true
  }))
);

export const layoutReducer = (state: LayoutState | undefined, action: Action): LayoutState => {
  try {
    return reducer(state, action);
  } catch (error) {
    console.error(error);
    return initialState;
  }
};
