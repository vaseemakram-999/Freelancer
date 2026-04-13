document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const html = document.documentElement;

  const themeToggle = document.getElementById("themeToggle");
  const rtlToggle = document.getElementById("rtlToggle");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navWrapper = document.querySelector(".nav-wrapper");
  const navActions = document.querySelector(".nav-actions");
  const dropdownToggles = document.querySelectorAll(".dropdown > a");
  const isPagesRoute = window.location.pathname.toLowerCase().includes("/pages/");
  const homeHref = isPagesRoute ? "../pages/index.html" : "./pages/index.html";

  document.querySelectorAll(".logo, .footer-logo").forEach((brandBlock) => {
    if (brandBlock.tagName.toLowerCase() === "a") {
      return;
    }

    brandBlock.setAttribute("role", "link");
    brandBlock.setAttribute("tabindex", "0");
    brandBlock.setAttribute("aria-label", "Go to home page");

    brandBlock.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, textarea, select, label")) {
        return;
      }
      window.location.href = homeHref;
    });

    brandBlock.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = homeHref;
      }
    });
  });

  const syncMobileNavActions = () => {
    if (!navMenu || !navActions || !navWrapper) {
      return;
    }

    if (window.innerWidth <= 1024) {
      if (navActions.parentElement !== navMenu) {
        navMenu.prepend(navActions);
      }
      return;
    }

    if (navActions.parentElement !== navWrapper) {
      navMenu.insertAdjacentElement("afterend", navActions);
    }
  };

  syncMobileNavActions();

  const THEME_KEY = "freelancer_theme";
  const DIR_KEY = "freelancer_dir";

  const applyTheme = (theme) => {
    const isDark = theme === "dark";

    body.classList.toggle("dark-mode", isDark);
    html.classList.toggle("dark", isDark);
    html.style.colorScheme = isDark ? "dark" : "light";

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme =
    savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  applyTheme(preferredTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  const applyDirection = (dir) => {
    html.setAttribute("dir", dir);
  };

  const savedDir = localStorage.getItem(DIR_KEY);
  if (savedDir) {
    applyDirection(savedDir);
  }

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const currentDir = html.getAttribute("dir") || "ltr";
      const nextDir = currentDir === "ltr" ? "rtl" : "ltr";
      applyDirection(nextDir);
      localStorage.setItem(DIR_KEY, nextDir);
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      const parentDropdown = link.parentElement;
      const isDropdownToggle =
        parentDropdown &&
        parentDropdown.classList.contains("dropdown") &&
        link.nextElementSibling &&
        link.nextElementSibling.classList.contains("dropdown-menu");

      if (window.innerWidth <= 1024 && isDropdownToggle) {
        return;
      }

      if (navMenu) {
        navMenu.classList.remove("active");
      }

      if (hamburger) {
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      if (window.innerWidth > 1024) {
        return;
      }

      event.preventDefault();
      toggle.parentElement.classList.toggle("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!hamburger || !navMenu || window.innerWidth > 1024) {
      return;
    }

    if (
      navMenu.classList.contains("active") &&
      !navMenu.contains(event.target) &&
      !hamburger.contains(event.target)
    ) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", () => {
    syncMobileNavActions();

    if (!hamburger || !navMenu || window.innerWidth > 1024) {
      if (navMenu) {
        navMenu.classList.remove("active");
      }

      if (hamburger) {
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    }
  });

  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === currentPage) {
      link.classList.add("active");
    }
  });

  const mapElement = document.getElementById("map");
  if (mapElement && typeof L !== "undefined") {
    const map = L.map("map").setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    document.querySelectorAll(".location-card").forEach((card) => {
      const lat = Number(card.dataset.lat);
      const lng = Number(card.dataset.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return;
      }

      L.marker([lat, lng]).addTo(map);
      card.addEventListener("click", () => {
        map.setView([lat, lng], 10);
      });
    });
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        galleryItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          item.style.display =
            filter === "all" || category === filter ? "block" : "none";
        });
      });
    });
  }

  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (testimonialCards.length) {
    let currentIndex = Array.from(testimonialCards).findIndex((card) =>
      card.classList.contains("active")
    );

    if (currentIndex < 0) {
      currentIndex = 0;
      testimonialCards[0].classList.add("active");
    }

    const showTestimonial = (index) => {
      testimonialCards.forEach((card, cardIndex) => {
        card.classList.toggle("active", cardIndex === index);
      });
    };

    const goTo = (index) => {
      currentIndex = (index + testimonialCards.length) % testimonialCards.length;
      showTestimonial(currentIndex);
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goTo(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goTo(currentIndex - 1);
      });
    }

    setInterval(() => {
      goTo(currentIndex + 1);
    }, 4000);
  }

  const faqButtons = document.querySelectorAll(".bsfaq-question");
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.classList.toggle("active");
    });
  });

  const categoryButtons = document.querySelectorAll(".category-btn");
  if (categoryButtons.length) {
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        categoryButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  const pricingToggle = document.getElementById("pricingToggle");
  if (pricingToggle) {
    const pricingSection = pricingToggle.closest(".pricing-plans-section");
    const updatePricing = () => {
      if (!pricingSection) {
        return;
      }
      pricingSection.classList.toggle("show-yearly", pricingToggle.checked);
    };

    updatePricing();
    pricingToggle.addEventListener("change", updatePricing);
  }

  const comparisonSlider = document.querySelector(".image-comparison");
  const sliderButton = document.querySelector(".slider-button");
  const sliderLine = document.querySelector(".slider-line");
  const afterWrapper = document.querySelector(".img-after-wrapper");

  if (comparisonSlider && sliderButton && sliderLine && afterWrapper) {
    let dragging = false;

    const updateComparison = (clientX) => {
      const bounds = comparisonSlider.getBoundingClientRect();
      let offset = clientX - bounds.left;

      if (offset < 0) {
        offset = 0;
      }

      if (offset > bounds.width) {
        offset = bounds.width;
      }

      const percent = (offset / bounds.width) * 100;
      afterWrapper.style.width = percent + "%";
      sliderButton.style.left = percent + "%";
      sliderLine.style.left = percent + "%";
    };

    sliderButton.addEventListener("mousedown", () => {
      dragging = true;
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    window.addEventListener("mousemove", (event) => {
      if (dragging) {
        updateComparison(event.clientX);
      }
    });
  }
});
