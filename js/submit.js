/* =========================
   SUBMIT / ORDER HANDLER
   STABLE + COOLDOWN
========================= */
(() => {

  const payBtn = document.querySelector('.pay-btn')
  const emailInput = document.getElementById('email')
  const payModal = document.getElementById('payModal')
  const confirmBtn = document.getElementById('confirmPay')
  const cancelBtn = document.getElementById('cancelPay')
  const refInput = document.getElementById('refNumber')
  const refError = document.getElementById('refError')

  if (!payBtn || !emailInput || !payModal) return

  /* =========================
     COOLDOWN CONFIG
  ========================= */
  const ORDER_COOLDOWN_MS = 60 * 1000 // 1 minute
  const LAST_ORDER_KEY = 'gt_last_order_time'

  function canPlaceOrder() {
    const last = parseInt(localStorage.getItem(LAST_ORDER_KEY) || '0', 10)
    const now = Date.now()

    if (now - last < ORDER_COOLDOWN_MS) {
      return {
        allowed: false,
        wait: Math.ceil(
          (ORDER_COOLDOWN_MS - (now - last)) / 1000
        )
      }
    }
    return { allowed: true }
  }

  /* =========================
     TOAST (SIMPLE & SAFE)
  ========================= */
  function showToast(message, duration = 3000) {
    let t = document.getElementById('cooldownToast')
    if (t) t.remove()

    t = document.createElement('div')
    t.id = 'cooldownToast'
    t.style.cssText = `
      position:fixed;
      bottom:24px;
      left:50%;
      transform:translateX(-50%);
      background:#111827;
      color:#fff;
      padding:12px 16px;
      border-radius:12px;
      font-size:14px;
      z-index:9999;
      max-width:90%;
      text-align:center;
      box-shadow:0 20px 40px rgba(0,0,0,.3);
      font-family:Inter,sans-serif;
    `
    t.textContent = message
    document.body.appendChild(t)

    setTimeout(() => t.remove(), duration)
  }

  /* =========================
     EMAIL VALIDATION
  ========================= */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /* =========================
     PROCEED TO PAYMENT
     (BUILD PAYLOAD HERE)
  ========================= */
  payBtn.addEventListener('click', e => {
    e.preventDefault()

    if (!isValidEmail(emailInput.value.trim())) {
      showToast('Please enter a valid email address.')
      emailInput.focus()
      return
    }

    // collect dynamic fields (IMEI / serial etc.)
    const fields = {}
    let invalid = false

    document
      .querySelectorAll('#dynamicFields input[data-key]')
      .forEach(input => {
        const key = input.dataset.key
        const value = input.value.trim()

        let err = input.nextElementSibling
        if (!err || err.tagName !== 'SMALL') {
          err = document.createElement('small')
          err.style.cssText = 'color:#dc2626;font-size:12px;display:none'
          input.after(err)
        }

        if (!value) {
          err.textContent = `${key.replace(/_/g, ' ')} is required`
          err.style.display = 'block'
          invalid = true
        } else {
          err.style.display = 'none'
          fields[key] = value
        }
      })

    if (invalid) return

    const unitPrice = Number(sessionStorage.getItem('unitPrice') || 0)
    const qty = Number(document.getElementById('quantity')?.value || 1)

    const payload = {
      title: sessionStorage.getItem('paymentTitle') || 'Service',
      unitPrice,
      quantity: qty,
      total: unitPrice * qty,
      email: emailInput.value.trim(),
      fields,
      remarks: document.getElementById('remarks')?.value || '',
      from: new URLSearchParams(location.search).get('from'),
      ts: Date.now()
    }

    sessionStorage.setItem(
      'orderPayload',
      JSON.stringify(payload)
    )

    // reset reference input
    refInput.value = ''
    refError.textContent = ''
    confirmBtn.disabled = true

    payModal.classList.add('active')
    document.body.style.overflow = 'hidden'
  })

  /* =========================
     REFERENCE NUMBER INPUT
  ========================= */
  refInput.addEventListener('input', () => {
    refInput.value = refInput.value.replace(/\D/g, '').slice(0, 4)
    confirmBtn.disabled = refInput.value.length !== 4
    refError.textContent = confirmBtn.disabled
      ? 'Enter last 4 digits of reference number'
      : ''
  })

  /* =========================
     CANCEL MODAL
  ========================= */
  cancelBtn.addEventListener('click', () => {
    payModal.classList.remove('active')
    document.body.style.overflow = ''
  })

  /* =========================
     CONFIRM & SUBMIT
     (COOLDOWN HERE ONLY)
  ========================= */
  confirmBtn.addEventListener('click', () => {

    const check = canPlaceOrder()
    if (!check.allowed) {
      showToast(
        `Please wait ${check.wait} seconds before placing another order.`
      )
      return
    }

    const raw = sessionStorage.getItem('orderPayload')
    if (!raw) {
      showToast('Order expired. Please try again.')
      return
    }

    const payload = JSON.parse(raw)
    payload.reference = refInput.value

    sessionStorage.setItem(
      'orderPayload',
      JSON.stringify(payload)
    )

    // save cooldown ONLY on success submit
    localStorage.setItem(
      LAST_ORDER_KEY,
      Date.now().toString()
    )

    document.body.style.overflow = ''
    location.href = 'confirm.html'
  })

})()
