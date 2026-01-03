(() => {

  const body = document.body

  /* =========================
     PAGE DETECTION
  ========================= */
  const currentPage = location.pathname.split('/').pop() || 'index.html'
  const params = new URLSearchParams(location.search)
  const from = params.get('from')

  /* ========================= 
     BOTTOM NAVIGATION
  ========================= */
  const navItems = [
    { href: 'imei.html', icon: 'fa-solid fa-fingerprint', label: 'IMEI' },
    { href: 'server.html', icon: 'fa-solid fa-cloud',   label: 'Server' },
    { href: 'index.html',  icon: 'fa-solid fa-house',   label: 'Home' },
    { href: 'rent.html',   icon: 'fa-solid fa-clock',   label: 'Rent' },
    { href: 'orders.html', icon: 'fa-solid fa-receipt', label: 'Orders' }
  ]

  const nav = document.createElement('div')
  nav.className = 'nav'

  navItems.forEach(item => {
    const a = document.createElement('a')
    a.href = item.href

    const key = item.href.replace('.html', '')
    if (
      item.href === currentPage ||
      (currentPage === 'payment.html' && from === key)
    ) {
      a.classList.add('active')
    }

    a.innerHTML = `<i class="fa ${item.icon}"></i><span>${item.label}</span>`
    nav.appendChild(a)
  })

  body.appendChild(nav)

  /* =========================
     DARK MODE
  ========================= */
  const savedTheme = localStorage.getItem('theme')

  // DEFAULT = DARK
  if (!savedTheme) {
    body.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else if (savedTheme === 'dark') {
    body.classList.add('dark')
  }

  /* =========================
     STOP ORDERS PAGE
  ========================= */
  if (currentPage === 'orders.html') return

  /* =========================
     EMPTY SEARCH
  ========================= */
  const empty = document.createElement('div')
  empty.className = 'empty'
  empty.id = 'emptyText'
  empty.innerText = 'No matching service found'
  document.querySelector('.wrapper')?.appendChild(empty)

  /* =========================
     JSON LOADER
  ========================= */
  async function loadJSON(path) {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`Failed to load ${path}`)
    return res.json()
  }

  let items = []

  async function loadItems() {
    if (currentPage === 'index.html') {
      const [imei, server, rent] = await Promise.all([
        loadJSON('data/imei-items.json'),
        loadJSON('data/server-items.json'),
        loadJSON('data/rent-items.json')
      ])
      items = [...imei, ...server, ...rent]
    } else if (currentPage === 'imei.html') {
      items = await loadJSON('data/imei-items.json')
    } else if (currentPage === 'server.html') {
      items = await loadJSON('data/server-items.json')
    } else if (currentPage === 'rent.html') {
      items = await loadJSON('data/rent-items.json')
    }

    initGrid()
  }

  /* =========================
     GRID / CARDS
  ========================= */
  function initGrid() {

    items.sort((a, b) => {
      if (!!a.unavailable !== !!b.unavailable) {
        return a.unavailable ? 1 : -1
      }
      return (a.title || '').localeCompare(b.title || '')
    })

    const grid = document.getElementById('grid')
    if (!grid) return
    grid.innerHTML = ''

    items.forEach(item => {

      const a = document.createElement('a')
      a.className = 'card'
      a.dataset.from = item.from || ''

      /* BADGE (MATCH JSON) */
      if (item.from === 'imei' || currentPage === 'imei.html') {
        a.classList.add('card-imei')
      } else if (item.from === 'server' || currentPage === 'server.html') {
        a.classList.add('card-server')
      } else if (item.from === 'rent' || currentPage === 'rent.html') {
        a.classList.add('card-rent')
      }

      /* AUTO LINK */
      const finalLink =
        item.link ||
        (item.from ? `payment.html?from=${item.from}` : null)

      if (!item.unavailable && finalLink) {
        a.href = finalLink
      } else {
        a.classList.add('disabled')
      }

      a.addEventListener('mousedown', e => {
        if (!finalLink || item.unavailable) {
          e.preventDefault()
          return
        }

        sessionStorage.setItem(
          'paymentTitle',
          [item.title, item.subtitle].filter(Boolean).join(' – ')
        )

        item.price
          ? sessionStorage.setItem('unitPrice', item.price.replace(/[^\d.]/g, ''))
          : sessionStorage.removeItem('unitPrice')

        sessionStorage.setItem('paymentFields', JSON.stringify(item.fields || []))
        sessionStorage.setItem('pricingType', item.pricingType || 'flat')
      })

      a.innerHTML = `
        <div class="thumb">
          <img src="${item.image || 'img/placeholder.png'}" alt="">
        </div>
        <span>
          ${item.title || ''}
          ${item.subtitle ? `<br>${item.subtitle}` : ''}
        </span>
        ${
          item.price
            ? `<div class="price ${item.unavailable ? 'not-available' : ''}">
                 ${item.price}
               </div>`
            : ''
        }
      `

      grid.appendChild(a)
    })

    /* =========================
       CASCADE (CRITICAL FIX)
    ========================= */
    const cards = [...grid.querySelectorAll('.card')]

    cards.forEach((card, i) => {
      card.style.animation = 'none'
      card.offsetHeight
      setTimeout(() => {
        card.style.animation = 'cascade .45s ease forwards'
      }, i * 70)
    })
  }

  loadItems().catch(console.error)

  /* =========================
    SMART SEARCH FILTER
  ========================= */
  const searchInput = document.querySelector('.search input')

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase()
      const emptyText = document.getElementById('emptyText')
      const grid = document.getElementById('grid')

      if (!grid) return

      let visibleCount = 0

      ;[...grid.children].forEach(card => {
        const text = card.innerText.toLowerCase()
        const category = (card.dataset.from || '').toLowerCase()

        const isCategoryMatch =
          q === 'imei' || q === 'server' || q === 'rent'
            ? category === q
            : false

        const match =
          q === '' ||
          text.includes(q) ||
          isCategoryMatch

        card.style.display = match ? '' : 'none'
        if (match) visibleCount++
      })

      if (emptyText) {
        emptyText.style.display = visibleCount === 0 ? 'block' : 'none'
      }
    })
  }
})()

