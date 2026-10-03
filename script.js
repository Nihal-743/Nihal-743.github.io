// portfolio js - nihal
// no jquery / libraries, just plain js

document.documentElement.classList.add("js");

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// footer year
document.getElementById("year").textContent = new Date().getFullYear();


// ---------- header bg + back to top button ----------

const header = document.getElementById("header");
const toTop = document.getElementById("toTop");

function onScroll() {
  if (window.scrollY > 20) {
    header.classList.add("stuck");
  } else {
    header.classList.remove("stuck");
  }

  if (window.scrollY > 700) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });


// ---------- mobile menu ----------

const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function openMenu() {
  nav.classList.add("open");
  burger.setAttribute("aria-expanded", "true");
  burger.setAttribute("aria-label", "Close menu");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  nav.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";
}

burger.addEventListener("click", function () {
  if (nav.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// close menu when a link is clicked
const navLinks = document.querySelectorAll(".nav a");
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", closeMenu);
}

// esc key closes it too
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    burger.focus();
  }
});

// if someone rotates the phone / resizes with menu open
window.addEventListener("resize", function () {
  if (window.innerWidth > 900 && nav.classList.contains("open")) {
    closeMenu();
  }
});


// ---------- typing text in hero ----------

const typed = document.getElementById("typed");
// words come from the admin panel (data-words on the span)
let words = [];
try {
  words = JSON.parse(typed.dataset.words || "[]");
} catch (err) {
  words = [];
}

let wordIndex = 0;
let charIndex = words.length ? words[0].length : 0; // first word is already in the html
let deleting = true;

function typeLoop() {
  const word = words[wordIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  typed.textContent = word.substring(0, charIndex);

  let speed = deleting ? 40 : 85;

  if (!deleting && charIndex === word.length) {
    // finished typing, wait a bit then delete
    speed = 1800;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex++;
    if (wordIndex >= words.length) wordIndex = 0;
    speed = 300;
  }

  setTimeout(typeLoop, speed);
}

if (typed && words.length > 1 && !reduceMotion) {
  setTimeout(typeLoop, 2200);
}


// ---------- show sections on scroll ----------

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // small delay for cards in the same row so they come one by one
        const siblings = Array.from(entry.target.parentElement.children);
        const pos = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (pos % 4) * 80 + "ms";

        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("in");
  });
}

// just in case something breaks, show everything after 4 sec
setTimeout(function () {
  revealItems.forEach(function (item) {
    item.classList.add("in");
  });
}, 4000);


// ---------- counter (50+) ----------

const counters = document.querySelectorAll("[data-count]");

counters.forEach(function (el) {
  const target = parseInt(el.getAttribute("data-count"));

  if (reduceMotion) {
    el.textContent = target;
    return;
  }

  const counterObs = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    counterObs.disconnect();

    let start = null;
    const duration = 1400;

    function step(time) {
      if (!start) start = time;
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;

      // ease out so it slows down at the end
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  counterObs.observe(el);
});


// ---------- project filter buttons ----------

const filterBtns = document.querySelectorAll(".filters button");
const projectCards = document.querySelectorAll(".project");

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const filter = btn.dataset.filter;

    filterBtns.forEach(function (b) {
      b.classList.remove("on");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("on");
    btn.setAttribute("aria-pressed", "true");

    projectCards.forEach(function (card) {
      if (filter === "all" || card.dataset.cat === filter) {
        card.classList.remove("hide");
        card.classList.add("in");
      } else {
        card.classList.add("hide");
      }
    });
  });
});


// ---------- highlight nav link of current section ----------

const menuLinks = document.querySelectorAll('.nav a[href^="#"]');

const sectionObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      menuLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.classList.add("active");
        }
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

menuLinks.forEach(function (link) {
  const sec = document.querySelector(link.getAttribute("href"));
  if (sec) sectionObs.observe(sec);
});


// ---------- copy email button ----------

const copyBtn = document.querySelector(".copy");

if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    const email = copyBtn.dataset.copy;

    navigator.clipboard.writeText(email).then(function () {
      copyBtn.textContent = "Copied!";
    }).catch(function () {
      copyBtn.textContent = "Press Ctrl+C";
    });

    copyBtn.classList.add("done");
    setTimeout(function () {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("done");
    }, 2000);
  });
}


// ---------- contact form ----------
// sends to enquiry.php (saved in admin > enquiries)

const form = document.getElementById("form");
const sendBtn = document.getElementById("sendBtn");
const formNote = document.getElementById("formNote");

function showError(input, msg) {
  const field = input.closest(".field");
  const errBox = field.querySelector(".err");

  if (msg) {
    field.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
  } else {
    field.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  }
  errBox.textContent = msg;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const contact = form.contact.value.trim();
  const message = form.message.value.trim();
  let ok = true;

  if (name === "") {
    showError(form.name, "Please enter your name.");
    ok = false;
  } else {
    showError(form.name, "");
  }

  if (contact === "") {
    showError(form.contact, "Add your email or phone so I can reply.");
    ok = false;
  } else {
    showError(form.contact, "");
  }

  if (message.length < 10) {
    showError(form.message, "Please write a line or two about the role.");
    ok = false;
  } else {
    showError(form.message, "");
  }

  if (!ok) {
    form.querySelector(".invalid input, .invalid textarea").focus();
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  fetch(form.getAttribute("action"), {
    method: "POST",
    body: new FormData(form)
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        form.classList.add("sent");
        form.innerHTML = '<div class="sent-box"><span class="sent-tick">✓</span><h3>Message sent</h3><p></p></div>';
        form.querySelector(".sent-box p").textContent = data.message;
      } else {
        formNote.textContent = data.message;
        formNote.classList.add("note-error");
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";
      }
    })
    .catch(function () {
      // server didn't answer - fall back to whatsapp so the message isn't lost
      if (form.dataset.wa) {
        let text = "Hi Nihal, I'm " + name + ".\n\n" + message;
        window.open("https://wa.me/" + form.dataset.wa + "?text=" + encodeURIComponent(text), "_blank");
      } else {
        formNote.textContent = "Couldn't send right now. Please try again in a minute.";
        formNote.classList.add("note-error");
      }
      sendBtn.disabled = false;
      sendBtn.textContent = "Send message";
    });
});

// remove the red border once they start typing again
form.querySelectorAll("input, textarea").forEach(function (input) {
  input.addEventListener("input", function () {
    if (input.closest(".field").classList.contains("invalid")) {
      showError(input, "");
    }
  });
});
