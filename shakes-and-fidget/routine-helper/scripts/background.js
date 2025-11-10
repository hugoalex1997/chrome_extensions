import { Game } from './game.js'
import { config } from './config.js'
import { contains } from './utils.js'

function CreateWebRequestListeners() {
  const url = `https://${config.sfWorld}.sfgame.${config.sfLocalization}/cmd.php*`

  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const url = details.url

      if (contains(url, 'Poll&')) {
        const sid = new URL(url).searchParams.get('sid')

        if (sid) {
          game.set_session_id(sid)

          if (!initialized) {
            initialized = true
            CreateAlarms()
            game.fill_scrapbook()
          }
        }

        // Optionally: set session if needed for future calls

        return
      }
    },
    { urls: [url] }
  )

  chrome.webRequest.onCompleted.addListener(
    (details) => {
      const url = details.url

      if (contains(url, 'Poll&')) {
        const sid = new URL(url).searchParams.get('sid')
        game.set_session_id(sid)
        return
      }

      console.log('Response received:', details.url, details.statusCode)
    },
    { urls: [url] }
  )
}

function CreateAlarms() {
  const alarms = new Map([
    ['search_player', 1 / 6],
    ['attack_player', 11],
  ])

  alarms.forEach((interval, alarmName) => {
    chrome.alarms.create(alarmName, { periodInMinutes: interval })
  })

  chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
      case 'search_player':
        game.search_player()
        break
      case 'attack_player':
        game.attack_player()
        break
      default:
        console.log('Unknown alarm:', alarm.name)
    }
  })
}
//================== MAIN ==================//

console.log('Service Worker script start loading')

CreateWebRequestListeners()

let initialized = false
const game = new Game()

console.log('Service Worker script end loading')
