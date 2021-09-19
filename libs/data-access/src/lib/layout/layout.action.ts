import {createAction, props} from '@ngrx/store';

export const loadMenu = createAction('[Layout] Load Menu');

export const loadGuestMenu = createAction('[Layout] Load Guest Menu');

export const layoutClick = createAction('[Layout] Click');

export const toggleMenu = createAction(
  '[Layout] Toggle Menu',
  props<{ isDesktop: boolean }>()
);

export const menuCLick = createAction('[Layout] Menu Click');
