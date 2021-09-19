import { adapter, LayoutState } from './layout.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const layoutFeatureKey = 'layout';

export const selectLayoutFeature = createFeatureSelector<LayoutState>(layoutFeatureKey);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectLayoutFeature);

export const selectStateMenuMobileActive = createSelector(
  selectLayoutFeature,
  ({ isActiveMenuMobile }) => isActiveMenuMobile
);

export const selectStateMenuDesktopInactive = createSelector(
  selectLayoutFeature,
  ({ isInactiveMenuDesktop }) => isInactiveMenuDesktop
);

export const selectStateLoadingMenu = createSelector(
  selectLayoutFeature,
  ({ loading }) => loading
);
