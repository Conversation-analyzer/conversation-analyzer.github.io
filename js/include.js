/* ==========================================================================
   AI Conversation Analyzer — Partial Loader & Config Resolver
   Fetches header.html and footer.html from /partials and injects them.
   Resolves data-github / data-email attributes against window.APP_CONFIG.
   Also initialises navbar scroll, mobile toggle, and active-link highlight.
   ========================================================================== */

(function () {
    "use strict";

    var page   = location.pathname.split("/").pop().replace(".html", "") || "index";
    var config = window.APP_CONFIG || {};

    function load(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) cb(xhr.responseText);
        };
        xhr.send();
    }

    /* --- Resolve data-github / data-email attributes -------------------- */

    function resolveLinks(root) {
        var gh    = config.github || {};
        var base  = gh.base || "#";
        var email = config.email || "";

        root.querySelectorAll("[data-github]").forEach(function (raw) {
            var key  = raw.getAttribute("data-github");
            var href = gh[key];

            /* support composite keys like "repo/issues" → gh.repo + "/issues" */
            if (!href && key.indexOf("/") !== -1) {
                var parts = key.split("/");
                href = (gh[parts[0]] || base) + "/" + parts.slice(1).join("/");
            }

            raw.href = href || base;
            raw.removeAttribute("data-github");
        });

        root.querySelectorAll("[data-email]").forEach(function (el) {
            el.href = "mailto:" + email;
            el.removeAttribute("data-email");
        });
    }

    /* --- Navbar -------------------------------------------------------- */

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

    /* --- Inject partials then initialise -------------------------------- */

    load("partials/header.html", function (html) {
        var el = document.getElementById("site-header");
        if (el) {
            el.innerHTML = html;
            resolveLinks(el);
        }
        initNavbar();
        initMobileNav();
        setActiveNavLink();
    });

    load("partials/footer.html", function (html) {
        var el = document.getElementById("site-footer");
        if (el) {
            el.innerHTML = html;
            resolveLinks(el);
        }
    });

    /* --- Resolve page content links too --------------------------------- */

    resolveLinks(document.body);

})();
