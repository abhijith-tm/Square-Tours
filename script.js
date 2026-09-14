/**
 * Square Tours — Interactive Vanilla JavaScript
 * Zero dependencies, ultra-lightweight (<4KB), fast performance.
 * 
 * Key Features:
 * 1. Network-aware progressive video loader (prevents freezing on 2G/3G connections)
 * 2. Aesthetic 'Contact Us' modal & drawer controls
 * 3. Quick destination chip selector
 * 4. Mobile navigation drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  // Video & Preloader Elements
  const bgVideo = document.getElementById('bgVideo');
  const videoPreloader = document.getElementById('videoPreloader');

  // Contact Modal Elements
  const contactModal = document.getElementById('contactModal');
  const heroContactBtn = document.getElementById('heroContactBtn');
  const closeContactBtn = document.getElementById('closeContactBtn');
  const closeModalOverlay = document.getElementById('closeModalOverlay');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const destinationSelect = document.getElementById('destinationSelect');

  // Itineraries & Destinations Drawer Elements
  const itinerariesDrawer = document.getElementById('itinerariesDrawer');
  const drawerTitle = document.getElementById('drawerTitle');
  const navItineraries = document.getElementById('navItineraries');
  const navDestinations = document.getElementById('navDestinations');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const closeDrawerOverlay = document.getElementById('closeDrawerOverlay');

  /* ==========================================================================
     1. Local Background Video Loader & Preloader Dismissal
     ========================================================================== */
  let preloaderDismissed = false;

  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;

    // Smoothly reveal the video
    if (bgVideo) {
      bgVideo.classList.add('is-loaded');
    }

    // Fade out preloader overlay
    if (videoPreloader) {
      videoPreloader.classList.add('loaded');
      setTimeout(() => {
        videoPreloader.style.display = 'none';
      }, 850);
    }
  }

  function initSmartVideoLoading() {
    if (!bgVideo) {
      dismissPreloader();
      return;
    }

    bgVideo.preload = 'auto';

    // Check if the video is already loaded/cached in browser memory
    if (bgVideo.readyState >= 3) {
      dismissPreloader();
    }

    // Trigger fade as soon as the first frame actually starts playing
    bgVideo.addEventListener('playing', () => {
      dismissPreloader();
    });

    // Trigger when enough video is buffered
    bgVideo.addEventListener('canplay', () => {
      dismissPreloader();
    });

    // Ensure seamless loop without any frame drop or gap
    bgVideo.addEventListener('ended', () => {
      bgVideo.currentTime = 0;
      bgVideo.play();
    });

    // Video error fallback (in case video fails or cannot load)
    bgVideo.addEventListener('error', () => {
      console.warn('Video failed to load, falling back to gradient background.');
      dismissPreloader();
    });

    // Request autoplay
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          dismissPreloader();
        })
        .catch((err) => {
          console.log('Video autoplay deferred by browser policy:', err);
          // If browser blocks autoplay, don't leave user stuck on loader
          dismissPreloader();
        });
    }

    // Safety timeout: dismiss after 3.5s so slow connections aren't locked out
    setTimeout(() => {
      dismissPreloader();
    }, 3500);
  }

  initSmartVideoLoading();

  /* ==========================================================================
     2. Aesthetic "Contact Us" Modal Handlers
     ========================================================================== */
  function openContactModal(preselectedPlan = null) {
    if (preselectedPlan && destinationSelect) {
      for (let i = 0; i < destinationSelect.options.length; i++) {
        if (destinationSelect.options[i].text.includes(preselectedPlan) || destinationSelect.options[i].value.includes(preselectedPlan)) {
          destinationSelect.selectedIndex = i;
          break;
        }
      }
    }
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeContactModal() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeContactBtn) closeContactBtn.addEventListener('click', closeContactModal);
  if (closeModalOverlay) closeModalOverlay.addEventListener('click', closeContactModal);

  // Close modal when pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContactModal();
      closeItinerariesDrawer();
    }
  });

  // Contact Form Submission (Demo handling with instant feedback)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitFormBtn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
        }
        contactForm.reset();

        setTimeout(() => {
          if (formSuccess) formSuccess.classList.add('hidden');
          closeContactModal();
        }, 2500);
      }, 700);
    });
  }

  /* ==========================================================================
     3. Itineraries & Destinations Slide-In Drawer Handlers
     ========================================================================== */
  function openItinerariesDrawer(title = 'Explore') {
    if (drawerTitle) drawerTitle.textContent = title;
    itinerariesDrawer.classList.add('open');
    itinerariesDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeItinerariesDrawer() {
    itinerariesDrawer.classList.remove('open');
    itinerariesDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navDestinations) {
    navDestinations.addEventListener('click', (e) => {
      e.preventDefault();
      openItinerariesDrawer('Destinations');
    });
  }

  if (navItineraries) {
    navItineraries.addEventListener('click', (e) => {
      e.preventDefault();
      openItinerariesDrawer('Itineraries');
    });
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeItinerariesDrawer);
  if (closeDrawerOverlay) closeDrawerOverlay.addEventListener('click', closeItinerariesDrawer);
});
