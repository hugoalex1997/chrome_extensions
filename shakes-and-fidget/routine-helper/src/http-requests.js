import { ScrapbookParser } from './scrapbook-parser.js'
import { ToBase64 } from './utils.js'

const StatusCode = {
  Success: 200,
}

class HttpRequestsHandler {
  /**
   * Sends a http requests and await for the response
   * @return Http Response on Success, empty object on Error
   */
  async SendRequestAsync(url, method) {
    const response = await fetch(url, { method: method })

    let data = ''
    if (response.status == StatusCode.Success) {
      data = await response.text()
    }

    return {
      status: response.status,
      data: data,
    }
  }

  /**
   * Sends a http requests and ignore the response
   */
  SendRequest(url, method) {
    fetch(url, {
      method: method,
    })
  }
}

export class ShakesAndFidgetHttpRequests {
  constructor(config) {
    this.http = new HttpRequestsHandler()
    this.sessionId = ''

    const world = config.world
    const loc = config.localization
    this.baseRequest = `https://s${world}.sfgame.${loc}/cmd.php?`
  }

  buildRequest(name, params = null) {
    if (params) {
      return `${this.baseRequest}req=${name}&params=${params}&sid=${this.sessionId}`
    }
    return `${this.baseRequest}req=${name}&sid=${this.sessionId}`
  }

  SetSessionId(id) {
    if (this.sessionId == id) {
      return
    }

    console.info('ShakesAndFidgetHttpRequests :: Session ID updated to: ' + id)
    this.sessionId = id
  }

  /**
   * Sends a http request to attack a specific player
   * @return whether or not the attack was a success
   */
  async AttackPlayer(name) {
    /* Example:
    request: https://s23.sfgame.eu/cmd.php?req=PlayerArenaFight&params=TVJfS0FNWUsvMA==&sid=${a_valid_session_id}

    response: (not used)
    */

    if (!this.sessionId) {
      //console.log('ShakesAndFidgetHttpRequests :: AttackPlayer :: session id not set')
      return
    }

    const params = `${name}/0`
    const params_ = ToBase64(params)
    const url = this.buildRequest('PlayerArenaFight', params_)

    const response = await this.http.SendRequestAsync(url, 'GET')

    if (response.status != StatusCode.Success) {
      console.warn('ShakesAndFidgetHttpRequests :: AttackPlayer request failed')
      return false
    }

    console.info('ShakesAndFidgetHttpRequests :: Attacked player: ' + name)
    return true
  }

  /**
   * Sends a http request to obtain a player name
   * @name rank player rank
   * @return player name on success, empty string on error
   */
  async GetPlayerName(rank) {
    /* Example:
     * request: https://s23.sfgame.eu/cmd.php?req=PlayerGetHallOfFame&params=MTAwMDAvLzAvMA==&sid=${a_valid_session_id}
     *
     * response: Ranklistplayer.r:10000,Tinswele,Deus Vult,47,2988,12;
     *
     * player name: Tinswele
     */

    if (!this.sessionId) {
      //console.log('ShakesAndFidgetHttpRequests :: GetPlayerName :: session id not set')
      return ''
    }

    const params = `${rank}//0/0`
    const params_ = ToBase64(params)
    const url = this.buildRequest('PlayerGetHallOfFame', params_)

    const response = await this.http.SendRequestAsync(url, 'GET')

    if (response.status != StatusCode.Success) {
      console.warn('ShakesAndFidgetHttpRequests :: GetPlayer request failed')
      return ''
    }

    // [0] rank, [1] name, [2] clan, [3] Level, [4] Honor [5] I have no idea!
    const player = response.data.replace('Ranklistplayer.r:', '')
    const name = player.split(',')[1]

    //console.log('ShakesAndFidgetHttpRequests :: Obtained player: ' + name + ' at rank ' + rank)
    return name
  }

