import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {FeatureDto, FeatureService} from "@hello-spring-client/data-generated";
import * as LayoutAction from './layout.action';
import {delay, map, switchMap} from "rxjs/operators";
import { NavItem } from "@hello-spring-client/shared/ui/nav-item";

@Injectable()
export class LayoutEffect {
  loadMenu$ = createEffect(() => this.action$.pipe(
    ofType(LayoutAction.loadMenu),
    switchMap(() => this.featureService.getFeatures().pipe(
      delay(1000),
      map((res) => {
        const menu: NavItem[] = [];
        if (res.context && Array.isArray(res.context)) {
          const cloneFeature = [...res.context];
          let removedCount = 0;
          for (let i = 0; i < res.context.length; i++) {
            const item = res.context[i];
            if (item.showInMenu && item.parent === 0) {
              cloneFeature.splice(i - removedCount, 1);
              removedCount++;
              if (item.hasChildren) {
                const children = cloneFeature.filter(x => x.parent === item.id).map(x => this.featureToNav(x));
                menu.push(this.featureToNav(item, children));
              } else {
                menu.push(this.featureToNav(item));
              }
            }
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

  featureToNav(feature: FeatureDto, children?: NavItem[]): NavItem {
    return {
      id: `${feature.id}`,
      label: feature.label,
      icon: feature.icon,
      routerLink: feature.routerLink,
      isHasChildren: feature.hasChildren,
      items: children
    }
  }
}

