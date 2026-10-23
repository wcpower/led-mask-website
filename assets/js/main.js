/* LUMASK — shared behaviour (PLACEHOLDER BRAND)
   Mobile nav, scroll reveals, contact + newsletter validation. No backend. */
(function () {
  "use strict";
  window.__lumaskJs = "v2-reveal";

  /* mobile nav */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  /* scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
    /* safety pass: anything already at the fold reveals immediately, even if
       web-font swaps shifted layout after the observer's first callback */
    requestAnimationFrame(function () {
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* contact form — client-side only, no data leaves the page */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var valid = true;
      var firstInvalid = null;
      form.querySelectorAll(".field").forEach(function (field) {
        var input = field.querySelector("input, textarea");
        if (!input) return;
        var ok = input.value.trim() !== "" &&
          (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle("invalid", !ok);
        if (!ok) {
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });
      var msg = form.querySelector(".form-msg");
      if (valid) {
        if (msg) {
          msg.textContent = "Thank you — your message is ready to send. (Demo site: nothing was submitted. Connect a form backend like Formspree to go live.)";
          msg.classList.add("show");
        }
        form.reset();
      } else {
        if (msg) msg.classList.remove("show");
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* newsletter (footer) */
  var news = document.getElementById("newsletter-form");
  if (news) {
    news.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = news.querySelector("input");
      var msg = news.parentElement.querySelector(".newsletter-msg");
      var ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (msg) {
        msg.textContent = ok
          ? "You're on the list! (Demo site — no data stored.)"
          : "Please enter a valid email address.";
        msg.classList.add("show");
      }
      if (ok) news.reset();
    });
  }

  /* copyright year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
