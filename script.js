// 1. Particle System (Extremely Subtle)
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const particlesContainer = document.getElementById('particles-js');

if (particlesContainer) {
    particlesContainer.appendChild(canvas);
}

let particles = [];
const PARTICLE_COUNT = 40; // Reduced count for subtlety

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3; // Very slow
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2;
        this.alpha = Math.random() * 0.3 + 0.1; // Low opacity
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(148, 163, 184, ${this.alpha * 0.4})`; // Muted blue-grey
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// 2. Magnetic Hover & 3D Tilt Effect
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate center relative position (-1 to 1)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        // Settings for tilt and magnetic pull
        const maxTilt = 8; // degrees
        const maxMove = 5; // pixels (magnetic pull)

        const rotateX = percentY * -maxTilt;
        const rotateY = percentX * maxTilt;

        const moveX = percentX * maxMove;
        const moveY = percentY * maxMove;

        // Apply transform
        // Important: preserve transparency and scale if needed
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translate3d(${moveX}px, ${moveY}px, 0)
        `;
    });

    card.addEventListener('mouseleave', () => {
        // Reset position on leave
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg) 
            rotateY(0deg)
            translate3d(0, 0, 0)
        `;
    });

    // 3. Ripple Effect on Click
    card.addEventListener('click', (e) => {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'rippleAnim 0.6s linear';

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '200px';
        ripple.style.height = '200px';

        // Add keyframes dynamically if not present (or assume CSS handles it, but this ensures it works)
        // Actually, let's use the .card::after logic in CSS by triggering a class if possible?
        // Simpler: Just append the element.
        card.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add dynamic keyframes for ripple if needed, but we'll stick to styles.css for clean separation
// The styles.css @keyframes ripple needs to match this animation name if we used class.
// But here we set animation directly. Let's ensure a global style exists or inject it.
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes rippleAnim {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
