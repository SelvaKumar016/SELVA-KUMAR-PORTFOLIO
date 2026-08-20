/* ==========================================================================
   ULTRA-PREMIUM PORTFOLIO JS (GSAP + LENIS + NEURAL MESH)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LENIS SMOOTH SCROLLING --- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* --- 2. GSAP SCROLLTRIGGER SETUP --- */
    gsap.registerPlugin(ScrollTrigger);

    // Preloader Sequence
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('preloader-loading-bar');
    
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            
            // GSAP Intro Animation
            const tl = gsap.timeline();
            tl.to(loadingBar, { width: '100%', duration: 0.2 })
              .to(preloader, { yPercent: -100, duration: 1.2, ease: "power4.inOut", delay: 0.5 })
              .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
              .from(".hero-badge", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");
        }
        loadingBar.style.width = progress + '%';
    }, 100);

    // Section Titles Reveal
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Certifications Staggered Reveal
    gsap.from('.cert-row', {
        scrollTrigger: {
            trigger: '.certs-list',
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Lab Cards Staggered Reveal
    gsap.from('.glass-card', {
        scrollTrigger: {
            trigger: '.lab-grid',
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    /* --- 3. CUSTOM CURSOR & MAGNETIC BUTTONS --- */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const updateCursor = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Hover state
        document.querySelectorAll('a, button, .glass-card, .cert-row').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Dynamic Lighting on Cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    } else {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
    }

    /* --- 4. NEURAL NETWORK CANVAS 2.0 --- */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        // Ensure it's visible now
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const nodes = [];
        const numNodes = window.innerWidth < 768 ? 40 : 80;

        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        function drawNeuralNetwork() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < numNodes; i++) {
                let p1 = nodes[i];
                
                // Mouse Interaction
                if (!isTouchDevice) {
                    let dx = mouseX - p1.x;
                    let dy = mouseY - p1.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 210, 200, ${1 - dist/150})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                        
                        // Pull slightly
                        p1.x += dx * 0.01;
                        p1.y += dy * 0.01;
                    }
                }

                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0 || p1.x > width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > height) p1.vy *= -1;

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();

                for (let j = i + 1; j < numNodes; j++) {
                    let p2 = nodes[j];
                    let dx = p1.x - p2.x;
                    let dy = p1.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist/120)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawNeuralNetwork);
        }
        drawNeuralNetwork();
    }
});
