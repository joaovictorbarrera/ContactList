import { Component, signal } from '@angular/core';
import { PhoneComponent } from './components/phone/phone.component';

@Component({
  selector: 'app-root',
  imports: [PhoneComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
