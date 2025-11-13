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

function onBeforeRequest(details) {
  const url = details.url

  //console.log('Background :: Request Received - ', url)
}

function onCompleted(details) {
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
}

function CreateWebRequestListeners(config) {
  const url = `https://s${config.world}.sfgame.${config.localization}/cmd.php*`

  chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, { urls: [url] })

  chrome.webRequest.onCompleted.addListener(onCompleted, { urls: [url] })
}

function DeleteWebRequestListeners() {
  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest)
  chrome.webRequest.onCompleted.removeListener(onCompleted)
}

function onAlarm(alarm) {
  if (!scrapBookAttackRoutine.IsInitialized) {
    //console.log('Background :: ScrapBookAttackRoutine not initialized yet, skipping alarm')
    return
  }

  switch (alarm.name) {
    case 'timer_logger':
      timer++
      console.info(`Background running for ${timer} minutes `)
      break
    case 'search_player':
      scrapBookAttackRoutine.SearchPlayer()
      break
    case 'attack_player':
      scrapBookAttackRoutine.AttackPlayer()
      break
    default:
      console.error('Unknown alarm:', alarm.name)
  }
}

function CreateScrapBookAttackRoutineAlarms() {
  const alarms = new Map([
    ['timer_logger', 1],
    ['search_player', 1 / 120], // 2 per second
    ['attack_player', 11], // 1 per 11 minutes
  ])

  alarms.forEach((interval, alarmName) => {
    chrome.alarms.create(alarmName, { periodInMinutes: interval })
  })

  chrome.alarms.onAlarm.addListener(onAlarm)
}

function DeleteScrapBookAttackRoutineAlarms() {
  chrome.alarms.onAlarm.removeListener(onAlarm)
}

//================== PUBLIC =================//

export function StartScrapBookRoutine(config) {
  console.info('Routine :: Starting ScrapBook Routine!')

  if (scrapBookAttackRoutine.IsInitialized()) {
    console.error('Routine :: ScrapBook Routine is already running!')
    return
  }

  scrapBookAttackRoutine.Enable()
  CreateWebRequestListeners(config)
}

export function StopScrapBookRoutine() {
  console.info('Routine :: Stopping ScrapBook Routine!')

  DeleteWebRequestListeners()
  DeleteScrapBookAttackRoutineAlarms()
  scrapBookAttackRoutine.Reset()
}

export function IsScrapBookRoutineActive() {
  return scrapBookAttackRoutine.IsRunning()
}
//================== MAIN ==================//

//console.log('Routine :: Script Run!')
const scrapBookAttackRoutine = new ScrapBookAttackRoutine()
let timer = 0
