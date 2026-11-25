/* Ablaze — interactive polish layer (progressive enhancement; safe if it fails) */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const animate = () => !reduced.matches;

  root.classList.add("epic");

  /* ---- 1. Pointer spotlight on glass surfaces ---- */
  const spotSelector = [
    ".step-card",
    ".coverage-card",
    ".guide-card",
    ".faq-item",
    ".contact-detail",
    ".facts-inner",
    ".hero-note",
    ".moments-video-frame",
  ].join(",");

  document.querySelectorAll(spotSelector).forEach((el) => el.classList.add("spot"));

  if (finePointer.matches) {
    let spotFrame = 0;
    document.addEventListener(
      "pointermove",
      (event) => {
        if (!animate() || spotFrame) return;
        spotFrame = requestAnimationFrame(() => {
          spotFrame = 0;
          const target = event.target instanceof Element ? event.target.closest(".spot") : null;
          if (!target) return;
          const box = target.getBoundingClientRect();
          target.style.setProperty("--mx", `${event.clientX - box.left}px`);
          target.style.setProperty("--my", `${event.clientY - box.top}px`);
        });
      },
      { passive: true },
    );
  }

  /* ---- 2. Soft cursor aura ---- */
  if (finePointer.matches && animate()) {
    const aura = document.createElement("div");
    aura.className = "cursor-aura";
    aura.setAttribute("aria-hidden", "true");
    document.body.appendChild(aura);

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let running = false;

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      aura.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        tx = event.clientX;
        ty = event.clientY;
        aura.classList.add("is-on");
        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => aura.classList.remove("is-on"));
  }

  /* ---- 3. Magnetic buttons ---- */
  if (finePointer.matches) {
    document.querySelectorAll(".button, .nav-cta").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        if (!animate()) return;
        const box = button.getBoundingClientRect();
        const dx = (event.clientX - (box.left + box.width / 2)) / box.width;
        const dy = (event.clientY - (box.top + box.height / 2)) / box.height;
        button.style.setProperty("--mag-x", `${(dx * 10).toFixed(2)}px`);
        button.style.setProperty("--mag-y", `${(dy * 8).toFixed(2)}px`);
      });
      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--mag-x", "0px");
        button.style.setProperty("--mag-y", "0px");
      });
    });
  }

  /* ---- 4. Scrollspy for the navigation ---- */
  const navLinks = Array.from(document.querySelectorAll(".primary-navigation a[href^='#']")).filter(
    (link) => !link.classList.contains("nav-cta"),
  );
  const spyTargets = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  if ("IntersectionObserver" in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const match = spyTargets.find((item) => item.section === entry.target);
          if (!match) return;
          if (entry.isIntersecting) {
            spyTargets.forEach((item) => item.link.removeAttribute("aria-current"));
            match.link.setAttribute("aria-current", "true");
          } else if (match.link.getAttribute("aria-current") === "true") {
            match.link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    spyTargets.forEach((item) => spy.observe(item.section));
  }

  /* ---- 5. Heading rule that draws itself in ---- */
  const headings = document.querySelectorAll(
    ".approach h2, .coverage-heading h2, .guide-heading h2, .faq-heading h2, .about-copy h2, .moments-copy h2, .contact-copy h2",
  );
  headings.forEach((heading) => heading.classList.add("epic-heading"));

  if ("IntersectionObserver" in window) {
    const headingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    headings.forEach((heading) => headingObserver.observe(heading));
  } else {
    headings.forEach((heading) => heading.classList.add("is-in"));
  }

  /* ---- 6. Parallax depth + back-to-top ---- */
  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "back-to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "<span aria-hidden=\"true\">↑</span>";
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: animate() ? "smooth" : "auto" });
  });
  document.body.appendChild(toTop);

  let scrollFrame = 0;
  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const y = window.scrollY;
      if (animate()) root.style.setProperty("--scroll", String(Math.round(y)));
      toTop.classList.toggle("is-visible", y > 900);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* Contact form: build a ready-to-send email (no data leaves the visitor's device) */
(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const body = [
      "Hi Margaret,",
      "",
      "I'd like to request a conversation.",
      "",
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : "",
      `Topic: ${data.get("topic")}`,
      `Best time to reach me: ${data.get("time")}`,
      "",
      "Thank you.",
    ].filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n");
    const subject = `Conversation request: ${data.get("topic")}`;
    window.location.href = `mailto:margaret@ablazesolutions.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
