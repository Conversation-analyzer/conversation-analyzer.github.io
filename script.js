/* ==========================================================================
   Conversation Analyzer Landing Page
   script.js
   ========================================================================== */

   (() => {

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isTouchDevice =
        window.matchMedia("(hover: none)").matches;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /* ==========================================================
       Splash / boot sequence
    ========================================================== */

    const bootLines = [
        { element: "line1", text: "Searching GitHub... ✖" },
        { element: "line2", text: "Searching Reddit... ✖" },
        { element: "line3", text: "Searching the ecosystem... ✖" }
    ];

    const finalText = "Fine...\nWe'll do it ourselves.";

    const HAS_VISITED_KEY = "ca_splash_seen";

    async function typeText(id, text, speed = 30) {
        const el = document.getElementById(id);
        if (!el) return;

        if (prefersReducedMotion) {
            el.textContent = text;
            return;
        }

        el.textContent = "";
        for (const char of text) {
            el.textContent += char;
            await sleep(speed);
        }
    }

    async function runSplash() {
        const splash = document.getElementById("splash");
        if (!splash) return;

        await sleep(700);

        for (const item of bootLines) {
            await typeText(item.element, item.text);
            await sleep(450);
        }

        await sleep(500);
        await typeText("finalLine", finalText, 35);
        await sleep(1800);

        splash.style.opacity = "0";
        splash.style.pointerEvents = "none";

        await sleep(900);
        splash.remove();
    }

    function skipSplash() {
        const splash = document.getElementById("splash");
        if (splash) splash.remove();
    }

    /* ==========================================================
       Rotating text panels (hero preview + dashboard demo)
       Shared engine so both panels reuse the same logic.
    ========================================================== */

    function createRotator({ titleEl, textEl, frames, interval = 3500 }) {
        if (!textEl || !frames.length) return null;

        let index = 0;
        let timerId = null;

        function render() {
            textEl.style.opacity = "0";
            textEl.style.transform = "translateY(10px)";

            setTimeout(() => {
                index = (index + 1) % frames.length;

                if (titleEl && frames[index].title) {
                    titleEl.textContent = frames[index].title;
                }

                textEl.textContent = frames[index].text;

                textEl.style.opacity = "1";
                textEl.style.transform = "translateY(0)";
            }, prefersReducedMotion ? 0 : 250);
        }

        function start() {
            if (timerId || prefersReducedMotion) return;
            timerId = setInterval(render, interval);
        }

        function stop() {
            clearInterval(timerId);
            timerId = null;
        }

        start();

        // Pause work while the tab isn't visible.
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        return { start, stop };
    }

    const heroPreviewFrames = [
        { text: "31,284 Tokens\n\nDiagnosis\n\nWho let bro cook?" },
        { text: "Saved\n\n8,421 Tokens\n\nNature is healing." },
        { text: "Loaded\n\n47 Tools\n\nUsed\n\n2\n\nThe rest came\nfor emotional support." },
        { text: "Agent\n\nSolved without tools\n\nSometimes the best tool\nis knowing you don't\nneed one." },
        { text: "Prompt Size\n\n18,004 Tokens\n\nI'm not mad.\n\nI'm just disappointed." }
    ];

    const dashboardFrames = [
        { title: "Prompt Size", text: "31,284 Tokens\n\nDiagnosis\n\nWho let bro cook?" },
        { title: "Optimization", text: "Saved\n\n8,421 Tokens\n\nNature is healing." },
        { title: "Tool Usage", text: "Loaded\n\n47 Tools\n\nUsed\n\n2\n\nThe rest came\nfor emotional support." },
        { title: "Timeline", text: "Human\n ↓\nLLM\n ↓\nFilesystem\n ↓\nGit\n\n\"I wasn't even called.\"" },
        { title: "Memory", text: "18,922 Tokens\n\nI'm not mad.\n\nI'm just disappointed." }
    ];

    /* ==========================================================
       Navbar scroll + mobile toggle
    ========================================================== */

    function navbarEffect() {
        const nav = document.getElementById("navbar");
        if (!nav) return;

        let ticking = false;

        window.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                if (window.scrollY > 40) {
                    nav.style.background = "rgba(13,17,23,.82)";
                    nav.style.borderBottom = "1px solid rgba(255,255,255,.08)";
                } else {
                    nav.style.background = "rgba(13,17,23,.55)";
                    nav.style.borderBottom = "1px solid rgba(255,255,255,.04)";
                }
                ticking = false;
            });
        }, { passive: true });
    }

    function mobileNavToggle() {
        const toggle = document.getElementById("navToggle");
        const nav = document.getElementById("primaryNav");
        if (!toggle || !nav) return;

        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ==========================================================
       Scroll reveal (single observer for all reveal targets)
    ========================================================== */

    function revealElements() {
        const targets = document.querySelectorAll(".placeholder, .reveal");
        if (!targets.length) return;

        if (prefersReducedMotion) {
            targets.forEach(el => {
                el.style.opacity = "1";
                el.style.transform = "none";
                el.classList.add("active");
            });
            return;
        }

        document.querySelectorAll(".placeholder").forEach(section => {
            section.style.opacity = "0";
            section.style.transform = "translateY(40px)";
            section.style.transition = ".8s";
        });

        document
            .querySelectorAll(".feature-card, .dashboard, .primary, .secondary")
            .forEach(el => el.classList.add("reveal"));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("active");
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            });
        }, { threshold: .15 });

        targets.forEach(el => observer.observe(el));
    }

    /* ==========================================================
       Mouse-follow glow (skipped on touch / reduced-motion)
    ========================================================== */

    function mouseGlow() {
        if (isTouchDevice || prefersReducedMotion) return;

        const glow = document.getElementById("mouse-glow");
        if (!glow) return;

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let rafId = null;

        function paint() {
            glow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
            rafId = null;
        }

        window.addEventListener("mousemove", (e) => {
            x = e.clientX;
            y = e.clientY;

            if (!rafId) {
                rafId = requestAnimationFrame(paint);
            }
        }, { passive: true });
    }

    /* ==========================================================
       Boot
    ========================================================== */

    window.addEventListener("DOMContentLoaded", () => {

        const hasSeenSplash = sessionStorage.getItem(HAS_VISITED_KEY);

        if (hasSeenSplash) {
            skipSplash();
        } else {
            sessionStorage.setItem(HAS_VISITED_KEY, "true");
            runSplash();
        }

        createRotator({
            textEl: document.querySelector(".preview pre"),
            frames: heroPreviewFrames,
            interval: 3500
        });

        createRotator({
            titleEl: document.getElementById("analysisTitle"),
            textEl: document.getElementById("analysisText"),
            frames: dashboardFrames,
            interval: 3500
        });

        navbarEffect();
        mobileNavToggle();
        revealElements();
        mouseGlow();
    });

})();