const payParams = new URLSearchParams(location.search)

/* =======================
   REDIRECT GUARD
======================= */

const storedTitle = sessionStorage.getItem('paymentTitle')
const paramTitle = payParams.get('title')

if (!storedTitle && !paramTitle) {
  location.replace('index.html')
}

/* =======================
   TITLE
======================= */

const title = storedTitle || paramTitle || 'Payment'
const titleEl = document.querySelector('.page-title')
if (titleEl) titleEl.textContent = title

/* =======================
   IMEI LUHN VALIDATION
======================= */

function isValidIMEI(imei) {
  if (!/^\d{15}$/.test(imei)) return false
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let d = parseInt(imei[i])
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  const check = (10 - (sum % 10)) % 10
  return check === parseInt(imei[14])
}

/* =======================
   PAYMENT METHODS
======================= */

const paymentMethods = [
  { name: "InstaPay", icon: "fa-solid fa-money-bill-wave" },
  { name: "Binance Pay", icon: "fa-brands fa-bitcoin" },
  { name: "PayPal", icon: "fa-brands fa-paypal" }
]

const methodContainer = document.getElementById("paymentMethods")

if (methodContainer) {
  methodContainer.innerHTML = `
    <div class="section">
      <label>Choose a payment method</label>
      <div class="methods">
        ${paymentMethods.map((m, i) => `
          <label class="method ${i === 0 ? 'active' : ''}">
            <input type="radio" name="pay" ${i === 0 ? 'checked' : ''}>
            <i class="${m.icon}"></i>
            <span>${m.name}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `
}

/* =======================
   FIELD CONFIG
======================= */

const fieldConfig = {
  username: {
    label: "Username",
    transform: v => v,
    validate: v => v.length >= 3,
    error: "Username must be at least 3 characters"
  },
  serial: {
    label: "Serial Number",
    transform: v => v.toUpperCase(),
    validate: v => v.length > 0,
    error: "Serial number is required"
  },
  imei: {
    label: "IMEI",
    transform: v => v.replace(/\D/g, '').slice(0, 15),
    validate: v => isValidIMEI(v),
    error: "Invalid IMEI (checksum failed)"
  },
  pc_name: {
    label: "PC Name",
    transform: v => v.toUpperCase(),
    validate: v => v.length > 0,
    error: "PC name is required"
  },
  pc_ip: {
    label: "PC IP Address",
    transform: v => v,
    validate: v =>
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(\d{1,3}\.){2}\d{1,3}$/.test(v),
    error: "Invalid IP address"
  },
  unlock_code: {
    label: "Unlock Code",
    transform: v => v.toUpperCase(),
    validate: v => v.length > 0,
    error: "Unlock code is required"
  }
}

/* =======================
   DYNAMIC FIELDS
======================= */

const dynamicFields = JSON.parse(sessionStorage.getItem('paymentFields') || '[]')
const fieldContainer = document.getElementById('dynamicFields')
const inputs = []

if (fieldContainer) {
  fieldContainer.innerHTML = ''
  dynamicFields.forEach(key => {
    const cfg = fieldConfig[key]
    if (!cfg) return

    const div = document.createElement('div')
    div.className = 'section'
    div.innerHTML = `
      <label>${cfg.label}</label>
      <input type="text" data-key="${key}">
      <small class="error" style="display:none;color:#dc2626;font-size:12px"></small>
    `
    const input = div.querySelector('input')
    input.addEventListener('input', () => {
      input.value = cfg.transform(input.value)
    })
    fieldContainer.appendChild(div)
    inputs.push(input)
  })
}

/* =======================
   REMARKS
======================= */

if (sessionStorage.getItem('remarksEnabled') === '1' && fieldContainer) {
  const div = document.createElement('div')
  div.className = 'section'
  div.innerHTML = `
    <label>Remarks (optional)</label>
    <textarea id="remarks" rows="3"></textarea>
  `
  fieldContainer.appendChild(div)
}

/* =======================
   PRICE & QUANTITY
======================= */

const summary = document.getElementById('summary')
const unitPriceEl = document.getElementById('unitPrice')
const totalPriceEl = document.getElementById('totalPrice')
const unitWrap = document.getElementById('unitWrap')
const qtyWrap = document.getElementById('qtyWrap')
const qtyInput = document.getElementById('quantity')
const plusBtn = document.getElementById('plus')
const minusBtn = document.getElementById('minus')
const payBtn = document.querySelector('.pay-btn')

const pricingType = sessionStorage.getItem('pricingType') || 'flat'
const storedPrice = sessionStorage.getItem('unitPrice')
const minQty = parseInt(sessionStorage.getItem('minQty') || 1)
const maxQty = parseInt(sessionStorage.getItem('maxQty') || 9999)

let serviceUnavailable = false
const unit = parseFloat(storedPrice)

if (!storedPrice || isNaN(unit) || unit <= 0) {
  serviceUnavailable = true
  summary.hidden = false
  totalPriceEl.textContent = 'Service unavailable'
  totalPriceEl.style.color = '#dc2626'
  unitWrap.hidden = true
  qtyWrap.hidden = true
  payBtn.disabled = true
  payBtn.textContent = 'Service Unavailable'
  document.querySelectorAll('.method').forEach(m => {
    m.style.pointerEvents = 'none'
    m.style.opacity = '0.5'
  })
}

if (!serviceUnavailable) {
  summary.hidden = false
  if (pricingType === 'per_unit') {
    unitWrap.hidden = false
    qtyWrap.hidden = false
    qtyInput.value = minQty

    const updateTotal = () => {
      let qty = Math.max(minQty, Math.min(maxQty, +qtyInput.value || minQty))
      qtyInput.value = qty
      totalPriceEl.textContent = `₱${(unit * qty).toFixed(2)}`
    }

    unitPriceEl.textContent = unit.toFixed(2)
    updateTotal()

    qtyInput.addEventListener('input', updateTotal)
    plusBtn?.addEventListener('click', () => {
      if (+qtyInput.value < maxQty) qtyInput.value++
      updateTotal()
    })
    minusBtn?.addEventListener('click', () => {
      if (+qtyInput.value > minQty) qtyInput.value--
      updateTotal()
    })
  } else {
    unitWrap.hidden = true
    qtyWrap.hidden = true
    totalPriceEl.textContent = `₱${unit.toFixed(2)}`
  }
}

/* =======================
   PAY VALIDATION
======================= */

const emailInput = document.getElementById('email')

payBtn?.addEventListener('click', e => {
  if (serviceUnavailable) {
    e.preventDefault()
    return
  }

  let valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
  inputs.forEach(input => {
    const cfg = fieldConfig[input.dataset.key]
    const err = input.nextElementSibling
    if (!cfg.validate(input.value.trim())) {
      err.textContent = cfg.error
      err.style.display = 'block'
      valid = false
    } else err.style.display = 'none'
  })

  if (!valid) e.preventDefault()
  // ❌ HUWAG I-CLEAR ang sessionStorage dito
})

/* =========================
   DISPLAY FINAL AMOUNT IN PAYMENT MODAL
========================= */
const priceEl = document.getElementById('cPrice')

const total =
  sessionStorage.getItem('finalTotal') ||
  sessionStorage.getItem('unitPrice')

if (priceEl && total) {
  priceEl.textContent = Number(total).toFixed(2)
}
