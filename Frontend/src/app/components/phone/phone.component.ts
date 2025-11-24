import { Component, signal, inject, OnInit, viewChild, effect, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../../services/contacts.service';
import { ContactComponent } from '../contact/contact.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { AddContactFormComponent } from '../add-contact-form/add-contact-form.component';

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [ContactComponent, ContactDetailComponent, AddContactFormComponent, FormsModule],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss'
})
export class PhoneComponent implements OnInit {
  private readonly contactsService = inject(ContactsService);

  protected readonly contacts = signal<Contact[]>([]);

  protected readonly showSearch = signal(false);
  protected searchQuery = '';
  protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly showAddContact = signal(false);

  protected readonly deletionMode = signal(false);
  protected readonly selectedContactIdsForDeletion = signal<Set<number>>(new Set());

  protected readonly showContactDetail = signal(false);
  protected openedContact: Contact | null = null;

  constructor() {
    // Auto-focus search input when it appears
    effect(() => {
      if (this.showSearch() && this.searchInput()) {
        setTimeout(() => {
          this.searchInput()?.nativeElement.focus();
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  private loadContacts(): void {
    this.contactsService.getAllContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });
  }

  protected getFavoriteContacts(): Contact[] {
    const favorites = this.contacts().filter(contact => contact.favorite);
    return this.filterContacts(favorites);
  }

  protected getAllContacts(): Contact[] {
    return this.filterContacts(this.contacts());
  }

  private filterContacts(contacts: Contact[]): Contact[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return contacts;
    }
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query)
    );
  }

  protected refreshContacts(): void {
    this.loadContacts();
  }

  protected toggleSearch(): void {
    this.showSearch.set(!this.showSearch());
  }

  protected hideSearch(): void {
    // Only hide if search query is empty
    if (!this.searchQuery.trim()) {
      this.showSearch.set(false);
      this.searchQuery = '';
    }
  }

  protected enterDeletionMode(): void {
    this.deletionMode.set(true);
    this.selectedContactIdsForDeletion.set(new Set());
  }

  protected exitDeletionMode(): void {
    this.deletionMode.set(false);
    this.selectedContactIdsForDeletion.set(new Set());
  }

  protected openAddContactForm(): void {
    // Show the standalone add-contact form component.
    this.showAddContact.set(true);
  }

  protected cancelAddContact(): void {
    // Hide the add-contact form.
    this.showAddContact.set(false);
  }

  protected onAddContactSave(payload: { name: string; phone: string; email?: string }): void {
    this.contactsService.createContact(payload).subscribe({
      next: (created) => {
        this.showAddContact.set(false);
        // Refresh list to include the newly created contact
        this.refreshContacts();
      },
      error: (error) => {
        console.error('Failed to create contact:', error);
        alert('Failed to create contact. Please try again.');
      }
    });
  }

  protected onContactItemClick(contact: Contact): void {
    // If deletion mode is active, clicks are used for selection
    if (this.deletionMode()) {
      const selected = new Set(this.selectedContactIdsForDeletion());
      if (selected.has(contact.id)) {
        selected.delete(contact.id);
      } else {
        selected.add(contact.id);
      }
      this.selectedContactIdsForDeletion.set(selected);
      return
    };

    // Open contact detail view
    this.openedContact = contact;
    this.showContactDetail.set(true);
    this.cancelAddContact();
  }

  protected closeContactDetail(): void {
    this.openedContact = null;
    this.showContactDetail.set(false);
  }

  protected onContactUpdated(updated: Contact | null): void {
    this.openedContact = updated;
    this.refreshContacts();
  }

  protected isContactSelected(contactId: number): boolean {
    return this.selectedContactIdsForDeletion().has(contactId);
  }

  protected getSelectedCount(): number {
    return this.selectedContactIdsForDeletion().size;
  }

  protected deleteSelectedContacts(): void {
    const selectedIds = Array.from(this.selectedContactIdsForDeletion());
    if (selectedIds.length === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} contact(s)?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    this.contactsService.deleteContacts(selectedIds).subscribe({
      next: () => {
        this.exitDeletionMode();
        this.refreshContacts();
      },
      error: (error) => {
        console.error('Error deleting contacts:', error);
        alert('Failed to delete contacts. Please try again.');
      }
    });
  }
}

