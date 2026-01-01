document.addEventListener("DOMContentLoaded", () => {
  // ===== 1) SCROLL REVEAL =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

  // ===== 2) TYPEWRITER =====
  const phrases = [
    "a varsity athlete.",
    "an entrepreneur.",
    "a public speaker.",
    "an economics student.",
    "a risk taker.",
  ];

  const textElement = document.getElementById("typewriter");

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if (!textElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();

  // ===== 3) HAMBURGER MENU =====
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".navbar-menu");
  const navLinks = document.querySelectorAll(".navbar-links, .button");

  if (menu && menuLinks) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("is-active");
      menuLinks.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-active");
        menuLinks.classList.remove("active");
      });
    });
  }

// ===== 4) MOBILE CAROUSEL AUTOPLAY (SMOOTH + NO JITTER) =====
const timeline = document.querySelector(".experience .timeline");

let rafId = null;
let paused = false;
let resumeTimeout = null;

function isMobile() {
  return window.innerWidth <= 768;
}

function stopAutoScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

function autoStep() {
  if (!timeline || !isMobile() || paused) {
    rafId = requestAnimationFrame(autoStep);
    return;
  }

  timeline.scrollLeft += 0.6; // smaller = smoother

  const maxScroll = timeline.scrollWidth - timeline.clientWidth;
  if (timeline.scrollLeft >= maxScroll - 1) {
    timeline.scrollLeft = 0;
  }

  rafId = requestAnimationFrame(autoStep);
}

function pauseAndResumeLater() {
  paused = true;
  if (resumeTimeout) clearTimeout(resumeTimeout);

  // resume only after user stops interacting
  resumeTimeout = setTimeout(() => {
    paused = false;
  }, 1400);
}

function initAutoScroll() {
  if (!timeline) return;

  // stop completely on desktop
  if (!isMobile()) {
    stopAutoScroll();
    return;
  }

  if (!rafId) rafId = requestAnimationFrame(autoStep);
}

if (timeline) {
  // Any of these means "user is interacting" -> pause autoplay
  timeline.addEventListener("touchstart", pauseAndResumeLater, { passive: true });
  timeline.addEventListener("touchmove", pauseAndResumeLater, { passive: true });
  timeline.addEventListener("pointerdown", pauseAndResumeLater);
  timeline.addEventListener("wheel", pauseAndResumeLater, { passive: true });

  // Also pause when the user scrolls the carousel (covers momentum scrolling)
  timeline.addEventListener("scroll", pauseAndResumeLater, { passive: true });
}

window.addEventListener("resize", initAutoScroll);
initAutoScroll();
});
