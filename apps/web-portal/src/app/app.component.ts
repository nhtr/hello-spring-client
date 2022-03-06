import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'hsc-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'web-portal';
}
