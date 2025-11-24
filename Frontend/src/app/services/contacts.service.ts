import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || '';

  /**
   * Get all contacts.
   * GET /contacts/
   */
  getAllContacts(): Observable<Contact[]> {
    const url = this.baseUrl ? `${this.baseUrl}/ContactGetAll` : '/ContactGetAll';
    return this.http.get<Contact[]>(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Delete contacts by their IDs.
   * DELETE /contacts/
   */
  deleteContacts(ids: number[]): Observable<Contact[]> {
    const url = this.baseUrl ? `${this.baseUrl}/ContactDelete` : '/ContactDelete';
    return this.http.delete<Contact[]>(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: ids
    });
  }

  /**
   * Create a new contact.
   * POST /contacts/
   */
  createContact(payload: { name: string; phone: string; email?: string }): Observable<Contact> {
    const url = this.baseUrl ? `${this.baseUrl}/ContactCreate` : '/ContactCreate';
    return this.http.post<Contact>(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Favorite or unfavorite an existing contact.
   * PUT /contacts/favorite?star=<true|false>&id=<id>
   */
  favoriteContact(id: number, star: boolean): Observable<Contact> {
    const url = this.baseUrl ? `${this.baseUrl}/ContactFavorite?star=${star}&id=${id}` : `/ContactFavorite?star=${star}&id=${id}`;
    // API uses query params; no request body required
    return this.http.put<Contact>(url, null, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Update an existing contact by id.
   * PUT /contacts/<id>
   */
  updateContact(id: number, payload: { name: string; phone: string; email?: string }): Observable<Contact> {
    const url = this.baseUrl ? `${this.baseUrl}/ContactUpdate/${id}` : `/ContactUpdate/${id}`;
    return this.http.put<Contact>(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
}