  /**
   * Sends a http request to obtain player information
   * @name name player name
   * @return equipment information on success, empty string on error
   */
  async GetPlayerInformation(name) {
    /* Example:
     * request: https://s23.sfgame.eu/cmd.php?req=PlayerLookAt&params=WmllbG9ueSBTemFtcGFu&sid=0-xTimY60dMH96xh
     *
     * response:
     *
     * otherplayergroupname.r:Juice&otherplayer.playerlookat:4537/0/67/619577/779390/4599/6383/0/2/106/101/6/99
     * /5/2/3/0/0/5/35520514/3/411/480/431/471/471/236/1983/0/253/50/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
     * 0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/
     * 0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/4/5/390/0/10782/0/0/
     * 1759529227/0/1355/72/212/128112/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/16/12/11/1763148733/1763725042/1763218924
     * /25/25/25/25/0/0/0/0/10/9/1/1/1/0/1/9/7/4/5/9/0/0/0/0/0/0/0/0/393/126/65563/2/0/1762834893/1762859887/1762855315/0/0
     * /0/347/113/375/125/0/0/0/0/147/1054/45/45/45/0/0/0/0/0/0/9/0/0&otherplayersaveequipment:6/13/0/2010/0/356/0/2/0/0/99
     * /0/0/16521/0/0/88/53/0/3/31/0/2010/0/337/0/2/0/0/115/0/0/29346/0/0/104/59/0/5/33/0/2009/0/246/0/2/0/0/99/0/0/36348/0
     * /0/77/51/0/4/31/0/2008/0/257/0/2/0/0/92/0/0/61087/0/0/74/52/0/8/30/0/15/0/0/0/2/0/0/108/0/0/18766/0/0/107/58/0/7/11
     * /0/2009/0/159/0/5/2/0/50/40/0/18868/0/0/42/47/0/9/33/0/3/0/0/0/2/0/0/103/0/0/15678/0/0/88/55/0/10/11/0/37/0/0/0/2/0
     * /0/116/0/0/24277/0/0/105/61/0/1/21/0/2008/0/72/212/2/0/0/192/0/0/19215/0/0/101/56/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0
     * /0/0/0&otherdescription.s:&otherplayername.r:Zielony Szampan&otherplayerunitlevel(4):76/45/45/45/&otherplayerfriendstatus:
     * 0&otherplayerfortressrank:5178&otherplayerpetbonus.petbonus:4537/0/0/0/0/0&soldieradvice:1005&deedsandtitlesplayersave:
     * 4537/25/4936/5/0/0/0/0/0/1/37/0/40/0/43/0/0/0/0/0/0/0
     */

    if (!this.sessionId) {
      //console.log('ShakesAndFidgetHttpRequests :: GetPlayerInformation :: session id not set')
      return
    }

    const name_ = ToBase64(name)
    const url = this.buildRequest('PlayerLookAt', name_)
    const response = await this.http.SendRequestAsync(url, 'GET')

    if (response.status != StatusCode.Success) {
      console.warn('ShakesAndFidgetHttpRequests :: GetPlayerInformation :: request failed')
      return ''
    }

    const equipment = response.data.match(/otherplayersaveequipment:([^&]*)/)

    if (!equipment) {
      console.warn('ShakesAndFidgetHttpRequests :: GetPlayerInformation :: failed to get equipment')
      return ''
    }

    //console.log('ShakesAndFidgetHttpRequests :: Obtained equipments: ' + equipment[1])
    return equipment[1]
  }

  /**
   * Sends a http request to obtain scrapbook information
   * @return scrapbook information on success, empty string on error
   */
  async GetScrapBook() {
    /* Example
     * request: https://s23.sfgame.eu/cmd.php?req=PlayerPollScrapbook&params=&sid=${a_valid_session_id}
     *
     * response:
     *
     * scrapbook.r:v_53-3GdZcav9z8_E7v7trxVFyhEgAAA_gAAAAAAAAAAAAAAAAAA_8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
     * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP____________8MAIEAAAAAAAAAAAAAAAAAPgICAAA________6__hSAAAAAAAAAAAAAD4CAgAAP___4pg
     * AAAAAD4CAgAABCFk9P___7f7____r_____-_5wAAAAAAAAAAAAAAAAAAAAAAAAPgICAAAKXv7_3_9wAAAAAAADYCAAAAJ__7____8AAAAAAAA-AgIA
     * ABX3______AAAAAAAAPgICAAAbz______wAAAAAAAD4CAAAAMf______8AAAAAAAA-AgIAADLv_____7AAAAAAAAPgICAAAFT______wAAAAAAADoC
     * AAAAGf______8AAAAAAAA-AgIAAD_______9AAAAAAAAPgIAAAA39______wAAAAAAAD4CAgAAP5_____38AAAAAAAA-AgAAACP______7AAAAAAAA
     * PgICAAAop______wAAAAAAADwCAAAAL_______8AAAAAAAA-AgAAABv_______AAAAAAAAPgICAAAFvv_____QAAAAAAAC4CAgAANj_____-8AAAAA
     * AAA-AgIAADXr_____9AAAAAAAAPgICAAAAA==&legendaries.r:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
     */

    if (!this.sessionId) {
      //console.log('ShakesAndFidgetHttpRequests :: GetScrapBook :: session id not set')
      return
    }

    const url = this.buildRequest('PlayerPollScrapbook')
    const response = await this.http.SendRequestAsync(url, 'GET')

    if (response.status != StatusCode.Success) {
      console.warn('ShakesAndFidgetHttpRequests :: GetScrapBook request failed')
      return ''
    }

    const scrapBookRawData = response.data.replace('scrapbook.r:', '')

    const parser = new ScrapbookParser()
    const scrapBook = parser.parse(scrapBookRawData)

    //console.log('ShakesAndFidgetHttpRequests :: Obtained ScrapBook: ', scrapBook)

    return scrapBook
  }
}
