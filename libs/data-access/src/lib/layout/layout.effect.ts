import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {FeatureGroupDto, FeatureService, GroupMenuDto} from "@hello-spring-client/data-generated";
import * as LayoutAction from './layout.action';
import {delay, map, switchMap} from "rxjs/operators";
import { NavItem } from "@hello-spring-client/shared/ui/nav-item";

@Injectable()
export class LayoutEffect {
  loadMenu$ = createEffect(() => this.action$.pipe(
    ofType(LayoutAction.loadMenu),
    switchMap(() => this.featureService.getMenu().pipe(
      delay(1000),
      map((res) => {
        const groupArr: GroupMenuDto[] = [];
        const featureHaveGroup: FeatureGroupDto[] = [];
        const featureHaveNotGroup: FeatureGroupDto[] = [];
        const menu: NavItem[] = [];
        if (res.context && Array.isArray(res.context)) {
          for (let i = 0; i < res.context.length; i++) {
            const item = res.context[i];
            if (item.groupMenu) {
              if (groupArr.findIndex((gr) => gr.id === item.groupMenu?.id) === -1) {
                groupArr.push(item.groupMenu);
                menu.push(this.groupToNav(item.groupMenu));
              }
              featureHaveGroup.push(item);
            } else {
              featureHaveNotGroup.push(item);
            }
          }

          for (let i = 0; i < groupArr.length; i++) {
            const item = groupArr[i];
            menu[i].items = featureHaveGroup
              .filter(x => x.groupMenu?.id === item.id && x.showInMenu)
              .map(x => this.featureToNav(x));
          }

          for (let i = 0; i < featureHaveNotGroup.length; i++) {
            menu.push(this.featureToNav(featureHaveNotGroup[i]));
          }
        }
        return LayoutAction.loadMenuSuccess({menu});
      })
    ))
  ));

  constructor(
    private action$: Actions,
    private featureService: FeatureService
  ) {}

  featureToNav(feature: FeatureGroupDto, children?: NavItem[]): NavItem {
    return {
      id: `feature${feature.id}`,
      label: feature.label,
      icon: feature.icon,
      routerLink: feature.routerLink,
      isHasChildren: feature.hasChildren,
      items: children
    }
  }

  groupToNav(group: GroupMenuDto) {
    return {
      id: `group${group.id}`,
      label: group.label,
      icon: group.icon,
      routerLink: undefined,
      isHasChildren: true,
      items: []
    }
  }
}

