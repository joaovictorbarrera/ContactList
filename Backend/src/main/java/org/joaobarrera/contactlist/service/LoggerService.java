package org.joaobarrera.contactlist.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class LoggerService {
    public void log(String message) {
        LocalDateTime now = LocalDateTime.now();

        // Format: Month Day Year HH:mm:ss
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd yyyy HH:mm:ss");

        String timestamp = now.format(formatter);
        System.out.println("[" + timestamp + "] " + message);
    }
}
