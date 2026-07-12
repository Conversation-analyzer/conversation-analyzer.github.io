/* ==========================================================================
   AI Conversation Analyzer — Site JavaScript
   ========================================================================== */

(() => {
    "use strict";

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ==========================================================
       Shared Navigation
    ========================================================== */

    function initNavbar() {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;

        let ticking = false;
        window.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                navbar.classList.toggle("scrolled", window.scrollY > 30);
                ticking = false;
            });
        }, { passive: true });
    }

    function initMobileNav() {
        const toggle = document.querySelector(".nav-toggle");
        const links = document.querySelector(".nav-links");
        if (!toggle || !links) return;

        toggle.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        links.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                links.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function setActiveNavLink() {
        const path = location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-links a").forEach(a => {
            const href = a.getAttribute("href");
            if (href === path || (path === "" && href === "index.html")) {
                a.classList.add("active");
            }
        });
    }

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
       Boot
    ========================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        initNavbar();
        initMobileNav();
        setActiveNavLink();
        initReveal();
        initCounters();
        initBarFills();

        initRotator("[data-rotate]", [
            "31,284 tokens analyzed",
            "47 tool calls inspected",
            "12 reasoning chains mapped",
            "8.2s average latency detected",
            "2,400 lines of context traced"
        ]);
    });

})();
