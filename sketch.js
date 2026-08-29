/* ============================================================
   sketch.js — hand-drawn notebook annotations
   Injects rough SVG marks and animates them (draw-on) when
   they scroll into view. Highlighter marks are pure CSS.
   ============================================================ */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  // Each path is intentionally a little wobbly; pathLength="1"
  // normalises it so the dash animation works at any size.
  var MARKS = {
    circle: {
      vb: "0 0 100 60",
      // one full lap, then a long second pass (~3/4 lap) riding just inside the
      // first — a heavy hand-drawn overlap before the stroke trails off.
      d: "M74,8 C44,2 14,10 9,26 C4,41 17,54 42,56 C70,59 93,46 90,26 C86,9 58,3 39,9 C24,13 9,25 13,39 C17,50 33,56 51,54 C66,52 77,45 80,38"
    },
    underline: {
      vb: "0 0 100 14",
      d: "M0,8 C22,6 44,9 66,7.5 C80,6.6 90,7.6 100,7"
    },
    "underline-2": {
      vb: "0 0 100 22",
      d: "M2,8 C20,2 30,12 48,7 C66,2 76,11 98,5 M3,16 C22,11 33,19 52,14 C70,10 81,17 97,13"
    },
    strike: {
      vb: "0 0 100 18",
      d: "M1,9 C19,5 27,12 45,9 C63,6 73,13 99,8"
    },
    // loose back-and-forth pen scribble — emphasis, not deletion
    scribble: {
      vb: "0 0 100 24",
      d: "M2,13 C11,4 17,20 27,12 C37,4 43,20 53,12 C63,4 69,20 79,12 C89,4 95,18 99,12 M4,17 C14,9 20,22 30,15 C40,9 47,22 57,15 C67,9 74,21 84,15 C90,12 95,17 98,14"
    },
    arrow: {
      vb: "0 0 122 54",
      d: "M4,40 C33,43 47,37 65,25 C81,15 95,11 114,10 M114,10 L99,3 M114,10 L101,22"
    },
    star: {
      vb: "0 0 60 60",
      d: "M30,5 L30,55 M7,17 L53,43 M53,17 L7,43"
    }
  };

  function buildMark(el) {
    var type = el.getAttribute("data-sketch");
    if (type === "highlight") return;            // CSS handles highlighter
    var spec = MARKS[type] || MARKS.underline;

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "sketch-mark sketch-mark--" + type);
    svg.setAttribute("viewBox", spec.vb);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", spec.d);
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);

    el.appendChild(svg);
  }

  function init() {
    var nodes = [].slice.call(document.querySelectorAll("[data-sketch]"));
    nodes.forEach(buildMark);

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-drawn"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        window.setTimeout(function () { el.classList.add("is-drawn"); }, 140);
        io.unobserve(el);
      });
    }, { threshold: 0.55, rootMargin: "0px 0px -6% 0px" });

    nodes.forEach(function (n) { io.observe(n); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
