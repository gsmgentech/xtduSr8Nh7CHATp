// Open the sample modal
function openModal() {
  const modal = document.getElementById("sampleModal");
  if (modal) modal.style.display = "block";
}

// Close the sample modal
function closeModal() {
  const modal = document.getElementById("sampleModal");
  if (modal) modal.style.display = "none";
}

// Close modal when clicking outside the modal content
window.addEventListener("click", function(event) {
  const modal = document.getElementById("sampleModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

const submitOrderBtn = document.getElementById('submitOrderBtn');
  const orderVerificationModal = document.getElementById('orderVerificationModal');

  submitOrderBtn.addEventListener('click', () => {
    orderVerificationModal.style.display = 'flex';
    orderVerificationModal.classList.remove('fade-out'); // remove previous fade-out
    orderVerificationModal.classList.add('fade-in');
  });

  function closeModalWithFade() {
    orderVerificationModal.classList.remove('fade-in'); // remove previous fade-in
    orderVerificationModal.classList.add('fade-out');
    
    setTimeout(() => {
      orderVerificationModal.style.display = 'none';
      orderVerificationModal.classList.remove('fade-out'); // reset
    }, 500);
  }