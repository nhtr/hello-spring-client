import {Injectable} from '@angular/core';
import {FeatureDto, FeatureService, RoleDto, RoleService} from '@hello-spring-client/data-generated';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {delay, filter, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {takeAfterLoggedIn} from '@hello-spring-client/util/custom-operators';
import {ApiStatusEnum} from '../model';
import {AuthStore} from '../auth';
import {Observable} from 'rxjs';

export interface RoleState {
  apiStatus: ApiStatusEnum;
  roles: RoleDto[];
  featureApiStatus: ApiStatusEnum;
  featuresInRole: FeatureDto[];
  selectedRoleId: string;
  mode: 'view' | 'edit';
}

@Injectable({providedIn: 'root'})
export class RoleStore extends ComponentStore<RoleState> {

  constructor(
    private roleService: RoleService,
    private authStore: AuthStore,
    private featureService: FeatureService
  ) {
    super(<RoleState>{
      apiStatus: ApiStatusEnum.INIT,
      featureApiStatus: ApiStatusEnum.INIT,
      roles: [],
      featuresInRole: [],
      selectedRoleId: '',
      mode: 'view'
    });
  }

  readonly apiStatus$ = this.select((state) => state.apiStatus);
  readonly roles$ = this.select((state) => state.roles);
  readonly featureApiStatus$ = this.select((state) => state.featureApiStatus);
  readonly features$ = this.select((state) => state.featuresInRole);
  readonly selectedRoleId$ = this.select((state) => state.selectedRoleId);
  readonly mode$ = this.select((state) => state.mode);
  readonly vm$ = this.select(
    this.apiStatus$,
    this.roles$,
    this.featureApiStatus$,
    this.features$,
    (apiStatus, roles, featureApiStatus, features) => ({
      isLoading: apiStatus === ApiStatusEnum.LOADING,
      isFailure: apiStatus === ApiStatusEnum.FAILED,
      isLoaded: apiStatus === ApiStatusEnum.LOADED,
      roles,
      isFeatureLoading: featureApiStatus === ApiStatusEnum.LOADING,
      isFeatureFailure: featureApiStatus === ApiStatusEnum.FAILED,
      isFeatureLoaded: featureApiStatus === ApiStatusEnum.LOADED,
      features
    })
  );

  readonly loadRoles = this.effect(trigger$ => trigger$.pipe(
    tap(() => this.patchState({apiStatus: ApiStatusEnum.LOADING})),
    delay(500),
    switchMap(() => this.roleService.getRoles().pipe(
      takeAfterLoggedIn(this.authStore.tokenReceived$),
      map((response) => response.context)
    )),
    tapResponse((response) => {
      this.patchState({apiStatus: ApiStatusEnum.LOADED, roles: response});
    }, err => {
      console.error(err);
      this.patchState({apiStatus: ApiStatusEnum.FAILED});
    })
  ));

  readonly loadFeaturesInRole = this.effect((roleId$: Observable<string>) => roleId$.pipe(
    withLatestFrom(this.selectedRoleId$),
    filter(([roleId, selectedRoleId]) => roleId !== selectedRoleId),
    map(([roleId, _]) => roleId),
    tap((roleId) => this.patchState({selectedRoleId: roleId, featureApiStatus: ApiStatusEnum.LOADING, featuresInRole: []})),
    delay(500),
    switchMap((roleId) => this.featureService.getFeatureByRole(roleId).pipe(
      tapResponse((response) => {
        this.patchState({ featureApiStatus: ApiStatusEnum.LOADED, featuresInRole: response.context });
      }, err => {
        console.error(err);
        this.patchState({ featureApiStatus: ApiStatusEnum.FAILED });
      })
    ))
  ));

  readonly clearData = this.updater(() => ({
    apiStatus: ApiStatusEnum.INIT,
    roles: [],
    featureApiStatus: ApiStatusEnum.INIT,
    featuresInRole: [],
    selectedRoleId: '',
    mode: 'view'
  }));
}

