document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     NAV TOGGLE (MOBILE)
  ================================ */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when link clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  /* ===============================
     COUNTER ANIMATION (+ SUPPORT)
  ================================ */
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";
    const duration = 5000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      counter.innerText = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });

  /* ===============================
     SECTION REVEAL ON SCROLL
  ================================ */
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
});


/* ===============================
   LIGHTBOX
================================ */
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  if (lightbox && img) {
    img.src = src;
    lightbox.style.display = "flex";
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.style.display = "none";
}

/* ===============================
   SERVICE MODAL
================================ */
function openServiceModal(serviceName, imagePath) {
  const modal = document.getElementById("serviceModal");
  const title = document.getElementById("serviceModalTitle");
  const image = document.getElementById("serviceModalImage");

  if (modal && title && image) {
    title.textContent = serviceName;
    image.src = imagePath;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeServiceModal() {
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Add click handlers to service items
document.addEventListener("DOMContentLoaded", () => {
  const serviceItems = document.querySelectorAll(".service-item");

  serviceItems.forEach(item => {
    item.addEventListener("click", () => {
      const serviceName = item.getAttribute("data-service");
      const imagePath = item.getAttribute("data-image");

      if (imagePath && imagePath !== "") {
        openServiceModal(serviceName, imagePath);
      }
    });
  });

  // Close modal when clicking outside content
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeServiceModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeServiceModal();
      closeLightbox();
    }
  });
});
