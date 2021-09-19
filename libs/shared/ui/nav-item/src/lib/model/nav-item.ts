export interface NavItem {
  id?: string;
  label?: string;
  icon?: string;
  routerLink?: string;
  disabled?: boolean;
  items?: NavItem[];
  isHasChildren?: boolean;
}
