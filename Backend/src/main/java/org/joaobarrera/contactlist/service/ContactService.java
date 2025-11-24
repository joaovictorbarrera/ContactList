package org.joaobarrera.contactlist.service;

import org.joaobarrera.contactlist.entity.Contact;
import org.joaobarrera.contactlist.repository.ContactRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> getAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Contact create(Contact contact) {
        return repository.save(contact);
    }

    public Contact update(Contact contact, Long id) {
        if (id == null || repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Contact with id " + contact.getId() + " does not exist");
        }

        contact.setId(id);

        return repository.save(contact);
    }

    public Contact updateFavoriteById(boolean star, Long id) {
        Optional<Contact> contactQuery = repository.findById(id);
        if (contactQuery.isEmpty()) {
            throw new IllegalArgumentException("There is no contact for the ID provided.");
        }

        Contact contact = contactQuery.get();

        contact.setFavorite(star);
        return repository.save(contact);
    }

    public List<Contact> deleteByIds(List<Long> ids) {
        List<Contact> contacts = repository.findAllById(ids);
        if (contacts.size() != ids.size()) {
            throw new IllegalArgumentException("Some of the ids provided do not exist");
        }

        repository.deleteAllById(ids);
        return contacts;
    }
}
