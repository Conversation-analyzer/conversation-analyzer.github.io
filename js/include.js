/* ==========================================================================
   AI Conversation Analyzer — Partial Loader
   Fetches header.html and footer.html from /partials and injects them.
   Also initialises navbar scroll, mobile toggle, and active-link highlight.
   ========================================================================== */

(function () {
    "use strict";

    var page = location.pathname.split("/").pop().replace(".html", "") || "index";

    function load(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) cb(xhr.responseText);
        };
        xhr.send();
    }

    function initNavbar() {
        var navbar = document.querySelector(".navbar");
        if (!navbar) return;

        var ticking = false;
        window.addEventListener("scroll", function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                navbar.classList.toggle("scrolled", window.scrollY > 30);
                ticking = false;
            });
        }, { passive: true });
    }

    function initMobileNav() {
        var toggle = document.querySelector(".nav-toggle");
        var links  = document.querySelector(".nav-links");
        if (!toggle || !links) return;

        toggle.addEventListener("click", function () {
            var open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        links.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                links.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function setActiveNavLink() {
        document.querySelectorAll(".nav-links a").forEach(function (a) {
            if (a.getAttribute("href") === page) a.classList.add("active");
        });
    }

    /* --- Inject partials then initialise nav ---------------------------- */

    load("partials/header.html", function (html) {
        var el = document.getElementById("site-header");
        if (el) el.innerHTML = html;
        initNavbar();
        initMobileNav();
        setActiveNavLink();
    });

    load("partials/footer.html", function (html) {
        var el = document.getElementById("site-footer");
        if (el) el.innerHTML = html;
    });

})();
