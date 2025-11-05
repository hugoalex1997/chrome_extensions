// === DATA SCRAPER ===
function scrapeData() {
  const intercepted = document.getElementById('__interceptedData');
  if (intercepted) {
    onRequest(intercepted.innerHTML);
    intercepted.remove();
  }
  requestIdleCallback(scrapeData, { timeout: 200 });
}

// === MAIN LOGIC ===
createPanel();

let scrapbook = {};
let maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 };

async function onRequest(data) {
  console.log('bateu no on request');

  const equipMatch = data.match(/otherplayersaveequipment:([^&]+)/g);
  const nameMatch = data.match(/otherplayername.r:([^&]+)/g);

  if (equipMatch?.length && nameMatch?.length) {
    const equipData = parseLookat(equipMatch[0].replace('otherplayersaveequipment:', ''));
    let unownedCount = 0;

    for (const item of equipData) {
      const variant = `${item}_1`;
      if ((item in scrapbook && !scrapbook[item]) || (variant in scrapbook && !scrapbook[variant])) {
        unownedCount++;
      }
    }

    setCounter(unownedCount);

    const playerName = nameMatch[0].replace('otherplayername.r:', '');
    setPlayerName(playerName);

    if (maxUnowned.count < unownedCount) {
      maxUnowned = {
        count: unownedCount,
        playerName,
        playerRank: parseInt(
          equipMatch[0].replace('otherplayer.playerlookat:', '').split('/')[6]
        ),
      };
      setMax(maxUnowned);
    }
  }

  const scrapbookMatch = data.match(/scrapbook.r:([^$]+)/g);
  if (scrapbookMatch?.length) {
    scrapbook = parseScrapbook(scrapbookMatch[0].replace('scrapbook.r:', ''));
  }

  if (data.match(/combatloglist.s/g)) {
    maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 };
    resetMax();
  }
}

// === FETCH INTERCEPTOR ===
window.addEventListener('load', () => {
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const buffer = await response.clone().arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    const hiddenDiv = document.createElement('div');
    hiddenDiv.id = '__interceptedData';
    hiddenDiv.innerText = text;
    Object.assign(hiddenDiv.style, { height: 0, overflow: 'hidden' });
    document.body.appendChild(hiddenDiv);

    return response;
  };

  requestIdleCallback(scrapeData, { timeout: 200 });
});
