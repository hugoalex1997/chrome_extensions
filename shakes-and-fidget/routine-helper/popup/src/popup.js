import { MessageWrapper } from './message-wrapper.js'

class Popup {
  constructor() {
    this.startLabel = 'Start Scrapbook Search'
    this.stopLabel = 'Stop Scrapbook Search'

    this.toggleButton = document.getElementById('scrapbook_routine_button')

    this.worldLabel = document.getElementById('world')
    this.localizationLabel = document.getElementById('localization')
    this.minRank = document.getElementById('min_rank')
    this.maxRank = document.getElementById('max_rank')

    this.enabled = false

    this.msgWrapper = new MessageWrapper()
  }

  //TODO(hg): initialize as async not a problem, but not a big fan!!!
  // Look into me later, probably use a variable 'loading' that will be responsible by load or not the frontend
  // is a better approach!
  async Initialize() {
    this.enabled = await this.FetchScrapbookRoutineStatus()

    this.toggleButton.textContent = this.enabled ? this.stopLabel : this.startLabel

    this.toggleButton.addEventListener('click', () => {
      if (this.enabled) {
        this.DisableScrapBookRoutine()
      } else {
        this.EnableScrapBookRoutine()
      }
    })
  }

  getSearchPlayerSpeed() {
    const speedSelected = document.querySelector('input[name="speed"]:checked')
    const speed = speedSelected ? speedSelected.value : null // "slow" | "normal" | "fast"
    const default_ = 60

    switch (speed) {
      case 'slow':
        return 30
      case 'normal':
        return 60
      case 'fast':
        return 120
    }
    return default_
  }

  getScrapbookRoutineMessage(enabled) {
    return {
      enabled: enabled,
      world: this.worldLabel?.value,
      localization: this.localizationLabel?.value,
      minRank: this.minRank?.value,
      maxRank: this.maxRank?.value,
      searchPlayerSpeed: this.getSearchPlayerSpeed(),
    }
  }

  async FetchScrapbookRoutineStatus() {
    //console.log('Fetching scrapbook routine status')

    let request = {}
    request.type = 'get_routine_status'
    const response = await this.msgWrapper.SendRequestAsync(request)

    if (!response.success) {
      console.warn('Failed to fetch scrapbook routine status')
      return
    }

    //console.log('Fetched scrapbook routine status:', response.body)
    return response.body
  }

  async EnableScrapBookRoutine() {
    if (this.enabled) {
      console.warn('Scrapbook routine is already disabled')
      return
    }

    //console.log('Enabling scrapbook routine')

    let request = {}
    request.type = 'toggle_routine_status'
    request.body = this.getScrapbookRoutineMessage(true)

    const response = await this.msgWrapper.SendRequestAsync(request)

    if (!response.success) {
      console.warn('Failed to enable scrapbook routine')
      return
    }

    this.enabled = true
    this.toggleButton.textContent = this.stopLabel
  }

  async DisableScrapBookRoutine() {
    if (!this.enabled) {
      console.warn('Scrapbook routine is already disabled')
      return
    }

    //console.log('Enabling scrapbook routine')

    let request = {}
    request.type = 'toggle_routine_status'
    request.body = this.getScrapbookRoutineMessage(false)

    const response = await this.msgWrapper.SendRequestAsync(request)

    if (!response.success) {
      console.warn('Failed to disable scrapbook routine')
      return
    }

    this.enabled = false
    this.toggleButton.textContent = this.startLabel
  }
}

//================== MAIN ==================//

let popup = new Popup()
popup.Initialize()
