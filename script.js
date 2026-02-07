// ============================================================
//  🌹 Valentine's Website for Rashi — script.js
// ============================================================

// ---------- CONFIG ----------
// 👇 Change this to the real date you two got together!
const RELATIONSHIP_START = new Date('2024-02-14T00:00:00');

// ---------- DOM REFS ----------
const envelope       = document.getElementById('envelope');
const envelopeContainer = document.getElementById('envelopeContainer');
const proposalContent = document.getElementById('proposalContent');
const btnYes         = document.getElementById('btnYes');
const btnNo          = document.getElementById('btnNo');
const acceptedMsg    = document.getElementById('acceptedMessage');
const confettiCanvas = document.getElementById('confettiCanvas');

// ---------- FLOATING HEARTS BACKGROUND ----------
function createFloatingHearts() {
    const container = document.getElementById('heartsBg');
    const hearts = ['💕', '❤️', '💖', '💗', '💓', '🌹', '✨', '💝'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(heart);
    }
}
createFloatingHearts();

// ---------- ENVELOPE ----------
let envelopeOpened = false;
envelopeContainer.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');

    setTimeout(() => {
        envelopeContainer.classList.add('hidden');
        proposalContent.classList.remove('hidden');
    }, 1200);
});

// ---------- YES / NO BUTTONS ----------
let noClickCount = 0;
const noTexts = [
    'No 😢',
    'Are you sure? 🥺',
    'Really sure? 😭',
    'Think again! 💔',
    'Pleeeease? 🥹',
    'Don\'t do this 😿',
    'I\'ll be sad... 😞',
    'Last chance! 💕',
    'Pretty please? 🌹',
    'Okay fine... 😢\n(just kidding, click Yes!)'
];

btnNo.addEventListener('click', () => {
    noClickCount++;

    // Make Yes button bigger each time
    const scale = 1 + noClickCount * 0.15;
    btnYes.style.transform = `scale(${scale})`;

    // Make No button smaller
    const noScale = Math.max(0.4, 1 - noClickCount * 0.1);
    btnNo.style.transform = `scale(${noScale})`;

    // Change No button text
    btnNo.textContent = noTexts[Math.min(noClickCount, noTexts.length - 1)];

    // After many clicks, move the No button randomly
    if (noClickCount >= 3) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 100;
        btnNo.style.transform = `scale(${noScale}) translate(${x}px, ${y}px)`;
    }
});

btnYes.addEventListener('click', () => {
    // Hide buttons, show message
    document.querySelector('.proposal-buttons').classList.add('hidden');
    document.querySelector('.subtitle').classList.add('hidden');
    acceptedMsg.classList.remove('hidden');

    // Launch confetti! 🎉
    launchConfetti();

    // Reveal all hidden sections
    document.querySelectorAll('.hidden-section').forEach((sec, i) => {
        setTimeout(() => {
            sec.classList.add('visible');
        }, 600 + i * 300);
    });

    // Start countdown timer
    startCountdown();
});

// ---------- CONFETTI 🎉 ----------
function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff6b8a', '#e84393', '#fd79a8', '#a29bfe', '#f9ca24',
                    '#ff6b6b', '#ee5a24', '#ffc0cb', '#ff69b4', '#ff1493'];

    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2,
            opacity: 1
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animate() {
        frame++;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        pieces.forEach(p => {
            p.y += p.speed;
            p.x += p.drift + Math.sin(p.angle) * 0.5;
            p.angle += p.spin;

            if (frame > maxFrames - 60) {
                p.opacity = Math.max(0, p.opacity - 0.02);
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }
    animate();
}

// ---------- SCROLL ANIMATIONS ----------
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Timeline items
            entry.target.querySelectorAll('.timeline-item').forEach((item, i) => {
                setTimeout(() => item.classList.add('animate'), i * 200);
            });

            // Reason cards
            entry.target.querySelectorAll('.reason-card').forEach((card, i) => {
                setTimeout(() => card.classList.add('animate'), i * 150);
            });

            // Letter paragraphs
            entry.target.querySelectorAll('.letter-content p').forEach((p, i) => {
                setTimeout(() => p.classList.add('animate'), i * 300);
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

// ---------- COUNTDOWN TIMER ----------
function startCountdown() {
    function update() {
        const now = new Date();
        const diff = now - RELATIONSHIP_START;

        if (diff < 0) {
            // If the date is in the future, show zeros
            document.getElementById('countDays').textContent = '000';
            document.getElementById('countHours').textContent = '00';
            document.getElementById('countMins').textContent = '00';
            document.getElementById('countSecs').textContent = '00';
            return;
        }

        const secs  = Math.floor(diff / 1000);
        const mins  = Math.floor(secs / 60);
        const hours = Math.floor(mins / 60);
        const days  = Math.floor(hours / 24);

        document.getElementById('countDays').textContent  = String(days).padStart(3, '0');
        document.getElementById('countHours').textContent = String(hours % 24).padStart(2, '0');
        document.getElementById('countMins').textContent  = String(mins % 60).padStart(2, '0');
        document.getElementById('countSecs').textContent  = String(secs % 60).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ---------- RESIZE HANDLER ----------
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// ---------- CLICK HEARTS EFFECT ----------
document.addEventListener('click', (e) => {
    // Don't create hearts on buttons
    if (e.target.closest('.btn')) return;

    const heart = document.createElement('span');
    heart.textContent = ['💕', '❤️', '💖', '✨'][Math.floor(Math.random() * 4)];
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '10000';
    heart.style.transition = 'all 1s ease-out';
    heart.style.opacity = '1';
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
        heart.style.transform = `translateY(-80px) scale(0.3)`;
        heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 1000);
});
