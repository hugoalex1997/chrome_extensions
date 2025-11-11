import { config } from './config.js'
import { ScrapbookParser } from './scrapbook.js'
import { PlayerItem } from './player-item.js'
import { toBase64, random_between } from './utils.js'

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

  reset() {
    this.playerItem.reset()
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
    /* Example:
    request: https://s23.sfgame.eu/cmd.php?req=PlayerArenaFight&params=TVJfS0FNWUsvMA==&sid=0-VZzPOZWlkODzj0

    response:

    fightresult.battlereward:0/1/0/0/0/-25/0/30298/30751/0/0/0/0/0/0/0/0/0/0/0/0&battlerewarditem:0/0/0/0/0/0/0/0/
    0/0/0/0/0/0/0/0/0/0/0&ownplayersave.playerSave:929950348/92347/1762865702/1762304919/1581073363/0/0/65545/3297/
    5355/227/30751/0/10/1/17/0/2/102/103/1/102/1/1/10/0/0/6/35454977/12/10/56/13/43/25/2/40/16/35/14/1/37/1/27/13/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/1762864036/1/1/1/1/2/5/-112/-79/-111/19/10/16/54/27/54/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
    0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/245/194/102/30/8/43/1/1762864036/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
    1762864036/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/108/21/23/1720/1764073703/0/0/0/1762304919
    /2580/0/1/1762867815/1762866332/0/0/0/0/408/0/0/0/0/0/0/0/0/-111/0/0/4/1762865732/0/0/0/0/0/0/0/0/0/0/0/120/0/0/2
    /0/0/1763123373/0/0/10/0/0/0/0/0/0/0/0/0/0/0/6/2/0/0/60/0/0/0/1300/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/1762304919/0/0/0/0/0/0/0/0/0/0/0/0/3/0/0/0
    /0/0/32379/56076/31336/1762866614/0/0/0/0/0/0/0/0/0/0/0/0/0/0/1/0/0/0/0/0/0/0/0/32/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/65536/1762905601/0/10/0/0/0/0/0/10/0/2/0/0/0/0/3420/0/0/0/1762782600/0/0/280020000000/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/1/0/0/0/0/0/0/0/0/0/0/0/1/0/0/0/1/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/&ownplayersaveequipment:6/0/0/1003/0/22/0/4/2/0/9/5/0/347/0/0/0/9/0/3/0/0
    /1001/0/2/0/0/0/0/0/0/0/23/0/0/0/1/0/5/0/0/1001/0/3/0/1/0/0/2/0/0/80/0/0/0/1/0/4/0/0/1001/0/3/0/3/0/0/3/0/0/135/0/0/
    0/2/0/8/0/0/4/0/0/0/3/0/0/3/0/0/75/0/0/0/2/0/7/0/0/1003/0/24/0/2/5/0/8/6/0/297/0/0/0/9/0/9/0/0/70/0/0/0/22/0/0/7/0/0
    /100/0/0/0/6/0/10/0/0/2/0/0/0/3/4/0/9/5/0/260/0/0/0/9/0/1/0/0/15/0/21/23/4/2/0/11/9/0/434/0/0/0/10/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/&fightversion:2&fightheader.fighters:0/0/0/0/1/92347/BadBunny/9/3120/3120/12/96/29/78/39/2/102
    /103/1/102/1/1/10/0/0/6/1/12/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/50880/MR_KAMYK/12/2964/2964/15/138/19/57
    /16/2/103/103/5/102/1/3/10/0/0/6/1/3/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0&fightequipment:1/15/1/0/0/0/0/1
    /0/0/1/2003/1/0/0/0/0/1/0/0&fightdecoration:0/0/0/0&externaltoolequipment:21/23/0/0/21/29/0/0&fight.r:92347/0/18/0/0
    /3120/2762/0/1/3/1/3/50880/0/0/4/0/2762/3120/1/3/1/3/0/92347/0/19/0/0/3120/2629/0/1/3/1/2/92347/0/0/4/0/3120/2629/0/1
    /3/1/2/50880/0/0/0/0/2629/2724/1/3/1/2/0/92347/0/19/0/0/2724/2499/0/1/3/1/1/92347/0/0/0/0/2724/2249/0/1/3/1/1/50880/0
    /0/0/0/2249/2228/1/3/1/1/0/92347/0/19/0/0/2228/2175/0/1/3/1/0/92347/0/0/4/0/2228/2175/0/0/50880/0/0/0/0/2175/1599/0/0
    /92347/0/17/0/0/1599/1872/0/1/3/1/3/50880/0/0/0/0/1872/978/1/3/1/3/0/92347/0/19/0/0/978/1543/0/1/3/1/2/92347/0/0/4/0/978
    /1543/0/1/3/1/2/50880/0/0/4/0/1543/978/1/3/1/2/0/92347/0/19/0/0/978/1287/0/1/3/1/1/92347/0/0/4/0/978/1287/0/1/3/1/1/50880
    /0/0/4/0/1287/978/1/3/1/1/0/92347/0/19/0/0/978/1154/0/1/3/1/0/92347/0/0/4/0/978/1154/0/0/50880/0/0/4/0/1154/978/0/0/92347
    /0/17/4/0/978/1154/0/0/50880/0/0/0/0/1154/-61/0/0/&winnerid:50880&dailytasklist:0/127/1/1/1/16/5/5/2/131/5/5/1/130/0/1/2/4
    /0/5/1/3/1/10/2/128/1/1/1/14/0/3/1/1/0/1/1/124/0/1/1/67/0/1/1/119/0/1/2/120/0/1/1/121/0/1/1/117/1/10/2/122/0/1/1/126/0/1/1
    /118/0/1/1&eventtasklist:76/0/10/1/57/0/10/1/77/0/10/1/75/0/10/1&deeds:0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    */

    if (this.playerItem.GetMaxUnownedItems() == 0) {
      console.warn('Player with rare items not found, skipping attack')
      return
    }

    const player = this.playerItem.GetPlayerToAttack()
    const unowned = this.playerItem.GetMaxUnownedItems()
    console.log('Attacking Player: ' + player + ' with ' + unowned + ' unowned items!')

    this.reset()

    const params = `${player}/0`
    const params_ = toBase64(params)
    const request = this.buildRequest('PlayerArenaFight', params_)

    fetch(request, {
      method: 'GET',
    })
      .then((response) => {
        console.log('PlayerArenaFight Response status ', response.status)
        return response.text()
      })
      .then((data) => {
        console.log('PlayerArenaFight Response:', data)
      })
      .catch((error) => {
        console.error('PlayerArenaFight Request error:', error)
      })
  }

  async get_player(rank) {
    /* Example:
    request: https://s23.sfgame.eu/cmd.php?req=PlayerGetHallOfFame&params=MTAwMDAvLzAvMA==&sid=0-Gn0vHk9Hizg0w2

    response: Ranklistplayer.r:10000,Tinswele,Deus Vult,47,2988,12;
    */

    const params = `${rank}//0/0`
    const params_ = toBase64(params)
    const request = this.buildRequest('PlayerGetHallOfFame', params_)

    try {
      const response = await fetch(request, { method: 'GET' })
      const data = await response.text()
      const playerInfo = data.replace('Ranklistplayer.r:', '')
      const parts = playerInfo.split(',') // [0] rank, [1] name, ...
      const playerName = parts[1]
      if (playerName) {
        // console.log('Found player to look at: ' + playerName)
        return playerName
      } else {
        console.warn('No player found')
        return ''
      }
    } catch (error) {
      console.error('Player Look At Request:', error)
      return ''
    }
  }

  async get_random_player() {
    const rank = random_between(config.minRank, config.maxRank)

    const player = await this.get_player(rank)
    return player
  }

  async search_player() {
    /* Example:
    request: https://s23.sfgame.eu/cmd.php?req=PlayerLookAt&params=WmllbG9ueSBTemFtcGFu&sid=0-xTimY60dMH96xh

    response: 
    
    otherplayergroupname.r:Juice&otherplayer.playerlookat:4537/0/67/619577/779390/4599/6383/0/2/106/101/6/99
    /5/2/3/0/0/5/35520514/3/411/480/431/471/471/236/1983/0/253/50/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
    0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
    0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/4/5/390/0/10782/0/0/
    1759529227/0/1355/72/212/128112/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/16/12/11/1763148733/1763725042/1763218924
    /25/25/25/25/0/0/0/0/10/9/1/1/1/0/1/9/7/4/5/9/0/0/0/0/0/0/0/0/393/126/65563/2/0/1762834893/1762859887/1762855315/0/0
    /0/347/113/375/125/0/0/0/0/147/1054/45/45/45/0/0/0/0/0/0/9/0/0&otherplayersaveequipment:6/13/0/2010/0/356/0/2/0/0/99
    /0/0/16521/0/0/88/53/0/3/31/0/2010/0/337/0/2/0/0/115/0/0/29346/0/0/104/59/0/5/33/0/2009/0/246/0/2/0/0/99/0/0/36348/0
    /0/77/51/0/4/31/0/2008/0/257/0/2/0/0/92/0/0/61087/0/0/74/52/0/8/30/0/15/0/0/0/2/0/0/108/0/0/18766/0/0/107/58/0/7/11
    /0/2009/0/159/0/5/2/0/50/40/0/18868/0/0/42/47/0/9/33/0/3/0/0/0/2/0/0/103/0/0/15678/0/0/88/55/0/10/11/0/37/0/0/0/2/0
    /0/116/0/0/24277/0/0/105/61/0/1/21/0/2008/0/72/212/2/0/0/192/0/0/19215/0/0/101/56/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
    /0/0/0&otherdescription.s:&otherplayername.r:Zielony Szampan&otherplayerunitlevel(4):76/45/45/45/&otherplayerfriendstatus:
    0&otherplayerfortressrank:5178&otherplayerpetbonus.petbonus:4537/0/0/0/0/0&soldieradvice:1005&deedsandtitlesplayersave:
    4537/25/4936/5/0/0/0/0/0/1/37/0/40/0/43/0/0/0/0/0/0/0
    */

    const player = await this.get_random_player()

    if (!player) {
      console.warn('Failed to search a player, skipping')
      return
    }

    // console.log('Looking at player: ' + player)

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
          console.warn('No player equipment data found in response')
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
    /* Example
    request: https://s23.sfgame.eu/cmd.php?req=PlayerPollScrapbook&params=&sid=0-xTimY60dMH96xh
    
    response: 

    scrapbook.r:v_53-3GdZcav9z8_E7v7trxVFyhEgAAA_gAAAAAAAAAAAAAAAAAA_8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP____________8MAIEAAAAAAAAAAAAAAAAAPgICAAA________6__hSAAAAAAAAAAAAAD4CAgAAP___4pg
    AAAAAD4CAgAABCFk9P___7f7____r_____-_5wAAAAAAAAAAAAAAAAAAAAAAAAPgICAAAKXv7_3_9wAAAAAAADYCAAAAJ__7____8AAAAAAAA-AgIA
    ABX3______AAAAAAAAPgICAAAbz______wAAAAAAAD4CAAAAMf______8AAAAAAAA-AgIAADLv_____7AAAAAAAAPgICAAAFT______wAAAAAAADoC
    AAAAGf______8AAAAAAAA-AgIAAD_______9AAAAAAAAPgIAAAA39______wAAAAAAAD4CAgAAP5_____38AAAAAAAA-AgAAACP______7AAAAAAAA
    PgICAAAop______wAAAAAAADwCAAAAL_______8AAAAAAAA-AgAAABv_______AAAAAAAAPgICAAAFvv_____QAAAAAAAC4CAgAANj_____-8AAAAA
    AAA-AgIAADXr_____9AAAAAAAAPgICAAAAA==&legendaries.r:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    */

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
          console.warn('No scrapbook data found in response')
        }
      })
      .catch((error) => {
        console.error('Fill Scrapbook Request error:', error)
      })
  }
}
