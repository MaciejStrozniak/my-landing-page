// let log = console.log();

// ładowanie zmiennych środowiskowych z .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { error } = require('console');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // użycie portu ze zmiennej środowiskowej lub na sztywno portu 3000

const nodemailer = require('nodemailer');
const path = require('path'); // moduł do pracy ze ścieżkami plików

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
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { // Dodaj ten obiekt
            rejectUnauthorized: false // Ustaw na false TYLKO DO TESTÓW/DEBUGOWANIA!
        }
    }
);

transporter.verify( error => {
    if (error) {
        console.error("❌ Błąd weryfikacji transportera Nodemailer:", error);
    } else 
        console.log("✅ Transporter Nodemailer gotowy do wysyłki e-maili.");
});

// Endpoint, na który będzie wysyłany formulardz kontaktowy (motodą POST)
app.post('/send-email', (req, res) => {
    // odczytanie danych z ciała żądania (dane z formularza w index.html)
    const{ name, email, message } = req.body;

    // walidacja po stronie serwera
    if (!name || !email || !message) {
        console.log("Attempted submission with missing fields:", req.body);
        
        return res.status(400).json({success: false, message: 'Proszę wypełnić wszystkie pola formularza.'});
    }

    const mailOptions = {
        from: '"${name}" <${process.env.EMAIL_USER}>',
        to: process.env.RECIPIENT_EMAIL,
        subject: 'Wiadomość z formularza kontaktowego od ${name}',
        text: 'Od ${name}\nEmail: ${email}\n Wiadomość:\n${message}',
        // html: `<p><strong>Od:</strong> ${name}</p>
        //        <p><strong>Email:</strong> ${email}</p>
        //        <p><strong>Wiadomość:</strong></p>
        //        <p>${message}</p>` // Wersja HTML emaila
    };

    // wyślij e-mail za pomocą Nodemailera
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Błąd podczas wysyłania e-maila:', error);
            // odesłanie odpowiedzi do klienta w formacie JSON
            res.status(500).json({ success:false, message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później'});
        } else {
            console.log('✅ E-mail wysłany: ' + info.response);
            res.status(200).json({ success:true, message: 'Wiadomość wysłana pomyślnie!' });
        }
    });
});