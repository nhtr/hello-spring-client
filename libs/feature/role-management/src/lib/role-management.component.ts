import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {RoleStore} from '@hello-spring-client/data-access';

@Component({
  selector: 'hsc-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  vm$ = this.roleStore.vm$;
  constructor(private roleStore: RoleStore) {
  }

  ngOnInit(): void {
    this.roleStore.loadRoles();
  }

  ngOnDestroy() {
    this.roleStore.clearData();
  }

  showFeatureInRole(roleId: string) {
    this.roleStore.loadFeaturesInRole(roleId);
  }

  doEditFeatureInRole(roleId: string) {
    this.roleStore.loadFeaturesInRole(roleId);
  }
}
