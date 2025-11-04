function createPanel() {
  let e = document.getElementById('krtekpanel');
  if (e) document.body.removeChild(e);

  e = document.createElement('div');
  e.id = 'krtekpanel';
  e.style.zIndex = 1000;
  e.style.fontSize = '48px';
  e.style.width = 'auto';
  e.style.backgroundColor = '#FFFFFF33';
  e.style.position = 'fixed';
  e.style.right = '15px';
  e.style.top = '15px';
  e.style.display = 'flex';
  e.style.flexDirection = 'column';
  e.style.alignItems = 'center';
  e.style.padding = '10px';
  e.style.borderRadius = '10px';
  e.style.backdropFilter = 'blur(6px)';
  document.body.appendChild(e);

  // Counter
  const t = document.createElement('div');
  t.id = 'krtekcounter';
  t.style.color = 'white';
  t.textContent = '0';
  e.appendChild(t);

  // Name tag
  const n = document.createElement('div');
  n.id = 'krteknametag';
  n.style.color = 'white';
  n.textContent = '';
  n.style.fontSize = '15px';
  e.appendChild(n);

  // Max value
  const a = document.createElement('div');
  a.id = 'krtekmax';
  a.style.color = 'white';
  a.textContent = '';
  a.style.fontSize = '15px';
  e.appendChild(a);

  // Reset button
  const o = document.createElement('button');
  o.textContent = 'Reset Max';
  o.style.marginTop = '10px';
  o.onclick = function () {
    maxUnowned = { count: -Infinity, playerName: null, playerRank: 0 };
    resetMax();
    setCounter(0);
    setPlayerName('');
  };
  e.appendChild(o);

  // Hidden div (clipboard)
  const l = document.createElement('div');
  l.id = 'hiddenMaxName';
  l.style.display = 'none';
  e.appendChild(l);

  e.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${l.innerHTML}`);
      console.log('Copied!');
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  });

}

function setCounter(e) {
  document.getElementById('krtekcounter').textContent = e
}
function setPlayerName(e) {
  document.getElementById('krteknametag').textContent = e
}
function setMax(e) {
  ;(document.getElementById('krtekmax').textContent = `Max: ${e.playerRank} - ${e.playerName} ${e.count}`),
    (document.getElementById('hiddenMaxName').innerHTML = `${e.playerName}`)
}
function resetMax() {
  ;(document.getElementById('krtekmax').textContent = ''), (document.getElementById('hiddenMaxName').innerHTML = '')
}
function scrapeData() {
  let e = document.getElementById('__interceptedData')
  if (e) {
    onRequest(e.innerHTML), e.remove(), requestIdleCallback(scrapeData, { timeout: 200 })
  } else requestIdleCallback(scrapeData, { timeout: 200 })
}
createPanel()
let scrapbook = {},
  maxUnowned = { count: -1 / 0, playerName: null, playerRank: 0 }
async function onRequest(e) {
  let t = e.match(/otherplayersaveequipment:([^&]+)/g),
    n = e.match(/otherplayername.r:([^&]+)/g)
  if (t && 0 != t.length && n && 0 != n.length) {
    let e = parseLookat(t[0].replace('otherplayersaveequipment:', '')),
      a = 0
    for (item of e) {
      let e = item + '_1'
      ;((item in scrapbook && !scrapbook[item]) || (e in scrapbook && !scrapbook[e])) && ++a
    }
    setCounter(a)
    let o = n[0].replace('otherplayername.r:', '')
    setPlayerName(o),
      maxUnowned.count < a &&
        ((maxUnowned.count = a),
        (maxUnowned.playerName = o),
        (maxUnowned.playerRank = parseInt(t[0].replace('otherplayer.playerlookat:', '').split('/')[6])),
        setMax(maxUnowned))
  }
  let a = e.match(/scrapbook.r:([^$]+)/g)
  a && 0 != a.length && (scrapbook = parseScrapbook(a[0].replace('scrapbook.r:', '')))
  e.match(/combatloglist.s/g) && ((maxUnowned = { count: -1 / 0, playerName: null, playerRank: 0 }), resetMax())
}
window.addEventListener('load', async function () {
  const { fetch: e } = window
  ;(window.fetch = async (...t) => {
    const n = await e(...t),
      a = await n.clone().arrayBuffer(),
      o = new TextDecoder().decode(a),
      l = document.createElement('div')
    return (
      (l.id = '__interceptedData'),
      (l.innerText = o),
      (l.style.height = 0),
      (l.style.overflow = 'hidden'),
      document.body.appendChild(l),
      n
    )
  }),
    requestIdleCallback(scrapeData, { timeout: 200 })
})
