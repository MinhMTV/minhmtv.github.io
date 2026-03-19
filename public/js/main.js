/* MENU SHOW Y HIDDEN */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* MENU SHOW */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    document.querySelector('.lang-menu').style.zIndex = "-1";
  });

}

/* MENU HIDDEN */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    document.querySelector('.lang-menu').style.zIndex = "100";
  });
}

/* REMOVE MENU MOBILE */
const navLink = document.querySelectorAll(".nav-link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));


/* CHANGE LANGUAGE */
function updateContent(langData) {
  window.currentLangData = langData;
  document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = langData[key];
  });
  updateTypedStrings(langData['typedStrings']);
}

function syncSkillBars() {
  document.querySelectorAll(".skills-data").forEach((skillItem) => {
    const numberElement = skillItem.querySelector(".skills-number");
    const barElement = skillItem.querySelector(".skills-percentage");

    if (!numberElement || !barElement) {
      return;
    }

    const percentage = parseInt(numberElement.textContent, 10);
    if (!Number.isNaN(percentage)) {
      barElement.style.width = `${percentage}%`;
    }
  });
}

function updateLanguageFlag(lang) {
  const flagElement = document.querySelector('.lang-menu .selected-lang');
  if (lang === 'de') {
      flagElement.style.backgroundImage = "url('https://img.icons8.com/color/48/germany.png')";
  } else if (lang === 'en') {
      flagElement.style.backgroundImage = "url('https://img.icons8.com/color/48/great-britain.png')";
  }
}

// Function to update Typed.js strings
function updateTypedStrings(strings) {
  if (window.typed) {
    window.typed.destroy(); // Destroy existing Typed instance
  }
  window.typed = new Typed('#auto-type', {
    strings: strings,
    typeSpeed: 100,
    backspeed: 200,
    loop: true
  });
}

// Detect browser language
function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage; 
  return lang.split('-')[0]; // Extract language code
}

// Set initial language
function setInitialLanguage() {
  const browserLang = getBrowserLanguage();
  const savedLang = localStorage.getItem('language') || browserLang; // Use saved language if available, else use browser language
  setLanguagePreference(savedLang);
}

// Function to set the language preference and update the content
async function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
  const langData = await fetchLanguageData(lang);
  updateContent(langData);
  syncSkillBars();
  updateLanguageFlag(lang);
}

// Function to fetch language data
async function fetchLanguageData(lang) {
  const response = await fetch(`lang/${lang}.json`);
  return response.json();
}

// Event listeners for language change
document.querySelector('.de').addEventListener('click', () => setLanguagePreference('de'));
document.querySelector('.en').addEventListener('click', () => setLanguagePreference('en'));

// Load the preferred language on page load
document.addEventListener('DOMContentLoaded', async () => {
  const preferredLang = localStorage.getItem('language') || 'de'; // default to German
  setLanguagePreference(preferredLang);
});







/* ACCORDION SKILLS */
const skillsContent = document.getElementsByClassName(
    "skills-container-content"
  ),
  skillsHeader = document.querySelectorAll(".skills-container-header");

function toggleSkills() {
  let itemClass = this.parentNode.className;

  for (i = 0; i < skillsContent.length; i++) {
    console.log("lenght" + skillsContent.length)
    skillsContent[i].className = "skills-container-content skills-close";
  }
  if (itemClass === "skills-container-content skills-close") {
    this.parentNode.className = "skills-container-content skills-open";
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills);
});

/* QUALIFICATION TABS */
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("qualification-active");
    });
    target.classList.add("qualification-active");

    tabs.forEach((tab) => {
      tab.classList.remove("qualification-active");
    });
    tab.classList.add("qualification-active");
  });
});

