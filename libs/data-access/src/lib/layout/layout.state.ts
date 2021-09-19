import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {NavItem} from '@hello-spring-client/shared/ui/nav-item';

export interface LayoutState extends EntityState<NavItem> {
  loggedIn: boolean;
  loading: boolean;
  isInactiveMenuDesktop: boolean;
  isActiveMenuMobile: boolean;
  menuClick: boolean;
}

export const adapter = createEntityAdapter<NavItem>();

export const initialState: LayoutState = adapter.getInitialState({
  loggedIn: false,
  loading: true,
  isInactiveMenuDesktop: false,
  isActiveMenuMobile: false,
  menuClick: false
});
