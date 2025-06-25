function checkBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  const openHour = 8;
  const closeHour = 22;

  if (hour < openHour || hour >= closeHour) {
    if (!document.getElementById('businessHoursOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'businessHoursOverlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
        textAlign: 'center',
        zIndex: 9999,
        pointerEvents: 'auto',
        padding: '1rem',
        boxSizing: 'border-box',
      });

      overlay.innerHTML = `
        <div style="
          background: rgba(0, 0, 0, 0.7);
          padding: 2rem 3rem;
          border-radius: 12px;
          max-width: 90vw;
          box-sizing: border-box;
        ">
          <h1 style="font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 1rem;">
            ⚠️ No available admin at the moment.
          </h1>
          <p style="font-size: clamp(1rem, 2.5vw, 1.2rem);">
            Business hours: <strong>8:00 AM – 10:00 PM</strong>
          </p>
          <p style="margin-top: 1rem; font-size: clamp(0.8rem, 2vw, 1rem); opacity: 0.8;">
            This message will update automatically.
          </p>
        </div>
      `;

      document.body.appendChild(overlay);
    }
  } else {
    const existingOverlay = document.getElementById('businessHoursOverlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkBusinessHours();
  setInterval(checkBusinessHours, 60000);
});
