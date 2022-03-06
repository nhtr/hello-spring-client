import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'hsc-ui-input',
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiInputComponent {

  profileForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    birthDay: new FormControl(''),
    gender: new FormControl('M'),
    company: new FormControl(''),
    position: new FormControl(''),
    address: new FormControl()
  });

}
