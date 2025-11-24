import { Component, input, output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contact = input.required<Contact>();
  deletionMode = input<boolean>(false);
  isSelected = input<boolean>(false);

  getInitial(): string {
    const name = this.contact().name.trim();
    return name.length > 0 ? name[0].toUpperCase() : '?';
  }
}

