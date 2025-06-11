function generateOrderId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return 'ORD-' + Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

document.getElementById('submitButton').addEventListener('click', async (e) => {
  e.preventDefault();

  const highlightText = document.querySelector('.highlight')?.textContent.trim() || 'No service info';
  const imeiLabel = document.querySelector('label[for="imei"]')?.textContent.trim() || 'IMEI / MEID / SN';
  const commentsLabel = document.querySelector('label[for="comments"]')?.textContent.trim() || 'Email Address';
  const priceText = document.querySelector('.price')?.textContent.trim() || '₱0';

  const imeiInput = document.getElementById('imei').value.trim();
  const commentsInput = document.getElementById('comments').value.trim();

  if (!imeiInput) {
    alert('Please enter: ' + imeiLabel);
    return;
  }

  if (!commentsInput) {
    alert('Please enter a valid Email Address');
    return;
  }

  // ✅ Generate 8-character Order ID with uppercase random letters/numbers
  const orderId = generateOrderId(8);

  // ✅ Save orderId to localStorage para magamit sa ibang page
  localStorage.setItem('orderId', orderId);

  // ✅ Fetch IP address
  let ipAddress = 'Unavailable';
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    ipAddress = ipData.ip || 'Unavailable';
  } catch (err) {
    console.warn('Failed to fetch IP:', err);
  }

  const message = `
🆔 *Order ID:* ${orderId}
🔖 *Order:* ${highlightText}
💰 *Price:* ${priceText}
📧 *${commentsLabel}:* ${commentsInput}
📱 *${imeiLabel}:* 
${imeiInput}
🌐 *IP Address:* ${ipAddress}
  `;

  const botToken = '7629739770:AAEvP7NK4M9Cua3X4norSzqQS2y2Edrdy3Q';
  const chatId = '6892566157';

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      document.getElementById('imei').value = '';
      document.getElementById('comments').value = '';
      closeModalWithFade();
      setTimeout(() => {
        window.location.href = '../payment.html';
      }, 50);
    } else {
      console.error('Failed to send order: ' + data.description);
    }
  })
  .catch(err => {
    console.error('Error sending message: ' + err.message);
  });
});


