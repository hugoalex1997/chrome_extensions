export class ScrapbookParser {
  static CharacterClass = {
    Warrior: 1,
    Mage: 2,
    Hunter: 3,
    Assassin: 4,
    Battlemage: 5,
    Berserk: 6,
    None: 0,
  }

  /**
   * Parse the encoded scrapbook string.
   * @param {string} encoded
   * @returns {Object} Mapping from item code to true/false
   */
  parse(encoded) {
    let result = {}
    let e = encoded.split('&')[0].replace(/-/g, '+').replace(/_/g, '/')
    let bytes = Uint8Array.from(atob(e), (c) => c.charCodeAt(0))
    let a = 1
    for (let i = 0; i < bytes.length; i++) {
      const t = bytes[i]
      for (let bit = 7; bit >= 0; bit--) {
        const hasItem = ((t >> bit) & 1) === 1
        const code = this.parseScrapbookItem(a)
        if (code) result[code] = hasItem
        ++a
      }
    }
    return result
  }

  /**
   * Map scrapbook index to item code string.
   * @param {number} e Scrapbook index
   * @returns {string|null}
   */
  parseScrapbookItem(e) {
    const CC = ScrapbookParser.CharacterClass
    if (e >= 801 && e <= 905) {
      return `items\\08-necklaces\\${this.Method_3(105, e, 905, 0, 8, CC.None)}`
    } else if (e >= 1011 && e <= 1028) {
      return `items\\08-necklaces\\epic\\${this.Method_5(18, e, 1028, 50, 64, 8, CC.None)}`
    } else if (e >= 1051 && e <= 1130) {
      return `items\\09-rings\\${this.Method_3(80, e, 1130, 0, 9, CC.None)}`
    } else if (e >= 1211 && e <= 1228) {
      return `items\\09-rings\\epic\\${this.Method_5(18, e, 1228, 50, 67, 9, CC.None)}`
    } else if (e >= 1251 && e <= 1287) {
      return `items\\10-talismans\\${this.Method_4(37, e, 1287, 0, 10)}`
    } else if (e >= 1325 && e <= 1342) {
      return `items\\10-talismans\\${this.Method_5(18, e, 1342, 50, 50, 10, CC.None)}`
    } else if (e >= 1365 && e <= 1514) {
      return `items\\01-weapons\\warrior\\${this.Method_3(150, e, 1514, 0, 1, CC.Warrior)}`
    } else if (e >= 1665 && e <= 1682) {
      return `items\\01-weapons\\warrior\\epic\\${this.Method_5(14, e, 1678, 50, -1, 1, CC.Warrior)}`
    } else if (e >= 1705 && e <= 1754) {
      return `items\\02-shields\\warrior\\${this.Method_3(50, e, 1754, 0, 2, CC.Warrior)}`
    } else if (e >= 1805 && e <= 1822) {
      return `items\\02-shields\\warrior\\${this.Method_5(18, e, 1822, 50, -1, 2, CC.Warrior)}`
    } else if (e >= 1845 && e <= 1894) {
      return `items\\03-armor\\warrior\\${this.Method_3(50, e, 1894, 0, 3, CC.Warrior)}`
    } else if ((e >= 1945 && e <= 1953) || (e >= 1956 && e <= 1962)) {
      return `items\\03-armor\\warrior\\epic\\${this.Method_5(18, e, 1962, 50, -1, 3, CC.Warrior)}`
    } else if (e >= 1985 && e <= 2034) {
      return `items\\04-shoes\\warrior\\${this.Method_3(50, e, 2034, 0, 4, CC.Warrior)}`
    } else if ((e >= 2085 && e <= 2093) || (e >= 2096 && e <= 2102)) {
      return `items\\04-shoes\\warrior\\${this.Method_5(18, e, 2102, 50, -1, 4, CC.Warrior)}`
    } else if (e >= 2125 && e <= 2174) {
      return `items\\05-gloves\\warrior\\${this.Method_3(50, e, 2174, 0, 5, CC.Warrior)}`
    } else if ((e >= 2225 && e <= 2233) || (e >= 2236 && e <= 2242)) {
      return `items\\05-gloves\\warrior\\${this.Method_5(18, e, 2242, 50, -1, 5, CC.Warrior)}`
    } else if (e >= 2265 && e <= 2314) {
      return `items\\06-helmets\\warrior\\${this.Method_3(50, e, 2314, 0, 6, CC.Warrior)}`
    } else if ((e >= 2365 && e <= 2373) || (e >= 2376 && e <= 2382)) {
      return `items\\06-helmets\\warrior\\${this.Method_5(18, e, 2382, 50, -1, 6, CC.Warrior)}`
    } else if (e >= 2405 && e <= 2454) {
      return `items\\07-belts\\warrior\\${this.Method_3(50, e, 2454, 0, 7, CC.Warrior)}`
    } else if ((e >= 2505 && e <= 2513) || (e >= 2516 && e <= 2522)) {
      return `items\\07-belts\\warrior\\epic\\${this.Method_5(18, e, 2522, 50, -1, 7, CC.Warrior)}`
    } else if (e >= 2545 && e <= 2594) {
      return `items\\01-weapons\\mage\\${this.Method_3(50, e, 2594, 0, 1, CC.Mage)}`
    } else if (e >= 2645 && e <= 2662) {
      return `items\\01-weapons\\mage\\${this.Method_5(18, e, 2662, 50, -1, 1, CC.Mage)}`
    } else if (e >= 2685 && e <= 2734) {
      return `items\\03-armor\\mage\\${this.Method_3(50, e, 2734, 0, 3, CC.Mage)}`
    } else if ((e >= 2785 && e <= 2793) || (e >= 2796 && e <= 2802)) {
      return `items\\03-armor\\mage\\epic\\${this.Method_5(18, e, 2802, 50, -1, 3, CC.Mage)}`
    } else if (e >= 2825 && e <= 2874) {
      return `items\\04-shoes\\mage\\${this.Method_3(50, e, 2874, 0, 4, CC.Mage)}`
    } else if ((e >= 2925 && e <= 2933) || (e >= 2936 && e <= 2942)) {
      return `items\\04-shoes\\mage\\${this.Method_5(18, e, 2942, 50, -1, 4, CC.Mage)}`
    } else if (e >= 2965 && e <= 3014) {
      return `items\\05-gloves\\mage\\${this.Method_3(50, e, 3014, 0, 5, CC.Mage)}`
    } else if ((e >= 3065 && e <= 3073) || (e >= 3076 && e <= 3082)) {
      return `items\\05-gloves\\mage\\${this.Method_5(18, e, 3082, 50, -1, 5, CC.Mage)}`
    } else if (e >= 3105 && e <= 3154) {
      return `items\\06-helmets\\mage\\${this.Method_3(50, e, 3154, 0, 6, CC.Mage)}`
    } else if ((e >= 3205 && e <= 3213) || (e >= 3216 && e <= 3222)) {
      return `items\\06-helmets\\mage\\${this.Method_5(18, e, 3222, 50, -1, 6, CC.Mage)}`
    } else if (e >= 3245 && e <= 3294) {
      return `items\\07-belts\\mage\\${this.Method_3(50, e, 3294, 0, 7, CC.Mage)}`
    } else if ((e >= 3345 && e <= 3353) || (e >= 3356 && e <= 3362)) {
      return `items\\07-belts\\mage\\epic\\${this.Method_5(18, e, 3362, 50, -1, 7, CC.Mage)}`
    } else if (e >= 3385 && e <= 3434) {
      return `items\\01-weapons\\scout\\${this.Method_3(50, e, 3434, 0, 1, CC.Hunter)}`
    } else if (e >= 3485 && e <= 3502) {
      return `items\\01-weapons\\scout\\${this.Method_5(18, e, 3502, 50, -1, 1, CC.Hunter)}`
    } else if (e >= 3525 && e <= 3574) {
      return `items\\03-armor\\scout\\${this.Method_3(50, e, 3574, 0, 3, CC.Hunter)}`
    } else if ((e >= 3625 && e <= 3633) || (e >= 3636 && e <= 3642)) {
      return `items\\03-armor\\scout\\epic\\${this.Method_5(18, e, 3642, 50, -1, 3, CC.Hunter)}`
    } else if (e >= 3665 && e <= 3714) {
      return `items\\04-shoes\\scout\\${this.Method_3(50, e, 3714, 0, 4, CC.Hunter)}`
    } else if ((e >= 3765 && e <= 3773) || (e >= 3776 && e <= 3782)) {
      return `items\\04-shoes\\scout\\${this.Method_5(18, e, 3782, 50, -1, 4, CC.Hunter)}`
    } else if (e >= 3805 && e <= 3854) {
      return `items\\05-gloves\\scout\\${this.Method_3(50, e, 3854, 0, 5, CC.Hunter)}`
    } else if ((e >= 3905 && e <= 3913) || (e >= 3916 && e <= 3922)) {
      return `items\\05-gloves\\scout\\${this.Method_5(18, e, 3922, 50, -1, 5, CC.Hunter)}`
    } else if (e >= 3945 && e <= 3994) {
      return `items\\06-helmets\\scout\\${this.Method_3(50, e, 3994, 0, 6, CC.Hunter)}`
    } else if ((e >= 4045 && e <= 4053) || (e >= 4056 && e <= 4062)) {
      return `items\\06-helmets\\scout\\${this.Method_5(18, e, 4062, 50, -1, 6, CC.Hunter)}`
    } else if (e >= 4085 && e <= 4134) {
      return `items\\07-belts\\scout\\${this.Method_3(50, e, 4134, 0, 7, CC.Hunter)}`
    } else if ((e >= 4185 && e <= 4193) || (e >= 4196 && e <= 4202)) {
      return `items\\07-belts\\scout\\epic\\${this.Method_5(18, e, 4202, 50, -1, 7, CC.Hunter)}`
    }
    return null
  }

  Method_3(e, s, r, a, t, i) {
    let o,
      l = e - (r - s)
    for (o = l < 10 ? l : l % 10; l % 5 != 0; ) l++
    l /= 5
    let h = `itm${t}_${l + a}_`
    if (o == 0) h += '5'
    if (o >= 1 && o <= 5) h += `${o}`
    if (o >= 6 && o <= 9) h += '' + (o - 5)
    switch (i) {
      case ScrapbookParser.CharacterClass.Warrior:
      case ScrapbookParser.CharacterClass.None:
        return h + '_1'
      case ScrapbookParser.CharacterClass.Mage:
        return h + '_2'
      case ScrapbookParser.CharacterClass.Hunter:
        return h + '_3'
    }
    throw 'sum tin wong'
  }

  Method_4(e, s, r, a, t) {
    return `itm${t}_${e - (r - s) + a}_1`
  }

  Method_5(e, s, r, a, t, i, o) {
    let l = e - (r - s)
    if (l + a - 1 < t || t < 1) {
      let code = `itm${i}_${l + a - 1}_1_`
      switch (o) {
        case ScrapbookParser.CharacterClass.Warrior:
        case ScrapbookParser.CharacterClass.None:
          return code + '1'
        case ScrapbookParser.CharacterClass.Mage:
          return code + '2'
        case ScrapbookParser.CharacterClass.Hunter:
          return code + '3'
      }
      throw 'kekster'
    }
    return `itm${i}_${l + a - 1}_1`
  }
}
