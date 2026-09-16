/**
 * AeroPure Client Dashboard Engine
 * Handles:
 * - Tab switching with skeleton loading states
 * - Job Status visual tracker
 * - Inspection booking scheduling
 * - Interactive invoices & mock Stripe payment modal
 * - Interactive messaging with Lead Certified Industrial Hygienist
 * - PDF report viewer modal
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Dashboard Tab Navigation with Skeleton Transition
     ========================================================================== */
  const navButtons = document.querySelectorAll('.dash-nav-btn[data-tab]');
  const tabPanels = document.querySelectorAll('.dash-panel');
  const skeletonOverlay = document.getElementById('dashboardSkeleton');

  const switchTab = (tabId) => {
    // Highlight button
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Show skeleton briefly for realistic dashboard data fetch
    if (skeletonOverlay) {
      skeletonOverlay.style.display = 'block';
    }

    tabPanels.forEach(panel => {
      panel.style.display = 'none';
    });

    setTimeout(() => {
      if (skeletonOverlay) {
        skeletonOverlay.style.display = 'none';
      }
      const targetPanel = document.getElementById(`panel-${tabId}`);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    }, 280);
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Global helper for quick navigation from buttons
  window.navigateToDashTab = (tabId) => {
    switchTab(tabId);
  };

  /* ==========================================================================
     2. Inspection Booking Form Handler
     ========================================================================== */
  const bookingForm = document.getElementById('dashBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('bookDate')?.value;
      const timeVal = document.getElementById('bookTime')?.value;
      const typeVal = document.getElementById('bookType')?.value;

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Securing Appointment...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        bookingForm.reset();

        if (window.showToast) {
          window.showToast(`Inspection confirmed for ${dateVal} at ${timeVal}! Dispatching CIH unit.`, 'success');
        }

        // Switch to Tracker view to show new job
        setTimeout(() => switchTab('tracker'), 1000);
      }, 700);
    });
  }

  /* ==========================================================================
     3. Invoices & Simulated Payment
     ========================================================================== */
  let activePayingInvoiceId = null;

  window.openPaymentModal = (invoiceId, amount) => {
    activePayingInvoiceId = invoiceId;
    const amountSpan = document.getElementById('modalPayAmount');
    if (amountSpan) amountSpan.textContent = amount;
    if (window.openModal) window.openModal('paymentModal');
  };

  const paymentForm = document.getElementById('mockPaymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payBtn = paymentForm.querySelector('button[type="submit"]');
      payBtn.disabled = true;
      payBtn.innerHTML = 'Processing Payment...';

      setTimeout(() => {
        payBtn.disabled = false;
        payBtn.innerHTML = 'Confirm & Pay Securely';
        if (window.closeModal) window.closeModal('paymentModal');

        // Update the invoice status pill in table
        if (activePayingInvoiceId) {
          const statusElem = document.getElementById(`status-${activePayingInvoiceId}`);
          const actionBtn = document.getElementById(`action-${activePayingInvoiceId}`);
          if (statusElem) {
            statusElem.className = 'status-pill status-paid';
            statusElem.textContent = 'Paid in Full';
          }
          if (actionBtn) {
            actionBtn.textContent = 'Download Receipt';
            actionBtn.classList.remove('btn-primary');
            actionBtn.classList.add('btn-secondary');
            actionBtn.onclick = () => window.openModal('receiptModal');
          }
        }

        if (window.showToast) {
          window.showToast('Payment successful! Receipt generated and balance cleared.', 'success');
        }
      }, 900);
    });
  }

  /* ==========================================================================
     4. Interactive Messaging Thread with Lead CIH
     ========================================================================== */
  const messageForm = document.getElementById('chatForm');
  const chatMessagesList = document.getElementById('chatMessages');

  if (messageForm && chatMessagesList) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;

      // Append Client Message
      const clientMsg = document.createElement('div');
      clientMsg.className = 'chat-bubble chat-client';
      clientMsg.innerHTML = `
        <div class="chat-bubble-meta">You &bull; Just now</div>
        <div class="chat-bubble-text">${text}</div>
      `;
      chatMessagesList.appendChild(clientMsg);
      input.value = '';
      chatMessagesList.scrollTop = chatMessagesList.scrollHeight;

      // Simulated automated response from Lead Technician
      setTimeout(() => {
        const replyMsg = document.createElement('div');
        replyMsg.className = 'chat-bubble chat-technician';
        replyMsg.innerHTML = `
          <div class="chat-bubble-meta">Dr. Elena Vance, CIH &bull; Just now</div>
          <div class="chat-bubble-text">Received your note. The laboratory incubator readings for your air cassette will be verified and uploaded to your Air Quality Reports tab by 3:00 PM today.</div>
        `;
        chatMessagesList.appendChild(replyMsg);
        chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
      }, 1200);
    });
  }

  /* ==========================================================================
     5. Report Sample Viewer Modal
     ========================================================================== */
  window.viewReportModal = (reportId, title, sporeTotal) => {
    const reportTitleElem = document.getElementById('reportModalTitle');
    const reportSporeElem = document.getElementById('reportModalSpore');
    if (reportTitleElem) reportTitleElem.textContent = `${title} (${reportId})`;
    if (reportSporeElem) reportSporeElem.textContent = sporeTotal;
    if (window.openModal) window.openModal('reportModal');
  };

  /* ==========================================================================
     6. Dashboard Mobile Hamburger Navigation Overlay Toggle
     ========================================================================== */
  const dashHamburgerBtn = document.getElementById('dashHamburgerBtn');
  const dashSidebarCloseBtn = document.getElementById('dashSidebarCloseBtn');
  const dashSidebarBackdrop = document.getElementById('dashSidebarBackdrop');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');

  const openDashSidebar = () => {
    if (dashboardSidebar) dashboardSidebar.classList.add('active');
    if (dashSidebarBackdrop) dashSidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDashSidebar = () => {
    if (dashboardSidebar) dashboardSidebar.classList.remove('active');
    if (dashSidebarBackdrop) dashSidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (dashHamburgerBtn) {
    dashHamburgerBtn.addEventListener('click', openDashSidebar);
  }
  if (dashSidebarCloseBtn) {
    dashSidebarCloseBtn.addEventListener('click', closeDashSidebar);
  }
  if (dashSidebarBackdrop) {
    dashSidebarBackdrop.addEventListener('click', closeDashSidebar);
  }

  // Close sidebar overlay when switching tabs
  navButtons.forEach(btn => {
    btn.addEventListener('click', closeDashSidebar);
  });
});
