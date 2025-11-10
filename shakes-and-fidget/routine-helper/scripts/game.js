import { config } from './config.js'
import { ScrapbookParser } from './scrapbook.js'
import { PlayerItem } from './player-item.js'
import { toBase64 } from './utils.js'

export class Game {
  constructor() {
    const world = config.sfWorld
    const loc = config.sfLocalization

    this.baseRequest = `https://${world}.sfgame.${loc}/cmd.php?`
    this.scrapbook = {}
    this.sessionId = ''

    this.playerItem = new PlayerItem()
    this.scrapBookParser = new ScrapbookParser()
  }

  set_session_id(id) {
    this.sessionId = id
  }

  buildRequest(name, params = null) {
    if (params) {
      return `${this.baseRequest}req=${name}&params=${params}&sid=${this.sessionId}`
    }
    return `${this.baseRequest}req=${name}&sid=${this.sessionId}`
  }

  attack_player() {
    if (this.playerItem.GetUnownedItems() == 0) {
      console.log('Player with rare items not found, skipping attack')
    }

    const player = this.playerItem.GetPlayerToAttack()
    console.log('Attacking Player: ' + player)
  }

  get_random_player() {
    return 'Jufferinho'
  }

  search_player() {
    // e.g. https://s23.sfgame.eu/cmd.php?req=PlayerLookAt&params=WmllbG9ueSBTemFtcGFu&sid=0-xTimY60dMH96xh
    const player = this.get_random_player()
    const player_ = toBase64(player)
    const request = this.buildRequest('PlayerLookAt', player_)
    fetch(request, {
      method: 'GET',
    })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const equipment = data.match(/otherplayersaveequipment:([^&]+)/g)
        const equipmentData = equipment[0].replace('otherplayersaveequipment:', '')

        if (equipmentData) {
          this.playerItem.SetUnownedItems(this.scrapbook, player, equipmentData)
        } else {
          console.log('No player equipment data found in response')
        }
      })
      .catch((error) => {
        console.error('Player Look At Request:', error)
      })
  }

  get_scrapbook() {
    return this.scrapbook
  }

  fill_scrapbook() {
    // e.g. https://s23.sfgame.eu/cmd.php?req=PlayerPollScrapbook&params=&sid=0-xTimY60dMH96xh

    const request = this.buildRequest('PlayerPollScrapbook')
    fetch(request, {
      method: 'GET',
    })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        const scrapbookData = data.replace('scrapbook.r:', '')

        if (scrapbookData) {
          this.scrapbook = this.scrapBookParser.parse(scrapbookData)
          // console.log('New scrapbook Info: ' + JSON.stringify(this.scrapbook))
        } else {
          console.log('No scrapbook data found in response')
        }
      })
      .catch((error) => {
        console.error('Fill Scrapbook Request error:', error)
      })
  }
}
