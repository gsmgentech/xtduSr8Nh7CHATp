document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('ordersWrap')
  const filter = document.getElementById('serviceFilter')
  const clearBtn = document.getElementById('clearOrders')

  if (!wrap || !filter || !clearBtn) return

  /* =========================
     CONFIG
  ========================= */
  const NO_PAYMENT_TIMEOUT = 5 * 60 * 1000 // 5 minutes

  const STATUS_MAP = {
    pending: { label: 'PENDING', color: '#c88719' },
    processing: { label: 'PROCESSING', color: '#4b6cb7' },
    in_process: { label: 'IN PROCESS', color: '#4b6cb7' },
    success: { label: 'SUCCESS', color: '#2e7d32' },
    failed: { label: 'FAILED', color: '#b23b3b' },
    invalid_imei: { label: 'INVALID IMEI', color: '#b23b3b' },
    invalid_username: { label: 'INVALID USERNAME', color: '#b23b3b' },
    invalid_email_address: { label: 'INVALID EMAIL ADDRESS', color: '#b23b3b' },
    invalid_serial_number: { label: 'INVALID SERIAL NUMBER', color: '#b23b3b' },
    no_payment_received: { label: 'NO PAYMENT RECEIVED', color: '#b23b3b' },
    not_supported: { label: 'NOT SUPPORTED', color: '#777' },
    contact_support: { label: 'CONTACT SUPPORT', color: '#2563eb', link: true },
    cancelled: { label: 'CANCELLED', color: '#777' }
  }

  /* =========================
     LOAD ORDERS
  ========================= */
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  let currentFilter = ''

  /* =========================
     ADMIN STATUS OVERRIDES
  ========================= */
  let statusOverrides = {}

  function fetchStatusOverrides() {
    return fetch(`data/order-status.json?ts=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        statusOverrides = data || {}
        applyStatusOverrides()
      })
      .catch(() => {})
  }

  function applyStatusOverrides() {
    orders.forEach(o => {
      const override = statusOverrides[o.orderId]
      if (!override) return

      if (typeof override === 'string') {
        o.status = override
        o.orderStatus = override
        o.statusText = override
        o.auto = false
        return
      }

      if (typeof override === 'object' && override.status) {
        o.status = override.status
        o.orderStatus = override.status
        o.statusText = override.status
        o.auto = override.auto === false ? false : o.auto

        if (override.meta && typeof override.meta === 'object') {
          o.meta = override.meta
        }
      }
    })
  }

  /* =========================
     AUTO NO PAYMENT CHECK
  ========================= */
  function applyNoPaymentTimeout() {
    const now = Date.now()
    let changed = false

    orders.forEach(o => {
      if (o.auto === false) return

      if (!o.ts) {
        o.ts = Date.now()
        changed = true
      }

      const status =
        (o.status || o.orderStatus || o.statusText || 'pending').toLowerCase()

      if (status !== 'pending') return

      if (now - o.ts >= NO_PAYMENT_TIMEOUT) {
        o.status = 'no_payment_received'
        o.orderStatus = 'no_payment_received'
        o.statusText = 'no_payment_received'
        o.auto = false
        changed = true
      }
    })

    if (changed) {
      localStorage.setItem('orders', JSON.stringify(orders))
    }
  }

  /* =========================
     FILTER OPTIONS
  ========================= */
  filter.innerHTML = `
    <option value="">All Services</option>
    <option value="imei">IMEI</option>
    <option value="server">Server</option>
    <option value="rent">Rent</option>
  `

  /* =========================
     RENDER
  ========================= */
  function renderFiltered() {
    const list = currentFilter
      ? orders.filter(o => o.from === currentFilter)
      : orders

    wrap.innerHTML = ''

    if (!list.length) {
      wrap.innerHTML = `
        <div class="empty">
          <strong>No orders found</strong>
          <p>All submitted orders will appear here for tracking and support reference.</p>
        </div>
      `
      return
    }

    list.forEach(o => {
      const rawStatus =
        o.status || o.orderStatus || o.statusText || 'pending'

      const statusKey = rawStatus.toLowerCase()
      const cfg = STATUS_MAP[statusKey] || STATUS_MAP.pending

      const total =
        typeof o.total === 'number' ? `₱${o.total.toFixed(2)}` : '—'
      const date = o.ts ? new Date(o.ts).toLocaleString() : '—'

      /* ✅ META SHOWN ONLY IF SUCCESS */
      let metaHtml = ''
      if (statusKey === 'success' && o.meta && typeof o.meta === 'object') {
        metaHtml = `
          <div class="order-meta">
            <strong style="color: #22c55e;">Service Details</strong>
            ${Object.values(o.meta)
              .filter(Boolean)
              .map(v => `<div class="meta-line">${v}</div>`)
              .join('')}
          </div>
        `
      }

      const statusHtml = cfg.link
        ? `<a href="support.html" style="color:${cfg.color}; font-weight:600;">
            ${cfg.label}
           </a>`
        : `<span style="color:${cfg.color}">${cfg.label}</span>`

      const card = document.createElement('div')
      card.className = 'card order-card'
      card.innerHTML = `
        <strong>${o.title || 'Service Order'}</strong>

        <div class="order-status">
          <span>Status:</span>
          ${statusHtml}
        </div>

        <div >Service: ${o.from}</div>
        <div>Order ID: ${o.orderId}</div>
        <div>Email: ${o.email}</div>
        <div>Quantity: ${o.quantity}</div>
        <div>Total: ${total}</div>
        <div class="order-date">${date}</div>

        ${metaHtml}

        <button class="copy-btn">Copy Details</button>
      `

      card.querySelector('.copy-btn').onclick = () => {
        let metaText = ''

        if (o.meta && typeof o.meta === 'object') {
          Object.values(o.meta).forEach(v => {
            if (v) metaText += `\n${v}`
          })
        }

        navigator.clipboard.writeText(`
Order ID: ${o.orderId}
Service: ${o.title}
Status: ${cfg.label}
Email: ${o.email}
Quantity: ${o.quantity}
Total: ${total}
Date: ${date}${metaText}
`)
      }

      wrap.appendChild(card)
    })
  }

  /* =========================
     EVENTS
  ========================= */
  filter.addEventListener('change', () => {
    currentFilter = filter.value
    renderFiltered()
  })

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('orders')
    renderFiltered()
  })

  /* =========================
     LIVE LOOP
  ========================= */
  fetchStatusOverrides().then(renderFiltered)

  setInterval(() => {
    fetchStatusOverrides().then(() => {
      applyNoPaymentTimeout()
      renderFiltered()
    })
  }, 60000)

  /* =========================
     TOAST
  ========================= */
  function toast(msg) {
    const t = document.createElement('div')
    t.className = 'toast info'
    t.textContent = msg
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 1800)
  }
})
