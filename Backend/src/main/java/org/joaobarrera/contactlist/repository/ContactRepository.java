package org.joaobarrera.contactlist.repository;

import org.joaobarrera.contactlist.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}