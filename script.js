// const { error } = require("console");
// const { response } = require("express");

document.addEventListener('DOMContentLoaded', () => {
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
        // Opcje Intersection Observer
        // Ustawienie threshold na 0 oznacza, że callback uruchomi się,
        // gdy nawet 1 piksel elementu wejdzie lub wyjdzie z widoku.
        // Możesz dostosować tę wartość np. na 0.1 (10%) jeśli wolisz.
        threshold: 0.1,
        // Ustaw ujemny rootMargin. Wartości to top, right, bottom, left.
        // "-50px 0px -50px 0px" zmniejsza obszar obserwacji o 50px od góry i od dołu.
        // Oznacza to, że element musi "wejść" 50px głębiej, żeby zostać zauważonym,
        // i "wyjść" 50px dalej, żeby przestać być zauważonym.
        // Eksperymentuj z wartościami! Możesz zacząć od mniejszych, np. "-20px 0px -20px 0px".
        // rootMargin: '-50px 0px -50px 0px'
        rootMargin: '-30px 0px -30px 0px'
        // root: null, // Domyślnie viewport
    });

    // Zacznij obserwować każdy element z listy revealElements
    revealElements.forEach(element => {
        observer.observe(element);
    });

});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // <-- Ta linia zatrzymuje przeładowanie!
        
        const formData = new FormData(contactForm);
        // Konwersja danych na format JSON, pasujacy do express.json() na backendzie
        const formObject = Object.fromEntries(formData.entries());
        
        try {
            // --- KOD WYSYŁAJĄCY DANE DO BACKENDU PRZEZ FETCH ---
            const response = await fetch(contactForm.action, { // Użyj adresu z action formularza (http://localhost:3000/send-email)
                // mode: "no-cors", 
                method: contactForm.method, // Użyj metody z formularza (POST)
                headers: {
                     'Content-Type': 'application/json' // Informujemy serwer, że wysyłamy JSON
                 },
                 body: JSON.stringify(formObject) // Wysłanie danych jako string JSON
             });

            const result = await response.json(); // Odbierz odpowiedź z backendu (nasz backend odsyła { success: true/false, message: '...' })

            if (response.ok) { // Sprawdź, czy odpowiedź HTTP ma status 2xx (np. 200)
                alert(result.message); // Wyświetl komunikat (np. "Wiadomość wysłana pomyślnie!")
                contactForm.reset(); // Wyczyść formularz po sukcesie
            } else { // Jeśli odpowiedź HTTP ma status błędu (np. 400, 500)
                 alert(`Błąd: ${result.message}`); // Wyświetl komunikat błędu z backendu
            }
            // --- KONIEC KODU WYSYŁKI ---

        } catch (error) {
            console.error('Error submitting form (fetch failed):', error);
            alert('Wystąpił błąd podczas wysyłania formularza. Sprawdź konsolę przeglądarki.');
        }
    });
}

    // // Contact form handling
    // const contactForm = document.getElementById('contact-form');
    // if (contactForm) {
    //     contactForm.addEventListener('submit', async (e) => {
    //         e.preventDefault();
            
    //         const formData = new FormData(contactForm);
    //         const formObject = Object.fromEntries(formData.entries());
            
    //         fetch('/send-email', {
    //             method: 'POST',
    //             body: formData
    //         })
    //         .then(response => response.json())
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });

    //         try {
    //             // Here you would typically send the form data to your backend
    //             // For now, we'll just show a success message
    //             alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.');

    //             contactForm.reset();
    //         } catch (error) {
    //             console.error('Error submitting form:', error);
    //             alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
    //         }
    //     });
    // }

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
    const observerOptions = {
        threshold: 0.1,
        // Ustaw ujemny rootMargin. Wartości to top, right, bottom, left.
        // "-50px 0px -50px 0px" zmniejsza obszar obserwacji o 50px od góry i od dołu.
        // Oznacza to, że element musi "wejść" 50px głębiej, żeby zostać zauważonym,
        // i "wyjść" 50px dalej, żeby przestać być zauważonym.
        // Eksperymentuj z wartościami! Możesz zacząć od mniejszych, np. "-20px 0px -20px 0px".
        rootMargin: '-50px 0px -50px 0px'
        // root: null, // Domyślnie viewport
    };

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

