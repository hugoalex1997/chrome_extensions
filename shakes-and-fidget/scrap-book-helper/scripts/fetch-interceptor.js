// === UI CREATION ===
function createPanel() {
  const existingPanel = document.getElementById('krtekpanel')
  if (existingPanel) document.body.removeChild(existingPanel)

  const panel = document.createElement('div')
  panel.id = 'krtekpanel'
  Object.assign(panel.style, {
    zIndex: 1000,
    fontSize: '48px',
    width: 'auto',
    backgroundColor: '#FFFFFF33',
    position: 'fixed',
    right: '15px',
    top: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '10px',
    backdropFilter: 'blur(6px)',
  })
  document.body.appendChild(panel)

  // Counter
  const counter = document.createElement('div')
  counter.id = 'krtekcounter'
  counter.style.color = 'white'
  counter.textContent = '0'
  panel.appendChild(counter)

  // Name tag
  const nameTag = document.createElement('div')
  nameTag.id = 'krteknametag'
  Object.assign(nameTag.style, { color: 'white', fontSize: '15px' })
  nameTag.textContent = ''
  panel.appendChild(nameTag)

  // Max value
  const maxDiv = document.createElement('div')
  maxDiv.id = 'krtekmax'
  Object.assign(maxDiv.style, { color: 'white', fontSize: '15px' })
  maxDiv.textContent = ''
  panel.appendChild(maxDiv)

  // Reset button
  const resetBtn = document.createElement('button')
  resetBtn.textContent = 'Reset Max'
  resetBtn.style.marginTop = '10px'
  resetBtn.onclick = () => {
    maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 }
    resetMax()
    setCounter(0)
    setPlayerName('')
  }
  panel.appendChild(resetBtn)

  // Hidden div (clipboard)
  const hiddenName = document.createElement('div')
  hiddenName.id = 'hiddenMaxName'
  hiddenName.style.display = 'none'
  panel.appendChild(hiddenName)

  // Click to copy hidden name
  panel.addEventListener('click', async (event) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(hiddenName.innerHTML)
      console.log('Copied!')
    } catch (err) {
      console.error('Clipboard error:', err)
    }
  })
}

// === UI HELPERS ===
function setCounter(value) {
  const el = document.getElementById('krtekcounter')
  if (el) el.textContent = value
}

function setPlayerName(name) {
  const el = document.getElementById('krteknametag')
  if (el) el.textContent = name
}

function setMax(info) {
  const maxEl = document.getElementById('krtekmax')
  const hiddenEl = document.getElementById('hiddenMaxName')
  if (maxEl && hiddenEl) {
    maxEl.textContent = `Max: ${info.playerRank} - ${info.playerName} ${info.count}`
    hiddenEl.innerHTML = info.playerName
  }
}

function resetMax() {
  const maxEl = document.getElementById('krtekmax')
  const hiddenEl = document.getElementById('hiddenMaxName')
  if (maxEl && hiddenEl) {
    maxEl.textContent = ''
    hiddenEl.innerHTML = ''
  }
}

// === DATA SCRAPER ===
function scrapeData() {
  const intercepted = document.getElementById('__interceptedData')
  if (intercepted) {
    onRequest(intercepted.innerHTML)
    intercepted.remove()
  }
  requestIdleCallback(scrapeData, { timeout: 200 })
}

// === MAIN LOGIC ===
createPanel()

let scrapbook = {}
let maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 }

async function onRequest(data) {
  console.log('bateu no on request')

  const equipMatch = data.match(/otherplayersaveequipment:([^&]+)/g)
  const nameMatch = data.match(/otherplayername.r:([^&]+)/g)

  if (equipMatch?.length && nameMatch?.length) {
    const equipData = parseLookat(equipMatch[0].replace('otherplayersaveequipment:', ''))
    let unownedCount = 0

    for (const item of equipData) {
      const variant = `${item}_1`
      if ((item in scrapbook && !scrapbook[item]) || (variant in scrapbook && !scrapbook[variant])) {
        unownedCount++
      }
    }

    setCounter(unownedCount)

    const playerName = nameMatch[0].replace('otherplayername.r:', '')
    setPlayerName(playerName)

    if (maxUnowned.count < unownedCount) {
      maxUnowned = {
        count: unownedCount,
        playerName,
        playerRank: parseInt(equipMatch[0].replace('otherplayer.playerlookat:', '').split('/')[6]),
      }
      setMax(maxUnowned)
    }
  }

  const scrapbookMatch = data.match(/scrapbook.r:([^$]+)/g)
  if (scrapbookMatch?.length) {
    scrapbook = parseScrapbook(scrapbookMatch[0].replace('scrapbook.r:', ''))
  }

  if (data.match(/combatloglist.s/g)) {
    maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 }
    resetMax()
  }
}

// === FETCH INTERCEPTOR ===
window.addEventListener('load', () => {
  const { fetch: originalFetch } = window

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)
    const buffer = await response.clone().arrayBuffer()
    const text = new TextDecoder().decode(buffer)

    const hiddenDiv = document.createElement('div')
    hiddenDiv.id = '__interceptedData'
    hiddenDiv.innerText = text
    Object.assign(hiddenDiv.style, { height: 0, overflow: 'hidden' })
    document.body.appendChild(hiddenDiv)

    return response
  }

  requestIdleCallback(scrapeData, { timeout: 200 })
})
