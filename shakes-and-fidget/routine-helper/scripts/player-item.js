export class PlayerItem {
  static ItemType = {
    Weapon: 1,
    Shield: 2,
    Chest: 3,
    Shoes: 4,
    Gloves: 5,
    Helmet: 6,
    Belt: 7,
    Necklace: 8,
    Ring: 9,
    Talisman: 10,
  }

  static ItemTypeNames = {
    1: '01-weapons',
    2: '02-shields',
    3: '03-armor',
    4: '04-shoes',
    5: '05-gloves',
    6: '06-helmets',
    7: '07-belts',
    8: '08-necklaces',
    9: '09-rings',
    10: '10-talismans',
  }

  static ClassNames = {
    1: 'warrior',
    2: 'mage',
    3: 'scout',
  }

  constructor() {
    this.max_unowned = 0
    this.player = ''
  }

  reset() {
    this.max_unowned = 0
    this.player = ""
  }

  GetMaxUnownedItems() {
    return this.max_unowned
  }

  GetPlayerToAttack() {
    return this.player
  }

  SetUnownedItems(scrapbook, player, lookatStr) {
    // console.log('Analyzing player: ' + player)
    // console.log('Lookat string: ' + lookatStr)

    const items = this.LookAt(lookatStr)

    // console.log('Parsed items: ' + items.join(', '))
    let unowned = 0
    for (const item of items) {
      const variant = `${item}_1`

      if (item in scrapbook && !scrapbook[item]) {
        unowned++
      } else if (variant in scrapbook && !scrapbook[variant]) {
        unowned++
      }
    }

    // console.log('Unowned items for player ' + player + ': ' + unowned)

    if (unowned > this.max_unowned) {
      console.log('New max found for player ' + player + ': ' + unowned)

      this.player = player
      this.max_unowned = unowned
    }
  }

  /**
   * Parses the lookat string into item representations.
   * @param {string} lookatStr - The encoded lookat string, slash-separated values.
   * @returns {string[]} Array of item name strings.
   */
  LookAt(lookatStr) {
    const result = []
    const lookatArr = lookatStr.split('/')
    // Indices for each section
    ;[0, 19, 38, 57, 76, 95, 114, 133, 152, 171].forEach((startIdx) => {
      result.push(this.parseLookatSection(lookatArr, startIdx))
    })
    return result
  }

  /**
   * Parses a section starting at index t in array e.
   * @param {string[]} e
   * @param {number} t
   */
  parseLookatSection(e, t) {
    // Convert string to number just once for indices, improves accuracy
    let m = 255 & Number(e[t])
    let o = (65535 & Number(e[t + 3])) % 1000
    let n =
      m === PlayerItem.ItemType.Helmet ||
      m === PlayerItem.ItemType.Belt ||
      m === PlayerItem.ItemType.Gloves ||
      m === PlayerItem.ItemType.Shoes ||
      m === PlayerItem.ItemType.Shield ||
      m === PlayerItem.ItemType.Weapon ||
      m === PlayerItem.ItemType.Chest
        ? Math.floor((65535 & Number(e[t + 3])) / 1000)
        : undefined

    let s
    if (o <= 49 && m !== PlayerItem.ItemType.Talisman) {
      const numbers = e.slice(t + 5, t + 13).map(Number)
      const sum = numbers.reduce((acc, val) => acc + val, 0)
      s = Number.isFinite(sum) ? (sum % 5) + 1 : 1
    } else {
      s = 1
    }
    return PlayerItem.getItemName(m, n, o, s)
  }

  /**
   * Returns the item display name.
   * @param {number} e - item type id
   * @param {number|undefined} t - class id (zero-based, so class+1)
   * @param {number} s - some value (quality?)
   * @param {number} m - serial
   * @returns {string}
   */
  static getItemName(e, t, s, m) {
    const o = PlayerItem.ItemTypeNames
    const n = PlayerItem.ClassNames
    const l = t != null && t + 1 === 1 // True for warrior class
    // Epic item if s >= 50 for certain types
    const epic =
      s >= 50 &&
      (e === PlayerItem.ItemType.Necklace ||
        e === PlayerItem.ItemType.Ring ||
        e === PlayerItem.ItemType.Chest ||
        e === PlayerItem.ItemType.Belt ||
        (e === PlayerItem.ItemType.Weapon && l))
        ? '\\epic'
        : ''
    if (t != null) {
      const classId = t + 1
      return `items\\${o[e]}\\${n[classId]}${epic}\\itm${e}_${s}_${m}_${classId}`
    }
    return `items\\${o[e]}${epic}\\itm${e}_${s}_${m}`
  }
}
