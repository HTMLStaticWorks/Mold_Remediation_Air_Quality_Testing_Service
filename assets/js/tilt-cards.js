/**
 * AeroPure 3D Tilt Cards Engine
 * Implements physical perspective transform following cursor coordinates,
 * specular highlight / glare shift, and touch graceful degradation.
 */
document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  const initTiltCards = () => {
    const tiltContainers = document.querySelectorAll('.tilt-card-container');
    if (!tiltContainers.length) return;

    tiltContainers.forEach(container => {
      const card = container.querySelector('.tilt-card');
      if (!card) return;

      // Ensure glare element exists
      let glare = card.querySelector('.tilt-card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-card-glare';
        card.appendChild(glare);
      }

      // If mobile or touch device, provide gentle touch feedback rather than 3D tracking
      if (isTouchDevice()) {
        card.style.transform = 'none';
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        
        card.addEventListener('touchstart', () => {
          card.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', () => {
          card.style.transform = 'none';
        }, { passive: true });

        return; // Gracefully degrade on touch devices
      }

      // Desktop 3D Physics Tracking
      const maxTilt = 12; // degrees

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (cardX - centerX) / centerX;
        const percentY = (cardY - centerY) / centerY;

        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        card.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Specular Glare position
        const glareX = ((cardX / rect.width) * 100).toFixed(1);
        const glareY = ((cardY / rect.height) * 100).toFixed(1);
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      };

      const handleMouseEnter = () => {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
      };

      const handleMouseLeave = () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    });
  };

  initTiltCards();
});
