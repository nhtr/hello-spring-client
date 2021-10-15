import {Action, createReducer, on} from '@ngrx/store';
import { adapter, initialState, LayoutState } from './layout.state';
import * as LayoutActions from './layout.action';

export const reducer = createReducer(
  initialState,
  on(LayoutActions.loadMenuSuccess, (state, {menu}) => ({
    ...adapter.setAll([
      {id: '1', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/'},
      ...menu
    ], state),
    loading: false,
    loggedIn: true,
    isInactiveMenuDesktop: false
  })),
  on(LayoutActions.loadGuestMenu, (state) => ({
    ...adapter.setAll([
      {id: '1', label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/'}
    ], state),
    loading: false,
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
