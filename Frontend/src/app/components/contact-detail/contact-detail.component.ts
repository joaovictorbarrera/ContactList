import { Component, input, output, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {
  private readonly contactsService = inject(ContactsService);

  // Input contact is provided by the parent.
  contact = input.required<Contact | null>();

  // Output events: close the view, and updated contact after favorite toggle
  close = output<void>();
  updated = output<Contact|null>();

  // Editing state and local editable copy
  protected editing = false;
  protected newContactData: { name: string; phone: string; email?: string } = { name: '', phone: '', email: '' };

  protected getInitial(): string {
    const c = this.contact();
    if (!c || !c.name) return '?';
    const n = c.name.trim();
    return n.length > 0 ? n[0].toUpperCase() : '?';
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected toggleFavorite(): void {
    const c = this.contact();
    if (!c) return;

    const id = c.id;
    const newStar = !c.favorite;

    this.contactsService.favoriteContact(id, newStar).subscribe({
      next: (updated) => {
        // emit updated contact so parent can refresh its list and update state
        this.updated.emit(updated);
      },
      error: (error) => {
        console.error('Failed to toggle favorite:', error);
        alert('Failed to update favorite. Please try again.');
      }
    });
  }

  protected onEditToggle(): void {
    const current = this.contact();
    if (!this.editing) {
      // Enter edit mode: seed editable fields from current contact
      this.newContactData = { name: current?.name ?? '', phone: current?.phone ?? '', email: current?.email ?? '' };
      this.editing = true;
      return;
    }

    // Currently editing -> save
    if (!current) return;
    const id = current.id;
    const payload = {
        name: this.newContactData.name.trim(),
        phone: this.newContactData.phone.trim(),
        email: this.newContactData.email?.trim(),
        favorite: current.favorite
    };

    // Basic validation: require name and phone
    if (!payload.name || !payload.phone) {
      alert('Name and phone are required.');
      return;
    }

    this.contactsService.updateContact(id, payload).subscribe({
      next: (updated) => {
        // update local view and notify parent
        this.editing = false;
        this.updated.emit(updated);
      },
      error: (error) => {
        console.error('Failed to update contact:', error);
        alert('Failed to update contact. Please try again.');
      }
    });
  }

  protected onDelete(): void {
    const current = this.contact();
    if (!current) return;

    const confirmMessage = `Are you sure you want to delete ${current.name}?`;
    if (!confirm(confirmMessage)) return;

    this.contactsService.deleteContacts([current.id]).subscribe({
      next: () => {
        // Notify parent to refresh and close the detail view
        this.updated.emit(null);
        this.close.emit();
      },
      error: (error) => {
        console.error('Failed to delete contact:', error);
        alert('Failed to delete contact. Please try again.');
      }
    });
  }

  // Close the detail view when user presses Escape anywhere in the document
  @HostListener('document:keydown.escape', ['$event'])
  protected onEscape(event: Event): void {
    // If editing, close the detail (discarding edits). Behavior is to close regardless.
    this.onClose();
  }
}
