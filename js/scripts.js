        // Get the button and the GCash number text
        const copyButton = document.getElementById('copyButton');
        const gcashNumber = '09923965626'; // GCash number to be copied
    
        // When the button is clicked, copy the GCash number to the clipboard
        copyButton.addEventListener('click', () => {
            // Create a temporary input element to hold the number
            const tempInput = document.createElement('input');
            tempInput.value = gcashNumber;
    
            // Append the input to the document body
            document.body.appendChild(tempInput);
    
            // Select the value of the input
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // For mobile devices
    
            // Execute the copy command
            document.execCommand('copy');
    
            // Remove the temporary input element
            document.body.removeChild(tempInput);
    
            // Optional: Provide feedback to the user
            alert('GCash number copied: ' + gcashNumber);
        });

        document.getElementById("openModalBtn").addEventListener("click", function () {
            let boxName = document.querySelector(".name").textContent; // Get the name from the box
            let contactNumber = document.getElementById("contactNumber").value;
            let emailAddress = document.getElementById("emailAddress").value;
            let referenceNumber = document.getElementById("number").value;
            let noteToAdmin = document.getElementById("notetoadmin").value;
        
            if (!contactNumber || !emailAddress || !referenceNumber) {
                alert("Please fill in all required fields.");
                return;
            }
        
            let message = `📌 *NEW ORDER*\n\n🔹 *Item:* ${boxName}\n📞 *Contact:* ${contactNumber}\n📧 *Email:* ${emailAddress}\n💰 *Gcash Ref:* ${referenceNumber}\n📝 *Note:* ${noteToAdmin}`;
            
            let botToken = "7629739770:AAEvP7NK4M9Cua3X4norSzqQS2y2Edrdy3Q"; // Replace with your bot token
            let chatId = "6892566157"; // Replace with your Telegram chat ID
        
            let telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
    // Send message to Telegram
    fetch(telegramURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    });

    // Instantly redirect after submission
    window.location.href = "success.html"; // Change this to your actual next page
});
        