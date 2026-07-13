/* ==========================================================================
   AI Conversation Analyzer — Site JavaScript
   ========================================================================== */

(() => {
    "use strict";

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ==========================================================
       Scroll Reveal
    ========================================================== */

    function initReveal() {
        const els = document.querySelectorAll(".reveal");
        if (!els.length) return;

        if (REDUCED) {
            els.forEach(el => el.classList.add("visible"));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        els.forEach(el => observer.observe(el));
    }

    /* ==========================================================
       Animated Counters
    ========================================================== */

    function initCounters() {
        const els = document.querySelectorAll("[data-count]");
        if (!els.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || "";
                const duration = REDUCED ? 0 : 1500;
                animateCounter(el, target, suffix, duration);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        els.forEach(el => observer.observe(el));
    }

    function animateCounter(el, target, suffix, duration) {
        if (duration === 0) {
            el.textContent = formatNumber(target) + suffix;
            return;
        }
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = formatNumber(Math.floor(eased * target)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function formatNumber(n) {
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        return String(n);
    }

    /* ==========================================================
       Rotating Text
    ========================================================== */

    function initRotator(selector, frames, interval = 3500) {
        const el = document.querySelector(selector);
        if (!el || !frames.length || REDUCED) return;

        let index = 0;
        setInterval(() => {
            el.style.opacity = "0";
            el.style.transform = "translateY(8px)";
            setTimeout(() => {
                index = (index + 1) % frames.length;
                el.textContent = frames[index];
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, 250);
        }, interval);
    }

    /* ==========================================================
       Animated Bar Fills
    ========================================================== */

    function initBarFills() {
        const bars = document.querySelectorAll(".mock-bar-fill[data-width]");
        if (!bars.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.width = entry.target.dataset.width;
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        bars.forEach(bar => {
            bar.style.width = "0%";
            observer.observe(bar);
        });
    }

    /* ==========================================================
       Docs — Sidebar Scroll Spy
    ========================================================== */

    function initDocsScrollSpy() {
        const links = document.querySelectorAll(".docs-nav-link");
        if (!links.length) return;

        const sections = [];
        links.forEach(link => {
            const id = link.getAttribute("href").slice(1);
            const section = document.getElementById(id);
            if (section) sections.push({ id, link, el: section });
        });

        if (!sections.length) return;

        let ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                let active = sections[0];
                const offset = window.scrollY + 120;
                for (const s of sections) {
                    if (s.el.offsetTop <= offset) active = s;
                }
                links.forEach(l => l.classList.remove("active"));
                active.link.classList.add("active");
                ticking = false;
            });
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ==========================================================
       Docs — Tab Panels
    ========================================================== */

    function initDocsTabs() {
        document.querySelectorAll(".docs-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const group = btn.closest(".docs-tabs");
                const target = btn.dataset.tab;

                group.querySelectorAll(".docs-tab-btn").forEach(b => b.classList.remove("active"));
                group.querySelectorAll(".docs-tab-panel").forEach(p => p.classList.remove("active"));

                btn.classList.add("active");
                group.querySelector(`[data-tab-panel="${target}"]`).classList.add("active");
            });
        });
    }

    /* ==========================================================
       Docs — Code Copy Buttons
    ========================================================== */

    function initDocsCopy() {
        document.querySelectorAll("[data-copy]").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.closest(".docs-code-block").querySelector("code");
                if (!code) return;
                navigator.clipboard.writeText(code.textContent).then(() => {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
                });
            });
        });
    }

    /* ==========================================================
       Boot
    ========================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        initReveal();
        initCounters();
        initBarFills();
        initDocsScrollSpy();
        initDocsTabs();
        initDocsCopy();

        initRotator("[data-rotate]", [
            "31,284 tokens analyzed",
            "47 tool calls inspected",
            "12 reasoning chains mapped",
            "8.2s average latency detected",
            "2,400 lines of context traced"
        ]);
    });

})();
