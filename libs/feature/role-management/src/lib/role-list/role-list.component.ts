import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {RoleDto} from '@hello-spring-client/data-generated';

@Component({
  selector: 'hsc-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {

  @Input() isLoading = false;
  @Input() roles: RoleDto[] = [];
  @Output() viewFeatureInRole: EventEmitter<string> = new EventEmitter<string>();
  @Output() editFeatureInRole: EventEmitter<string> = new EventEmitter<string>();

  doViewFeatures(id: string) {
    this.viewFeatureInRole.emit(id);
  }

  doEdit(id: string) {
    this.editFeatureInRole.emit(id);
  }
}
