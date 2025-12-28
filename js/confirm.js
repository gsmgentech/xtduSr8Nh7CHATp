/* =========================
   LOAD ORDER PAYLOAD
========================= */
const payload = JSON.parse(
  sessionStorage.getItem('orderPayload') || 'null'
)

if (!payload) {
  location.replace('index.html')
}

/* =========================
   ORDER ID
========================= */
if (!payload.ts) payload.ts = Date.now()
const orderId = 'ORD-' + payload.ts.toString(36).toUpperCase()

/* =========================
   DISPLAY DATA
========================= */
document.getElementById('cTitle').textContent = payload.title
document.getElementById('cEmail').textContent = payload.email
document.getElementById('cQty').textContent = payload.quantity
document.getElementById('cPrice').textContent = payload.total.toFixed(2)
document.getElementById('cRemarks').textContent =
  payload.remarks || '—'

const refEl = document.getElementById('orderRef')
if (refEl) refEl.textContent = orderId

/* =========================
   WARNING POPUP (AUTO SHOW)
========================= */
showConfirmWarning()

function showConfirmWarning() {
  const overlay = document.createElement('div')
  overlay.className = 'confirm-popup-overlay'

  const box = document.createElement('div')
  box.className = 'confirm-popup'

  box.innerHTML = `
    <button class="popup-close" aria-label="Close">&times;</button>
    <h3>Important Notice</h3>
    <p>
      Please double-check all details before submitting.
      Orders with incorrect <b>IMEI, username, serial number, or email</b>
      are <b>non-refundable</b> and cannot be modified once processed.
    </p>
  `

  overlay.appendChild(box)
  document.body.appendChild(overlay)

  // enter animation
  requestAnimationFrame(() => {
    overlay.classList.add('show')
  })

  function closePopup() {
    overlay.classList.remove('show')
    setTimeout(() => overlay.remove(), 300)
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup()
  })

  box.querySelector('.popup-close').onclick = closePopup
}

/* =========================
   CONFIRM = SAVE ORDER
========================= */
document.getElementById('confirmBtn').onclick = () => {

  const orders = JSON.parse(
    localStorage.getItem('orders') || '[]'
  )

  const finalOrder = {
    orderId,
    title: payload.title,
    from: payload.from || 'unknown',
    email: payload.email || '',
    quantity: payload.quantity || 1,
    total: typeof payload.total === 'number' ? payload.total : null,
    remarks: payload.remarks || '',
    fields: payload.fields || {},
    reference: payload.reference || '',
    ts: payload.ts
  }

  orders.unshift(finalOrder)

  localStorage.setItem(
    'orders',
    JSON.stringify(orders)
  )

  sessionStorage.removeItem('orderPayload')
  location.href = 'processing.html'
}
