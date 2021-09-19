import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NavItem} from "@hello-spring-client/shared/ui/nav-item";

@Component({
  selector: 'hsc-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent  {

  @Input() items: NavItem[] | null = [];

}
