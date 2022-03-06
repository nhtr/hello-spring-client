import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'hsc-ui-table',
  templateUrl: './ui-table.component.html',
  styleUrls: ['./ui-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTableComponent {

  products = [
    {code: '001', name: 'Laptop Dell Po 2010', category: 'Laptop', quantity: 5},
    {code: '002', name: 'Macbook Pro 2021', category: 'Laptop', quantity: 2},
    {code: '003', name: 'Iphone 15 Pro Max', category: 'Mobile', quantity: 5},
    {code: '004', name: 'Samsung galaxy S21', category: 'Mobile', quantity: 2},
    {code: '005', name: 'Laptop Asus Max 4', category: 'Laptop', quantity: 45},
    {code: '006', name: 'Macbook Air 2021', category: 'Laptop', quantity: 2},
    {code: '007', name: 'Iphone 10 Gold', category: 'Mobile', quantity: 15},
    {code: '008', name: 'Samsung galaxy A7 2018', category: 'Mobile', quantity: 2}
  ];

}
