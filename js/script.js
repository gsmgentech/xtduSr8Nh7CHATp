if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {

    if (registration.waiting) {
      notifyUserAboutUpdate(registration.waiting);
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          notifyUserAboutUpdate(newWorker);
        }
      });
    });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

function notifyUserAboutUpdate(worker) {
  const toast = document.createElement('div');
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

  toast.addEventListener('click', () => {
    worker.postMessage('skipWaiting');
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 10000);
}
