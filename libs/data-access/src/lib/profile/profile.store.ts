import {Injectable} from "@angular/core";
import {ApiStatusEnum} from "../model";
import {ProfileService, UserProfile} from "@hello-spring-client/data-generated";
import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {map, switchMapTo, tap} from "rxjs/operators";

export interface ProfileState {
  apiStatus: ApiStatusEnum,
  profile: UserProfile
}

@Injectable({providedIn: 'root'})
export class ProfileStore extends ComponentStore<ProfileState> {

  constructor(private profileService: ProfileService) {
    super(<ProfileState> {
      apiStatus: ApiStatusEnum.INIT
    });
  }

  readonly isLoading$ = this.select(state => state.apiStatus === ApiStatusEnum.LOADING);
  readonly isLoaded$ = this.select(state => state.apiStatus === ApiStatusEnum.LOADED);
  readonly profile$ = this.select(state => state.profile);
  readonly vm$ = this.select(
    this.isLoading$,
    this.isLoaded$,
    this.profile$,
    (isLoading, isLoaded, profile) => ({isLoading, isLoaded, profile})
  );

  readonly loadProfile = this.effect((trigger$) => trigger$.pipe(
    tap(() => this.patchState({ apiStatus: ApiStatusEnum.LOADING })),
    switchMapTo(this.profileService.getUserProfile().pipe(
      map((response) => response.context)
    )),
    tapResponse((response) => {
      this.patchState({ apiStatus: ApiStatusEnum.LOADED, profile: response });
    }, err => {
      console.error(err);
      this.patchState({ apiStatus: ApiStatusEnum.FAILED });
    })
  ));
}
