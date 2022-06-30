import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FeatureDto} from '@hello-spring-client/data-generated';

@Component({
  selector: 'hsc-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent {
  @Input() isLoading = false;
  @Input() features: FeatureDto[] = [];

}
