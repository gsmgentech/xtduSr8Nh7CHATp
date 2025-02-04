document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contactNumber').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });

    document.getElementById('imeiNumber').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);
    });

    document.getElementById('number').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    document.getElementById('serialNumber').addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });
});

function openModal(type, name, price) {
    document.getElementById('modalOverlay').style.display = 'block';
    if (type === 'imei') {
        document.getElementById('imeiModal').style.display = 'block';
        document.getElementById('imeiItemName').value = name;
        document.getElementById('imeiItemPrice').value = '₱' + price;
    } else if (type === 'unlockTool') {
        document.getElementById('unlockToolModal').style.display = 'block';
        document.getElementById('unlockToolItemName').value = name;
        document.getElementById('unlockToolItemPrice').value = '₱' + price;
    }
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('imeiModal').style.display = 'none';
    document.getElementById('unlockToolModal').style.display = 'none';
}

document.getElementById('imeiForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    setTimeout(() => {
        submitButton.disabled = false;
    }, 3000);

    const itemName = document.getElementById('imeiItemName').value;
    const itemPrice = document.getElementById('imeiItemPrice').value;
    const imei = this.querySelector('input[placeholder="Dial #06# to get your IMEI number. Enter the 15-digit IMEI"]').value;
    const serialNumber = this.querySelector('input[placeholder="Serial Number"]').value;
    const contactNumber = this.querySelector('input[placeholder="Contact Number"]').value;
    const emailAddress = this.querySelector('input[placeholder="Email Address"]').value;
    const gcashReference = this.querySelector('input[placeholder="Gcash Reference Number"]').value;

    const orderId = generateOrderId();

    const message = `${itemName}

IMEI: ${imei}
Serial Number: ${serialNumber}
Order ID: ${orderId}

Your order is being processed.
We will notify you with an update once the process is complete, along with detailed instructions.
In the meantime, please ensure that your Samsung phone remains connected to the internet.
Thank you for choosing GenTech Server.

Price: ${itemPrice}
Contact Number: ${contactNumber}
Email Address: ${emailAddress}
Gcash Reference #: ${gcashReference}
IP Address: ${customerIP}`;
    
    const successRedirectUrl = "success.html";
    sendToTelegram(message, successRedirectUrl);
    closeModal();
});

document.getElementById('unlockToolForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    setTimeout(() => {
        submitButton.disabled = false;
    }, 3000);

    const itemName = document.getElementById('unlockToolItemName').value;
    const itemPrice = document.getElementById('unlockToolItemPrice').value;
    const contactNumber = this.querySelector('input[placeholder="Contact Number"]').value;
    const emailAddress = this.querySelector('input[placeholder="Email Address"]').value;
    const gcashReference = this.querySelector('input[placeholder="Gcash Reference Number"]').value;

    const orderId = generateOrderId();

    const message = `${itemName}

Username: Genrev
Password: 
Order ID: ${orderId}

Your UnlockTool rental request has been successfully processed. Thank you for choosing GenTech Server.

Price: ${itemPrice}
Contact Number: ${contactNumber}
Email Address: ${emailAddress}
Gcash Reference #: ${gcashReference}
IP Address: ${customerIP}`;
    
    const successRedirectUrl = "success.html";
    sendToTelegram(message, successRedirectUrl);
    closeModal();
});

function showTab(tabId) {
    document.querySelectorAll('.items').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    document.getElementById(tabId + 'Tab').classList.add('active');
}

showTab('imei');

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});

document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

document.addEventListener('copy', function (e) {
    e.preventDefault();
});

let customerIP = 'Unknown IP';

fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        customerIP = data.ip;
    })
    .catch(error => console.error('Error fetching IP address:', error));

