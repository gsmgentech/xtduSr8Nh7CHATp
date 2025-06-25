// ✅ Register the service worker if supported by the browser
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {

    // ✅ If a new service worker is already waiting, notify the user
    if (registration.waiting) {
      notifyUserAboutUpdate(registration.waiting);
    }

    // ✅ Listen for new updates (when a new worker is installing)
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        // ✅ When the new service worker is installed and there's an existing one in control
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          notifyUserAboutUpdate(newWorker);
        }
      });
    });
  });

  // ✅ Automatically reload the page when a new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

// ✅ Show a toast notification that there's a new version available
function notifyUserAboutUpdate(worker) {
  const toast = document.createElement('div');

  // ✅ Toast styling
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#222';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  toast.style.cursor = 'pointer';
  toast.style.zIndex = '10000';
  toast.textContent = 'New version available. Click to update.';

  // ✅ When user clicks the toast, tell the worker to skip waiting
  toast.addEventListener('click', () => {
    worker.postMessage('skipWaiting');
  });

  // ✅ Show the toast on the page
  document.body.appendChild(toast);

  // ✅ Automatically remove the toast after 10 seconds
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 10000);
}
