const messages = {
  qntNote: "Qnt range should be 5 - 100",
  usernameNote: "No refunds will be issued for incorrect usernames.",
  emailNote: "Enter a valid email address to receive your order confirmation and details.",
};

document.getElementById('qnt-note').textContent = messages.qntNote;
document.getElementById('username-note').textContent = messages.usernameNote;
document.getElementById('email-note').textContent = messages.emailNote;