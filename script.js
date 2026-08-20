/* ==========================================================================
   ULTRA-PREMIUM PORTFOLIO JS — CINEMATIC EDITION
   GSAP + Lenis + Neural Canvas + Magnetic Cursor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. LENIS SMOOTH SCROLL ───────────────────────────── */
    const lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Hook lenis into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ─── 2. GSAP REGISTER ─────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);

    /* ─── 3. PRELOADER ─────────────────────────────────────── */
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('preloader-loading-bar');
    const percentText = document.getElementById('preloader-percentage-text');

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 18 + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            loadingBar.style.width = '100%';
            percentText && (percentText.textContent = '100%');

            setTimeout(() => {
                preloader.classList.add('done');

                // Big hero title entrance
                gsap.fromTo('.hero-badge',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
                );
                gsap.fromTo('.hero-title',
                    { y: '120%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 1.4, ease: 'power4.out', delay: 0.4 }
                );
                gsap.fromTo('.hero-subtitle',
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.9 }
                );
                gsap.fromTo('.scroll-hint',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.3 }
                );
            }, 500);
        }
        loadingBar.style.width = progress + '%';
        if (percentText) percentText.textContent = Math.round(progress) + '%';
    }, 80);

    /* ─── 4. NAVBAR SCROLL STATE ───────────────────────────── */
    const navbar = document.querySelector('.navbar');
    lenis.on('scroll', ({ scroll }) => {
        navbar && navbar.classList.toggle('scrolled', scroll > 80);
    });

    /* ─── 4b. MOBILE NAV TOGGLE ────────────────────────────── */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('open'));
        });
    }

    /* ─── 5. GSAP SCROLL ANIMATIONS ───────────────────────── */

    // Section titles slide up
    gsap.utils.toArray('.section-number, .section-title, .section-brief').forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            }
        );
    });

    // Cards stagger in
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
                delay: (i % 2) * 0.15,
                scrollTrigger: { trigger: card, start: 'top 90%' }
            }
        );
    });

    // Cert rows cascade in
    gsap.utils.toArray('.cert-row').forEach((row, i) => {
        gsap.fromTo(row,
            { x: -30, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
                delay: i * 0.07,
                scrollTrigger: { trigger: row, start: 'top 92%' }
            }
        );
    });

    // Divider line reveals
    gsap.utils.toArray('.divider-line').forEach(line => {
        ScrollTrigger.create({
            trigger: line,
            start: 'top 85%',
            onEnter: () => line.classList.add('revealed')
        });
    });

    // Portrait parallax
    const portrait = document.querySelector('.portrait-img');
    if (portrait) {
        gsap.to(portrait, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: portrait,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    /* ─── 6. CUSTOM CURSOR ─────────────────────────────────── */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
        cursorDot && (cursorDot.style.display = 'none');
        cursorRing && (cursorRing.style.display = 'none');
        document.body.style.cursor = 'auto';
    } else {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';
        });

        const tickCursor = () => {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';
            requestAnimationFrame(tickCursor);
        };
        tickCursor();

        // Hover states
        document.querySelectorAll('a, button, .glass-card, .cert-row, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Card spotlight effect
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
            });
        });
    }

    /* ─── 7. NEURAL MESH CANVAS 2.0 ────────────────────────── */
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    const COUNT = window.innerWidth < 768 ? 45 : 90;
    const CONNECT_DIST = 130;
    const MOUSE_DIST = 180;

    const nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.5 + 0.5
    }));

    function drawMesh() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < COUNT; i++) {
            const n = nodes[i];

            // Mouse attraction
            const mdx = mx - n.x, mdy = my - n.y;
            const md = Math.hypot(mdx, mdy);
            if (md < MOUSE_DIST && !isTouchDevice) {
                n.vx += (mdx / md) * 0.02;
                n.vy += (mdy / md) * 0.02;

                // Glow line to cursor
                const alpha = (1 - md / MOUSE_DIST) * 0.7;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 210, 200, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mx, my);
                ctx.stroke();
            }

            // Speed cap
            const speed = Math.hypot(n.vx, n.vy);
            if (speed > 1.2) { n.vx *= 0.95; n.vy *= 0.95; }

            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;

            // Draw node
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < COUNT; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x, dy = n.y - n2.y;
                const d = Math.hypot(dx, dy);
                if (d < CONNECT_DIST) {
                    const alpha = (1 - d / CONNECT_DIST) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawMesh);
    }
    drawMesh();
});
