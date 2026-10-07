/* dekx.js — shared by index.html and color.html */
(function () {
  var c = document.getElementById("neural");
  if (!c) return;
  var x = c.getContext("2d");
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, pts = [], running = false;
  function size() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(80, W * H / 18000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16 });
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      for (var j = i + 1; j < pts.length; j++) {
        var b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { x.strokeStyle = "rgba(167,139,250," + ((1 - d / 140) * .2).toFixed(3) + ")"; x.lineWidth = 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
      }
    }
    x.fillStyle = "rgba(196,181,253,.75)";
    for (var k = 0; k < pts.length; k++) x.fillRect(Math.round(pts[k].x) - 1, Math.round(pts[k].y) - 1, 2, 2);
  }
  function tick() {
    if (document.hidden) { running = false; return; }
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i]; p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
    }
    draw(); requestAnimationFrame(tick);
  }
  function start() { if (!running && !still) { running = true; requestAnimationFrame(tick); } }
  size();
  addEventListener("resize", function () { size(); if (still) draw(); });
  if (still) draw(); else { start(); document.addEventListener("visibilitychange", function () { if (!document.hidden) start(); }); }
})();

(function () {
  if (!window.matchMedia || !matchMedia("(max-width: 820px)").matches) return;
  var groups = document.querySelectorAll("details.group[data-collapse-mobile]");
  for (var i = 0; i < groups.length; i++) groups[i].removeAttribute("open");
})();

/* Window maximize / restore animation used by links with data-zoom */
(function () {
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function box(r) { return { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" }; }
  function homeRect() {
    var w = Math.min(1120, innerWidth), l = (innerWidth - w) / 2, t = innerWidth > 820 ? 28 : 0;
    return { left: l, top: t, width: w, height: innerHeight - t * 2 };
  }
  function zoom(from, to, title, done) {
    if (reduced || !Element.prototype.animate) { done(); return; }
    var g = document.createElement("div");
    g.className = "win zoom-ghost";
    g.innerHTML = '<div class="win-title"><span class="win-text"></span></div>';
    g.querySelector(".win-text").textContent = title;
    Object.assign(g.style, box(from));
    document.body.appendChild(g);
    var a = g.animate([box(from), box(to)], { duration: 240, easing: "cubic-bezier(.25,.7,.35,1)", fill: "forwards" });
    var finished = false;
    function go() { if (!finished) { finished = true; done(); } }
    a.onfinish = go;
    setTimeout(go, 600);
  }
  function wideRect() {
    var side = Math.max(24, (innerWidth - 1480) / 2);
    if (innerWidth <= 1180 || innerHeight <= 560) return { left: 0, top: 0, width: innerWidth, height: innerHeight };
    return { left: side, top: 24, width: innerWidth - side * 2, height: innerHeight - 48 };
  }
  window.dekxZoom = { zoom: zoom, homeRect: homeRect, wideRect: wideRect };

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-zoom]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var href = a.href, kind = a.getAttribute("data-zoom"), title = a.getAttribute("data-title") || a.textContent;
    var win = document.querySelector(".win-main"), r = win.getBoundingClientRect();
    var cur = { left: Math.max(0, r.left), top: Math.max(0, r.top), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight) };
    var go = function () { location.href = href; };
    if (kind === "max") zoom(a.getBoundingClientRect(), wideRect(), title, go);
    else if (kind === "min") zoom(cur, { left: 0, top: innerHeight - 22, width: 160, height: 22 }, title, go);
    else zoom(cur, homeRect(), title, go);
  });

  addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    var gs = document.querySelectorAll(".zoom-ghost");
    for (var i = 0; i < gs.length; i++) gs[i].remove();
  });
})();
