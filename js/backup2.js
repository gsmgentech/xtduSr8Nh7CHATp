function sendToTelegram(message, successRedirectUrl) {
    const botToken = '7629739770:AAEvP7NK4M9Cua3X4norSzqQS2y2Edrdy3Q';
    const chatId = '6892566157';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
        .then(response => {
            if (response.ok) {
                window.location.href = successRedirectUrl;
            } else {
                alert("Failed to submit your order.");
            }
        })
        .catch(error => console.error("Error:", error));
}