import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-contact-form.component.html',
  styleUrl: './add-contact-form.component.scss'
})
export class AddContactFormComponent {
  // events
  cancel = output<void>();
  save = output<{ name: string; phone: string; email?: string }>();

  protected contact: { name: string; phone: string; email?: string } = { name: '', phone: '', email: '' };

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected onSave(): void {
    const name = this.contact.name?.trim();
    const phone = this.contact.phone?.trim();
    const email = this.contact.email?.trim();

    if (!name || !phone) {
      alert('Please provide both name and phone number.');
      return;
    }

    this.save.emit({ name, phone, email: email || undefined });
  }
}
