document.addEventListener('DOMContentLoaded', () => {
    // 1. Optimized Background Shapes
    const bgLayer = document.getElementById('bg-layer');
    // Reduced from 15 to 8 shapes for better rendering performance
    for (let i = 0; i < 8; i++) {
        createFloatingShape(bgLayer);
    }

    // 2. Elements
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const successScreen = document.getElementById('success-screen');
    
    const openBtn = document.getElementById('open-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const subtitle = document.getElementById('subtitle');
    const btnText = yesBtn.querySelector('.btn-text');

    // 3. Data Progression Array (Looping sequence)
    const progression = [
        {
            gif: "https://gifdb.com/images/high/cute-bear-silvia-emoji-gif-z0343wle1ch6vs3x.gif",
            text: "Be honest...",
            noText: "No"
        },
        {
            gif: "https://gifdb.com/images/high/mochi-cat-confused-iydhq395cbdpypu7.gif",
            text: "Are you sure? 🤔",
            noText: "Think again!"
        },
        {
            gif: "https://gifdb.com/images/high/peach-and-goma-playing-l6xoal9z84okzjq0.gif",
            text: "Think about it again! 🤨",
            noText: "Still no?"
        },
        {
            gif: "https://gifdb.com/images/high/milk-and-mocha-alone-genrma4r1r6wstl9.gif",
            text: "Please don't do this 🥺",
            noText: "Too slow! 🐢"
        },
        {
            gif: "https://gifdb.com/images/high/milk-and-mocha-coaxing-qmvyxq6hvdxj2vy2.gif",
            text: "You're breaking my heart 💔",
            noText: "Catch me!"
        },
        {
            gif: "https://gifdb.com/images/high/mochi-cat-thrown-to-bin-xuax0u2dekrembij.gif",
            text: "I'll do anything! 😭",
            noText: "Nope! 🏃💨"
        },
        {
            gif: "https://gifdb.com/images/high/milk-and-mocha-kicking-dqs2wukw9kn5kcqa.gif",
            text: "Why are you running away?! 🏃",
            noText: "Over here!"
        },
        {
            gif: "https://gifdb.com/images/high/poor-crying-cat-t9apz9cfxzj4cgai.gif",
            text: "I'm actually crying now 😭",
            noText: "Nice try!"
        },
        {
            gif: "https://gifdb.com/images/high/frustrating-crying-cat-otveuu3sdmb473ky.gif",
            text: "PLEASE JUST SAY YES!!! 😫",
            noText: "Oops! Missed!"
        },
        {
            gif: "https://gifdb.com/images/high/screaming-crying-cat-xl6msgx53ws3shux.gif",
            text: "I WON'T GIVE UP! 😤",
            noText: "Can't touch this"
        },
        {
            gif: "https://gifdb.com/images/high/mochi-cat-holding-heart-y9fz23so3eptrx4o.gif",
            text: "Okay I'm calm... please? 🥺",
            noText: "I'm invincible"
        },
        {
            gif: "https://gifdb.com/images/high/peach-and-goma-v20vf9wazvmvfqsi.gif",
            text: "Just click the pink button! 💖",
            noText: "Stop it!"
        },
        {
            gif: "https://gifdb.com/images/high/peach-and-goma-cozying-up-fynbhr20x1ccnc6q.gif",
            text: "I'll give you a big hug! 🤗",
            noText: "No means no!"
        },
        {
            gif: "https://gifdb.com/images/high/milk-and-mocha-lying-vk0z6bc3ohaqrjc9.gif",
            text: "Don't make me sad again... 😿",
            noText: "Ah ah ah!"
        },
        {
            gif: "https://gifdb.com/images/high/mochi-cat-sweeping-broom-eg8ureo5eiiikt93.gif",
            text: "Last chance! 😠",
            noText: "I'm fast as boi"
        }
    ];

    // Preload images to prevent flickering during transitions
    progression.forEach(step => {
        step.preloadedImg = new Image();
        step.preloadedImg.src = step.gif;
    });

    const yesTexts = [
        "Of course I do 💖",
        "YES YES YES! ✨",
        "I love you more! 🥺",
        "Okay fine, I do! ❤️"
    ];

    // 4. Flow Handlers
    openBtn.addEventListener('click', () => {
        switchScreen(introScreen, questionScreen);
        // Start the yes button gentle pulse once visible
        yesBtn.classList.add('pulse');
    });

    yesBtn.addEventListener('click', () => {
        dodger.cleanup();
        
        if (noBtn && noBtn.parentNode) {
            noBtn.parentNode.removeChild(noBtn);
        }
        
        switchScreen(questionScreen, successScreen);
        fireConfetti();
    });

    // 5. High-Performance Spring Physics Dodger System
    const dodger = {
        count: 0,
        currentStepIndex: 0,
        isDetached: false,
        isCleanedUp: false,
        lastDodgeTime: 0,
        
        // Physics state
        current: { x: 0, y: 0, r: 0 },
        target: { x: 0, y: 0, r: 0 },
        
        // References
        rafId: null,
        resizeHandler: null,
        interactionHandlers: {},

        init() {
            this.interactionHandlers.trigger = this.dodge.bind(this);

            noBtn.addEventListener('mouseover', this.interactionHandlers.trigger);
            noBtn.addEventListener('touchstart', this.interactionHandlers.trigger, { passive: false });
            noBtn.addEventListener('click', this.interactionHandlers.trigger);
            
            this.resizeHandler = () => {
                if (this.isDetached && !this.isCleanedUp) {
                    this.calculateSafeTarget();
                }
            };
            window.addEventListener('resize', this.resizeHandler);
        },

        cleanup() {
            this.isCleanedUp = true;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            
            if (this.interactionHandlers.trigger) {
                noBtn.removeEventListener('mouseover', this.interactionHandlers.trigger);
                noBtn.removeEventListener('touchstart', this.interactionHandlers.trigger);
                noBtn.removeEventListener('click', this.interactionHandlers.trigger);
            }
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
            }
        },

        dodge(e) {
            if (e) e.preventDefault();
            if (this.isCleanedUp) return;

            // Throttle to prevent chaotic spamming from rapid cursor movements (200ms lock)
            const now = Date.now();
            if (now - this.lastDodgeTime < 200) return;
            this.lastDodgeTime = now;

            this.count++;
            
            // Text and GIF Updates (Using modulo for continuous looping)
            const stepIndex = this.count % progression.length;
            
            if (this.currentStepIndex !== stepIndex) {
                this.currentStepIndex = stepIndex;
                const step = progression[stepIndex];
                
                // Update subtitle with fade
                subtitle.style.opacity = '0';
                setTimeout(() => {
                    subtitle.textContent = step.text;
                    subtitle.style.opacity = '1';
                }, 150);

                // Update No button text
                noBtn.querySelector('span').textContent = step.noText;
                
                // Crossfade GIF instantly using preloaded node
                changeGif(step.gif, step.preloadedImg);
            }
            
            // Occasionally change Yes button text
            if (this.count % 3 === 0 && (this.count/3) < yesTexts.length) {
                btnText.textContent = yesTexts[this.count/3];
            }

            // Detach and initialize physics seamlessly on first interaction
            if (!this.isDetached) {
                const rect = noBtn.getBoundingClientRect();
                
                // Initialize exact coordinates to prevent snapping
                this.current.x = rect.left;
                this.current.y = rect.top;
                this.target.x = rect.left;
                this.target.y = rect.top;

                document.body.appendChild(noBtn);
                noBtn.style.position = 'fixed';
                noBtn.style.zIndex = '9999';
                noBtn.style.margin = '0';
                noBtn.style.left = '0px';
                noBtn.style.top = '0px';
                noBtn.style.transform = `translate3d(${this.current.x}px, ${this.current.y}px, 0)`;
                
                this.isDetached = true;
                
                // Start hardware-accelerated render loop
                this.startRenderLoop();
            }

            // Calculate new evasion target
            this.calculateSafeTarget();

            // Smoothly scale the Yes button up using JS transform (CSS handles the easing)
            const yesScale = Math.min(1.6, 1 + (this.count * 0.1));
            yesBtn.style.transform = `scale(${yesScale})`;
        },

        calculateSafeTarget() {
            const btnWidth = noBtn.offsetWidth;
            const btnHeight = noBtn.offsetHeight;
            const radius = Math.hypot(btnWidth, btnHeight) / 2;
            const safePadding = 24; 
            const inset = radius + safePadding;
            
            const minX = inset;
            const maxX = Math.max(inset, window.innerWidth - inset);
            const minY = inset;
            const maxY = Math.max(inset, window.innerHeight - inset);

            // Generate center points
            const targetCenterX = minX + Math.random() * (maxX - minX);
            const targetCenterY = minY + Math.random() * (maxY - minY);

            // Convert to top-left for the element
            this.target.x = targetCenterX - (btnWidth / 2);
            this.target.y = targetCenterY - (btnHeight / 2);
            this.target.r = (Math.random() - 0.5) * 60; // -30 to 30 deg rotation
        },

        startRenderLoop() {
            const loop = () => {
                if (this.isCleanedUp) return;

                // Spring physics lerp (linear interpolation)
                // The higher the factor, the snappier. The lower, the softer.
                // We make it slightly snappier as the count goes up.
                const speed = Math.min(0.2, 0.08 + (this.count * 0.01));
                
                this.current.x += (this.target.x - this.current.x) * speed;
                this.current.y += (this.target.y - this.current.y) * speed;
                this.current.r += (this.target.r - this.current.r) * speed;

                // Apply using GPU-accelerated translate3d
                noBtn.style.transform = `translate3d(${this.current.x}px, ${this.current.y}px, 0) rotate(${this.current.r}deg)`;

                this.rafId = requestAnimationFrame(loop);
            };
            this.rafId = requestAnimationFrame(loop);
        }
    };

    dodger.init();

    // 6. Helper Functions

    let currentGifSrc = progression[0].gif;

    function changeGif(newSrc, preloadedImgNode) {
        if (currentGifSrc === newSrc) return;
        currentGifSrc = newSrc;

        const container = document.querySelector('#question-screen .media-container');
        const oldImgs = container.querySelectorAll('img.active'); 
        
        // Clone the preloaded image node for instant synchronous rendering
        const newImg = preloadedImgNode ? preloadedImgNode.cloneNode() : new Image();
        if (!preloadedImgNode) newImg.src = newSrc;
        
        newImg.alt = "Cute reaction";
        
        container.appendChild(newImg);
        
        // Use requestAnimationFrame for a buttery smooth DOM insertion transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newImg.classList.add('active');
                
                oldImgs.forEach(oldImg => {
                    oldImg.classList.remove('active');
                    oldImg.classList.add('exit');
                    
                    // Cleanup old image after transition completes
                    setTimeout(() => {
                        if (oldImg.parentNode) oldImg.parentNode.removeChild(oldImg);
                    }, 500); // Matches CSS transition time
                });
            });
        });
    }

    function switchScreen(hideElement, showElement) {
        hideElement.classList.remove('active');
        
        setTimeout(() => {
            hideElement.style.display = 'none';
            showElement.style.display = 'flex';
            
            // Force reflow
            void showElement.offsetWidth;
            showElement.classList.add('active');
        }, 500);
    }

    function createFloatingShape(container) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        const size = Math.random() * 80 + 40; // Larger, softer shapes
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15; // 15s to 25s for slow, luxurious float
        const delay = Math.random() * 5;

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${left}vw`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `-${delay}s`; // Negative delay so they start immediately

        container.appendChild(shape);
    }

    function fireConfetti() {
        if (typeof confetti !== 'function') return; // Guard against network failure
        
        const duration = 4000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff4d6d', '#ffdde1', '#ffffff'],
                disableForReducedMotion: true
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff4d6d', '#ffdde1', '#ffffff'],
                disableForReducedMotion: true
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
});