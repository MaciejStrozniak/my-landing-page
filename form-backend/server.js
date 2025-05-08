// Załaduj zmienne środowiskowe z pliku .env (tylko jeśli nie jesteśmy na produkcji)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
const cors = require("cors");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Użyj portu ze zmiennej środowiskowej lub 3000

const nodemailer = require('nodemailer'); // Importuj Nodemailera
const path = require('path'); // Moduł do pracy ze ścieżkami plików (przyda się później)

// Middleware do parsowania danych z formularzy HTML (application/x-www-form-urlencoded)
// Umożliwia dostęp do danych formularza w req.body
app.use(express.urlencoded({ extended: true }));

// Middleware do parsowania danych wysyłanych jako JSON
// Umożliwia dostęp do danych JSON w req.body (jeśli formularz jest wysyłany JSem)
app.use(express.json());

// Middleware do serwowania statycznych plików (np. Twój plik index.html, style.css, script.js)
// Zakłada, że Twoje pliki frontendowe są w folderze 'public' w głównym folderze projektu (form-backend)
// Możesz pominąć ten krok lub dostosować ścieżkę, jeśli Twoje pliki są gdzie indziej
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());


// Skonfiguruj transporter Nodemailera, POBIERAJĄC dane ze ZMIENNYCH ŚRODOWISKOWYCH
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT), // Pamiętaj o konwersji portu na liczbę
    secure: process.env.EMAIL_SECURE === 'true', // Porównaj string 'true'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DO USUNIĘCIA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    tls: { // Dodaj ten obiekt
    rejectUnauthorized: false // Ustaw na false TYLKO DO TESTÓW/DEBUGOWANIA!    
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DO USUNIĘCIA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}
});

// Opcjonalnie: Weryfikacja połączenia z serwerem SMTP przy starcie aplikacji
transporter.verify(function(error, success) {
    if (error) {
        console.error("❌ Błąd weryfikacji transportera Nodemailer:", error);
        // W aplikacji produkcyjnej warto tu zablokować serwer lub logować błąd!
    } else {
        console.log("✅ Transporter Nodemailer gotowy do wysyłki e-maili.");
    }
});

// Krok 5: Utworzenie Endpointu do Obsługi Formularza (Metoda POST)

// Endpoint, na który będzie wysyłany formularz kontaktowy
app.post('/send-email', (req, res) => {
    // Odczytaj dane z ciała żądania (dane z formularza)
    const { name, email, message } = req.body;

    // Prosta walidacja po stronie serwera
  if (!name || !email || !message) {
      console.log("Attempted submission with missing fields:", req.body);
      return res.status(400).json({ success: false, message: 'Proszę wypełnić wszystkie pola formularza.' });
  }

    // Skonfiguruj opcje e-maila do wysłania
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Nazwa nadawcy może być imieniem z formularza, adres to email_user z env
        to: process.env.RECIPIENT_EMAIL, // Twój adres email, na który chcesz dostać wiadomość (z env)
        subject: `Wiadomość z formularza kontaktowego od ${name}`, // Temat emaila
        text: `Od: ${name}\nEmail: ${email}\nWiadomość:\n${message}`, // Wersja tekstowa emaila
        html: `<p><strong>Od:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Wiadomość:</strong></p>
                <p>${message}</p>` // Wersja HTML emaila
    };

    // Wyślij e-mail za pomocą Nodemailera
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Błąd podczas wysyłania e-maila:', error);
            // Odeslij do klienta odpowiedz o bledzie w formacie JSON
            res.status(500).json({ success: false, message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.' });
        } else {
            console.log('✅ E-mail wysłany: ' + info.response);
            // return res.status(200);
            res.status(200).json({ success: true, message: 'Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.' });        
        }
    });
});

// Opcjonalna trasa główna - serwuje Twój index.html (jeśli używasz middleware express.static)
// Jeśli Twoj index.html jest w folderze 'public' w folderze backendu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Uruchomienie serwera
app.listen(port, () => {
console.log(`🚀 Serwer nasłuchuje na porcie ${port}`);
console.log(`🌐 Otwórz w przeglądarce: http://localhost:${port}`);
});