document.addEventListener('DOMContentLoaded', () => {
    // Sekcja formularza kontaktowego
    const contactForm = document.getElementById('contact-form');
    const statusPopup = document.getElementById('status-popup');
    const popupMessage = document.getElementById('popup-message');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', () => {
            statusPopup.style.display = 'none';
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            popupMessage.textContent = 'Wysyłanie wiadomości... Proszę czekać.';
            statusPopup.className = 'info';
            statusPopup.style.display = 'block';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const backendUrl = 'https://contact-form-service-192026358406.europe-central2.run.app/send-email';

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                const result = await response.json();

                if (response.ok) {
                    statusPopup.className = 'success';
                    popupMessage.textContent = result.message || 'Wiadomość wysłana pomyślnie!';
                    contactForm.reset();
                } else {
                    statusPopup.className = 'error';
                    popupMessage.textContent = result.message || 'Wystąpił błąd podczas wysyłania wiadomości.';
                }
            } catch (error) {
                console.error('Błąd sieci lub serwera:', error);
                statusPopup.className = 'error';
                popupMessage.textContent = 'Wystąpił błąd połączenia. Spróbuj ponownie.';
            }
        });
    }

    // Smooth scrolling dla linków nawigacyjncyh
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        threshold: 0.05,
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

});

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = 'var(--white)';
        }
    });

    const skillCards = document.querySelectorAll('.skill-category');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});