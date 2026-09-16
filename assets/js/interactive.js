/**
 * AeroPure Interactive Engine
 * Handles:
 * 1. AQI & Mold Spore Danger Gauge Controller
 * 2. Before/After Split Comparison Slider
 * 3. FAQ Accordion Interaction
 * 4. Modal Window Controls (PDF report preview, payment receipt, forgot password)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. AQI & Mold Spore Danger Gauge Controller (Home 2)
     ========================================================================== */
  const needle = document.getElementById('aqiNeedle');
  const aqiValueDisplay = document.getElementById('aqiValueDisplay');
  const sporeCountDisplay = document.getElementById('sporeCountDisplay');
  const pm25Display = document.getElementById('pm25Display');
  const aqiStatusBadge = document.getElementById('aqiStatusBadge');
  const aqiAdviceText = document.getElementById('aqiAdviceText');
  const stateButtons = document.querySelectorAll('.state-btn');

  const aqiStates = {
    hazardous: {
      angle: 68,
      aqi: '245 AQI',
      status: 'Hazardous Spore Level',
      statusColor: '#EF4444',
      spores: '18,420 /m³',
      pm25: '84 µg/m³',
      advice: 'High-density Stachybotrys & Aspergillus detected. Immediate negative-air containment and HEPA scrubbing required.'
    },
    moderate: {
      angle: 0,
      aqi: '88 AQI',
      status: 'Moderate Risk Detected',
      statusColor: '#F59E0B',
      spores: '2,650 /m³',
      pm25: '22 µg/m³',
      advice: 'Elevated relative humidity and dormant hyphae detected. Air diagnostics and localized antimicrobial treatment advised.'
    },
    pure: {
      angle: -68,
      aqi: '12 AQI',
      status: 'Pure Air Certified',
      statusColor: '#10B981',
      spores: '< 35 /m³',
      pm25: '3 µg/m³',
      advice: 'Zero pathogenic fungal colonies. Indoor air quality exceeds ASHRAE 62.1 and hospital surgical-suite standards.'
    }
  };

  if (needle && stateButtons.length) {
    stateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stateButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const stateKey = btn.getAttribute('data-state');
        const state = aqiStates[stateKey];
        if (!state) return;

        // Animate needle rotation
        needle.style.transform = `translateX(-50%) rotate(${state.angle}deg)`;

        // Update indicators
        if (aqiValueDisplay) aqiValueDisplay.textContent = state.aqi;
        if (sporeCountDisplay) {
          sporeCountDisplay.textContent = state.spores;
          sporeCountDisplay.style.color = state.statusColor;
        }
        if (pm25Display) pm25Display.textContent = state.pm25;
        if (aqiStatusBadge) {
          aqiStatusBadge.textContent = state.status;
          aqiStatusBadge.style.backgroundColor = state.statusColor;
        }
        if (aqiAdviceText) aqiAdviceText.textContent = state.advice;
      });
    });
  }

  /* ==========================================================================
     2. Before & After Split Image Comparison Slider
     ========================================================================== */
  const sliderWrappers = document.querySelectorAll('.comparison-slider-wrapper');

  sliderWrappers.forEach(slider => {
    const afterImage = slider.querySelector('.comparison-image-after');
    const handle = slider.querySelector('.comparison-handle');
    if (!afterImage || !handle) return;

    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      let position = clientX - rect.left;

      // Constrain within container bounds
      if (position < 0) position = 0;
      if (position > rect.width) position = rect.width;

      const percentage = (position / rect.width) * 100;

      if (isRTL) {
        afterImage.style.width = `${100 - percentage}%`;
        handle.style.left = `${percentage}%`;
      } else {
        afterImage.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
      }
    };

    const onMouseDown = (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    slider.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Keyboard accessibility for handle
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Remediation Comparison Slider');
    handle.addEventListener('keydown', (e) => {
      const rect = slider.getBoundingClientRect();
      const currentLeft = handle.offsetLeft;
      if (e.key === 'ArrowLeft') {
        updateSlider(rect.left + currentLeft - 20);
      } else if (e.key === 'ArrowRight') {
        updateSlider(rect.left + currentLeft + 20);
      }
    });
  });

  /* ==========================================================================
     3. FAQ Accordion Interaction
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items in this group
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.accordion-body');
        if (body) body.style.maxHeight = `${body.scrollHeight + 30}px`;
      }
    });
  });

  /* ==========================================================================
     4. Modal Window Controls
     ========================================================================== */
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
});
