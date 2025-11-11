import { config } from './config.js'
import { PlayerEquipmentInspector } from './player-equipment-inspector.js'
import { RandomBetween } from './utils.js'
import { ShakesAndFidgetHttpRequests } from './http-requests.js'

export class ScrapBookAttackRoutine {
  constructor() {
    this.http = new ShakesAndFidgetHttpRequests()
    this.equipmentInspector = new PlayerEquipmentInspector()
    this.scrapbook = ''
    this.initialized = false
  }

  IsInitialized() {
    return this.initialized
  }

  async Initialize(id) {
    this.initialized = true
    this.SetSessionId(id)
    await this.FetchScrapBook()

    console.info('ScrapBookAttackRoutine :: Initialized!')
  }

  SetSessionId(id) {
    this.http.SetSessionId(id)
  }

  async FetchScrapBook() {
    this.scrapbook = await this.http.GetScrapBook()
  }

  async AttackPlayer() {
    const player = this.equipmentInspector.GetPlayer()

    if (!player) {
      console.warn('ScrapBookAttacksRoutine :: Player with rare items not found, skipping attack')
      return
    }

    const attacked = await this.http.AttackPlayer(player)

    if (!attacked) {
      console.warn('ScrapBookAttacksRoutine :: Failed to attack player: ' + player)
      return
    }

    console.info('ScrapBookAttacksRoutine :: Attacked player: ' + player)

    this.equipmentInspector.Reset() // reset unowned items search meters
    await this.FetchScrapBook()
  }

  async SearchPlayer() {
    if (!this.scrapbook) {
      console.error('ScrapBookAttacksRoutine :: Scrapbook not loaded, cannot search for players')
    }

    const rank = RandomBetween(config.minRank, config.maxRank)

    const playerName = await this.http.GetPlayerName(rank)

    if (!playerName) {
      console.warn('ScrapBookAttacksRoutine :: No player found at rank: ' + rank)
      return
    }

    const equipmentInfo = await this.http.GetPlayerInformation(playerName)

    this.equipmentInspector.UpdateUnownedItems(this.scrapbook, playerName, equipmentInfo)
  }
}
