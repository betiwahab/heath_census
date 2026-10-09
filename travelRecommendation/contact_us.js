 
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (!contactForm || !formStatus) {
        console.error("Le formulaire de contact est introuvable.");
        return;
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "";

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            subject: document.getElementById("subject").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {
            formStatus.textContent =
                "Please complete all required fields.";

            formStatus.classList.add("error");
            return;
        }

        /*
         * À ce stade, les données ont été validées
         * dans le navigateur.
         *
         * Aucun message n'est encore envoyé :
         * un backend ou un service de formulaire
         * doit être configuré pour recevoir les données.
         */

        console.log("Contact form data:", formData);

        formStatus.textContent =
            "Your form is valid, but the message has not been sent. " +
            "Please configure a contact service to deliver your message.";

        formStatus.classList.add("success");
    });
});
 
