export class PlayerEquipmentInspector {
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

  Reset() {
    this.max_unowned = 0
    this.player = ''
  }

  GetPlayer() {
    return this.player
  }

  UpdateUnownedItems(scrapbook, player, equipment) {
    const items = this.lookAt(equipment)

    let unowned = 0
    for (const item of items) {
      const variant = `${item}_1`

      if (item in scrapbook && !scrapbook[item]) {
        unowned++
      } else if (variant in scrapbook && !scrapbook[variant]) {
        unowned++
      }
    }

    if (unowned > this.max_unowned) {
      console.info('PlayerEquipmentInspector :: New max found for player ' + player + ': ' + unowned)

      this.player = player
      this.max_unowned = unowned
    }
  }

  //===============================================================================================================//
  // NOTE(hgomes): All the code below was copied from a working plugin.
  // If you're planning to update or refactor this section, best of luck, improvements are welcome!
  //===============================================================================================================//

  /**
   * Parses the lookat string into item representations.
   * @param {string} lookatStr - The encoded lookat string, slash-separated values.
   * @returns {string[]} Array of item name strings.
   */
  lookAt(lookatStr) {
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
      m === PlayerEquipmentInspector.ItemType.Helmet ||
      m === PlayerEquipmentInspector.ItemType.Belt ||
      m === PlayerEquipmentInspector.ItemType.Gloves ||
      m === PlayerEquipmentInspector.ItemType.Shoes ||
      m === PlayerEquipmentInspector.ItemType.Shield ||
      m === PlayerEquipmentInspector.ItemType.Weapon ||
      m === PlayerEquipmentInspector.ItemType.Chest
        ? Math.floor((65535 & Number(e[t + 3])) / 1000)
        : undefined

    let s
    if (o <= 49 && m !== PlayerEquipmentInspector.ItemType.Talisman) {
      const numbers = e.slice(t + 5, t + 13).map(Number)
      const sum = numbers.reduce((acc, val) => acc + val, 0)
      s = Number.isFinite(sum) ? (sum % 5) + 1 : 1
    } else {
      s = 1
    }
    return PlayerEquipmentInspector.getItemName(m, n, o, s)
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
    const o = PlayerEquipmentInspector.ItemTypeNames
    const n = PlayerEquipmentInspector.ClassNames
    const l = t != null && t + 1 === 1 // True for warrior class
    // Epic item if s >= 50 for certain types
    const epic =
      s >= 50 &&
      (e === PlayerEquipmentInspector.ItemType.Necklace ||
        e === PlayerEquipmentInspector.ItemType.Ring ||
        e === PlayerEquipmentInspector.ItemType.Chest ||
        e === PlayerEquipmentInspector.ItemType.Belt ||
        (e === PlayerEquipmentInspector.ItemType.Weapon && l))
        ? '\\epic'
        : ''
    if (t != null) {
      const classId = t + 1
      return `items\\${o[e]}\\${n[classId]}${epic}\\itm${e}_${s}_${m}_${classId}`
    }
    return `items\\${o[e]}${epic}\\itm${e}_${s}_${m}`
  }
}
