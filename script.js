document.addEventListener('DOMContentLoaded', () => {
    // Sekcja formularza kontaktowego
    // zmienne dla pobsługi popupu dla formulara kontaktowego
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

            // Ustaw początkowy status i pokaż popup
            popupMessage.textContent = 'Wysyłanie wiadomości... Proszę czekać.';
            statusPopup.className = 'info'; // Dodaj klasę 'info'
            statusPopup.style.display = 'block';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const backendUrl = 'http://localhost:3000/send-email'; // LOKALNY URL

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
                    statusPopup.className = 'success'; // Zmień klasę na 'success'
                    popupMessage.textContent = result.message || 'Wiadomość wysłana pomyślnie!';
                    contactForm.reset();
                } else {
                    statusPopup.className = 'error'; // Zmień klasę na 'error'
                    popupMessage.textContent = result.message || 'Wystąpił błąd podczas wysyłania wiadomości.';
                }
            } catch (error) {
                console.error('Błąd sieci lub serwera:', error);
                statusPopup.className = 'error'; // Zmień klasę na 'error'
                popupMessage.textContent = 'Wystąpił błąd połączenia. Spróbuj ponownie.';
            }
        });
    }

    // Smooth scrolling for navigation links
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

        // Pobierz wszystkie elementy, które mają się wsuwać
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Utwórz nowy Intersection Observer
    const observer = new IntersectionObserver(function(entries, observer) {
        // Callback uruchamia się, gdy któryś z obserwowanych elementów wejdzie lub wyjdzie z widoku

        entries.forEach(entry => {
            // Jeśli element jest w obszarze widocznym (lub spełnia próg widoczności)
            if (entry.isIntersecting) {
                // Dodaj klasę 'is-visible' do elementu, uruchamiając animację
                entry.target.classList.add('is-visible');
                // UWAGA: Usuwamy observer.unobserve(entry.target);
                // aby obserwator nadal monitorował element, gdy ten opuści widok
            } else {
                // Jeśli element opuścił obszar widoczny
                // Usuń klasę 'is-visible', resetując jego stan do początkowego
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        threshold: 0.05,
        // rootMargin: '-30px 0px -30px 0px'
    });

    // Zacznij obserwować każdy element z listy revealElements
    revealElements.forEach(element => {
        observer.observe(element);
    });

});

    // Add scroll-based header styling
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = 'var(--white)';
        }
    });

    // // Add animation to skill cards
    const skillCards = document.querySelectorAll('.skill-category');
    // const observerOptions = {
    //     threshold: 0.1,
    //     // Ustaw ujemny rootMargin. Wartości to top, right, bottom, left.
    //     // "-50px 0px -50px 0px" zmniejsza obszar obserwacji o 50px od góry i od dołu.
    //     // Oznacza to, że element musi "wejść" 50px głębiej, żeby zostać zauważonym,
    //     // i "wyjść" 50px dalej, żeby przestać być zauważonym.
    //     // Eksperymentuj z wartościami! Możesz zacząć od mniejszych, np. "-20px 0px -20px 0px".
    //     rootMargin: '-50px 0px -50px 0px'
    //     // root: null, // Domyślnie viewport
    // };

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