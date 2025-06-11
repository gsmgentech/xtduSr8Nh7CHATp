function generateOrderId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return 'ORD-' + Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

document.getElementById('submitButton').addEventListener('click', async (e) => {
  e.preventDefault();

  const highlightText = document.querySelector('.highlight')?.textContent.trim() || 'No service info';
  const qntLabel = document.querySelector('label[for="qnt"]')?.textContent.trim() || 'Qnt';
  const usernameLabel = document.querySelector('label[for="username"]')?.textContent.trim() || 'Username';
  const emailLabel = document.querySelector('label[for="email"]')?.textContent.trim() || 'Email Address';
  const priceText = document.querySelector('.price')?.textContent.trim() || '₱0';

  const qntInput = document.getElementById('qnt').value.trim();
  const usernameInput = document.getElementById('username').value.trim();
  const emailInput = document.getElementById('email').value.trim();

  if (!qntInput) {
    alert('Please enter: ' + qntLabel);
    return;
  }

  if (!usernameInput) {
    alert('Please enter: ' + usernameLabel);
    return;
  }

  if (!emailInput) {
    alert('Please enter a valid Email Address ' + emailLabel);
    return;
  }

  // ✅ Generate Order ID
  const orderId = generateOrderId(8);

  // ✅ Save Order ID to localStorage
  localStorage.setItem('orderId', orderId);

  // ✅ Get IP Address
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
👤 *${usernameLabel}:* ${usernameInput}
📧 *${emailLabel}:* ${emailInput}
🔢 *${qntLabel}:* 
${qntInput}
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
      // ✅ Clear form fields
      document.getElementById('qnt').value = '';
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';

      // ✅ Redirect to payment page
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
