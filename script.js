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
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const target = document.querySelector(this.getAttribute('href'));
    //         if (target) {
    //             target.scrollIntoView({
    //                 behavior: 'smooth',
    //                 block: 'start'
    //             });
    //         }
    //     });

    // Anchor links z kompensacją nagłówka i stałą pozycją dla #contact
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const getHeaderOffset = () => {
                const h = document.querySelector('header');
                return h ? Math.ceil(h.getBoundingClientRect().height) : 0;
            };
            const headerOff = getHeaderOffset();

            let top;
            if (target.id === 'contact') {
                const anchorEl = target.querySelector('h2') || target;
                const gap = window.innerWidth <= 768 ? 48 : 32;
                const anchorTop = anchorEl.getBoundingClientRect().top + window.scrollY;
                top = Math.round(anchorTop - headerOff - gap);
            } else {
                top = Math.round(target.getBoundingClientRect().top + window.scrollY - headerOff);
            }

            window.scrollTo({ top, behavior: 'smooth' });
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

// // scrollin to sections
// (() => {
// 	const ids = ['#hero', '#about', '#contact', '#footer'];
// 	const sections = ids.map(id => document.querySelector(id)).filter(Boolean);
// 	if (sections.length < 2) return;

// 	let isAnimating = false;
// 	let touchStartY = 0;
// 	let lastTriggerTs = 0;

// 	// touchpad safety
// 	let wheelAccum = 0;
// 	let lastDir = 0;
// 	const wheelThreshold = 120;   // próg wyzwolenia (dostosuj 100–160)
// 	const minGapMs = 700;         // throttling między skokami
// 	const graceAfterAnimMs = 150; // krótki grace period po animacji

// 	const getHeaderOffset = () => {
// 		const h = document.querySelector('header');
// 		return h ? Math.ceil(h.getBoundingClientRect().height) : 0;
// 	};
// 	const sectionTop = (el) => el.getBoundingClientRect().top + window.scrollY;

// 	const currentIndex = () => {
// 		const ref = window.scrollY + getHeaderOffset();
// 		let bestIdx = 0, bestDist = Infinity;
// 		for (let i = 0; i < sections.length; i++) {
// 			const top = sectionTop(sections[i]);
// 			const dist = Math.abs(top - ref);
// 			if (dist < bestDist) { bestDist = dist; bestIdx = i; }
// 		}
// 		return bestIdx;
// 	};

// 	const goTo = (idx) => {
//         if (idx < 0 || idx >= sections.length) return;
//         isAnimating = true;
//         lastTriggerTs = Date.now();
    
//         const startY = window.scrollY;
//         const headerOff = getHeaderOffset(); // zamroź offset na czas animacji
//         const el = sections[idx];
//         // dodatkowa korekta tylko dla #contact (dostosuj 12–20px wg potrzeby)
//         let extraFix = 0;
//         if (el.id === 'contact') {
//             const isMobile = window.innerWidth <= 768;
//             // bazuj też na padding-top sekcji, jeśli jest
//             const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
//             extraFix = (isMobile ? 48 : 32) + Math.min(padTop, 16);
//         }

//         const target = Math.round(sectionTop(el) - headerOff - extraFix);
    
//         const duration = 550; // ms
//         const start = performance.now();
//         const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
    
//         const step = (now) => {
//             const p = Math.min(1, (now - start) / duration);
//             const y = Math.round(startY + (target - startY) * ease(p));
//             window.scrollTo(0, y);
//             if (p < 1) {
//                 requestAnimationFrame(step);
//             } else {
//                 window.scrollTo(0, target);
//                 isAnimating = false;
//             }
//         };
//         requestAnimationFrame(step);

//         window.scrollTo(0, target);
// 		isAnimating = false;
// 		wheelAccum = 0;
// 		lastDir = 0;
// 		lastTriggerTs = Date.now() + graceAfterAnimMs; // ignoruj resztki momentum
//     };

// 		window.addEventListener('wheel', (e) => {
// 		// blokuj natywny scroll podczas animacji i cooldownu
// 		if (isAnimating || (Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }

