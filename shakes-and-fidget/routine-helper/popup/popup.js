function IsRunning() {
  return enable_disable_button.textContent === stopLabel
}

function getScrapbookRoutineMessage(enabled) {
  return {
    enabled,
    world: worldLabel?.value,
    localization: localizationLabel?.value,
    minRank: minRank?.value,
    maxRank: maxRank?.value,
  }
}

function EnableScrapBookRoutine() {
  console.log('Enabling scrapbook routine')
  enable_disable_button.textContent = stopLabel
  chrome.runtime.sendMessage({ scrapbook_routine_message: getScrapbookRoutineMessage(true) })
}

function DisableScrapBookRoutine() {
  console.log('Disabling scrapbook routine')
  enable_disable_button.textContent = startLabel
  chrome.runtime.sendMessage({ scrapbook_routine_message: getScrapbookRoutineMessage(false) })
}

//================== MAIN ==================//

//TODO(hg): Fetch popup state from backend routine status
const startLabel = 'Start Scrapbook Search'
const stopLabel = 'Stop Scrapbook Search'

const enable_disable_button = document.getElementById('scrapbook_routine_button')

const worldLabel = document.getElementById('world')
const localizationLabel = document.getElementById('localization')
const minRank = document.getElementById('min_rank')
const maxRank = document.getElementById('max_rank')

enable_disable_button.addEventListener('click', () => {
  if (IsRunning()) {
    DisableScrapBookRoutine()
  } else {
    EnableScrapBookRoutine()
  }
})
