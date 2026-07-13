/**
 * docs.js — Documentation page controller
 * Loads sidebar.json, renders sidebar, fetches + renders markdown files,
 * manages URL state, and initializes docs-specific interactivity.
 */
(function () {
    "use strict";

    var SIDEBAR_URL = "/docs/sidebar.json";
    var DOCS_DIR    = "/docs/";
    var config      = window.APP_CONFIG || {};
    var sidebarData = null;
    var currentFile = null;

    /* ------------------------------------------------
       Helpers
       ------------------------------------------------ */

    function fetchJSON(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) cb(JSON.parse(xhr.responseText));
        };
        xhr.send();
    }

    function fetchText(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) cb(xhr.responseText);
        };
        xhr.send();
    }

    function getDocParam() {
        return new URLSearchParams(location.search).get("doc");
    }

    /* ------------------------------------------------
       Sidebar renderer (desktop + mobile dropdown)
       ------------------------------------------------ */

    function buildSidebarNav(data) {
        var nav = document.createElement("nav");
        nav.className = "docs-nav";

        data.sections.forEach(function (section) {
            var group = document.createElement("div");
            group.className = "docs-nav-group";

            var heading = document.createElement("div");
            heading.className = "docs-nav-heading";
            heading.textContent = section.title;
            group.appendChild(heading);

            section.items.forEach(function (item) {
                var link = document.createElement("a");
                link.className = "docs-nav-link";
                link.href = "?doc=" + item.file;
                link.textContent = item.title;
                link.dataset.file = item.file;
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    navigateTo(item.file);
                    closeMobileDocsNav();
                });
                group.appendChild(link);
            });

            nav.appendChild(group);
        });

        return nav;
    }

    function renderSidebar(data) {
        // Desktop sidebar
        var sidebar = document.getElementById("docs-sidebar");
        if (sidebar) {
            sidebar.innerHTML = "";
            sidebar.appendChild(buildSidebarNav(data));
        }

        // Mobile dropdown
        var dropdown = document.querySelector(".docs-mobile-dropdown");
        if (dropdown) {
            dropdown.innerHTML = "";
            dropdown.appendChild(buildSidebarNav(data));
        }
    }

    /* ------------------------------------------------
       Active link tracking
       ------------------------------------------------ */

    function updateActiveLink(file) {
        var links = document.querySelectorAll(".docs-nav-link");
        links.forEach(function (link) {
            link.classList.toggle("active", link.dataset.file === file);
        });
    }

    /* ------------------------------------------------
       "Edit this page on GitHub" link
       ------------------------------------------------ */

    function updateEditLink(file) {
        var editBtn = document.querySelector(".docs-footer a[data-github='repo']");
        if (editBtn) {
            var base = (config.github && config.github.repo) || "#";
            editBtn.href = base + "/edit/main/docs/" + file;
        }
    }

    /* ------------------------------------------------
       Mobile bar text
       ------------------------------------------------ */

    function updateMobileBarText(file) {
        var barText = document.getElementById("docs-mobile-bar-text");
        if (!barText || !sidebarData) return;
        sidebarData.sections.forEach(function (section) {
            section.items.forEach(function (item) {
                if (item.file === file) {
                    barText.textContent = section.title + " \u203A " + item.title;
                }
            });
        });
    }

    /* ------------------------------------------------
       Navigation
       ------------------------------------------------ */

    function navigateTo(file) {
        if (!file) return;
        currentFile = file;
        showLoading();

        fetchText(DOCS_DIR + file, function (md) {
            var html = window.MarkdownRenderer.render(md);
            var inner = document.getElementById("docs-content-inner");
            inner.innerHTML = html + buildDocsFooter();
            updateActiveLink(file);
            updateEditLink(file);
            updateMobileBarText(file);
            pushState(file);
            initDocsTabs();
            initDocsCopy();
            if (typeof window.initReveal === "function") window.initReveal();
        });
    }

    function pushState(file) {
        history.pushState({ doc: file }, "", "?doc=" + file);
    }

    function buildDocsFooter() {
        return '<div class="docs-footer">' +
            '<a class="btn btn-secondary btn-sm" data-github="repo" target="_blank">' +
            '<i class="fa-brands fa-github"></i> Edit this page on GitHub</a>' +
            '<a class="btn btn-secondary btn-sm" data-github="issues" target="_blank">' +
            '<i class="fa-solid fa-bug"></i> Report an issue</a>' +
            '</div>';
    }

    /* ------------------------------------------------
       Loading state
       ------------------------------------------------ */

    function showLoading() {
        var el = document.getElementById("docs-content-inner");
        el.innerHTML = '<div class="docs-loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading...</p></div>';
    }

    function hideLoading() {
        var el = document.querySelector(".docs-loading");
        if (el) el.remove();
    }

    /* ------------------------------------------------
       Docs-specific interactivity (tabs, code copy)
       ------------------------------------------------ */

    function initDocsTabs() {
        document.querySelectorAll(".docs-tab-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var group = btn.closest(".docs-tabs");
                if (!group) return;
                var target = btn.dataset.tab;
                group.querySelectorAll(".docs-tab-btn").forEach(function (b) { b.classList.remove("active"); });
                group.querySelectorAll(".docs-tab-panel").forEach(function (p) { p.classList.remove("active"); });
                btn.classList.add("active");
                var panel = group.querySelector('[data-tab-panel="' + target + '"]');
                if (panel) panel.classList.add("active");
            });
        });
    }

    function initDocsCopy() {
        document.querySelectorAll("[data-copy]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var code = btn.closest(".docs-code-block");
                if (!code) return;
                var codeEl = code.querySelector("code");
                if (!codeEl) return;
                navigator.clipboard.writeText(codeEl.textContent).then(function () {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(function () { btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1500);
                });
            });
        });
    }

    /* ------------------------------------------------
       Mobile docs nav
       ------------------------------------------------ */

    function initMobileDocsNav() {
        var bar = document.getElementById("docs-mobile-bar");
        var dropdown = document.querySelector(".docs-mobile-dropdown");
        if (!bar || !dropdown) return;

        // Toggle dropdown on bar click
        bar.addEventListener("click", function (e) {
            e.stopPropagation();
            var open = dropdown.classList.toggle("open");
            bar.classList.toggle("open", open);
            // Close main hamburger if open
            var toggle = document.querySelector(".nav-toggle");
            var navLinks = document.querySelector(".nav-links");
            if (open && navLinks && navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close on click outside
        document.addEventListener("click", function (e) {
            if (!bar.contains(e.target) && !dropdown.contains(e.target)) {
                closeMobileDocsNav();
            }
        });
    }

    function closeMobileDocsNav() {
        var bar = document.getElementById("docs-mobile-bar");
        var dropdown = document.querySelector(".docs-mobile-dropdown");
        if (dropdown) dropdown.classList.remove("open");
        if (bar) bar.classList.remove("open");
    }

    /* ------------------------------------------------
       Resolve data-github / data-email in rendered content
       ------------------------------------------------ */

    function resolveLinks(root) {
        var gh = config.github || {};
        var base = gh.base || "#";
        var email = config.email || "";

        root.querySelectorAll("[data-github]").forEach(function (el) {
            var key = el.getAttribute("data-github");
            var href = gh[key];
            if (!href && key.indexOf("/") !== -1) {
                var parts = key.split("/");
                href = (gh[parts[0]] || base) + "/" + parts.slice(1).join("/");
            }
            el.href = href || base;
            el.removeAttribute("data-github");
        });

        root.querySelectorAll("[data-email]").forEach(function (el) {
            el.href = "mailto:" + email;
            el.removeAttribute("data-email");
        });
    }

    /* ------------------------------------------------
       Boot
       ------------------------------------------------ */

    document.addEventListener("DOMContentLoaded", function () {
        // Only run on docs page
        if (!document.getElementById("docs-sidebar")) return;

        fetchJSON(SIDEBAR_URL, function (data) {
            sidebarData = data;
            renderSidebar(data);
            initMobileDocsNav();

            var doc = getDocParam() || data.sections[0].items[0].file;
            navigateTo(doc);
        });

        // Handle back/forward
        window.addEventListener("popstate", function (e) {
            if (e.state && e.state.doc) {
                navigateTo(e.state.doc);
            } else {
                var doc = getDocParam();
                if (doc) navigateTo(doc);
            }
        });
    });

    // Expose for include.js link resolution after dynamic content load
    window.resolveLinks = resolveLinks;
})();
