// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initScrollEffects();
  initAnimations();
  initContactForm();
  initTypingEffect();
});

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active navigation link based on scroll position
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Scroll effects and animations
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".service-card, .portfolio-item, .skill-category, .stat-item"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

// Initialize animations
function initAnimations() {
  // Add CSS for scroll animations
  const style = document.createElement("style");
  style.textContent = `
        .service-card,
        .portfolio-item,
        .skill-category,
        .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .service-card.animate-in,
        .portfolio-item.animate-in,
        .skill-category.animate-in,
        .stat-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
  document.head.appendChild(style);

  // Counter animation for stats
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(progress * target);
      element.textContent = current + (target >= 100 ? "%" : "+");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + (target >= 100 ? "%" : "+");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Trigger counter animations when stats come into view
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number");
          const targetValue = parseInt(statNumber.textContent);
          animateCounter(statNumber, targetValue);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-item").forEach((item) => {
    statsObserver.observe(item);
  });
}

// Contact form functionality
// Contact form functionality - Updated to use default mail client
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Basic validation
      if (!name  || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      // Create mailto URL
      const mailtoUrl = createMailtoUrl(name, subject, message);

      // Open default mail client
      try {
        window.location.href = mailtoUrl;

        // Show success message
        setTimeout(() => {
          showNotification(
            "Mail client opened! Please send the email to complete your message.",
            "success"
          );
          // Reset form after opening mail client
          contactForm.reset();
        }, 500);
      } catch (error) {
        console.error("Error opening mail client:", error);
        showNotification(
          "Unable to open mail client. Please contact directly at info@ghaias.com",
          "error"
        );
      }
    });
  }
}

// Create mailto URL with form data
function createMailtoUrl(name, subject, message) {
  // Your email address - replace with your actual email
  const toEmail = "info@ghaias.com"; // Replace with your actual email

  // Create email body with form data
  const emailBody = `Name: ${name}
Message:
${message}

---
Sent from Ghaias.com contact form`;

  // Encode parameters for URL
  const params = new URLSearchParams({
    to: toEmail,
    subject: subject,
    body: emailBody,
  });

  return `mailto:${toEmail}?${params.toString()}`;
}

// Typing effect for hero section
function initTypingEffect() {
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (!heroSubtitle) return;

  const texts = [
    "Senior Software Developer & IT Consultant",
    ".NET Core & Angular Specialist",
    "Cloud Solutions Architect",
    "Agile Project Leader",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function typeEffect() {
    const currentText = texts[textIndex];

    if (!isDeleting && charIndex < currentText.length) {
      // Typing
      heroSubtitle.textContent = currentText.slice(0, charIndex + 1);
      charIndex++;
      setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      heroSubtitle.textContent = currentText.slice(0, charIndex - 1);
      charIndex--;
      setTimeout(typeEffect, 50);
    } else if (!isDeleting && charIndex === currentText.length) {
      // Pause before deleting
      if (!isPaused) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          typeEffect();
        }, 2000);
      }
    } else if (isDeleting && charIndex === 0) {
      // Move to next text
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeEffect, 500);
    }
  }

  // Start typing effect after page load
  setTimeout(typeEffect, 1000);
}

// Utility functions

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;

  // Set background color based on type
  if (type === "success") {
    notification.style.background = "#10b981";
  } else if (type === "error") {
    notification.style.background = "#ef4444";
  } else {
    notification.style.background = "#3b82f6";
  }

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Add scroll to top button
function addScrollToTopButton() {
  const scrollButton = document.createElement("button");
  scrollButton.innerHTML = "↑";
  scrollButton.className = "scroll-to-top";
  scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #10b981);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;

  scrollButton.addEventListener("click", scrollToTop);
  document.body.appendChild(scrollButton);

  // Show/hide based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollButton.style.opacity = "1";
      scrollButton.style.visibility = "visible";
    } else {
      scrollButton.style.opacity = "0";
      scrollButton.style.visibility = "hidden";
    }
  });

  // Hover effect
  scrollButton.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
    this.style.boxShadow = "0 10px 20px -5px rgba(0, 0, 0, 0.2)";
  });

  scrollButton.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  });
}

// Initialize scroll to top button
setTimeout(addScrollToTopButton, 1000);

// Performance optimization
function optimizeImages() {
  // Lazy load images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize image optimization
optimizeImages();

// Add CSS animations for notifications
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
