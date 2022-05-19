import {createAction, props} from '@ngrx/store';
import {NavItem} from "@hello-spring-client/shared/ui/nav-item";

export const loadMenu = createAction('[Layout] Load Menu');
export const loadMenuTransformed = createAction('[Layout] Load Menu Transformed');

export const loadMenuSuccess = createAction(
  '[Layout] Load Menu Success',
  props<{ menu: NavItem[]} >()
);

export const loadGuestMenu = createAction('[Layout] Load Guest Menu');

export const layoutClick = createAction('[Layout] Click');

export const toggleMenu = createAction(
  '[Layout] Toggle Menu',
  props<{ isDesktop: boolean }>()
);

export const menuCLick = createAction('[Layout] Menu Click');
