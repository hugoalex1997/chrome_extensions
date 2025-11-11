import { ScrapBookAttackRoutine } from './scrapbook-attack-routine.js'
import { config } from './config.js'
import { Contains } from './utils.js'

function isPoll(url) {
  if (!url) {
    GenLogError('Background :: isPoll :: Called Method with invalid argument!')
    return
  }
  return Contains(url, 'Poll&')
}

function CreateWebRequestListeners() {
  const url = `https://${config.sfWorld}.sfgame.${config.sfLocalization}/cmd.php*`

  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const url = details.url

      //console.log('Background :: Request Received - ', url)
    },
    { urls: [url] }
  )

  chrome.webRequest.onCompleted.addListener(
    (details) => {
      const url = details.url

      //console.log('Background :: Response Received - ', url)

      if (isPoll(url)) {
        const sid = new URL(url).searchParams.get('sid')

        if (!sid) {
          console.warn('Background :: ScrapBookAttackRoutine :: No session ID found in Poll request')
          return
        }

        if (!scrapBookAttackRoutine.IsInitialized()) {
          scrapBookAttackRoutine.Initialize(sid)
          CreateScrapBookAttackRoutineAlarms()
          return
        }

        scrapBookAttackRoutine.SetSessionId(sid)

        return
      }
    },
    { urls: [url] }
  )
}

function CreateScrapBookAttackRoutineAlarms() {
  const alarms = new Map([
    ['timer_logger', 1],
    ['search_player', 1 / 60], // 1 per second
    ['attack_player', 11], // 1 per 11 minutes
  ])

  let timer = 0

  alarms.forEach((interval, alarmName) => {
    chrome.alarms.create(alarmName, { periodInMinutes: interval })
  })

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (!scrapBookAttackRoutine.IsInitialized) {
      //console.log('Background :: ScrapBookAttackRoutine not initialized yet, skipping alarm')
      return
    }

    switch (alarm.name) {
      case 'timer_logger':
        timer++
        console.info(`Background running for ${timer} minutes `)
      case 'search_player':
        scrapBookAttackRoutine.SearchPlayer()
        break
      case 'attack_player':
        scrapBookAttackRoutine.AttackPlayer()
        break
      default:
        console.error('Unknown alarm:', alarm.name)
    }
  })
}
//================== MAIN ==================//

console.info('Background :: Service Worker script start!')

CreateWebRequestListeners()

const scrapBookAttackRoutine = new ScrapBookAttackRoutine()
