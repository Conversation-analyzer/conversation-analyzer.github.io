/**
 * markdown.js — Lightweight Markdown renderer
 * Handles: headings, bold, italic, inline code, fenced code blocks,
 * tables, ordered/unordered lists, links, blockquotes, horizontal rules,
 * and passes through raw HTML.
 */
window.MarkdownRenderer = (function () {
    "use strict";

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function inline(text) {
        // inline code (protect from further processing)
        var codes = [];
        text = text.replace(/`([^`]+)`/g, function (_, c) {
            codes.push("<code>" + escapeHtml(c) + "</code>");
            return "\x00C" + (codes.length - 1) + "\x00";
        });
        // images
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">');
        // links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        // bold + italic
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
        // bold
        text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
        // italic
        text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
        text = text.replace(/_(.+?)_/g, "<em>$1</em>");
        // restore inline code
        text = text.replace(/\x00C(\d+)\x00/g, function (_, i) { return codes[parseInt(i)]; });
        return text;
    }

    function render(text) {
        var lines = text.replace(/\r\n/g, "\n").split("\n");
        var out = [];
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            // blank line
            if (line.trim() === "") { i++; continue; }

            // raw HTML (pass through lines that look like HTML tags)
            if (/^<[a-zA-Z]/.test(line.trim())) {
                var htmlBlock = [];
                while (i < lines.length && lines[i].trim() !== "") {
                    htmlBlock.push(lines[i]);
                    i++;
                }
                out.push(htmlBlock.join("\n"));
                continue;
            }

            // fenced code block
            var fenceMatch = line.match(/^```(\w*)/);
            if (fenceMatch) {
                var lang = fenceMatch[1];
                var codeLines = [];
                i++;
                while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                    codeLines.push(escapeHtml(lines[i]));
                    i++;
                }
                i++; // skip closing fence
                var langLabel = lang || "code";
                out.push(
                    '<div class="docs-code-block">' +
                    '<div class="docs-code-header"><span class="docs-code-lang">' + langLabel + '</span>' +
                    '<button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button></div>' +
                    '<pre><code>' + codeLines.join("\n") + '</code></pre></div>'
                );
                continue;
            }

            // heading
            var headingMatch = line.match(/^(#{1,6})\s+(.+)/);
            if (headingMatch) {
                var level = headingMatch[1].length;
                out.push("<h" + level + ">" + inline(headingMatch[2]) + "</h" + level + ">");
                i++;
                continue;
            }

            // horizontal rule
            if (/^[-*_]{3,}\s*$/.test(line.trim())) {
                out.push("<hr>");
                i++;
                continue;
            }

            // blockquote
            if (/^>\s?/.test(line)) {
                var bqLines = [];
                while (i < lines.length && /^>\s?/.test(lines[i])) {
                    bqLines.push(lines[i].replace(/^>\s?/, ""));
                    i++;
                }
                out.push("<blockquote>" + inline(bqLines.join("\n")) + "</blockquote>");
                continue;
            }

            // table
            if (line.indexOf("|") !== -1 && i + 1 < lines.length && /^\|?\s*[-:]+[-|:\s]+\s*\|?/.test(lines[i + 1])) {
                var tableLines = [];
                while (i < lines.length && lines[i].indexOf("|") !== -1) {
                    tableLines.push(lines[i]);
                    i++;
                }
                out.push(renderTable(tableLines));
                continue;
            }

            // unordered list
            if (/^[\-\*\+]\s+/.test(line)) {
                var ulItems = [];
                while (i < lines.length && /^[\-\*\+]\s+/.test(lines[i])) {
                    ulItems.push("<li>" + inline(lines[i].replace(/^[\-\*\+]\s+/, "")) + "</li>");
                    i++;
                }
                out.push("<ul class='docs-list'>" + ulItems.join("") + "</ul>");
                continue;
            }

            // ordered list
            if (/^\d+\.\s+/.test(line)) {
                var olItems = [];
                while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                    olItems.push("<li>" + inline(lines[i].replace(/^\d+\.\s+/, "")) + "</li>");
                    i++;
                }
                out.push("<ol class='docs-steps'>" + olItems.join("") + "</ol>");
                continue;
            }

            // paragraph (collect consecutive non-empty, non-special lines)
            var paraLines = [];
            while (
                i < lines.length &&
                lines[i].trim() !== "" &&
                !/^(#{1,6}\s|```|>\s?|[-*_]{3,}\s*$)/.test(lines[i]) &&
                !/^[<]/.test(lines[i].trim()) &&
                !/^\d+\.\s+/.test(lines[i]) &&
                !/^[\-\*\+]\s+/.test(lines[i])
            ) {
                paraLines.push(lines[i]);
                i++;
            }
            if (paraLines.length) {
                out.push("<p>" + inline(paraLines.join(" ")) + "</p>");
            }
        }

        return out.join("\n");
    }

    function renderTable(lines) {
        if (lines.length < 2) return "";
        var parseRow = function (row) {
            return row.replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); });
        };
        var headers = parseRow(lines[0]);
        // skip separator line (lines[1])
        var rows = lines.slice(2).map(parseRow);
        var html = '<div class="docs-table-wrap"><table class="docs-table"><thead><tr>';
        headers.forEach(function (h) { html += "<th>" + inline(h) + "</th>"; });
        html += "</tr></thead><tbody>";
        rows.forEach(function (row) {
            html += "<tr>";
            row.forEach(function (cell) { html += "<td>" + inline(cell) + "</td>"; });
            html += "</tr>";
        });
        html += "</tbody></table></div>";
        return html;
    }

    return { render: render };
})();