/* =========================
   APP VERSION CHECK
========================= */
const APP_VERSION = '1.0.3'
const VERSION_KEY = 'gt_app_version'

const savedVersion = localStorage.getItem(VERSION_KEY)
if (savedVersion !== APP_VERSION) {
  localStorage.setItem(VERSION_KEY, APP_VERSION)
  if (!location.search.includes('v=')) {
    location.replace(location.pathname + '?v=' + APP_VERSION)
  }
}

/* =========================
   MENU OVERLAY
========================= */
document.body.insertAdjacentHTML('beforeend', `
  <div class="menu-overlay" id="menuOverlay">
    <div class="menu-drawer">
      <div class="menu-header">
        <span>Menu</span>
        <i class="fa fa-times" id="closeMenu"></i>
      </div>

      <div class="menu-item" id="menuDark">
        <i class="fa fa-moon"></i>
        <span>Dark Mode</span>
      </div>

      <div class="menu-item" id="menuWhatsNew">
        <i class="fa fa-rocket"></i>
        <span>What’s New</span>
      </div>

      <div class="menu-item" id="menuClearCache">
        <i class="fa fa-trash"></i>
        <span>Clear Cache</span>
      </div>

      <div class="menu-item">
        <i class="fa fa-user"></i>
        <span>Login</span>
      </div>

      <div class="menu-item">
        <i class="fa fa-coins"></i>
        <span>Currency</span>
      </div>
    </div>
  </div>
`)

const menuToggle = document.getElementById('menuToggle')
const menuOverlay = document.getElementById('menuOverlay')
const closeMenu = document.getElementById('closeMenu')
const whatsNew = document.getElementById('whatsNew')
const hideBtn = document.getElementById('hideForToday')

menuToggle && (menuToggle.onclick = () => menuOverlay.classList.add('show'))
closeMenu && (closeMenu.onclick = () => menuOverlay.classList.remove('show'))

menuOverlay.onclick = e => {
  if (e.target === menuOverlay) menuOverlay.classList.remove('show')
}

document.getElementById('menuDark')?.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  )
})

document.getElementById('menuWhatsNew')?.addEventListener('click', () => {
  whatsNew?.classList.add('show')
  menuOverlay.classList.remove('show')
})

document.getElementById('menuClearCache')?.addEventListener('click', () => {
  if (!confirm('This will clear cached data and reload the app. Continue?')) return
  localStorage.clear()
  location.reload()
})

document.addEventListener('keydown', function(e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

/* =========================
   CONTENT-ONLY NAV TRANSITION
========================= */
(() => {

  const TRANSITION_MS = 350

  function getWrapper() {
    return document.querySelector('.wrapper')
  }

  // ENTER animation
  window.addEventListener('pageshow', () => {
    const wrap = getWrapper()
    if (!wrap) return

    wrap.classList.add('slide-enter')

    setTimeout(() => {
      wrap.classList.remove('slide-enter')
    }, TRANSITION_MS)
  })

  // NAV only
  document.addEventListener('click', e => {
    const link = e.target.closest('.nav a')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('#')) return

    if (link.classList.contains('active')) {
      e.preventDefault()
      return
    }

    const wrap = getWrapper()
    if (!wrap) return

    e.preventDefault()

    wrap.classList.add('slide-exit')

    setTimeout(() => {
      location.href = href
    }, TRANSITION_MS)
  })

})()

