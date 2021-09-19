import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {NavItem} from './model';
import {Router} from '@angular/router';

@Component({
  selector: 'hsc-nav-item',
  templateUrl: './nav-item.component.html',
  animations: [
    trigger('children', [
      state('void', style({
        height: '0px'
      })),
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavItemComponent implements OnInit {

  @HostBinding('class.active-menuitem') active = false;

  @Input() item: NavItem = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.item.routerLink) {
      if (this.item.isHasChildren) {
        this.active = this.router.isActive(this.item.routerLink, {paths: 'subset', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'});
      } else {
        this.active = this.router.isActive(this.item.routerLink, {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'});
      }
    }
  }

  doItemClick(evt: MouseEvent): void {
    if (this.item.disabled) {
      evt.preventDefault();
    } else if (this.item.isHasChildren) {
      this.active = !this.active;
    } else {
      this.active = true;
    }
  }

}
