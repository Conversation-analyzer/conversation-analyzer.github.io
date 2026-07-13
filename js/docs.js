/**
 * docs.js — Documentation page controller
 * Sidebar, navigation, search (Ctrl+K), prev/next, URL state.
 */
(function () {
    "use strict";

    var SIDEBAR_URL = "/docs/sidebar.json";
    var DOCS_DIR    = "/docs/";
    var config      = window.APP_CONFIG || {};
    var sidebarData = null;
    var currentFile = null;
    var allItems    = []; // flat list for prev/next + search

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

    /** Read ?doc= param — if it doesn't end with .md, append it */
    function getDocParam() {
        var doc = new URLSearchParams(location.search).get("doc");
        if (doc && !doc.endsWith(".md")) doc += ".md";
        return doc;
    }

    /** Strip .md for clean URL display */
    function cleanUrl(file) {
        return file.replace(/\.md$/, "");
    }

    /** Build flat ordered list of all items from sidebar */
    function buildFlatList(data) {
        var list = [];
        data.sections.forEach(function (section) {
            section.items.forEach(function (item) {
                list.push({ title: item.title, file: item.file, section: section.title });
            });
        });
        return list;
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
                link.href = "?doc=" + cleanUrl(item.file);
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
        var sidebar = document.getElementById("docs-sidebar");
        if (sidebar) {
            sidebar.innerHTML = "";
            sidebar.appendChild(buildSidebarNav(data));
        }

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
        document.querySelectorAll(".docs-nav-link").forEach(function (link) {
            link.classList.toggle("active", link.dataset.file === file);
        });

        // Scroll active link into view in sidebar
        var active = document.querySelector(".docs-nav-link.active");
        if (active) {
            var sidebar = document.getElementById("docs-sidebar");
            if (sidebar) {
                var top = active.offsetTop - sidebar.offsetTop;
                if (top < sidebar.scrollTop || top > sidebar.scrollTop + sidebar.clientHeight - 40) {
                    sidebar.scrollTop = top - 80;
                }
            }
        }
    }

    /* ------------------------------------------------
       Edit link
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
            inner.innerHTML = html + buildPrevNext(file) + buildDocsFooter();
            updateActiveLink(file);
            updateEditLink(file);
            updateMobileBarText(file);
            pushState(file);
            initDocsTabs();
            initDocsCopy();
            initPrevNext();
            resolveLinks(inner);
            // Scroll content to top
            var content = document.getElementById("docs-content");
            if (content) content.scrollTop = 0;
            if (typeof window.initReveal === "function") window.initReveal();
        });
    }

    function pushState(file) {
        history.pushState({ doc: file }, "", "?doc=" + cleanUrl(file));
    }

    /* ------------------------------------------------
       Prev / Next navigation
       ------------------------------------------------ */

    function buildPrevNext(file) {
        var idx = -1;
        for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].file === file) { idx = i; break; }
        }
        if (idx === -1) return "";

        var prev = idx > 0 ? allItems[idx - 1] : null;
        var next = idx < allItems.length - 1 ? allItems[idx + 1] : null;

        var html = '<div class="docs-prev-next">';
        if (prev) {
            html += '<a class="docs-prev" href="?doc=' + cleanUrl(prev.file) + '" data-file="' + prev.file + '">' +
                '<span class="docs-prev-next-label">\u2190 Previous</span>' +
                '<span class="docs-prev-next-title">' + prev.title + '</span></a>';
        } else {
            html += '<span></span>';
        }
        if (next) {
            html += '<a class="docs-next" href="?doc=' + cleanUrl(next.file) + '" data-file="' + next.file + '">' +
                '<span class="docs-prev-next-label">Next \u2192</span>' +
                '<span class="docs-prev-next-title">' + next.title + '</span></a>';
        }
        html += '</div>';
        return html;
    }

    function initPrevNext() {
        document.querySelectorAll(".docs-prev-next a").forEach(function (link) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                navigateTo(link.dataset.file);
            });
        });
    }

    /* ------------------------------------------------
       Docs footer
       ------------------------------------------------ */

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

    /* ------------------------------------------------
       Search
       ------------------------------------------------ */

    function initSearch() {
        var input = document.getElementById("docs-search-input");
        var searchEl = document.getElementById("docs-search");
        if (!input || !searchEl) return;

        // Build results container
        var results = document.createElement("div");
        results.className = "docs-search-results";
        searchEl.appendChild(results);

        // Ctrl+K to focus
        document.addEventListener("keydown", function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                input.focus();
                input.select();
            }
            if (e.key === "Escape") {
                input.blur();
                results.classList.remove("open");
            }
        });

        // Filter on input
        input.addEventListener("input", function () {
            var q = input.value.trim().toLowerCase();
            if (!q) { results.classList.remove("open"); results.innerHTML = ""; return; }

            var matches = allItems.filter(function (item) {
                return item.title.toLowerCase().indexOf(q) !== -1 ||
                       item.section.toLowerCase().indexOf(q) !== -1 ||
                       item.file.toLowerCase().indexOf(q) !== -1;
            });

            if (!matches.length) {
                results.innerHTML = '<div class="docs-search-empty">No results found</div>';
                results.classList.add("open");
                return;
            }

            var html = "";
            matches.forEach(function (item) {
                html += '<a class="docs-search-result" href="?doc=' + cleanUrl(item.file) + '" data-file="' + item.file + '">' +
                    '<span class="docs-search-result-title">' + item.title + '</span>' +
                    '<span class="docs-search-result-section">' + item.section + '</span></a>';
            });
            results.innerHTML = html;
            results.classList.add("open");

            // Click to navigate
            results.querySelectorAll(".docs-search-result").forEach(function (link) {
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    navigateTo(link.dataset.file);
                    input.value = "";
                    results.classList.remove("open");
                    results.innerHTML = "";
                    closeMobileDocsNav();
                });
            });
        });

        // Close results on click outside
        document.addEventListener("click", function (e) {
            if (!searchEl.contains(e.target)) {
                results.classList.remove("open");
            }
        });
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

        bar.addEventListener("click", function (e) {
            e.stopPropagation();
            var open = dropdown.classList.toggle("open");
            bar.classList.toggle("open", open);
            var toggle = document.querySelector(".nav-toggle");
            var navLinks = document.querySelector(".nav-links");
            if (open && navLinks && navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            }
        });

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
        if (!document.getElementById("docs-sidebar")) return;

        fetchJSON(SIDEBAR_URL, function (data) {
            sidebarData = data;
            allItems = buildFlatList(data);
            renderSidebar(data);
            initMobileDocsNav();
            initSearch();

            var doc = getDocParam() || data.sections[0].items[0].file;
            navigateTo(doc);
        });

        window.addEventListener("popstate", function (e) {
            if (e.state && e.state.doc) {
                navigateTo(e.state.doc);
            } else {
                var doc = getDocParam();
                if (doc) navigateTo(doc);
            }
        });
    });

    window.resolveLinks = resolveLinks;
})();
