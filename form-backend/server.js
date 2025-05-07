// Załaduj zmienne środowiskowe z pliku .env (tylko jeśli nie jesteśmy na produkcji)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// const { error } = require('console'); // <-- USUŃ tę linię!
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // użycie portu ze zmiennej środowiskowej lub na sztywno portu 3000

const nodemailer = require('nodemailer');
const path = require('path'); // moduł do pracy ze ścieżkami plików

// --- DODAJ TEN MIDDLEWARE ---
// Middleware do parsowania danych z formularzy HTML (application/x-www-form-urlencoded)
// Umożliwia dostęp do danych formularza w req.body
app.use(express.urlencoded({ extended: false }));
// -----------------------------

// Middleware do parsowania danych wysyłanych jako JSON
// Umożliwia dostęp do danych JSON w req.body (jeśli formularz jest wysyłany JSem)
app.use(express.json());

// Middleware do serwowania statycznych plików (np. Twój plik index.html, style.css, script.js)
// Zakłada, że Twoje pliki frontendowe są w folderze 'public' w głównym folderze projektu (form-backend)
// Możesz pominąć ten krok lub dostosować ścieżkę, jeśli Twoje pliki są gdzie indziej
app.use(express.static(path.join(__dirname, 'public')));

// Skonfiguruj transporter Nodemailera, POBIERAJĄC dane ze ZMIENNYCH ŚRODOWISKOWYCH
const transporter = nodemailer.createTransport(
    {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        // Pamiętaj o poprawnej logice secure: true dla 465, false dla 587
        secure: process.env.EMAIL_SECURE === 'true', // <-- UPEWNIJ SIĘ, ŻE JEST === 'true'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { // Dodaj ten obiekt
            rejectUnauthorized: false // Ustaw na false TYLKO DO TESTÓW/DEBUGOWANIA! Pamiętaj o usunięciu na produkcji!
        }
    }
);

transporter.verify( error => {
    if (error) {
        console.error("❌ Błąd weryfikacji transportera Nodemailer:", error);
    } else { // <--- Dodaj nawias klamrowy tutaj
        console.log("✅ Transporter Nodemailer gotowy do wysyłki e-maili.");
    } // <--- Dodaj nawias klamrowy tutaj
});

// Endpoint, na który będzie wysyłany formulardz kontaktowy (metodą POST)
app.post('/send-email', (req, res) => {
    // Odczytaj dane z ciała żądania (dane z formularza w index.html)
    // Teraz req.body powinno zawierać dane dzięki express.urlencoded()
    const{ name, email, message } = req.body;

    // walidacja po stronie serwera
    if (!name || !email || !message) {
        console.log("Attempted submission with missing fields:", req.body);

        return res.status(400).json({success: false, message: 'Proszę wypełnić wszystkie pola formularza.'});
    }

    // --- Poprawione użycie szablonów stringów (backticki zamiast pojedynczych cudzysłowów) ---
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Użyj backticków!
        to: process.env.RECIPIENT_EMAIL,
        subject: `Wiadomość z formularza kontaktowego od ${name}`, // Użyj backticków!
        text: `Od ${name}\nEmail: ${email}\n Wiadomość:\n${message}`, // Użyj backticków!
        html: `<p><strong>Od:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Wiadomość:</strong></p>
               <p>${message}</p>` // Użyj backticków!
    };
    // ------------------------------------------------------------------------------------


    // wyślij e-mail za pomocą Nodemailera
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Błąd podczas wysyłania e-maila:', error);
            // odesłanie odpowiedzi do klienta w formacie JSON
            res.status(500).json({ success:false, message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później'});
        } else {
            console.log('✅ E-mail wysłany: ' + info.response);
             // Jeśli używasz ethereal.email, wyświetl link do podglądu
            if (process.env.EMAIL_HOST === 'smtp.ethereal.email') { // Sprawdź czy to ethereal
                 console.log('✨ Podgląd wiadomości (ethereal): ' + nodemailer.getTestMessageUrl(info));
            }
            res.status(200).json({ success:true, message: 'Wiadomość wysłana pomyślnie!' });
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