/* Dona Deoli — Landi v2 · interações */
(function () {
  "use strict";

  /* ---------- Pétalas caindo ---------- */
  var petalsLayer = document.querySelector(".petals");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (petalsLayer && !reduceMotion) {
    var COUNT = 9;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--drift", (Math.random() * 120 - 60).toFixed(0) + "px");
      p.style.animationDuration = (7 + Math.random() * 6).toFixed(2) + "s";
      p.style.animationDelay = (Math.random() * 8).toFixed(2) + "s";
      var size = 9 + Math.random() * 8;
      p.style.width = size.toFixed(0) + "px";
      p.style.height = size.toFixed(0) + "px";
      petalsLayer.appendChild(p);
    }
  }

  /* ---------- Abas ---------- */
  var links = document.querySelectorAll(".navlink");
  var panels = {
    intro: document.getElementById("intro"),
    jogos: document.getElementById("jogos"),
    protegidos: document.getElementById("protegidos")
  };

  function showTab(name) {
    Object.keys(panels).forEach(function (key) {
      panels[key].hidden = key !== name;
    });
    links.forEach(function (l) {
      var active = l.getAttribute("href") === "#" + name;
      l.classList.toggle("active", active);
      if (active) l.setAttribute("aria-current", "page");
      else l.removeAttribute("aria-current");
    });
    if (history.replaceState) history.replaceState(null, "", "#" + name);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  links.forEach(function (l) {
    l.addEventListener("click", function (e) {
      e.preventDefault();
      showTab(l.getAttribute("href").slice(1));
    });
  });

  var initial = location.hash.replace("#", "");
  if (panels[initial]) showTab(initial);

  /* ---------- Carrossel lateral da introdução ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll("#intro .slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("#intro .dot"));
  var current = 0;

  function goTo(n) {
    if (n < 0 || n >= slides.length || n === current) return;
    slides[current].classList.remove("active");
    slides[current].classList.toggle("exit-left", n > current);
    dots[current].classList.remove("active");
    dots[current].setAttribute("aria-selected", "false");
    current = n;
    slides[current].classList.remove("exit-left");
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    dots[current].setAttribute("aria-selected", "true");
  }

  document.querySelector(".arrow-next").addEventListener("click", function () { goTo(current + 1); });
  document.querySelector(".arrow-prev").addEventListener("click", function () { goTo(current - 1); });

  dots.forEach(function (d, i) {
    d.addEventListener("click", function () { goTo(i); });
  });

  /* teclado: setas dentro da aba intro */
  document.addEventListener("keydown", function (e) {
    if (panels.intro.hidden) return;
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });

  /* swipe no toque */
  var touchX = null;
  var hscroll = document.querySelector(".hscroll");
  hscroll.addEventListener("touchstart", function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  hscroll.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) goTo(dx < 0 ? current + 1 : current - 1);
    touchX = null;
  }, { passive: true });
})();