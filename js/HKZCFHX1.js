function goBackAndClear() {
  localStorage.clear();
  window.history.back();
}

function placeOrder() {
  const priceText = document.querySelector('.price').textContent;
  const price = parseFloat(priceText.replace('₱', '').trim());

  const nameText = document.querySelector('.highlight').textContent.trim();

  localStorage.setItem('orderPrice', price);
  localStorage.setItem('orderName', nameText);
} 