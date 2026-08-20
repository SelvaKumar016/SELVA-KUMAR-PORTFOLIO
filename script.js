/* ==========================================================================
   Selva Kumar R - Luxury Editorial Script Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Cap Device Pixel Ratio to optimize GPU/CPU rendering performance
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    /* ==========================================================================
       1. Custom Cursor & Ambient Background Aura
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const glowAura = document.getElementById('glow-aura'); // Removed in HTML
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
    } else {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Toggle hover indicators on active links/buttons
        const applyHoverListeners = () => {
            const hoverElements = document.querySelectorAll('a, button, .lab-card, .cert-row, input, textarea');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        };
        applyHoverListeners();

        // Update cursor ring and background glows with custom inertia
        const updatePhysicsCursor = () => {
            const easeRing = 0.12;
            const easeAura = 0.06;

            ringX += (mouseX - ringX) * easeRing;
            ringY += (mouseY - ringY) * easeRing;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            auraX += (mouseX - auraX) * easeAura;
            auraY += (mouseY - auraY) * easeAura;
            if(glowAura) {
                glowAura.style.left = `${auraX - 225}px`;
                glowAura.style.top = `${auraY - 225}px`;
            }

            requestAnimationFrame(updatePhysicsCursor);
        };
        updatePhysicsCursor();
    }


    /* ==========================================================================
       2. Cinematic Preloader & Curtain Reveal
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('preloader-loading-bar');
    const percentText = document.getElementById('preloader-percentage-text');
    let progress = 0;

    const triggerCurtainReveal = () => {
        clearInterval(loadingInterval);
        progress = 100;
        loadingBar.style.width = '100%';
        percentText.textContent = '100%';

        setTimeout(() => {
            preloader.classList.add('wipe-curtain');
            
            // Fade preloader content out first
            setTimeout(() => {
                preloader.querySelector('.preloader-content').style.opacity = '0';
            }, 300);

            // Hide preloader overlay completely and trigger entrance anims
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.add('loaded');
                
                // Animate horizontal division lines
                setTimeout(() => {
                    document.querySelectorAll('.divider-line').forEach(line => {
                        line.classList.add('revealed');
                    });
                }, 400);
            }, 1000);
        }, 350);
    };

    // Incremental progress counter loading
    const loadingInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.floor(Math.random() * 9) + 3;
            if (progress > 90) progress = 90;
            loadingBar.style.width = `${progress}%`;
            percentText.textContent = `${progress}%`;
        }
    }, 70);

    window.addEventListener('load', triggerCurtainReveal);
    
    // Safety timeout fallback
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) {
            triggerCurtainReveal();
        }
    }, 3000);


    /* ==========================================================================
       3. Ambient Hero Drifting Particle Canvas
       ========================================================================== */
    const heroSection = document.getElementById('hero');
    const neuralCanvas = document.getElementById('neural-canvas');
    const ctxNeural = neuralCanvas.getContext('2d');
    
    let heroWidth = neuralCanvas.width = heroSection.offsetWidth * dpr;
    let heroHeight = neuralCanvas.height = heroSection.offsetHeight * dpr;
    ctxNeural.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        if (heroSection.offsetWidth > 0) {
            heroWidth = neuralCanvas.width = heroSection.offsetWidth * dpr;
            heroHeight = neuralCanvas.height = heroSection.offsetHeight * dpr;
            ctxNeural.scale(dpr, dpr);
        }
    });

    const starParticles = [];
    // Reduced particle counts on mobile viewports
    const particleMaxCount = window.innerWidth < 768 ? 40 : 70;
    let starsGatherCenter = false;

    class StarParticle {
        constructor() {
            this.x = Math.random() * (heroWidth / dpr);
            this.y = Math.random() * (heroHeight / dpr);
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
            this.radius = Math.random() * 1.0 + 0.5;
        }

        update() {
            if (starsGatherCenter) {
                // Drag particles towards center coordinates in Contact section end
                const centerX = (heroWidth / dpr) / 2;
                const centerY = (heroHeight / dpr) / 2;
                this.x += (centerX - this.x) * 0.015;
                this.y += (centerY - this.y) * 0.015;
            } else {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > (heroWidth / dpr)) this.vx *= -1;
                if (this.y < 0 || this.y > (heroHeight / dpr)) this.vy *= -1;

                // Mouse drag force
                if (!isTouchDevice) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 150) {
                        this.x += (dx / dist) * 0.08;
                        this.y += (dy / dist) * 0.08;
                    }
                }
            }
        }

        draw() {
            ctxNeural.beginPath();
            ctxNeural.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctxNeural.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctxNeural.fill();
        }
    }

    for (let i = 0; i < particleMaxCount; i++) {
        starParticles.push(new StarParticle());
    }

    const animateStarUniverse = () => {
        ctxNeural.clearRect(0, 0, heroWidth / dpr, heroHeight / dpr);

        starParticles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateStarUniverse);
    };
    animateStarUniverse();


    /* ==========================================================================
       4. Skills Constellation Node Assembly
       ========================================================================== */
    const skillsCanvas = document.getElementById('skills-canvas');
    const ctxSkills = skillsCanvas.getContext('2d');
    const skillWrapper = skillsCanvas.parentElement;

    let skillWidth = skillsCanvas.width = skillWrapper.offsetWidth * dpr;
    let skillHeight = skillsCanvas.height = skillWrapper.offsetHeight * dpr;
    ctxSkills.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        if (skillWrapper.offsetWidth > 0) {
            skillWidth = skillsCanvas.width = skillWrapper.offsetWidth * dpr;
            skillHeight = skillsCanvas.height = skillWrapper.offsetHeight * dpr;
            ctxSkills.scale(dpr, dpr);
            positionSkillNodes();
        }
    });

    const skillNodes = [
        { id: 'py', label: 'Python', desc: 'Core language proficiency. Used for logical structuring, data structures solutions, dynamic object scripting, and analysis libraries.', tags: ['OOP', 'Scripts', 'Generators'], normX: 0.28, normY: 0.35, glowColor: '#00ff87' },
        { id: 'cpp', label: 'C++', desc: 'Academic programming structure. Experienced with pointer parameters, reference matrices, allocations, and sorting algorithms.', tags: ['Structures', 'Pointers', 'Complexity'], normX: 0.5, normY: 0.22, glowColor: '#00ff87' },
        { id: 'java', label: 'Java', desc: 'Standard object architecture. Learning inheritance loops, polymorphic systems, dynamic compilation, and classes structures.', tags: ['Classes', 'Inheritance', 'JVM'], normX: 0.72, normY: 0.35, glowColor: '#00ff87' },
        { id: 'sql', label: 'SQL Databases', desc: 'Relational data queries. Writing join tables statements, schema tables setups, group queries, and indexes tags.', tags: ['PostgreSQL', 'Tables', 'Schema Design'], normX: 0.35, normY: 0.68, glowColor: '#00ff87' },
        { id: 'ml', label: 'Machine Learning', desc: 'Computational models. Exploring parameters tuning, dataset training splitting, regression boundaries, and classifications models.', tags: ['Supervised', 'Models', 'Scikit-Learn'], normX: 0.6, normY: 0.74, glowColor: '#00ff87' },
        { id: 'ds', label: 'Data Science', desc: 'Dataset analytics. Cleaning data arrays columns, correlating distributions values, and plotting trend metrics in code grids.', tags: ['Pandas', 'NumPy', 'Data Cleaning'], normX: 0.78, normY: 0.62, glowColor: '#00ff87' }
    ];

    let constellationAssembled = false;
    let lineDrawProgress = 0; // 0 to 1 progressive drawing of connections
    let hoveredNode = null;
    let skillMouseX = -1000;
    let skillMouseY = -1000;

    const positionSkillNodes = () => {
        skillNodes.forEach(node => {
            node.targetX = node.normX * (skillWidth / dpr);
            node.targetY = node.normY * (skillHeight / dpr);
            
            // Spawn nodes at random locations initially before assembly animation
            if (!constellationAssembled) {
                node.x = Math.random() * (skillWidth / dpr);
                node.y = Math.random() * (skillHeight / dpr);
            } else {
                node.x = node.targetX;
                node.y = node.targetY;
            }
            
            node.angle = Math.random() * Math.PI * 2;
            node.driftSpeed = 0.008 + Math.random() * 0.008;
            node.driftRadius = 3 + Math.random() * 3;
        });
    };
    positionSkillNodes();

    const skillNameUI = document.getElementById('skill-name');
    const skillDescUI = document.getElementById('skill-desc');
    const skillTagsUI = document.getElementById('skill-tags');

    const updateSkillPanel = (node) => {
        if (!node) {
            skillNameUI.textContent = "Select a Node";
            skillNameUI.style.color = '#ffffff';
            skillDescUI.textContent = "Hover over any node in the constellation on the left to review descriptions, proficiencies, and libraries.";
            skillTagsUI.innerHTML = "";
            return;
        }

        skillNameUI.textContent = node.label;
        skillNameUI.style.color = node.glowColor;
        skillDescUI.textContent = node.desc;
        
        let tagsHtml = "";
        node.tags.forEach(tag => {
            tagsHtml += `<span class="skill-tag hl">${tag}</span>`;
        });
        skillTagsUI.innerHTML = tagsHtml;
    };

    skillsCanvas.addEventListener('mousemove', (e) => {
        const rect = skillsCanvas.getBoundingClientRect();
        skillMouseX = e.clientX - rect.left;
        skillMouseY = e.clientY - rect.top;
    });

    skillsCanvas.addEventListener('mouseleave', () => {
        skillMouseX = -1000;
        skillMouseY = -1000;
    });

    // Node click sends emerald pulse
    const activePulses = [];
    skillsCanvas.addEventListener('click', () => {
        if (hoveredNode) {
            activePulses.push({
                x: hoveredNode.x + (hoveredNode.driftX || 0),
                y: hoveredNode.y + (hoveredNode.driftY || 0),
                radius: 1,
                maxRadius: (skillWidth / dpr) * 0.35,
                speed: 4
            });
        }
    });

    const animateSkillConstellation = () => {
        ctxSkills.clearRect(0, 0, skillWidth / dpr, skillHeight / dpr);
        hoveredNode = null;

        // Assembly transition: slide from random start locations to targets
        let reachedCount = 0;
        skillNodes.forEach(node => {
            if (constellationAssembled) {
                // Floating noise drift
                node.angle += node.driftSpeed;
                node.driftX = Math.cos(node.angle) * node.driftRadius;
                node.driftY = Math.sin(node.angle * 1.2) * node.driftRadius;
            } else {
                node.driftX = 0;
                node.driftY = 0;
                node.x += (node.targetX - node.x) * 0.05;
                node.y += (node.targetY - node.y) * 0.05;

                if (Math.hypot(node.targetX - node.x, node.targetY - node.y) < 1.0) {
                    reachedCount++;
                }
            }

            const currentX = node.x + (node.driftX || 0);
            const currentY = node.y + (node.driftY || 0);

            const dx = skillMouseX - currentX;
            const dy = skillMouseY - currentY;
            if (Math.hypot(dx, dy) < 14) {
                hoveredNode = node;
            }
        });

        if (reachedCount === skillNodes.length && !constellationAssembled) {
            constellationAssembled = true;
        }

        // Draw connections progressively once assembled
        if (constellationAssembled) {
            if (lineDrawProgress < 1.0) {
                lineDrawProgress += 0.015;
            }
            
            skillNodes.forEach((node, i) => {
                const currentX = node.x + node.driftX;
                const currentY = node.y + node.driftY;

                for (let j = i + 1; j < skillNodes.length; j++) {
                    const other = skillNodes[j];
                    const otherX = other.x + other.driftX;
                    const otherY = other.y + other.driftY;
                    const dist = Math.hypot(currentX - otherX, currentY - otherY);

                    // Connect lines if distance is reasonable
                    if (dist < (skillWidth / dpr) * 0.45) {
                        const isHoveredSystem = hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === other.id);
                        
                        ctxSkills.beginPath();
                        ctxSkills.moveTo(currentX, currentY);
                        // Progressively draw the line
                        const lx = currentX + (otherX - currentX) * lineDrawProgress;
                        const ly = currentY + (otherY - currentY) * lineDrawProgress;
                        ctxSkills.lineTo(lx, ly);
                        
                        ctxSkills.strokeStyle = isHoveredSystem 
                            ? `rgba(0, 255, 135, 0.28)` 
                            : `rgba(255, 255, 255, 0.04)`;
                        ctxSkills.lineWidth = isHoveredSystem ? 1.0 : 0.6;
                        ctxSkills.stroke();
                    }
                }
            });
        }

        // Draw active pulses
        activePulses.forEach((pulse, idx) => {
            pulse.radius += pulse.speed;
            
            ctxSkills.beginPath();
            ctxSkills.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
            ctxSkills.strokeStyle = `rgba(0, 255, 135, ${0.3 * (1 - pulse.radius / pulse.maxRadius)})`;
            ctxSkills.lineWidth = 1.0;
            ctxSkills.stroke();

            if (pulse.radius >= pulse.maxRadius) {
                activePulses.splice(idx, 1);
            }
        });

        // Draw nodes
        skillNodes.forEach(node => {
            const currentX = node.x + (node.driftX || 0);
            const currentY = node.y + (node.driftY || 0);
            const isActive = hoveredNode && hoveredNode.id === node.id;

            // Halo back glow
            ctxSkills.beginPath();
            ctxSkills.arc(currentX, currentY, isActive ? 12 : 6, 0, Math.PI * 2);
            ctxSkills.fillStyle = isActive ? 'rgba(0, 255, 135, 0.08)' : 'rgba(255, 255, 255, 0.01)';
            ctxSkills.fill();

            // Core center dot
            ctxSkills.beginPath();
            ctxSkills.arc(currentX, currentY, 3, 0, Math.PI * 2);
            ctxSkills.fillStyle = isActive ? '#00ff87' : '#ffffff';
            ctxSkills.fill();

            // Outward Ring
            ctxSkills.beginPath();
            ctxSkills.arc(currentX, currentY, 7, 0, Math.PI * 2);
            ctxSkills.strokeStyle = isActive ? '#00ff87' : 'rgba(255, 255, 255, 0.12)';
            ctxSkills.lineWidth = 1.0;
            ctxSkills.stroke();

            // Labels
            ctxSkills.font = `500 10px 'Space Grotesk', sans-serif`;
            ctxSkills.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
            ctxSkills.textAlign = 'center';
            ctxSkills.fillText(node.label, currentX, currentY - 12);
        });

        if (hoveredNode) {
            updateSkillPanel(hoveredNode);
        } else {
            if (skillMouseX === -1000) updateSkillPanel(null);
        }

        requestAnimationFrame(animateSkillConstellation);
    };
    animateSkillConstellation();

    // Trigger skills constellation assembly when entering section viewport
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Assembly trigger starts
                constellationAssembled = false;
                positionSkillNodes();
            }
        });
    }, { threshold: 0.15 });
    const skillsSection = document.getElementById('skills');
    if (skillsSection) skillsObserver.observe(skillsSection);


    /* ==========================================================================
       5. Experimental Lab Active Simulations & Transitions
       ========================================================================== */
    const activeCanvases = { boids: false, pendulum: false, flow: false };
    const hoverCanvases = { boids: false, pendulum: false, flow: false };

    const createCanvasObserver = (id, key) => {
        const el = document.getElementById(id);
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                activeCanvases[key] = entry.isIntersecting;
                
                // Standby -> Active status transitions on entrance triggers
                const statusTag = document.getElementById(`hud-status-${key}`);
                if (statusTag) {
                    if (entry.isIntersecting) {
                        statusTag.className = "hud-status active";
                        statusTag.textContent = "ACTIVE";
                    } else {
                        statusTag.className = "hud-status standby";
                        statusTag.textContent = "STANDBY";
                    }
                }
            });
        }, { threshold: 0.05 });
        observer.observe(el);
    };
    createCanvasObserver('boids-canvas', 'boids');
    createCanvasObserver('pendulum-canvas', 'pendulum');
    createCanvasObserver('flow-canvas', 'flow');

    // Hover cards triggers state enhancements
    const setHoverListeners = (cardId, key) => {
        const card = document.getElementById(cardId);
        if (!card) return;
        card.addEventListener('mouseenter', () => {
            hoverCanvases[key] = true;
        });
        card.addEventListener('mouseleave', () => {
            hoverCanvases[key] = false;
        });
    };
    setHoverListeners('lab-card-boids', 'boids');
    setHoverListeners('lab-card-pendulum', 'pendulum');
    setHoverListeners('lab-card-flow', 'flow');


    /* --- LAB 1: BOIDS SWARM --- */
    const boidsCanvas = document.getElementById('boids-canvas');
    const ctxBoids = boidsCanvas.getContext('2d');
    let boidsWidth = boidsCanvas.width = boidsCanvas.offsetWidth * dpr;
    let boidsHeight = boidsCanvas.height = boidsCanvas.offsetHeight * dpr;
    ctxBoids.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        if (boidsCanvas.offsetWidth > 0) {
            boidsWidth = boidsCanvas.width = boidsCanvas.offsetWidth * dpr;
            boidsHeight = boidsCanvas.height = boidsCanvas.offsetHeight * dpr;
            ctxBoids.scale(dpr, dpr);
        }
    });

    const boids = [];
    const boidsCount = 28;

    class Boid {
        constructor() {
            this.x = Math.random() * (boidsWidth / dpr);
            this.y = Math.random() * (boidsHeight / dpr);
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.maxSpeed = 1.6;
        }

        update(boidsList, mouseInCanvas, mX, mY, speedMultiplier) {
            let alignX = 0, alignY = 0;
            let cohX = 0, cohY = 0;
            let sepX = 0, sepY = 0;
            let count = 0;

            const localDistance = 35;
            const currentMaxSpeed = this.maxSpeed * speedMultiplier;

            boidsList.forEach(other => {
                if (other === this) return;
                const d = Math.hypot(this.x - other.x, this.y - other.y);
                if (d < localDistance) {
                    alignX += other.vx;
                    alignY += other.vy;

                    cohX += other.x;
                    cohY += other.y;

                    if (d > 0) {
                        sepX += (this.x - other.x) / d;
                        sepY += (this.y - other.y) / d;
                    }
                    count++;
                }
            });

            if (count > 0) {
                alignX /= count;
                alignY /= count;
                const aSpeed = Math.hypot(alignX, alignY);
                if (aSpeed > 0) {
                    alignX = (alignX / aSpeed) * currentMaxSpeed - this.vx;
                    alignY = (alignY / aSpeed) * currentMaxSpeed - this.vy;
                }

                cohX /= count;
                cohY /= count;
                const cDx = cohX - this.x;
                const cDy = cohY - this.y;
                const cDist = Math.hypot(cDx, cDy);
                if (cDist > 0) {
                    cohX = (cDx / cDist) * currentMaxSpeed - this.vx;
                    cohY = (cDy / cDist) * currentMaxSpeed - this.vy;
                }

                const sSpeed = Math.hypot(sepX, sepY);
                if (sSpeed > 0) {
                    sepX = (sepX / sSpeed) * currentMaxSpeed - this.vx;
                    sepY = (sepY / sSpeed) * currentMaxSpeed - this.vy;
                }

                this.vx += alignX * 0.6 + cohX * 0.4 + sepX * 1.0;
                this.vy += alignY * 0.6 + cohY * 0.4 + sepY * 1.0;
            }

            // Mouse force guides agents on hover attraction
            if (mouseInCanvas) {
                const mdX = mX - this.x;
                const mdY = mY - this.y;
                const mDist = Math.hypot(mdX, mdY);
                if (mDist < 100) {
                    const pull = (100 - mDist) / 100 * 0.04;
                    this.vx += (mdX / mDist) * pull;
                    this.vy += (mdY / mDist) * pull;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wraparound boundaries
            if (this.x < 0) this.x = boidsWidth / dpr;
            if (this.x > boidsWidth / dpr) this.x = 0;
            if (this.y < 0) this.y = boidsHeight / dpr;
            if (this.y > boidsHeight / dpr) this.y = 0;

            const speed = Math.hypot(this.vx, this.vy);
            if (speed > currentMaxSpeed) {
                this.vx = (this.vx / speed) * currentMaxSpeed;
                this.vy = (this.vy / speed) * currentMaxSpeed;
            }
        }

        draw() {
            const angle = Math.atan2(this.vy, this.vx);
            ctxBoids.save();
            ctxBoids.translate(this.x, this.y);
            ctxBoids.rotate(angle);
            ctxBoids.beginPath();
            ctxBoids.moveTo(6, 0);
            ctxBoids.lineTo(-5, -3);
            ctxBoids.lineTo(-3, 0);
            ctxBoids.lineTo(-5, 3);
            ctxBoids.closePath();
            ctxBoids.fillStyle = '#ffffff';
            ctxBoids.fill();
            ctxBoids.restore();
        }
    }



    for (let i = 0; i < boidsCount; i++) {
        boids.push(new Boid());
    }

    let boidsMouseIn = false;
    let boidsMouseX = 0;
    let boidsMouseY = 0;

    boidsCanvas.addEventListener('mousemove', (e) => {
        const rect = boidsCanvas.getBoundingClientRect();
        boidsMouseX = e.clientX - rect.left;
        boidsMouseY = e.clientY - rect.top;
        boidsMouseIn = true;
    });

    boidsCanvas.addEventListener('mouseleave', () => {
        boidsMouseIn = false;
    });

    const loopBoids = () => {
        if (activeCanvases.boids) {
            ctxBoids.fillStyle = 'rgba(5, 5, 5, 0.25)';
            ctxBoids.fillRect(0, 0, boidsWidth / dpr, boidsHeight / dpr);

            // Simulation speed multiplier increases slightly on hover (1.0 -> 1.5)
            const speedMult = hoverCanvases.boids ? 1.5 : 1.0;

            boids.forEach(b => {
                b.update(boids, boidsMouseIn, boidsMouseX, boidsMouseY, speedMult);
                b.draw();
            });
        }
        requestAnimationFrame(loopBoids);
    };
    loopBoids();


    /* --- LAB 2: CHAOS DOUBLE PENDULUM --- */
    const pendCanvas = document.getElementById('pendulum-canvas');
    const ctxPend = pendCanvas.getContext('2d');
    let pendWidth = pendCanvas.width = pendCanvas.offsetWidth * dpr;
    let pendHeight = pendCanvas.height = pendCanvas.offsetHeight * dpr;
    ctxPend.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        if (pendCanvas.offsetWidth > 0) {
            pendWidth = pendCanvas.width = pendCanvas.offsetWidth * dpr;
            pendHeight = pendCanvas.height = pendCanvas.offsetHeight * dpr;
            ctxPend.scale(dpr, dpr);
        }
    });

    const pl1 = 60;
    const pl2 = 50;
    const pm1 = 10;
    const pm2 = 8;
    let pa1 = Math.PI / 2;
    let pa2 = Math.PI / 2;
    let pg1 = 0;
    let pg2 = 0;
    const pg = 0.18;

    const pendTrail = [];
    const maxTrail = 70;
    let pendDragging = false;
    let dragBob = null;

    let pMouseX = 0;
    let pMouseY = 0;

    const getBobCoords = () => {
        const originX = (pendWidth / dpr) / 2;
        const originY = (pendHeight / dpr) / 3 + 10;
        const x1 = originX + pl1 * Math.sin(pa1);
        const y1 = originY + pl1 * Math.cos(pa1);
        const x2 = x1 + pl2 * Math.sin(pa2);
        const y2 = y1 + pl2 * Math.cos(pa2);
        return { originX, originY, x1, y1, x2, y2 };
    };

    pendCanvas.addEventListener('mousedown', (e) => {
        const rect = pendCanvas.getBoundingClientRect();
        pMouseX = e.clientX - rect.left;
        pMouseY = e.clientY - rect.top;

        const { x1, y1, x2, y2 } = getBobCoords();
        
        if (Math.hypot(pMouseX - x2, pMouseY - y2) < 15) {
            pendDragging = true;
            dragBob = 'bob2';
        } else if (Math.hypot(pMouseX - x1, pMouseY - y1) < 15) {
            pendDragging = true;
            dragBob = 'bob1';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!pendDragging) return;
        const rect = pendCanvas.getBoundingClientRect();
        pMouseX = e.clientX - rect.left;
        pMouseY = e.clientY - rect.top;

        const { originX, originY } = getBobCoords();
        if (dragBob === 'bob1') {
            pa1 = Math.atan2(pMouseX - originX, pMouseY - originY);
            pg1 = 0; pg2 = 0;
        } else if (dragBob === 'bob2') {
            const { x1, y1 } = getBobCoords();
            pa2 = Math.atan2(pMouseX - x1, pMouseY - y1);
            pg1 = 0; pg2 = 0;
        }
    });

    window.addEventListener('mouseup', () => {
        pendDragging = false;
        dragBob = null;
    });

    const loopPendulum = () => {
        if (activeCanvases.pendulum) {
            ctxPend.fillStyle = 'rgba(5, 5, 5, 0.15)';
            ctxPend.fillRect(0, 0, pendWidth / dpr, pendHeight / dpr);

            const { originX, originY, x1, y1, x2, y2 } = getBobCoords();

            if (!pendDragging) {
                // Euler Numerical physics integrations
                const stepCount = hoverCanvases.pendulum ? 2 : 1; // Speed multiplier on hover runs calculations twice per frame
                for (let step = 0; step < stepCount; step++) {
                    const num1 = -pg * (2 * pm1 + pm2) * Math.sin(pa1) - pm2 * pg * Math.sin(pa1 - 2 * pa2) - 2 * Math.sin(pa1 - pa2) * pm2 * (pg2 * pg2 * pl2 + pg1 * pg1 * pl1 * Math.cos(pa1 - pa2));
                    const den1 = pl1 * (2 * pm1 + pm2 - pm2 * Math.cos(2 * pa1 - 2 * pa2));
                    const acc1 = num1 / den1;

                    const num2 = 2 * Math.sin(pa1 - pa2) * (pg1 * pg1 * pl1 * (pm1 + pm2) + pg * (pm1 + pm2) * Math.cos(pa1) + pg2 * pg2 * pl2 * pm2 * Math.cos(pa1 - pa2));
                    const den2 = pl2 * (2 * pm1 + pm2 - pm2 * Math.cos(2 * pa1 - 2 * pa2));
                    const acc2 = num2 / den2;

                    pg1 += acc1;
                    pg2 += acc2;
                    pa1 += pg1;
                    pa2 += pg2;

                    // Soft velocity damping
                    pg1 *= 0.997;
                    pg2 *= 0.997;
                }
            }

            // Append trail bob 2
            pendTrail.push({ x: x2, y: y2 });
            if (pendTrail.length > maxTrail) pendTrail.shift();

            // Trace wireframe trail
            ctxPend.beginPath();
            for (let i = 0; i < pendTrail.length - 1; i++) {
                const alpha = i / pendTrail.length * 0.35;
                ctxPend.strokeStyle = `rgba(0, 255, 135, ${alpha})`;
                ctxPend.lineWidth = 1.0;
                ctxPend.beginPath();
                ctxPend.moveTo(pendTrail[i].x, pendTrail[i].y);
                ctxPend.lineTo(pendTrail[i+1].x, pendTrail[i+1].y);
                ctxPend.stroke();
            }

            // Draw link rods
            ctxPend.beginPath();
            ctxPend.moveTo(originX, originY);
            ctxPend.lineTo(x1, y1);
            ctxPend.lineTo(x2, y2);
            ctxPend.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctxPend.lineWidth = 1.5;
            ctxPend.stroke();

            // Draw bobs
            ctxPend.beginPath();
            ctxPend.arc(originX, originY, 3, 0, Math.PI * 2);
            ctxPend.fillStyle = '#ffffff';
            ctxPend.fill();

            // Bob 1
            ctxPend.beginPath();
            ctxPend.arc(x1, y1, 6, 0, Math.PI * 2);
            ctxPend.fillStyle = '#ffffff';
            ctxPend.fill();

            // Bob 2 (emerald accent)
            ctxPend.beginPath();
            ctxPend.arc(x2, y2, 6, 0, Math.PI * 2);
            ctxPend.fillStyle = '#00ff87';
            ctxPend.fill();
        }
        requestAnimationFrame(loopPendulum);
    };
    loopPendulum();


    /* --- LAB 3: VECTOR FLOW FIELD --- */
    const flowCanvas = document.getElementById('flow-canvas');
    const ctxFlow = flowCanvas.getContext('2d');
    let flowWidth = flowCanvas.width = flowCanvas.offsetWidth * dpr;
    let flowHeight = flowCanvas.height = flowCanvas.offsetHeight * dpr;
    ctxFlow.scale(dpr, dpr);

    window.addEventListener('resize', () => {
        if (flowCanvas.offsetWidth > 0) {
            flowWidth = flowCanvas.width = flowCanvas.offsetWidth * dpr;
            flowHeight = flowCanvas.height = flowCanvas.offsetHeight * dpr;
            ctxFlow.scale(dpr, dpr);
        }
    });

    const flowParticles = [];
    const flowCount = 100;
    
    let fxCoef = Math.random() * 0.08 + 0.04;
    let fyCoef = Math.random() * 0.08 + 0.04;
    let fScale = Math.random() * 4 + 2.5;
    
    // Drifts flowing particles downward out of field on scroll trigger
    let flowDriftDownwards = false;

    class FlowParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (flowWidth / dpr);
            this.y = Math.random() * (flowHeight / dpr);
            this.prevX = this.x;
            this.prevY = this.y;
            this.speed = Math.random() * 0.6 + 0.4;
            this.color = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 255, 135, 0.15)';
        }

        update(speedMultiplier) {
            this.prevX = this.x;
            this.prevY = this.y;

            if (flowDriftDownwards) {
                // Morphing illusion: drift particles off bottom bound to connect with Journey timeline dots
                this.y += 2.2 * speedMultiplier;
                this.x += (Math.random() - 0.5) * 0.5;
            } else {
                const angle = Math.sin(this.x * fxCoef) * Math.cos(this.y * fyCoef) * fScale;
                this.x += Math.cos(angle) * this.speed * speedMultiplier;
                this.y += Math.sin(angle) * this.speed * speedMultiplier;
            }

            // Boundary checks
            if (this.x < 0 || this.x > (flowWidth / dpr) || this.y < 0 || this.y > (flowHeight / dpr)) {
                this.reset();
                if (flowDriftDownwards) {
                    // Start particles at top to continue downward rain cascade
                    this.y = 0;
                }
            }
        }

        draw() {
            ctxFlow.beginPath();
            ctxFlow.moveTo(this.prevX, this.prevY);
            ctxFlow.lineTo(this.x, this.y);
            ctxFlow.strokeStyle = this.color;
            ctxFlow.lineWidth = 0.8;
            ctxFlow.stroke();
        }
    }

    for (let i = 0; i < flowCount; i++) {
        flowParticles.push(new FlowParticle());
    }

    flowCanvas.addEventListener('click', () => {
        fxCoef = Math.random() * 0.08 + 0.04;
        fyCoef = Math.random() * 0.08 + 0.04;
        fScale = Math.random() * 5 + 2.5;
        ctxFlow.clearRect(0, 0, flowWidth / dpr, flowHeight / dpr);
        flowParticles.forEach(p => p.reset());
    });

    const loopFlow = () => {
        if (activeCanvases.flow) {
            ctxFlow.fillStyle = 'rgba(5, 5, 5, 0.055)';
            ctxFlow.fillRect(0, 0, flowWidth / dpr, flowHeight / dpr);

            const speedMult = hoverCanvases.flow ? 1.6 : 1.0;

            flowParticles.forEach(p => {
                p.update(speedMult);
                p.draw();
            });
        }
        requestAnimationFrame(loopFlow);
    };
    loopFlow();


    /* ==========================================================================
       6. Lab to Journey Morphing Illusion & Scroll Highlights
       ========================================================================== */
    const timelineDot = document.getElementById('timeline-trigger-dot');
    const journeySection = document.getElementById('journey');

    const trackVisualMorph = () => {
        if (!journeySection) return;
        const rect = journeySection.getBoundingClientRect();
        
        // When user scrolls flow field out and journey in, enable downwards rain
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
            flowDriftDownwards = true;
            
            // Highlight timeline start dot
            if (rect.top < window.innerHeight * 0.6) {
                timelineDot.classList.add('active');
            } else {
                timelineDot.classList.remove('active');
            }
        } else {
            flowDriftDownwards = false;
        }

        // Gather stars toward center on contact scroll bottom
        const contactSec = document.getElementById('contact');
        if (contactSec) {
            const crect = contactSec.getBoundingClientRect();
            if (crect.top < window.innerHeight * 0.75) {
                starsGatherCenter = true;
            } else {
                starsGatherCenter = false;
            }
        }
    };
    window.addEventListener('scroll', trackVisualMorph);


    /* ==========================================================================
       7. Smooth Editorial Scroll Reveals & Clipping Masks
       ========================================================================== */
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is a timeline row, activate its dot marker
                if (entry.target.classList.contains('timeline-row')) {
                    const dot = entry.target.querySelector('.timeline-dot');
                    if (dot) dot.classList.add('active');
                }

                // If it is the contact heading, trigger word reveals
                if (entry.target.classList.contains('contact-header-mask')) {
                    entry.target.querySelectorAll('.contact-reveal-word').forEach(word => {
                        word.classList.add('revealed');
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .divider-line, .timeline-row, .cert-row, .contact-header-mask'
    );
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Custom Scroll Scaling for Hero name
    const heroNameText = document.getElementById('hero-title-name');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight && heroNameText) {
            // Scale down slowly on scroll
            const scaleVal = Math.max(0.85, 1 - (scrollY / window.innerHeight) * 0.15);
            heroNameText.style.transform = `scale(${scaleVal})`;
            heroNameText.style.opacity = `${Math.max(0, 1 - (scrollY / (window.innerHeight * 0.75)))}`;
        }
    });


    /* ==========================================================================
       8. Stats Count-Up Handler (Lite)
       ========================================================================== */
    let countUpTriggered = false;
    
    const initCountUp = () => {
        const statsSection = document.getElementById('about');
        if (!statsSection) return;
        
        const checkStatsScroll = () => {
            if (countUpTriggered) return;
            
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                countUpTriggered = true;
                const statNums = document.querySelectorAll('.stat-num');
                
                statNums.forEach(num => {
                    const target = parseInt(num.getAttribute('data-val'));
                    const duration = 1500;
                    const startTime = performance.now();

                    const updateCount = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // EaseOutQuad
                        const easeProgress = progress * (2 - progress);
                        const current = Math.floor(easeProgress * target);
                        
                        num.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            num.textContent = target;
                        }
                    };

                    requestAnimationFrame(updateCount);
                });
                
                window.removeEventListener('scroll', checkStatsScroll);
            }
        };

        window.addEventListener('scroll', checkStatsScroll);
        checkStatsScroll();
    };


    /* ==========================================================================
       9. Form Validation & Submission Handler
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = document.getElementById('submit-btn-text') || submitBtn.querySelector('span');
            
            submitBtn.disabled = true;
            submitBtnText.textContent = "TRANSMITTING...";
            
            formStatus.textContent = "";
            formStatus.className = "form-status";

            try {
                const response = await fetch(e.target.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.disabled = false;
                    submitBtnText.textContent = "Send Signal";
                    
                    formStatus.textContent = "SIGNAL TRANSMITTED. I WILL CONTACT YOU SHORTLY.";
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error("Transmission failed.");
                }
            } catch (error) {
                submitBtn.disabled = false;
                submitBtnText.textContent = "Send Signal";
                
                formStatus.textContent = "TRANSMISSION FAILED. PLEASE TRY AGAIN.";
                formStatus.classList.add('error'); // Needs styling if not present, but text communicates it
            }
                
            setTimeout(() => {
                formStatus.style.transition = "opacity 0.8s";
                formStatus.style.opacity = "0";
                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.style.opacity = "1";
                    formStatus.className = "form-status";
                }, 800);
            }, 4000);
        });
    }


    /* ==========================================================================
       10. Floating Header & Navigation Highlight
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('section, .hero-section');
    
    const highlightActiveNav = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav();


    /* ==========================================================================
       11. Portrait 3D Mouse-Tilt Parallax
       ========================================================================== */
    const portraitTilt   = document.getElementById('portrait-tilt');
    const portraitInner  = document.getElementById('portrait-inner');
    const portraitImg    = document.getElementById('portrait-img');

    if (portraitTilt && portraitInner && !isTouchDevice) {
        const MAX_TILT   = 12;    // max degrees of rotation
        const MAX_SHIFT  = 6;     // max px of image parallax shift
        const EASE_IN    = 0.12;  // inertia on mouse enter
        const EASE_OUT   = 0.06;  // inertia on mouse leave

        let tiltRX = 0, tiltRY = 0;
        let targetRX = 0, targetRY = 0;
        let shiftX = 0, shiftY = 0;
        let targetShiftX = 0, targetShiftY = 0;
        let isOverPortrait = false;
        let tiltAnimId = null;

        const animateTilt = () => {
            const ease = isOverPortrait ? EASE_IN : EASE_OUT;

            tiltRX += (targetRX - tiltRX) * ease;
            tiltRY += (targetRY - tiltRY) * ease;
            shiftX += (targetShiftX - shiftX) * ease;
            shiftY += (targetShiftY - shiftY) * ease;

            portraitInner.style.transform =
                `rotateX(${tiltRX.toFixed(3)}deg) rotateY(${tiltRY.toFixed(3)}deg)`;

            // Parallax shift on photo itself (opposite direction = depth illusion)
            portraitImg.style.transform =
                `scale(1.04) translate(${(-shiftX * 0.55).toFixed(2)}px, ${(-shiftY * 0.55).toFixed(2)}px)`;

            // Stop loop when values are near zero after mouse leave
            if (!isOverPortrait &&
                Math.abs(tiltRX) < 0.02 && Math.abs(tiltRY) < 0.02) {
                portraitImg.style.transform = '';
                portraitInner.style.transform = '';
                tiltAnimId = null;
                return;
            }

            tiltAnimId = requestAnimationFrame(animateTilt);
        };

        portraitTilt.addEventListener('mousemove', (e) => {
            const rect = portraitTilt.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;

            // Normalise -1 â†’ +1
            const normX = (e.clientX - cx) / (rect.width  / 2);
            const normY = (e.clientY - cy) / (rect.height / 2);

            targetRY = normX  * MAX_TILT;        // lean left/right
            targetRX = -normY * MAX_TILT * 0.7;  // lean up/down (gentler)
            targetShiftX = normX * MAX_SHIFT;
            targetShiftY = normY * MAX_SHIFT;
        });

        portraitTilt.addEventListener('mouseenter', () => {
            isOverPortrait = true;
            if (!tiltAnimId) tiltAnimId = requestAnimationFrame(animateTilt);
        });

        portraitTilt.addEventListener('mouseleave', () => {
            isOverPortrait = false;
            targetRX = 0; targetRY = 0;
            targetShiftX = 0; targetShiftY = 0;
            if (!tiltAnimId) tiltAnimId = requestAnimationFrame(animateTilt);
        });
    }

});

/* --- PREMIUM UI ENHANCEMENTS (JS) --- */
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for subtitle
    const subtitleEl = document.querySelector('.hero-subtitle');
    if(subtitleEl) {
        const text = subtitleEl.innerText;
        subtitleEl.innerText = '';
        // Create blinking cursor element
        const cursor = document.createElement('span');
        cursor.innerHTML = '&#9608;';
        cursor.style.color = 'var(--accent-color)';
        cursor.style.animation = 'blink 1s step-start infinite';
        
        let i = 0;
        const typeWriter = () => {
            if(i < text.length) {
                subtitleEl.innerHTML = text.substring(0, i+1);
                subtitleEl.appendChild(cursor);
                i++;
                setTimeout(typeWriter, 40 + Math.random() * 50);
            } else {
                // Done typing, keep cursor blinking
            }
        }
        
        // Add blink animation to document
        const style = document.createElement('style');
        style.innerHTML = '@keyframes blink { 50% { opacity: 0; } }';
        document.head.appendChild(style);

        // Start typing after preloader (approx 3s)
        setTimeout(typeWriter, 2800); 
    }
});


