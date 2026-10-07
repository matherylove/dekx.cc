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
