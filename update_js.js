const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const replacement = `
    /* ─── 3. CINEMATIC INTRO ───────────────────────────────── */
    const introScreen = document.getElementById('intro-screen');
    
    // Scale container smoothly
    gsap.fromTo('.intro-name',
        { scale: 0.96 },
        { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
    
    // Letters rise up with slight blur
    gsap.fromTo('.intro-char',
        { y: '120%', opacity: 0, filter: 'blur(8px)' },
        { 
            y: '0%', opacity: 1, filter: 'blur(0px)', 
            duration: 1.0, stagger: 0.03, ease: 'power3.out',
            onComplete: () => {
                // Hold for a moment, then fade out the whole intro screen
                gsap.to(introScreen, {
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        introScreen.style.display = 'none';
                        
                        // Fire hero section entrance animations
                        gsap.fromTo('.hero-badge',
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
                        );
                        gsap.fromTo('.hero-title',
                            { scale: 0.96, opacity: 0, filter: 'blur(10px)' },
                            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out' }
                        );
                        gsap.fromTo('.hero-subtitle',
                            { y: 40, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
                        );
                        gsap.fromTo('.scroll-hint',
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }
                        );
                    }
                });
            }
        }
    );
`;

const startIndex = js.indexOf('/* ─── 3. PRELOADER');
const endIndex = js.indexOf('/* ─── 4. NAVBAR SCROLL STATE');

if (startIndex !== -1 && endIndex !== -1) {
    js = js.substring(0, startIndex) + replacement + "\n    " + js.substring(endIndex);
    fs.writeFileSync('script.js', js, 'utf8');
    console.log("Replaced successfully!");
} else {
    // Try matching corrupted comment
    const altStart = js.indexOf('3. PRELOADER');
    const altEnd = js.indexOf('4. NAVBAR SCROLL STATE');
    if (altStart !== -1 && altEnd !== -1) {
        const startLine = js.lastIndexOf('\n', altStart);
        const endLine = js.lastIndexOf('\n', altEnd);
        js = js.substring(0, startLine) + replacement + "\n    " + js.substring(endLine);
        fs.writeFileSync('script.js', js, 'utf8');
        console.log("Replaced alt successfully!");
    } else {
        console.log("Could not find blocks.");
    }
}
