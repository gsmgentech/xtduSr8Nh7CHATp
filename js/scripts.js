const copyButton = document.getElementById('copyButton');
const gcashNumber = '09923965626';

copyButton.addEventListener('click', () => {
    const tempInput = document.createElement('input');
    tempInput.value = gcashNumber;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('GCash number copied: ' + gcashNumber);
});

document.getElementById("openModalBtn").addEventListener("click", async function () {
    let boxName = document.querySelector(".name").textContent;
    let contactNumber = document.getElementById("contactNumber").value;
    let emailAddress = document.getElementById("emailAddress").value;
    let referenceNumber = document.getElementById("number").value;
    let noteToAdmin = document.getElementById("notetoadmin").value;

    if (!contactNumber || !emailAddress || !referenceNumber) {
        alert("Please fill in all required fields.");
        return;
    }

    let message = `📌 *NEW ORDER*\n\n🔹 *Item:* ${boxName}\n📞 *Contact:* ${contactNumber}\n📧 *Email:* ${emailAddress}\n💰 *Gcash Ref:* ${referenceNumber}\n📝 *Note:* ${noteToAdmin}`;
    
    let botToken = "7629739770:AAEvP7NK4M9Cua3X4norSzqQS2y2Edrdy3Q";
    let chatId = "6892566157";
    let telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        let response = await fetch(telegramURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        let data = await response.json();

        if (data.ok) {
            window.location.href = "success.html";
        } else {
            alert("Failed to send order. Please try again.");
        }
    } catch (error) {
        alert("Error sending order: " + error);
    }
});

const backButton = document.getElementById("backButton");
const submitButton = document.getElementById("openModalBtn");
let initialHeight = window.innerHeight;

window.addEventListener("resize", () => {
    if (window.innerHeight < initialHeight * 0.75) { 
        // Hide both buttons when keyboard is detected
        backButton.style.opacity = "0"; 
        backButton.style.pointerEvents = "none"; 
        submitButton.style.opacity = "0"; 
        submitButton.style.pointerEvents = "none"; 
    } else { 
        // Show both buttons when keyboard is closed
        backButton.style.opacity = "1"; 
        backButton.style.pointerEvents = "auto"; 
        submitButton.style.opacity = "1"; 
        submitButton.style.pointerEvents = "auto"; 
    }
});