// 		const dy = e.deltaY;

// 		// reset akumulatora przy zmianie kierunku
// 		if (Math.sign(dy) !== Math.sign(wheelAccum)) wheelAccum = 0;

// 		wheelAccum += dy;

// 		let dir = 0;
// 		if (wheelAccum >= wheelThreshold) dir = 1;
// 		if (wheelAccum <= -wheelThreshold) dir = -1;

// 		if (!dir) { e.preventDefault(); return; }

// 		// zablokuj od razu dalsze momentum i wyzwól skok
// 		e.preventDefault();
// 		wheelAccum = 0;
// 		lastDir = dir;

// 		const idx = currentIndex() + dir;
// 		if (idx >= 0 && idx < sections.length) {
// 			goTo(idx);
// 		}
// 	}, { passive: false });

// 	window.addEventListener('touchstart', (e) => {
// 		if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
// 	}, { passive: true });

// 	window.addEventListener('touchmove', (e) => {
// 		if (isAnimating) { e.preventDefault(); return; }
// 		if ((Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }
// 		if (!e.touches || !e.touches[0]) return;

// 		const delta = touchStartY - e.touches[0].clientY;
// 		if (Math.abs(delta) < 30) return;

// 		const dir = delta > 0 ? 1 : -1;
// 		const idx = currentIndex() + dir;
// 		if (idx >= 0 && idx < sections.length) {
// 			e.preventDefault();
// 			goTo(idx);
// 		}
// 	}, { passive: false });

//     window.addEventListener('keydown', (e) => {
//         // blokady jak w wheel/touch
//         if (isAnimating || (Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }
    
//         let dir = 0;
    
//         // nawigacja sekcja-po-sekcji
//         if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
//         if (e.key === 'ArrowUp'   || e.key === 'PageUp'   || (e.key === ' ' &&  e.shiftKey)) dir = -1;
    
//         // skoki na początek/koniec
//         if (e.key === 'Home') {
//             e.preventDefault();
//             // wyczyść ewentualne akumulatory touchpada
//             if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
//             goTo(0);
//             return;
//         }
//         if (e.key === 'End') {
//             e.preventDefault();
//             if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
//             goTo(sections.length - 1);
//             return;
//         }
    
//         if (dir !== 0) {
//             e.preventDefault();
//             if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
//             const idx = currentIndex() + dir;
//             if (idx >= 0 && idx < sections.length) {
//                 goTo(idx);
//             }
//         }
//     }, { passive: false });
// })();

