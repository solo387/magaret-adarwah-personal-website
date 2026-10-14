const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mobileNavigationQuery = window.matchMedia("(max-width: 820px)");

function closeNavigation(returnFocus = false) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeNavigation(true);
    }
  });

  mobileNavigationQuery.addEventListener("change", (event) => {
    if (!event.matches) closeNavigation();
  });
}

const guideTopics = {
  life: {
    label: "A GOOD PLACE TO START",
    prompt: "Who would you like your coverage to protect?",
    description: "There’s no quiz or right answer. These prompts can help you think about what you want to ask Margaret.",
    questions: [
      "What do I already have through work or elsewhere?",
      "How could I think about the length and amount of coverage?",
      "What should I understand before comparing policy types?",
    ],
    subject: "Life insurance conversation",
  },
  health: {
    label: "A GOOD PLACE TO START",
    prompt: "What matters most when you compare health plans?",
    description: "Think about the care you may need and the costs you want to understand before choosing a plan.",
    questions: [
      "Which costs should I compare beyond the monthly premium?",
      "How can I check whether the care I need is covered?",
      "What should I understand about deductibles and out-of-pocket costs?",
    ],
    subject: "Health coverage conversation",
  },
  annuities: {
    label: "A GOOD PLACE TO START",
    prompt: "What should I understand before considering an annuity?",
    description: "Annuity terms can vary. A good first conversation is about how the details fit your own timeline and priorities.",
    questions: [
      "When can I access my money, and what charges may apply?",
      "How does the contract provide income, and when would it begin?",
      "What guarantees, limits, and trade-offs should I understand?",
    ],
    subject: "Annuity conversation",
  },
};

const topicPicker = document.querySelector(".topic-picker");
const guidePrompt = document.querySelector("#guide-prompt");
const guideDescription = document.querySelector("#guide-description");
const guideLabel = document.querySelector("#guide-label");
const guideQuestions = document.querySelector("#guide-questions");
const guideContact = document.querySelector("#guide-contact");
const guidePrint = document.querySelector("#guide-print");
const printableGuideTopic = document.querySelector("#print-guide-topic");
const printableGuidePrompt = document.querySelector("#print-guide-prompt");
const printableGuideQuestions = document.querySelector("#print-guide-questions");

function selectGuideTopic(topic) {
  const selection = guideTopics[topic];
  if (
    !selection ||
    !topicPicker ||
    !guidePrompt ||
    !guideDescription ||
    !guideLabel ||
    !guideQuestions ||
    !guideContact
  ) {
    return;
  }

  topicPicker.querySelectorAll("[data-topic]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
  });

  guideLabel.textContent = selection.label;
  guidePrompt.textContent = selection.prompt;
  guideDescription.textContent = selection.description;
  guideQuestions.replaceChildren(
    ...selection.questions.map((question) => {
      const item = document.createElement("li");
      item.textContent = question;
      return item;
    }),
  );
  const emailBody = "Hi Margaret,\n\nI'd like to request a time to talk. Please let me know what works for you.\n\nThank you.";
  guideContact.href = `mailto:margaret@ablazesolutions.net?subject=${encodeURIComponent(`Request a conversation: ${selection.subject}`)}&body=${encodeURIComponent(emailBody)}`;

  if (printableGuideTopic && printableGuidePrompt && printableGuideQuestions) {
    printableGuideTopic.textContent = selection.subject;
    printableGuidePrompt.textContent = selection.prompt;
    printableGuideQuestions.replaceChildren(
      ...selection.questions.map((question) => {
        const item = document.createElement("li");
        item.textContent = question;
        return item;
      }),
    );
  }
}

if (guidePrint) {
  guidePrint.addEventListener("click", () => window.print());
}

if (topicPicker) {
  topicPicker.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-topic]");
    if (button) selectGuideTopic(button.dataset.topic);
  });
}

const coverageGrid = document.querySelector(".coverage-grid");
if (coverageGrid) {
  coverageGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const topicLink = event.target.closest("a[data-topic]");
    if (topicLink) selectGuideTopic(topicLink.dataset.topic);
  });
}

const tiltTargets = document.querySelectorAll("[data-tilt]");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function resetTilt(target) {
  target.style.setProperty("--tilt-x", "0deg");
  target.style.setProperty("--tilt-y", "0deg");
}

if (finePointerQuery.matches) {
  tiltTargets.forEach((target) => {
    let tiltFrame = 0;

    target.addEventListener("pointermove", (event) => {
      if (reducedMotionQuery.matches) return;

      if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
      tiltFrame = window.requestAnimationFrame(() => {
        const bounds = target.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
        const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
        const intensity = target.classList.contains("hero-visual") ? 5 : 4;

        target.style.setProperty("--tilt-x", `${(-vertical * intensity).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${(horizontal * intensity).toFixed(2)}deg`);
        tiltFrame = 0;
      });
    });

    target.addEventListener("pointerleave", () => {
      if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
      tiltFrame = 0;
      resetTilt(target);
    });
  });
}

reducedMotionQuery.addEventListener("change", (event) => {
  if (event.matches) tiltTargets.forEach(resetTilt);
});

const progressBar = document.querySelector(".scroll-progress span");
let scrollFrame = 0;

function updateScrollState() {
  scrollFrame = 0;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  }

  document.querySelector(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function scheduleScrollStateUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", scheduleScrollStateUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollStateUpdate);
updateScrollState();

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(
    ".site-header, .hero-copy, .hero-visual, .fact, .section-heading, .approach-copy, .step-card, .coverage-heading, .coverage-card, .coverage-note, .guide-heading, .guide-card, .faq-heading, .faq-item, .about-portrait-wrap, .about-copy, .contact-copy, .contact-details, .footer-brand, .footer-links, .footer-bottom",
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 80}ms`);
  });

  document.documentElement.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
