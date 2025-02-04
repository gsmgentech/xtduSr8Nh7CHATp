const botToken = '7629739770:AAEvP7NK4M9Cua3X4norSzqQS2y2Edrdy3Q';
const chatId = '6892566157';

function generateOrderId() {
    return '' + new Date().getTime() + Math.floor(Math.random() * 1000);
}

function sendToTelegram(message, successRedirectUrl) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = successRedirectUrl;
        } else {
            alert("Failed to submit your order.");
        }
    })
    .catch(error => {
        console.error("There is an error on your order.", error);
    });
}