// scrollin to sections
(() => {
	const ids = ['#hero', '#about', '#contact', '#footer'];
	const sections = ids.map(id => document.querySelector(id)).filter(Boolean);
	if (sections.length < 2) return;

	// stan
	let isAnimating = false;
	let touchStartY = 0;
	let lastTriggerTs = 0;
	let currentIdx = 0;

	// touchpad safety
	let wheelAccum = 0;
	let lastDir = 0;
	const wheelThreshold = 120;   // próg wyzwolenia (100–160 w zależności od touchpada)
	const minGapMs = 700;         // minimalny odstęp między skokami
	const graceAfterAnimMs = 150; // krótka ochrona po animacji

	const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

	const getHeaderOffset = () => {
		const h = document.querySelector('header');
		return h ? Math.ceil(h.getBoundingClientRect().height) : 0;
	};
	const sectionTop = (el) => el.getBoundingClientRect().top + window.scrollY;

	// pomocnicze: najbliższa sekcja względem bieżącej pozycji (do inicjalizacji)
	const closestIndex = () => {
		const ref = window.scrollY + getHeaderOffset();
		let best = 0, bestDist = Infinity;
		for (let i = 0; i < sections.length; i++) {
			const top = sectionTop(sections[i]);
			const d = Math.abs(top - ref);
			if (d < bestDist) { bestDist = d; best = i; }
		}
		return best;
	};

	// inicjalizacja aktualnej sekcji
	currentIdx = closestIndex();
	window.addEventListener('resize', () => { currentIdx = closestIndex(); });

	// płynna animacja skoku z kompensacją nagłówka i korektą dla #contact
	const goTo = (idx) => {
		if (idx < 0 || idx >= sections.length) return;
		isAnimating = true;
		lastTriggerTs = Date.now();

		const startY = window.scrollY;
		const headerOff = getHeaderOffset(); // zamroź offset na czas animacji
		const el = sections[idx];

		// dodatkowa korekta tylko dla #contact aby napis nie był pod nagłówkiem
		let extraFix = 0;
		if (el.id === 'contact') {
			const isMobile = window.innerWidth <= 768;
			const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
			extraFix = (isMobile ? 48 : 32) + Math.min(padTop, 16);
		}

		const target = Math.round(sectionTop(el) - headerOff - extraFix);

		const duration = 550; // ms
		const start = performance.now();
		const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

		const step = (now) => {
			const p = Math.min(1, (now - start) / duration);
			const y = Math.round(startY + (target - startY) * ease(p));
			window.scrollTo(0, y);
			if (p < 1) {
				requestAnimationFrame(step);
			} else {
				window.scrollTo(0, target);
				isAnimating = false;
				wheelAccum = 0;
				lastDir = 0;
				lastTriggerTs = Date.now() + graceAfterAnimMs;
				currentIdx = idx; // ustal aktywną sekcję po skoku
			}
		};
		requestAnimationFrame(step);
	};

	// wheel (w tym touchpad) z akumulacją i progiem
	window.addEventListener('wheel', (e) => {
		// blokuj natywny scroll podczas animacji i cooldownu
		if (isAnimating || (Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }

		const dy = e.deltaY;

		// reset akumulatora przy zmianie kierunku
		if (Math.sign(dy) !== Math.sign(wheelAccum)) wheelAccum = 0;

		wheelAccum += dy;

		let dir = 0;
		if (wheelAccum >= wheelThreshold) dir = 1;
		if (wheelAccum <= -wheelThreshold) dir = -1;

		if (!dir) { e.preventDefault(); return; }

		// zablokuj od razu dalsze momentum i wyzwól skok
		e.preventDefault();
		wheelAccum = 0;
		lastDir = dir;

		const next = clamp(currentIdx + dir, 0, sections.length - 1);
		if (next !== currentIdx) {
			goTo(next);
		}
	}, { passive: false });

	// dotyk
	window.addEventListener('touchstart', (e) => {
		if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
	}, { passive: true });

	window.addEventListener('touchmove', (e) => {
		if (isAnimating) { e.preventDefault(); return; }
		if ((Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }
		if (!e.touches || !e.touches[0]) return;

		const delta = touchStartY - e.touches[0].clientY;
		if (Math.abs(delta) < 30) return;

		const dir = delta > 0 ? 1 : -1;
		const next = clamp(currentIdx + dir, 0, sections.length - 1);
		if (next !== currentIdx) {
			e.preventDefault();
			goTo(next);
		}
	}, { passive: false });

	// klawiatura: ArrowUp/Down, PageUp/Down, Space (+Shift), Home/End
	window.addEventListener('keydown', (e) => {
		if (isAnimating || (Date.now() - lastTriggerTs) < minGapMs) { e.preventDefault(); return; }

		let dir = 0;

		// nawigacja sekcja-po-sekcji
		if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
		if (e.key === 'ArrowUp'   || e.key === 'PageUp'   || (e.key === ' ' &&  e.shiftKey)) dir = -1;

		// skoki na początek/koniec
		if (e.key === 'Home') {
			e.preventDefault();
			if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
			goTo(0);
			return;
		}
		if (e.key === 'End') {
			e.preventDefault();
			if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
			goTo(sections.length - 1);
			return;
		}

		if (dir !== 0) {
			e.preventDefault();
			if (typeof wheelAccum !== 'undefined') wheelAccum = 0;
			const next = clamp(currentIdx + dir, 0, sections.length - 1);
			if (next !== currentIdx) {
				goTo(next);
			}
		}
	}, { passive: false });
})();