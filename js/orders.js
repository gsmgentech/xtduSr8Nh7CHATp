document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('ordersWrap')
  const filter = document.getElementById('serviceFilter')
  const clearBtn = document.getElementById('clearOrders')

  // SAFETY: orders page only
  if (!wrap || !filter || !clearBtn) return

  /* =========================
     PERFORMANCE CONFIG
  ========================= */
  const ANIMATION_LIMIT = 30

  /* =========================
     STATUS CONFIG
  ========================= */
  const STATUS_MAP = {
    pending: { label: 'PENDING', color: '#c88719' },
    processing: { label: 'PROCESSING', color: '#4b6cb7' },
    success: { label: 'SUCCESS', color: '#2e7d32' },
    failed: { label: 'FAILED', color: '#b23b3b' },
    invalid_reference: { label: 'INVALID REFERENCE NUMBER', color: '#b23b3b' },
    invalid_imei: { label: 'INVALID IMEI', color: '#b23b3b' },
    invalid_serial: { label: 'INVALID SERIAL', color: '#b23b3b' },
    already_used: { label: 'ALREADY USED', color: '#8a1c1c' },
    not_supported: { label: 'NOT SUPPORTED', color: '#555' },
    cancelled: { label: 'CANCELLED', color: '#777' }
  }

  /* =========================
     LOAD ORDERS
  ========================= */
  const rawOrders = JSON.parse(localStorage.getItem('orders') || '[]')

  const orders = rawOrders.map(o => {
    const category = o.from || 'unknown'
    return {
      orderId: o.orderId || '—',
      title:
        o.title ||
        (category === 'imei'
          ? 'IMEI Service'
          : category === 'server'
          ? 'Server Service'
          : category === 'rent'
          ? 'Rental Service'
          : 'Unknown Service'),
      from: category,
      email: o.email || '—',
      quantity: o.quantity || 1,
      total:
        typeof o.total === 'number'
          ? o.total
          : typeof o.unitPrice === 'number'
          ? o.unitPrice * (o.quantity || 1)
          : null,
      fields: o.fields || {},
      reference: o.reference || '—',
      ts: o.ts || null,
      status: o.status || 'pending'
    }
  })

  /* =========================
     STATUS SYNC
  ========================= */
  async function syncOrderStatus() {
    try {
      const res = await fetch('data/order-status.json', { cache: 'no-store' })
      if (!res.ok) return false

      const map = await res.json()
      let changed = false

      orders.forEach(o => {
        if (map[o.orderId] && o.status !== map[o.orderId]) {
          o.status = map[o.orderId]
          changed = true
        }
      })

      if (changed) {
        localStorage.setItem('orders', JSON.stringify(orders))
      }

      return changed
    } catch {
      return false
    }
  }

  /* =========================
     RENDER
  ========================= */
  function render(list) {
    wrap.innerHTML = ''

    if (!list.length) {
      wrap.innerHTML = `<div class="empty">No orders found</div>`
      return
    }

    const animate = list.length <= ANIMATION_LIMIT

    list.forEach((o, i) => {
      const card = document.createElement('div')
      card.className = 'card order-card'

      const total =
        typeof o.total === 'number' ? `₱${o.total.toFixed(2)}` : '—'
      const date = o.ts ? new Date(o.ts).toLocaleString() : '—'

      const extra =
        o.fields && Object.keys(o.fields).length
          ? Object.entries(o.fields)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          : ''

      const statusCfg = STATUS_MAP[o.status] || STATUS_MAP.pending

      card.innerHTML = `
        <strong>${o.title}</strong>

        <div class="order-status">
          <span>Status:</span>
          <span class="status-text" style="color:${statusCfg.color}">
            ${statusCfg.label}
          </span>
        </div>

        <div>Category: ${o.from}</div>
        <div>Order ID: ${o.orderId}</div>
        <div>Email: ${o.email}</div>
        <div>Quantity: ${o.quantity}</div>
        <div>Total: ${total}</div>
        ${extra ? `<div>Details: ${extra}</div>` : ''}
        <div class="order-date">${date}</div>
        <button class="copy-btn">Copy Details</button>
      `

      card.querySelector('.copy-btn').onclick = () => {
        navigator.clipboard.writeText(`
Order ID: ${o.orderId}
Service: ${o.title}
Status: ${statusCfg.label}
Email: ${o.email}
Quantity: ${o.quantity}
Total: ${total}
Date: ${date}
`)
        showToast('Order details copied')
      }

      if (animate) {
        card.style.animation = 'none'
        wrap.appendChild(card)
        card.offsetHeight
        card.style.animation = ''
        card.style.animationDelay = `${i * 120}ms`
      } else {
        card.style.animation = 'none'
        card.style.opacity = '1'
        card.style.transform = 'none'
        wrap.appendChild(card)
      }
    })
  }

  /* =========================
     INITIAL LOAD
  ========================= */
  ;(async () => {
    await syncOrderStatus()
    render(orders)
  })()

  /* =========================
     AUTO REFRESH
  ========================= */
  setInterval(async () => {
    const changed = await syncOrderStatus()
    if (changed) render(orders)
  }, 30000)

  /* =========================
     FILTER
  ========================= */
  filter.addEventListener('change', () => {
    const val = filter.value
    render(val ? orders.filter(o => o.from === val) : orders)
  })

  /* =========================
     CLEAR HISTORY
  ========================= */
  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all order history?')) return
    localStorage.removeItem('orders')
    render([])
  })

  /* =========================
     TOAST
  ========================= */
  function showToast(msg) {
    const t = document.createElement('div')
    t.className = 'toast info'
    t.textContent = msg
    document.body.appendChild(t)

    requestAnimationFrame(() => t.classList.add('show'))

    setTimeout(() => {
      t.classList.remove('show')
      setTimeout(() => t.remove(), 300)
    }, 1600)
  }
})
