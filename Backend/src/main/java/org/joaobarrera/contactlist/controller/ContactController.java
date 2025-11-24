package org.joaobarrera.contactlist.controller;

import org.joaobarrera.contactlist.entity.Contact;
import org.joaobarrera.contactlist.service.ContactService;
import org.joaobarrera.contactlist.service.LoggerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ContactController {
    @Autowired
    LoggerService logger;

    private final ContactService service;

    public ContactController (ContactService service) {
        this.service = service;
    }

    @GetMapping("/ContactGetAll")
    public List<Contact> getAll() {
        logger.log("GET /contacts");
        return service.getAll();
    }

    @PostMapping("/ContactCreate")
    public Contact create(@RequestBody Contact contact) {
        logger.log("POST /contacts");
        return service.create(contact);
    }

    @PutMapping("/ContactUpdate/{id}")
    public Contact update(@PathVariable Long id, @RequestBody Contact contact) {
        logger.log("PUT /contacts/" + id);
        return service.update(contact, id);
    }

    @PutMapping("/ContactFavorite")
    public Contact favorite(@RequestParam boolean star, @RequestParam Long id) {
        logger.log("PUT /contacts/favorite");
        return service.updateFavoriteById(star, id);
    }

    @DeleteMapping("/ContactDelete")
    public List<Contact> bulkDelete(@RequestBody List<Long> ids) {
        logger.log("DELETE /contacts");
        return service.deleteByIds(ids);
    }
}
