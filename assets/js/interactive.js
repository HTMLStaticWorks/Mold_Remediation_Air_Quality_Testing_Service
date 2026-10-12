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
    const divider = slider.querySelector('.comparison-divider');
    const pillAfter = slider.querySelector('.comparison-pill.pill-after');
    const pillBefore = slider.querySelector('.comparison-pill.pill-before');
    if (!afterImage || !handle) return;

    let isDragging = false;

    const setPosition = (pct) => {
      // Constrain percentage between 0 and 100
      pct = Math.max(0, Math.min(100, pct));
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      const clipPct = isRTL ? pct : (100 - pct);

      // 1. Direct hardware-accelerated clip-path on the after image
      afterImage.style.clipPath = `inset(0 ${clipPct}% 0 0)`;
      afterImage.style.webkitClipPath = `inset(0 ${clipPct}% 0 0)`;

      // 2. CSS custom property fallback
      slider.style.setProperty('--slider-pos', `${pct}%`);

      // 3. Handle & Divider positions
      handle.style.left = `${pct}%`;
      if (divider) divider.style.left = `${pct}%`;

      // 4. Auto-fade badge pills smoothly when handle moves over them
      if (pillAfter) {
        if (pct < 24) {
          pillAfter.style.opacity = Math.max(0, (pct - 6) / 18);
        } else {
          pillAfter.style.opacity = '1';
        }
      }

      if (pillBefore) {
        if (pct > 76) {
          pillBefore.style.opacity = Math.max(0, (94 - pct) / 18);
        } else {
          pillBefore.style.opacity = '1';
        }
      }
    };

    const updateSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      let position = clientX - rect.left;
      const percentage = (position / rect.width) * 100;
      setPosition(percentage);
    };

    // Initialize to 50% immediately on DOM ready
    setPosition(50);

    const onMouseDown = (e) => {
      e.preventDefault();
      isDragging = true;
      updateSlider(e.clientX);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
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
      if (e.touches[0]) {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
      }
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
        e.preventDefault();
        updateSlider(rect.left + currentLeft - 20);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
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

  /* ==========================================================================
     5. Live Zip Code Dispatch Availability Checker
     ========================================================================== */
  const zipForm = document.getElementById('zipCheckerForm');
  const zipInput = document.getElementById('zipInput');
  const zipResult = document.getElementById('zipResultMsg');

  if (zipForm && zipInput && zipResult) {
    zipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const zipVal = zipInput.value.trim();
      
      if (!/^\d{5}$/.test(zipVal)) {
        zipResult.className = 'zip-result-message not-found';
        zipResult.innerHTML = '<strong>Invalid Format:</strong> Please enter a standard 5-digit US ZIP code.';
        return;
      }

      // Regional Depot Mapping
      const prefix = zipVal.substring(0, 3);
      const prefixNum = parseInt(prefix, 10);
      let depotName = 'Metro Tri-State Emergency Response Fleet';
      let eta = '35 - 45 mins';

      if (prefixNum >= 100 && prefixNum <= 104) {
        depotName = 'Central Bio-Lab & HQ Hub (Manhattan / Bronx)';
        eta = '25 - 35 mins';
      } else if (prefixNum >= 105 && prefixNum <= 109) {
        depotName = 'North County Rapid Dispatch (Westchester / Rockland)';
        eta = '30 - 45 mins';
      } else if (prefixNum >= 110 && prefixNum <= 119) {
        depotName = 'East Bay Commercial Station (Queens / Brooklyn / Long Island)';
        eta = '35 - 50 mins';
      } else if (prefixNum >= 70 && prefixNum <= 89) {
        depotName = 'Tri-State Emergency Mobile Depot (Northern & Central NJ)';
        eta = '40 - 55 mins';
      } else if (prefixNum >= 60 && prefixNum <= 69) {
        depotName = 'Fairfield & New Haven Corridor Depot (CT)';
        eta = '45 - 60 mins';
      }

      zipResult.className = 'zip-result-message success';
      zipResult.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          <strong>Dispatch Available in ZIP ${zipVal}!</strong>
        </div>
        <div>Assigned Unit: <strong>${depotName}</strong> &bull; Estimated Arrival: <span style="color:#10B981; font-weight:700;">${eta}</span>. Priority containment units are currently standing by.</div>
      `;
    });
  }

  /* ==========================================================================
     6. Mold Risk Self-Assessment Checkbox Counter
     ========================================================================== */
  const riskCheckboxes = document.querySelectorAll('.risk-check-item input[type="checkbox"]');
  const riskPill = document.getElementById('riskPill');
  const riskTitle = document.getElementById('riskTitle');
  const riskDesc = document.getElementById('riskDesc');

  if (riskCheckboxes.length && riskPill && riskTitle && riskDesc) {
    const updateRiskScore = () => {
      let checkedCount = 0;
      riskCheckboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
      });

      if (checkedCount === 0) {
        riskPill.style.background = 'rgba(16, 185, 129, 0.15)';
        riskPill.style.color = '#10B981';
        riskPill.textContent = 'Minimal Risk • Score 0/6';
        riskTitle.textContent = 'Optimal Indoor Conditions';
        riskDesc.textContent = 'No active red flags detected. Maintain relative humidity below 50% and inspect HVAC air filters quarterly.';
      } else if (checkedCount <= 2) {
        riskPill.style.background = 'rgba(245, 158, 11, 0.15)';
        riskPill.style.color = '#F59E0B';
        riskPill.textContent = `Moderate Risk • Score ${checkedCount}/6`;
        riskTitle.textContent = 'Potential Hidden Moisture Source';
        riskDesc.textContent = 'Localized condensation or hidden spores likely. A non-invasive FLIR thermal inspection is recommended to verify cavity saturation.';
      } else {
        riskPill.style.background = 'rgba(239, 68, 68, 0.15)';
        riskPill.style.color = '#EF4444';
        riskPill.textContent = `Critical Hazard • Score ${checkedCount}/6`;
        riskTitle.textContent = 'Active Airborne Contamination Alert';
        riskDesc.textContent = 'High probability of active toxic spore distribution. Immediate containment and accredited spore-trap lab testing strongly advised.';
      }
    };

    riskCheckboxes.forEach(cb => {
      cb.addEventListener('change', updateRiskScore);
    });
  }

  /* ==========================================================================
     7. Case Study Switcher for Before & After Showcase
     ========================================================================== */
  const caseStudyBtns = document.querySelectorAll('.case-study-tab-btn');
  const casePreVal = document.getElementById('casePreVal');
  const casePostVal = document.getElementById('casePostVal');
  const caseDurationVal = document.getElementById('caseDurationVal');
  const caseStatusVal = document.getElementById('caseStatusVal');
  const caseBeforeImg = document.getElementById('caseBeforeImg');
  const caseAfterImg = document.getElementById('caseAfterImg');

  const isSubpage = window.location.pathname.includes('/pages/') || document.querySelector('link[href*="../assets"]') !== null;
  const assetPrefix = isSubpage ? '../' : '';

  const caseStudiesData = {
    attic: {
      pre: '24,870 /m³',
      post: '40 /m³',
      duration: '48 Hours',
      status: '100% Passed PRV',
      beforeSrc: assetPrefix + 'assets/images/mold-before-real.jpg',
      afterSrc: assetPrefix + 'assets/images/mold-after-real.jpg'
    },
    basement: {
      pre: '38,200 /m³',
      post: '28 /m³',
      duration: '36 Hours',
      status: 'Hospital Safe',
      beforeSrc: assetPrefix + 'assets/images/service-mold-inspection.jpg',
      afterSrc: assetPrefix + 'assets/images/service-mold-remediation.jpg'
    },
    crawlspace: {
      pre: '19,400 /m³',
      post: '< 20 /m³',
      duration: '24 Hours',
      status: 'Transferable Pass',
      beforeSrc: assetPrefix + 'assets/images/mold-inspection-thermal.jpg',
      afterSrc: assetPrefix + 'assets/images/testing-equipment-methods.jpg'
    }
  };

  if (caseStudyBtns.length) {
    caseStudyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        caseStudyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-case');
        const data = caseStudiesData[key];
        if (!data) return;

        if (casePreVal) casePreVal.textContent = data.pre;
        if (casePostVal) casePostVal.textContent = data.post;
        if (caseDurationVal) caseDurationVal.textContent = data.duration;
        if (caseStatusVal) caseStatusVal.textContent = data.status;
        if (caseBeforeImg && data.beforeSrc) caseBeforeImg.src = data.beforeSrc;
        if (caseAfterImg && data.afterSrc) caseAfterImg.src = data.afterSrc;
      });
    });
  }
});

