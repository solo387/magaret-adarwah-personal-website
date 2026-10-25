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

selectGuideTopic("life");

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

const momentsGallery = document.querySelector(".moments-gallery");
const momentsFilters = document.querySelector(".moments-filters");
const momentsGalleryCount = document.querySelector("#moments-gallery-count");
const photoLightbox = document.querySelector("#photo-lightbox");
const lightboxImage = document.querySelector("#photo-lightbox-image");
const lightboxCaption = document.querySelector("#photo-lightbox-caption");
const lightboxCount = document.querySelector("#photo-lightbox-count");
const lightboxClose = document.querySelector("#photo-lightbox-close");
const lightboxPrevious = document.querySelector("#photo-lightbox-previous");
const lightboxNext = document.querySelector("#photo-lightbox-next");

if (
  momentsGallery &&
  momentsFilters &&
  momentsGalleryCount &&
  photoLightbox instanceof HTMLDialogElement &&
  lightboxImage instanceof HTMLImageElement &&
  lightboxCaption &&
  lightboxCount &&
  lightboxClose &&
  lightboxPrevious &&
  lightboxNext
) {
  const photos = Array.from(momentsGallery.querySelectorAll(".moments-photo"));
  const filterButtons = Array.from(momentsFilters.querySelectorAll("button[data-gallery-filter]"));
  let activePhotoIndex = 0;

  photos.forEach((photo) => {
    const image = photo.querySelector("img");
    if (!image) return;
    photo.tabIndex = 0;
    photo.setAttribute("role", "button");
    photo.setAttribute("aria-haspopup", "dialog");
    photo.setAttribute("aria-label", `View photo: ${image.alt}`);
  });

  function getVisiblePhotos() {
    return photos.filter((photo) => !photo.closest("li")?.hidden);
  }

  function setGalleryFilter(category) {
    if (!filterButtons.some((button) => button.dataset.galleryFilter === category)) return;

    photos.forEach((photo) => {
      const listItem = photo.closest("li");
      if (listItem) listItem.hidden = category !== "all" && listItem.dataset.category !== category;
    });

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.galleryFilter === category));
    });

    const visibleCount = getVisiblePhotos().length;
    momentsGalleryCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "photo" : "photos"}`;
  }

  filterButtons.forEach((button) => {
    const category = button.dataset.galleryFilter;
    const count = category === "all"
      ? photos.length
      : photos.filter((photo) => photo.closest("li")?.dataset.category === category).length;
    const countLabel = button.querySelector("[data-filter-count]");
    if (countLabel) countLabel.textContent = String(count);
  });

  momentsFilters.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-gallery-filter]");
    if (button) setGalleryFilter(button.dataset.galleryFilter);
  });

  setGalleryFilter("all");

  function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();
    if (visiblePhotos.length === 0) return;
    activePhotoIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const photo = visiblePhotos[activePhotoIndex];
    const image = photo.querySelector("img");
    const caption = photo.querySelector("figcaption");
    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption?.textContent ?? image.alt;
    lightboxCount.textContent = `Photo ${activePhotoIndex + 1} of ${visiblePhotos.length}`;
  }

  function openPhoto(photo) {
    const index = getVisiblePhotos().indexOf(photo);
    if (index < 0) return;
    showPhoto(index);
    photoLightbox.showModal();
    lightboxClose.focus();
  }

  momentsGallery.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const photo = event.target.closest(".moments-photo");
    if (photo) openPhoto(photo);
  });

  momentsGallery.addEventListener("keydown", (event) => {
    if (!(event.target instanceof Element)) return;
    const photo = event.target.closest(".moments-photo");
    if (!photo || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openPhoto(photo);
  });

  lightboxClose.addEventListener("click", () => photoLightbox.close());
  lightboxPrevious.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
  lightboxNext.addEventListener("click", () => showPhoto(activePhotoIndex + 1));

  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) photoLightbox.close();
  });

  photoLightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      photoLightbox.close();
      return;
    }
    if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
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
    ".site-header, .hero-copy, .hero-visual, .fact, .section-heading, .approach-copy, .step-card, .coverage-heading, .coverage-card, .coverage-note, .guide-heading, .guide-card, .faq-heading, .faq-item, .about-portrait-wrap, .about-copy, .moments-copy, .moments-video-frame, .contact-copy, .contact-details, .footer-brand, .footer-links, .footer-bottom",
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
