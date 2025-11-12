import { StartScrapBookRoutine, StopScrapBookRoutine } from './routine.js'

//================== MAIN ==================//

console.info('Background :: Service Worker script start!')

chrome.runtime.onMessage.addListener((message) => {
  console.log('Background :: Received message:', message)

  if (message.scrapbook_routine_message) {
    const info = message.scrapbook_routine_message

    if (info.enabled) {
      const config = {
        world: `s${info.world}`,
        localization: info.localization,
        minRank: info.minRank,
        maxRank: info.maxRank,
      }
      StartScrapBookRoutine(config)
    } else {
      StopScrapBookRoutine()
    }
  } else if (message.get_scrapbook_routine_state) {
    const isActive = IsScrapBookRoutineActive()
    sendResponse({isActive: isActive})
  }
})

