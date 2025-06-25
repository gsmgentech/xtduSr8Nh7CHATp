if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('js/service-worker.js')
      .then(reg => console.log('Service worker registered.'))
      .catch(err => console.log('Service worker not registered', err));
  });
}

document.getElementById('groupSelect').addEventListener('change', function () {
  const page = this.value;
  if (page) {
    window.location.href = page;
  }
});

function goToCheckout(page) {
  window.location.href = page;
}

const searchInput = document.getElementById('searchInput');
const serviceCards = document.querySelectorAll('.service-card');
const sectionTitles = document.querySelectorAll('.section-title');

searchInput.addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
    
  let currentSectionTitle = null;
  let hasVisibleCard = false;

  sectionTitles.forEach(title => title.style.display = 'none');

  serviceCards.forEach(card => {

    const prev = card.previousElementSibling;
    if (prev && prev.classList.contains('section-title')) {
      currentSectionTitle = prev;
      hasVisibleCard = false;
    }

    const text = card.textContent.toLowerCase();
    const match = text.includes(searchValue);

    if (match) {
      card.style.display = 'block';
      if (currentSectionTitle) {
        currentSectionTitle.style.display = 'block';
      }
    } else {
      card.style.display = 'none';
    }
  });
});

const checkoutLinks = {
  iremovalproa12rebypass: 'imei/iremovalproa12rebypass.html',
  imecheckservice1: 'imei/imecheckservice1.html',
  imecheckservice2: 'imei/imecheckservice2.html',
  imecheckservice3: 'imei/imecheckservice3.html',
  imecheckservice4: 'imei/imecheckservice4.html',
  imecheckservice5: 'imei/imecheckservice5.html',
  imecheckservice6: 'imei/imecheckservice6.html',
  imecheckservice7: 'imei/imecheckservice7.html',
  imecheckservice8: 'imei/imecheckservice8.html',
  imecheckservice9: 'imei/imecheckservice9.html',
  imecheckservice10: 'imei/imecheckservice10.html',
  imecheckservice11: 'imei/imecheckservice11.html',
  imecheckservice12: 'imei/imecheckservice12.html',
  imecheckservice13: 'imei/imecheckservice13.html',
  imecheckservice14: 'imei/imecheckservice14.html',
  imecheckservice15: 'imei/imecheckservice15.html',
  imecheckservice16: 'imei/imecheckservice16.html',
  imecheckservice17: 'imei/imecheckservice17.html',
  imecheckservice18: 'imei/imecheckservice18.html',
  imecheckservice19: 'imei/imecheckservice19.html',
  imecheckservice20: 'imei/imecheckservice20.html',
  imecheckservice21: 'imei/imecheckservice21.html',
  imecheckservice22: 'imei/imecheckservice22.html',
  imecheckservice23: 'imei/imecheckservice23.html',
  imecheckservice24: 'imei/imecheckservice24.html',
  imecheckservice25: 'imei/imecheckservice25.html',
  imecheckservice26: 'imei/imecheckservice26.html',
  imecheckservice27: 'imei/imecheckservice27.html',
  imecheckservice28: 'imei/imecheckservice28.html',
  imecheckservice29: 'imei/imecheckservice29.html',
  imecheckservice30: 'imei/imecheckservice30.html',
  imecheckservice31: 'imei/imecheckservice31.html', 
  imecheckservice32: 'imei/imecheckservice32.html',
  imecheckservice33: 'imei/imecheckservice33.html',
  imecheckservice34: 'imei/imecheckservice34.html',
  imecheckservice35: 'imei/imecheckservice35.html',
  imecheckservice36: 'imei/imecheckservice36.html',
  iphonepremiumunlockservice1: 'imei/iphonepremiumunlockservice1.html',
  iphonepremiumunlockservice2: 'imei/iphonepremiumunlockservice2.html',
  iphonepremiumunlockservice3: 'imei/iphonepremiumunlockservice3.html',
  iphonepremiumunlockservice4: 'imei/iphonepremiumunlockservice4.html',
  iphonepremiumunlockservice5: 'imei/iphonepremiumunlockservice5.html',
  iphonepremiumunlockservice6: 'imei/iphonepremiumunlockservice6.html',
  iphonepremiumunlockservice7: 'imei/iphonepremiumunlockservice7.html',
  iphonepremiumunlockservice8: 'imei/iphonepremiumunlockservice8.html',
  iphonepremiumunlockservice9: 'imei/iphonepremiumunlockservice9.html',
  iphonepremiumunlockservice10: 'imei/iphonepremiumunlockservice10.html',
  iphonepremiumunlockservice11: 'imei/iphonepremiumunlockservice11.html',
  iphonepremiumunlockservice12: 'imei/iphonepremiumunlockservice12.html',
  iphonepremiumunlockservice13: 'imei/iphonepremiumunlockservice13.html',
  iphonepremiumunlockservice14: 'imei/iphonepremiumunlockservice14.html',
  iphonepremiumunlockservice15: 'imei/iphonepremiumunlockservice15.html',
  iphonepremiumunlockservice16: 'imei/iphonepremiumunlockservice16.html',
  iphonepremiumunlockservice17: 'imei/iphonepremiumunlockservice17.html',
  iphonepremiumunlockservice18: 'imei/iphonepremiumunlockservice18.html',
  iphonepremiumunlockservice19: 'imei/iphonepremiumunlockservice19.html',
  iphonepremiumunlockservice20: 'imei/iphonepremiumunlockservice20.html',
  iphonepremiumunlockservice21: 'imei/iphonepremiumunlockservice21.html',
  iphonepremiumunlockservice22: 'imei/iphonepremiumunlockservice22.html',
  iphonepremiumunlockservice23: 'imei/iphonepremiumunlockservice23.html',
  iphonepremiumunlockservice24: 'imei/iphonepremiumunlockservice24.html',
  genericunlockservice1: 'imei/genericunlockservice1.html',
  genericunlockservice2: 'imei/genericunlockservice2.html',
  genericunlockservice3: 'imei/genericunlockservice3.html',
  genericunlockservice4: 'imei/genericunlockservice4.html',
  genericunlockservice5: 'imei/genericunlockservice5.html',
  genericunlockservice6: 'imei/genericunlockservice6.html',
  genericunlockservice7: 'imei/genericunlockservice7.html',
  genericunlockservice8: 'imei/genericunlockservice8.html',
  genericunlockservice9: 'imei/genericunlockservice9.html',
  samsungfrpremove1: 'imei/samsungfrpremove1.html',
  samsungfrpremove2: 'imei/samsungfrpremove2.html',
  samsungfrpremove3: 'imei/samsungfrpremove3.html',
  samsungfrprefund: 'imei/samsungfrprefund.html',
  iremovalprov4bypass1: 'imei/iremovalprov4bypass1.html',
  iremovalprov4bypass2: 'imei/iremovalprov4bypass2.html',
  iremovalprov4bypass3: 'imei/iremovalprov4bypass3.html',
  vortexsimunlock: 'imei/vortexsimunlock.html',
  tracfoneunlock: 'imei/tracfoneunlock.html',
  honorfrpkeyemergency: 'imei/honorfrpkeyemergency.html',
  honorfrpkeyfast: 'imei/honorfrpkeyfast.html',
  honorfrpkeyslow: 'imei/honorfrpkeyslow.html',
  honornetworkunlock: 'imei/honornetworkunlock.html',
  t2mdmunlockpermanenthfztool: 'imei/t2mdmunlockpermanenthfztool.html',
  verizonusa1: 'imei/verizonusa1.html',
  verizonusa2: 'imei/verizonusa2.html',
  nothingphonenetworkunlock: 'imei/nothingphonenetworkunlock.html',
  oneplusnetworkunlock: 'imei/oneplusnetworkunlock.html',
  tecnoinfinixitelmdmfast: 'imei/tecnoinfinixitelmdmfast.html',
  tecnoinfinixitelmdmslow: 'imei/tecnoinfinixitelmdmslow.html',
  itelnetworkunlock: 'imei/itelnetworkunlock.html',
  xiaomiworldwide: 'imei/xiaomiworldwide.html',
  xiaomieuropefast: 'imei/xiaomieuropefast.html',
  xiaomieuropeslow: 'imei/xiaomieuropeslow.html',
  xiaomibrazilfast: 'imei/xiaomibrazilfast.html',
  xiaomibrazilslow: 'imei/xiaomibrazilslow.html',
  realmenetworkunlockchina: 'imei/realmenetworkunlockchina.html',
  realmenetworkunlockeurope: 'imei/realmenetworkunlockeurope.html',
  realmenetworkunlockindia: 'imei/realmenetworkunlockindia.html',
  realmenetworkunlockworldwide: 'imei/realmenetworkunlockworldwide.html',
  opponetworkunlockindia: 'imei/opponetworkunlockindia.html',
  opponetworkunlockfast: 'imei/opponetworkunlockfast.html',
  opponetworkunlockslow: 'imei/opponetworkunlockslow.html',
  usagsmunlock: 'imei/usagsmunlock.html',
  repairfixauthtool: 'server/repairfixauthtool.html',
  XXXXX: 'imei/XXXXX.html'
};

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.getAttribute('data-key').toLowerCase();
    const url = checkoutLinks[key];
    if (url) {
      window.location.href = url;
    } else {
      console.warn(`No checkout link found for key: ${key}`);
    }
  });
});