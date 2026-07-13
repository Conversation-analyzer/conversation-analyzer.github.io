/**
 * markdown.js — Markdown renderer using marked.js (CDN)
 * Wraps marked with custom renderers for code blocks, tables, and lists
 * to produce the existing docs HTML structure.
 */
window.MarkdownRenderer = (function () {
    "use strict";

    // Custom code block renderer — adds header with language label + copy button
    var renderer = new marked.Renderer();

    renderer.code = function (code, lang) {
        // marked v14+ passes an object { text, lang }
        var text = typeof code === "object" ? code.text : code;
        var language = typeof code === "object" ? code.lang : lang;
        var escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        var label = language || "code";
        return (
            '<div class="docs-code-block">' +
            '<div class="docs-code-header">' +
            '<span class="docs-code-lang">' + label + "</span>" +
            '<button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>' +
            "</div>" +
            "<pre><code>" + escaped + "</code></pre></div>\n"
        );
    };

    // Custom list renderer — adds docs-list / docs-steps classes
    renderer.list = function (token) {
        var ordered = typeof token === "object" ? token.ordered : arguments[1];
        var items = typeof token === "object" ? token.items : arguments[0];
        var tag = ordered ? "ol" : "ul";
        var cls = ordered ? "docs-steps" : "docs-list";
        var body = "";
        if (items && items.length) {
            items.forEach(function (item) {
                var text = item.tokens ? inlineTokens(item.tokens) : (item.text || "");
                body += "<li>" + text + "</li>\n";
            });
        }
        return "<" + tag + ' class="' + cls + '">' + body + "</" + tag + ">\n";
    };

    // Custom table renderer — wraps output in docs-table-wrap
    renderer.table = function (header, body) {
        // marked v14+ passes objects { header, rows } or { headers, rows }
        if (typeof header === "object" && header.header !== undefined) {
            // v14+ object format
            var hdr = header.header;
            var rows = header.rows;
            var h = "<thead><tr>";
            hdr.forEach(function (cell) {
                h += "<th>" + (cell.tokens ? inlineTokens(cell.tokens) : cell.text) + "</th>";
            });
            h += "</tr></thead>";
            var b = "<tbody>";
            rows.forEach(function (row) {
                b += "<tr>";
                row.forEach(function (cell) {
                    b += "<td>" + (cell.tokens ? inlineTokens(cell.tokens) : cell.text) + "</td>";
                });
                b += "</tr>";
            });
            b += "</tbody>";
            return '<div class="docs-table-wrap"><table class="docs-table">' + h + b + "</table></div>\n";
        }
        // Fallback for older marked versions (string args)
        return (
            '<div class="docs-table-wrap"><table class="docs-table"><thead>' +
            header +
            "</thead><tbody>" +
            body +
            "</tbody></table></div>\n"
        );
    };

    function inlineTokens(tokens) {
        if (!tokens) return "";
        return tokens
            .map(function (t) {
                if (t.type === "text") return t.text || t.raw || "";
                if (t.type === "strong") return "<strong>" + inlineTokens(t.tokens) + "</strong>";
                if (t.type === "em") return "<em>" + inlineTokens(t.tokens) + "</em>";
                if (t.type === "codespan") return "<code>" + (t.text || t.raw) + "</code>";
                if (t.type === "link") return '<a href="' + t.href + '">' + inlineTokens(t.tokens) + "</a>";
                if (t.type === "image") return '<img src="' + t.href + '" alt="' + (t.text || "") + '" style="max-width:100%">';
                return t.raw || t.text || "";
            })
            .join("");
    }

    // Configure marked
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        breaks: false,
    });

    function render(text) {
        return marked.parse(text);
    }

    return { render: render };
})();
