/* mdrasaa · interactive portfolio */

/* ------------------------------------------------------------
   Data
------------------------------------------------------------ */
const CERTIFICATIONS = [
  { issuer: "CompTIA", name: "A+" },
  { issuer: "CompTIA", name: "Network+" },
  { issuer: "CompTIA", name: "Security+", img: "assets/img/security-plus.jpg" },
  { issuer: "CompTIA", name: "Linux+" },
  { issuer: "INE", name: "eJPT v1", level: "Junior Penetration Testing" },
  { issuer: "INE", name: "eJPT v2", level: "Junior Penetration Testing" },
  { issuer: "eLearnSecurity · INE", name: "EWPT", level: "Web Application Penetration Testing" },
  { issuer: "eLearnSecurity · INE", name: "EWPTX", level: "Web Application Penetration Testing eXtreme" },
  { issuer: "CRTO", name: "CRTM", level: "Red Team Operator" },
  { issuer: "eLearnSecurity", name: "CCEP", level: "Certified Cyber Security Professional" },
];

const FINDINGS = [
  { title: "SSRF — access to internal admin services", img: "assets/img/findings/ssrf-3.png", tag: "SSRF" },
  { title: "Reflected XSS x6 — one vulnerable template", img: "assets/img/findings/xss-6.png", tag: "XSS" },
  { title: "AEM content repository information disclosure", img: "assets/img/findings/aem-info-disclosure.png", tag: "Info Leak" },
  { title: "Sensitive data exposed via debug.log", img: "assets/img/findings/debuglog-exposed.jpeg", tag: "Info Leak" },
  { title: "Insufficiently protected credentials", img: "assets/img/findings/insufficient-credentials.png", tag: "Credentials" },
  { title: "Path traversal", img: "assets/img/findings/path-traversal.png", tag: "Path Traversal" },
  { title: "Subdomain takeover", img: "assets/img/findings/subdomain-takeover.png", tag: "Takeover" },
];

const SPECIALTIES = [
  { title: "Web Application Security", chips: ["XSS — reflected", "XSS — stored", "DOM XSS", "SSRF", "Authorization flaws", "Template injection", "API security", "OWASP Top 10"] },
  { title: "Engagements", chips: ["VAPT", "Vulnerability scanning", "Manual + automated testing", "Structured methodology", "Remediation-first reporting"] },
  { title: "Infrastructure", chips: ["Linux administration", "TCP/IP & hardening", "Windows internals", "Cloud / metadata exposure", "Subdomain takeover"] },
  { title: "Tooling & Development", chips: ["Burp Suite", "ffuf", "Node.js / JavaScript", "Go & Python scripting", "Frontend & web development", "Reproducible PoCs"] },
];

/* ------------------------------------------------------------
   Renderers
------------------------------------------------------------ */
function renderCerts() {
  const grid = document.getElementById("certsGrid");
  grid.innerHTML = CERTIFICATIONS.map(
    (c) => `
      <article class="cert-card">
        ${c.img
          ? `<div class="cert-card__badge"><img src="${c.img}" alt="${c.name} certificate" loading="lazy" decoding="async" /></div>`
          : ""}
        <p class="cert-card__issuer">${c.issuer}</p>
        <h3 class="cert-card__name">${c.name}</h3>
        ${c.level ? `<p class="cert-card__lvl">${c.level}</p>` : ""}
      </article>`
  ).join("");
}

function renderFindings() {
  const grid = document.getElementById("evidenceGrid");
  grid.innerHTML = FINDINGS.map(
    (f, i) => `
      <button class="evidence-card" type="button" data-idx="${i}">
        <span class="evidence-card__tag">${f.tag}</span>
        <img class="evidence-card__thumb" src="${f.img}" alt="${f.title}" loading="lazy" decoding="async" />
        <span class="evidence-card__title">${f.title}</span>
      </button>`
  ).join("");

  grid.querySelectorAll(".evidence-card").forEach((card) =>
    card.addEventListener("click", () => openLightbox(parseInt(card.dataset.idx, 10)))
  );
}

function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  grid.innerHTML = SPECIALTIES.map(
    (g) => `
      <div class="skill-group">
        <h3 class="skill-group__title">&gt; ${g.title}</h3>
        <div class="skill-chips">
          ${g.chips.map((c) => `<span class="skill-chip">${c}</span>`).join("")}
        </div>
      </div>`
  ).join("");
}

/* ------------------------------------------------------------
   Intersection observers (reveal + counters)
------------------------------------------------------------ */
function initReveals() {
  const reveal = (selector) => {
    const els = document.querySelectorAll(selector);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 0.06 + "s";
      io.observe(el);
    });
  };

  reveal(".cert-card, .skill-group, .about__card, .method__step");
  reveal(".contact__card");
  reveal(".evidence-card");
  reveal(".finding");
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  const sections = [...document.querySelectorAll("section[id]")];
  const navItems = [...links.querySelectorAll(".nav__link:not(.nav__link--cta)")];

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((item) => {
          item.style.color = item.getAttribute("href") === "#" + entry.target.id
            ? "var(--accent)"
            : "";
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ------------------------------------------------------------
   Lightbox
------------------------------------------------------------ */
let lastFocusedElement = null;

function openLightbox(idx) {
  const finding = FINDINGS[idx];
  const lightbox = document.getElementById("lightbox");
  const img = lightbox.querySelector(".lightbox__img");
  const caption = lightbox.querySelector(".lightbox__caption");
  lastFocusedElement = document.activeElement;
  img.src = finding.img;
  img.alt = finding.title;
  caption.textContent = finding.title;
  lightbox.classList.add("open");
  lightbox.querySelector(".lightbox__close").focus();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
}

/* ------------------------------------------------------------
   Init
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderCerts();
  renderFindings();
  renderSkills();
  initReveals();
  initNav();
  initLightbox();
});