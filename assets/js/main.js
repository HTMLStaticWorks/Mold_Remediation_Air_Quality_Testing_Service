/**
 * AeroPure Main Engine
 * Handles:
 * - Theme Switcher (Dark / Light with system auto-detection & persistence)
 * - RTL Layout Toggle (Mirroring with persistence)
 * - Mobile Navigation Drawer
 * - Form Validation with inline feedback & toast alerts
 * - Sticky Header scroll states
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme Management (Dark / Light Mode)
     ========================================================================== */
  const THEME_KEY = 'aeropure_theme';

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(activeTheme);

    // Watch system preference changes if no manual preference saved
    if (!savedTheme && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    });
  };

  let lastThemeToggleTime = 0;
  window.toggleTheme = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const now = Date.now();
    if (now - lastThemeToggleTime < 100) return;
    lastThemeToggleTime = now;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  /* ==========================================================================
     2. RTL Layout Management
     ========================================================================== */
  const RTL_KEY = 'aeropure_direction';

  const initDirection = () => {
    const savedDir = localStorage.getItem(RTL_KEY) || 'ltr';
    applyDirection(savedDir);
  };

  const applyDirection = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${dir === 'rtl' ? 'LTR' : 'RTL'} layout`);
      btn.classList.toggle('active', dir === 'rtl');
    });
  };

  let lastRTLToggleTime = 0;
  window.toggleRTL = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const now = Date.now();
    if (now - lastRTLToggleTime < 100) return;
    lastRTLToggleTime = now;

    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(RTL_KEY, nextDir);
    applyDirection(nextDir);
  };

  /* ==========================================================================
     3. Mobile Navigation Drawer
     ========================================================================== */
  const initMobileNav = () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const drawerClose = document.querySelector('.drawer-close-btn');

    if (!menuToggle || !drawer || !backdrop) return;

    const openDrawer = () => {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', openDrawer);
    backdrop.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    // Close on navigation link click
    drawer.querySelectorAll('.drawer-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  };

  /* ==========================================================================
     4. Form Validation & Feedback Toast
     ========================================================================== */
  const initFormValidation = () => {
    const forms = document.querySelectorAll('form[data-validate="true"]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
          const value = input.value.trim();
          let error = '';

          if (!value) {
            error = 'This field is required.';
          } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please provide a valid email address.';
          } else if (input.type === 'tel' && !/^[\d\s\+\-\(\)]{7,20}$/.test(value)) {
            error = 'Please enter a valid phone number.';
          }

          // Clear previous error
          let errorElem = input.parentElement.querySelector('.field-error');
          if (error) {
            isValid = false;
            input.style.borderColor = 'var(--accent-red)';
            if (!errorElem) {
              errorElem = document.createElement('span');
              errorElem.className = 'field-error';
              errorElem.style.color = 'var(--accent-red)';
              errorElem.style.fontSize = '0.8rem';
              errorElem.style.marginTop = '4px';
              errorElem.style.display = 'block';
              input.parentElement.appendChild(errorElem);
            }
            errorElem.textContent = error;
          } else {
            input.style.borderColor = '';
            if (errorElem) errorElem.remove();
          }
        });

        if (isValid) {
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn ? submitBtn.innerHTML : '';
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting Request...';
          }

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
            form.reset();
            showToast('Thank you! Your request has been dispatched to our Certified Hygienist team.', 'success');
          }, 800);
        }
      });
    });
  };

  /* Toast Notification */
  window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '12px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.background = type === 'success' ? '#0F172A' : '#EF4444';
    toast.style.color = '#FFFFFF';
    toast.style.borderLeft = `5px solid ${type === 'success' ? '#10B981' : '#F59E0B'}`;
    toast.style.padding = '14px 22px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '500';
    toast.style.minWidth = '280px';
    toast.style.maxWidth = '420px';
    toast.style.transition = 'all 0.3s ease';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  /* ==========================================================================
     5. Scroll To Top Floating Button
     ========================================================================== */
  const initScrollUp = () => {
    let btn = document.getElementById('scrollUpBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scrollUpBtn';
      btn.className = 'scroll-up-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>';
      document.body.appendChild(btn);
    }

    const toggleScrollBtn = () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleScrollBtn, { passive: true });
    toggleScrollBtn();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDirection();
    initMobileNav();
    initFormValidation();
    initScrollUp();

    // Attach click listeners to toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', window.toggleTheme);
    });
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', window.toggleRTL);
    });
  });
})();
