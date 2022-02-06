/* PrismJS 1.26.0
https://prismjs.com/download.html#themes=prism-okaidia&languages=asm6502 */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}, Prism = function (u) { var t = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, n = 0, e = {}, M = { manual: u.Prism && u.Prism.manual, disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler, util: { encode: function e(n) { return n instanceof W ? new W(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ") }, type: function (e) { return Object.prototype.toString.call(e).slice(8, -1) }, objId: function (e) { return e.__id || Object.defineProperty(e, "__id", { value: ++n }), e.__id }, clone: function t(e, r) { var a, n; switch (r = r || {}, M.util.type(e)) { case "Object": if (n = M.util.objId(e), r[n]) return r[n]; for (var i in a = {}, r[n] = a, e) e.hasOwnProperty(i) && (a[i] = t(e[i], r)); return a; case "Array": return n = M.util.objId(e), r[n] ? r[n] : (a = [], r[n] = a, e.forEach(function (e, n) { a[n] = t(e, r) }), a); default: return e } }, getLanguage: function (e) { for (; e;) { var n = t.exec(e.className); if (n) return n[1].toLowerCase(); e = e.parentElement } return "none" }, setLanguage: function (e, n) { e.className = e.className.replace(RegExp(t, "gi"), ""), e.classList.add("language-" + n) }, currentScript: function () { if ("undefined" == typeof document) return null; if ("currentScript" in document) return document.currentScript; try { throw new Error } catch (e) { var n = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(e.stack) || [])[1]; if (n) { var t = document.getElementsByTagName("script"); for (var r in t) if (t[r].src == n) return t[r] } return null } }, isActive: function (e, n, t) { for (var r = "no-" + n; e;) { var a = e.classList; if (a.contains(n)) return !0; if (a.contains(r)) return !1; e = e.parentElement } return !!t } }, languages: { plain: e, plaintext: e, text: e, txt: e, extend: function (e, n) { var t = M.util.clone(M.languages[e]); for (var r in n) t[r] = n[r]; return t }, insertBefore: function (t, e, n, r) { var a = (r = r || M.languages)[t], i = {}; for (var l in a) if (a.hasOwnProperty(l)) { if (l == e) for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]); n.hasOwnProperty(l) || (i[l] = a[l]) } var s = r[t]; return r[t] = i, M.languages.DFS(M.languages, function (e, n) { n === s && e != t && (this[e] = i) }), i }, DFS: function e(n, t, r, a) { a = a || {}; var i = M.util.objId; for (var l in n) if (n.hasOwnProperty(l)) { t.call(n, l, n[l], r || l); var o = n[l], s = M.util.type(o); "Object" !== s || a[i(o)] ? "Array" !== s || a[i(o)] || (a[i(o)] = !0, e(o, t, l, a)) : (a[i(o)] = !0, e(o, t, null, a)) } } }, plugins: {}, highlightAll: function (e, n) { M.highlightAllUnder(document, e, n) }, highlightAllUnder: function (e, n, t) { var r = { callback: t, container: e, selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code' }; M.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), M.hooks.run("before-all-elements-highlight", r); for (var a, i = 0; a = r.elements[i++];)M.highlightElement(a, !0 === n, r.callback) }, highlightElement: function (e, n, t) { var r = M.util.getLanguage(e), a = M.languages[r]; M.util.setLanguage(e, r); var i = e.parentElement; i && "pre" === i.nodeName.toLowerCase() && M.util.setLanguage(i, r); var l = { element: e, language: r, grammar: a, code: e.textContent }; function o(e) { l.highlightedCode = e, M.hooks.run("before-insert", l), l.element.innerHTML = l.highlightedCode, M.hooks.run("after-highlight", l), M.hooks.run("complete", l), t && t.call(l.element) } if (M.hooks.run("before-sanity-check", l), (i = l.element.parentElement) && "pre" === i.nodeName.toLowerCase() && !i.hasAttribute("tabindex") && i.setAttribute("tabindex", "0"), !l.code) return M.hooks.run("complete", l), void (t && t.call(l.element)); if (M.hooks.run("before-highlight", l), l.grammar) if (n && u.Worker) { var s = new Worker(M.filename); s.onmessage = function (e) { o(e.data) }, s.postMessage(JSON.stringify({ language: l.language, code: l.code, immediateClose: !0 })) } else o(M.highlight(l.code, l.grammar, l.language)); else o(M.util.encode(l.code)) }, highlight: function (e, n, t) { var r = { code: e, grammar: n, language: t }; if (M.hooks.run("before-tokenize", r), !r.grammar) throw new Error('The language "' + r.language + '" has no grammar.'); return r.tokens = M.tokenize(r.code, r.grammar), M.hooks.run("after-tokenize", r), W.stringify(M.util.encode(r.tokens), r.language) }, tokenize: function (e, n) { var t = n.rest; if (t) { for (var r in t) n[r] = t[r]; delete n.rest } var a = new i; return I(a, a.head, e), function e(n, t, r, a, i, l) { for (var o in r) if (r.hasOwnProperty(o) && r[o]) { var s = r[o]; s = Array.isArray(s) ? s : [s]; for (var u = 0; u < s.length; ++u) { if (l && l.cause == o + "," + u) return; var c = s[u], g = c.inside, f = !!c.lookbehind, h = !!c.greedy, d = c.alias; if (h && !c.pattern.global) { var v = c.pattern.toString().match(/[imsuy]*$/)[0]; c.pattern = RegExp(c.pattern.source, v + "g") } for (var p = c.pattern || c, m = a.next, y = i; m !== t.tail && !(l && y >= l.reach); y += m.value.length, m = m.next) { var k = m.value; if (t.length > n.length) return; if (!(k instanceof W)) { var x, b = 1; if (h) { if (!(x = z(p, y, n, f)) || x.index >= n.length) break; var w = x.index, A = x.index + x[0].length, E = y; for (E += m.value.length; E <= w;)m = m.next, E += m.value.length; if (E -= m.value.length, y = E, m.value instanceof W) continue; for (var P = m; P !== t.tail && (E < A || "string" == typeof P.value); P = P.next)b++, E += P.value.length; b--, k = n.slice(y, E), x.index -= y } else if (!(x = z(p, 0, k, f))) continue; var w = x.index, L = x[0], S = k.slice(0, w), O = k.slice(w + L.length), j = y + k.length; l && j > l.reach && (l.reach = j); var C = m.prev; S && (C = I(t, C, S), y += S.length), T(t, C, b); var N = new W(o, g ? M.tokenize(L, g) : L, d, L); if (m = I(t, C, N), O && I(t, m, O), 1 < b) { var _ = { cause: o + "," + u, reach: j }; e(n, t, r, m.prev, y, _), l && _.reach > l.reach && (l.reach = _.reach) } } } } } }(e, a, n, a.head, 0), function (e) { var n = [], t = e.head.next; for (; t !== e.tail;)n.push(t.value), t = t.next; return n }(a) }, hooks: { all: {}, add: function (e, n) { var t = M.hooks.all; t[e] = t[e] || [], t[e].push(n) }, run: function (e, n) { var t = M.hooks.all[e]; if (t && t.length) for (var r, a = 0; r = t[a++];)r(n) } }, Token: W }; function W(e, n, t, r) { this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length } function z(e, n, t, r) { e.lastIndex = n; var a = e.exec(t); if (a && r && a[1]) { var i = a[1].length; a.index += i, a[0] = a[0].slice(i) } return a } function i() { var e = { value: null, prev: null, next: null }, n = { value: null, prev: e, next: null }; e.next = n, this.head = e, this.tail = n, this.length = 0 } function I(e, n, t) { var r = n.next, a = { value: t, prev: n, next: r }; return n.next = a, r.prev = a, e.length++, a } function T(e, n, t) { for (var r = n.next, a = 0; a < t && r !== e.tail; a++)r = r.next; (n.next = r).prev = n, e.length -= a } if (u.Prism = M, W.stringify = function n(e, t) { if ("string" == typeof e) return e; if (Array.isArray(e)) { var r = ""; return e.forEach(function (e) { r += n(e, t) }), r } var a = { type: e.type, content: n(e.content, t), tag: "span", classes: ["token", e.type], attributes: {}, language: t }, i = e.alias; i && (Array.isArray(i) ? Array.prototype.push.apply(a.classes, i) : a.classes.push(i)), M.hooks.run("wrap", a); var l = ""; for (var o in a.attributes) l += " " + o + '="' + (a.attributes[o] || "").replace(/"/g, "&quot;") + '"'; return "<" + a.tag + ' class="' + a.classes.join(" ") + '"' + l + ">" + a.content + "</" + a.tag + ">" }, !u.document) return u.addEventListener && (M.disableWorkerMessageHandler || u.addEventListener("message", function (e) { var n = JSON.parse(e.data), t = n.language, r = n.code, a = n.immediateClose; u.postMessage(M.highlight(r, M.languages[t], t)), a && u.close() }, !1)), M; var r = M.util.currentScript(); function a() { M.manual || M.highlightAll() } if (r && (M.filename = r.src, r.hasAttribute("data-manual") && (M.manual = !0)), !M.manual) { var l = document.readyState; "loading" === l || "interactive" === l && r && r.defer ? document.addEventListener("DOMContentLoaded", a) : window.requestAnimationFrame ? window.requestAnimationFrame(a) : window.setTimeout(a, 16) } return M }(_self); "undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.asm6502 = {
    comment: /;.*|#.*/,
    directive: {
        pattern: /\.\w+(?= )/,
        alias: "property"
    },
    string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    "op-code": {
        pattern: /\b(?:AND|OR|ADD|SUB|LW|SW|MOV|INP|JEQ|JNE|JGT|JLT|LW|SW|LI|JMP)\b/,
        alias: "keyword"
    },
    "hex-number": {
        pattern: /0[xX][0-9a-fA-F]+/,
        alias: "number"
    },
    register: {
        pattern: /\b(?:R0|R1|R2|R3|INP)\b/,
        alias: "variable"
    },
    label: {
        pattern: /.+?(?<=:)/
    }
};


// Initializing

function update(text) {
    let result_element = document.querySelector("#highlighting-content");
    // Handle final newlines (see article)
    if(text[text.length-1] == "\n") {
        text += " ";
    }
    // Update code
    result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
    // Syntax Highlight
    Prism.highlightElement(result_element);
    }

    function sync_scroll(element) {
    /* Scroll result to scroll coords of event - sync with textarea */
    let result_element = document.querySelector("#highlighting");
    // Get and set x and y
    result_element.scrollTop = element.scrollTop;
    result_element.scrollLeft = element.scrollLeft;
    }

    function check_tab(element, event) {
    let code = element.value;
    if(event.key == "Tab") {
        /* Tab key pressed */
        event.preventDefault(); // stop normal
        let before_tab = code.slice(0, element.selectionStart); // text before tab
        let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
        let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
        element.value = before_tab + "\t" + after_tab; // add tab char
        // move cursor
        element.selectionStart = cursor_pos;
        element.selectionEnd = cursor_pos;
        update(element.value); // Update text to include indent
    }
}

update(document.getElementById("asm-input").value);