/* SERVICES MODAL */
const modalViews = document.querySelectorAll(".services-modal"),
  modalBtns = document.querySelectorAll(".services-button"),
  modalCloses = document.querySelectorAll(".services-modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

const qualificationModal = document.getElementById("qualification-modal");
const qualificationModalClose = document.getElementById("qualification-modal-close");
const qualificationModalTitle = document.getElementById("qualification-modal-title");
const qualificationModalSubtitle = document.getElementById("qualification-modal-subtitle");
const qualificationModalLocation = document.getElementById("qualification-modal-location");
const qualificationModalCalendar = document.getElementById("qualification-modal-calendar");
const qualificationModalDescription = document.getElementById("qualification-modal-description");

function openQualificationModal(card) {
  if (!qualificationModal) {
    return;
  }

  const langData = window.currentLangData || {};
  const detailKey = card.dataset.detailKey;
  const detailText = langData[detailKey] || "";

  qualificationModalTitle.textContent =
    card.querySelector(".qualification-title")?.textContent.trim() || "";
  qualificationModalSubtitle.textContent =
    card.querySelector(".qualification-subtitle")?.textContent.trim() || "";
  qualificationModalLocation.textContent =
    card.querySelector(".qualification-subtitle2")?.textContent.trim() || "";
  qualificationModalCalendar.textContent =
    card.querySelector(".qualification-calendar")?.textContent.trim() || "";

  qualificationModalDescription.innerHTML = "";
  const items = detailText.split("\n").map((entry) => entry.trim()).filter(Boolean);

  if (items.length > 0) {
    const list = document.createElement("ul");
    list.className = "qualification-modal-list";

    items.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry;
      list.appendChild(li);
    });

    qualificationModalDescription.appendChild(list);
  }

  qualificationModal.classList.add("active-modal");
  qualificationModal.setAttribute("aria-hidden", "false");
}

function closeQualificationModal() {
  if (!qualificationModal) {
    return;
  }

  qualificationModal.classList.remove("active-modal");
  qualificationModal.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (event) => {
  const title = event.target.closest("#work .qualification-title");
  if (title) {
    const card = title.closest(".qualification-card");
    if (card) {
      openQualificationModal(card);
    }
    return;
  }

  if (qualificationModalClose && event.target === qualificationModalClose) {
    closeQualificationModal();
  }

  if (qualificationModal && event.target === qualificationModal) {
    closeQualificationModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && qualificationModal?.classList.contains("active-modal")) {
    closeQualificationModal();
  }
});

/* CONTACT FORM */
const contactForm = document.getElementById("contact-form");
const contactToast = document.getElementById("contact-toast");
let contactToastTimeout;

function showContactToast(message, isError = false) {
  if (!contactToast) {
    return;
  }

  clearTimeout(contactToastTimeout);
  contactToast.textContent = message;
  contactToast.classList.toggle("error", isError);
  contactToast.classList.add("show");

  contactToastTimeout = setTimeout(() => {
    contactToast.classList.remove("show", "error");
  }, 3200);
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const langData = window.currentLangData || {};
  const formData = new FormData(contactForm);

  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    contactForm.reset();
    showContactToast(
      langData.contact_success_message || "Thanks for your message. I will get back to you soon."
    );
  } catch (error) {
    showContactToast(
      langData.contact_error_message ||
        "Sending did not work right now. Please try again or contact me directly by email.",
      true
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

/* PORTFOLIO SWIPER  */
var swiperPortfolio = new Swiper(".portfolio-container", {
  cssMode: true,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* TESTIMONIAL */
var swiperTestimonial = new Swiper(".testimonial-container", {
  loop: true,
  grabCursor: true,
  spaceBetween: 50,

  breakpoints: {
    568: {
      slidesPerView: 2,
    },
  },
});

/* SCROLL SECTIONS ACTIVE LINK */
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/* CHANGE BACKGROUND HEADER */
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/* SHOW SCROLL UP */
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);



/* DARK LIGHT THEME */
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "fa-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

// Load the preferred language on page load
document.addEventListener('DOMContentLoaded', async () => {
  setInitialLanguage(); // Call the new function to set initial language
});
