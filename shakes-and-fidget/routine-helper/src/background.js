import { IsScrapBookRoutineActive, StartScrapBookRoutine, StopScrapBookRoutine } from './routine.js'

function ToggleScrapBookRoutineStatus(info) {
  if (!info.enabled) {
    StopScrapBookRoutine()
    return
  }

  const config = {
    world: info.world,
    localization: info.localization,
    minRank: info.minRank,
    maxRank: info.maxRank,
  }
  StartScrapBookRoutine(config)
}

//================== MAIN ==================//

console.info('Background :: Service Worker script start!')

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  //console.log(`Background :: Received: ${JSON.stringify(message)}`)

  let response = {}
  const type = message.type
  switch (type) {
    case 'get_routine_status':
      response.success = true
      response.body = IsScrapBookRoutineActive()
      break

    case 'toggle_routine_status':
      response.success = true
      ToggleScrapBookRoutineStatus(message.body)
      break

    default:
      response.success = false
  }
  sendResponse(response)
})
