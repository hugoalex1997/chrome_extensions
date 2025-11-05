function parseScrapbook(e) {
  let s = {}
  e = (e = e.split('&')[0]).replace(/-/g, '+').replace(/_/g, '/')
  let r = Uint8Array.from(atob(e), (e) => e.charCodeAt(0)),
    a = 1
  for (let e = 0; e < r.length; e++) {
    const t = r[e]
    for (let e = 7; e >= 0; e--) {
      const r = 1 == ((t >> e) & 1),
        i = parseScrapbookItem(a)
      i && (s[i] = r), ++a
    }
  }
  return s
}
function parseScrapbookItem(e) {
  let s = null
  if (e >= 801 && e <= 905) {
    s = `${'items\\08-necklaces\\'}${Method_3(105, e, 905, 0, 8, CharacterClass.None)}`
  } else if (e >= 1011 && e <= 1028) {
    s = `${'items\\08-necklaces\\epic\\'}${Method_5(18, e, 1028, 50, 64, 8, CharacterClass.None)}`
  } else if (e >= 1051 && e <= 1130) {
    s = `${'items\\09-rings\\'}${Method_3(80, e, 1130, 0, 9, CharacterClass.None)}`
  } else if (e >= 1211 && e <= 1228) {
    s = `${'items\\09-rings\\epic\\'}${Method_5(18, e, 1228, 50, 67, 9, CharacterClass.None)}`
  } else if (e >= 1251 && e <= 1287) {
    s = `${'items\\10-talismans\\'}${Method_4(37, e, 1287, 0, 10)}`
  } else if (e >= 1325 && e <= 1342) {
    s = `${'items\\10-talismans\\'}${Method_5(18, e, 1342, 50, 50, 10, CharacterClass.None)}`
  } else if (e >= 1365 && e <= 1514) {
    s = `${'items\\01-weapons\\warrior\\'}${Method_3(150, e, 1514, 0, 1, CharacterClass.Warrior)}`
  } else if (e >= 1665 && e <= 1682) {
    s = `${'items\\01-weapons\\warrior\\epic\\'}${Method_5(14, e, 1678, 50, -1, 1, CharacterClass.Warrior)}`
  } else if (e >= 1705 && e <= 1754) {
    s = `${'items\\02-shields\\warrior\\'}${Method_3(50, e, 1754, 0, 2, CharacterClass.Warrior)}`
  } else if (e >= 1805 && e <= 1822) {
    s = `${'items\\02-shields\\warrior\\'}${Method_5(18, e, 1822, 50, -1, 2, CharacterClass.Warrior)}`
  } else if (e >= 1845 && e <= 1894) {
    s = `${'items\\03-armor\\warrior\\'}${Method_3(50, e, 1894, 0, 3, CharacterClass.Warrior)}`
  } else if ((e >= 1945 && e <= 1953) || (e >= 1956 && e <= 1962)) {
    s = `${'items\\03-armor\\warrior\\epic\\'}${Method_5(18, e, 1962, 50, -1, 3, CharacterClass.Warrior)}`
  } else if (e >= 1985 && e <= 2034) {
    s = `${'items\\04-shoes\\warrior\\'}${Method_3(50, e, 2034, 0, 4, CharacterClass.Warrior)}`
  } else if ((e >= 2085 && e <= 2093) || (e >= 2096 && e <= 2102)) {
    s = `${'items\\04-shoes\\warrior\\'}${Method_5(18, e, 2102, 50, -1, 4, CharacterClass.Warrior)}`
  } else if (e >= 2125 && e <= 2174) {
    s = `${'items\\05-gloves\\warrior\\'}${Method_3(50, e, 2174, 0, 5, CharacterClass.Warrior)}`
  } else if ((e >= 2225 && e <= 2233) || (e >= 2236 && e <= 2242)) {
    s = `${'items\\05-gloves\\warrior\\'}${Method_5(18, e, 2242, 50, -1, 5, CharacterClass.Warrior)}`
  } else if (e >= 2265 && e <= 2314) {
    s = `${'items\\06-helmets\\warrior\\'}${Method_3(50, e, 2314, 0, 6, CharacterClass.Warrior)}`
  } else if ((e >= 2365 && e <= 2373) || (e >= 2376 && e <= 2382)) {
    s = `${'items\\06-helmets\\warrior\\'}${Method_5(18, e, 2382, 50, -1, 6, CharacterClass.Warrior)}`
  } else if (e >= 2405 && e <= 2454) {
    s = `${'items\\07-belts\\warrior\\'}${Method_3(50, e, 2454, 0, 7, CharacterClass.Warrior)}`
  } else if ((e >= 2505 && e <= 2513) || (e >= 2516 && e <= 2522)) {
    s = `${'items\\07-belts\\warrior\\epic\\'}${Method_5(18, e, 2522, 50, -1, 7, CharacterClass.Warrior)}`
  } else if (e >= 2545 && e <= 2594) {
    s = `${'items\\01-weapons\\mage\\'}${Method_3(50, e, 2594, 0, 1, CharacterClass.Mage)}`
  } else if (e >= 2645 && e <= 2662) {
    s = `${'items\\01-weapons\\mage\\'}${Method_5(18, e, 2662, 50, -1, 1, CharacterClass.Mage)}`
  } else if (e >= 2685 && e <= 2734) {
    s = `${'items\\03-armor\\mage\\'}${Method_3(50, e, 2734, 0, 3, CharacterClass.Mage)}`
  } else if ((e >= 2785 && e <= 2793) || (e >= 2796 && e <= 2802)) {
    s = `${'items\\03-armor\\mage\\epic\\'}${Method_5(18, e, 2802, 50, -1, 3, CharacterClass.Mage)}`
  } else if (e >= 2825 && e <= 2874) {
    s = `${'items\\04-shoes\\mage\\'}${Method_3(50, e, 2874, 0, 4, CharacterClass.Mage)}`
  } else if ((e >= 2925 && e <= 2933) || (e >= 2936 && e <= 2942)) {
    s = `${'items\\04-shoes\\mage\\'}${Method_5(18, e, 2942, 50, -1, 4, CharacterClass.Mage)}`
  } else if (e >= 2965 && e <= 3014) {
    s = `${'items\\05-gloves\\mage\\'}${Method_3(50, e, 3014, 0, 5, CharacterClass.Mage)}`
  } else if ((e >= 3065 && e <= 3073) || (e >= 3076 && e <= 3082)) {
    s = `${'items\\05-gloves\\mage\\'}${Method_5(18, e, 3082, 50, -1, 5, CharacterClass.Mage)}`
  } else if (e >= 3105 && e <= 3154) {
    s = `${'items\\06-helmets\\mage\\'}${Method_3(50, e, 3154, 0, 6, CharacterClass.Mage)}`
  } else if ((e >= 3205 && e <= 3213) || (e >= 3216 && e <= 3222)) {
    s = `${'items\\06-helmets\\mage\\'}${Method_5(18, e, 3222, 50, -1, 6, CharacterClass.Mage)}`
  } else if (e >= 3245 && e <= 3294) {
    s = `${'items\\07-belts\\mage\\'}${Method_3(50, e, 3294, 0, 7, CharacterClass.Mage)}`
  } else if ((e >= 3345 && e <= 3353) || (e >= 3356 && e <= 3362)) {
    s = `${'items\\07-belts\\mage\\epic\\'}${Method_5(18, e, 3362, 50, -1, 7, CharacterClass.Mage)}`
  } else if (e >= 3385 && e <= 3434) {
    s = `${'items\\01-weapons\\scout\\'}${Method_3(50, e, 3434, 0, 1, CharacterClass.Hunter)}`
  } else if (e >= 3485 && e <= 3502) {
    s = `${'items\\01-weapons\\scout\\'}${Method_5(18, e, 3502, 50, -1, 1, CharacterClass.Hunter)}`
  } else if (e >= 3525 && e <= 3574) {
    s = `${'items\\03-armor\\scout\\'}${Method_3(50, e, 3574, 0, 3, CharacterClass.Hunter)}`
  } else if ((e >= 3625 && e <= 3633) || (e >= 3636 && e <= 3642)) {
    s = `${'items\\03-armor\\scout\\epic\\'}${Method_5(18, e, 3642, 50, -1, 3, CharacterClass.Hunter)}`
  } else if (e >= 3665 && e <= 3714) {
    s = `${'items\\04-shoes\\scout\\'}${Method_3(50, e, 3714, 0, 4, CharacterClass.Hunter)}`
  } else if ((e >= 3765 && e <= 3773) || (e >= 3776 && e <= 3782)) {
    s = `${'items\\04-shoes\\scout\\'}${Method_5(18, e, 3782, 50, -1, 4, CharacterClass.Hunter)}`
  } else if (e >= 3805 && e <= 3854) {
    s = `${'items\\05-gloves\\scout\\'}${Method_3(50, e, 3854, 0, 5, CharacterClass.Hunter)}`
  } else if ((e >= 3905 && e <= 3913) || (e >= 3916 && e <= 3922)) {
    s = `${'items\\05-gloves\\scout\\'}${Method_5(18, e, 3922, 50, -1, 5, CharacterClass.Hunter)}`
  } else if (e >= 3945 && e <= 3994) {
    s = `${'items\\06-helmets\\scout\\'}${Method_3(50, e, 3994, 0, 6, CharacterClass.Hunter)}`
  } else if ((e >= 4045 && e <= 4053) || (e >= 4056 && e <= 4062)) {
    s = `${'items\\06-helmets\\scout\\'}${Method_5(18, e, 4062, 50, -1, 6, CharacterClass.Hunter)}`
  } else if (e >= 4085 && e <= 4134) {
    s = `${'items\\07-belts\\scout\\'}${Method_3(50, e, 4134, 0, 7, CharacterClass.Hunter)}`
  } else if ((e >= 4185 && e <= 4193) || (e >= 4196 && e <= 4202)) {
    s = `${'items\\07-belts\\scout\\epic\\'}${Method_5(18, e, 4202, 50, -1, 7, CharacterClass.Hunter)}`
  }
  return s
}
function Method_3(e, s, r, a, t, i) {
  let o,
    l = e - (r - s)
  for (o = l < 10 ? l : l % 10; l % 5 != 0; ) l++
  l /= 5
  let h = `itm${t}_${l + a}_`
  switch ((0 == o && (h += '5'), o >= 1 && o <= 5 && (h += `${o}`), o >= 6 && o <= 9 && (h += '' + (o - 5)), i)) {
    case CharacterClass.Warrior:
    case CharacterClass.None:
      return h + '_1'
    case CharacterClass.Mage:
      return h + '_2'
    case CharacterClass.Hunter:
      return h + '_3'
  }
  throw 'sum tin wong'
}
function Method_4(e, s, r, a, t) {
  return `itm${t}_${e - (r - s) + a}_1`
}
function Method_5(e, s, r, a, t, i, o) {
  let l = e - (r - s)
  if (l + a - 1 < t || t < 1) {
    let e = `itm${i}_${l + a - 1}_1_`
    switch (o) {
      case CharacterClass.Warrior:
      case CharacterClass.None:
        return e + '1'
      case CharacterClass.Mage:
        return e + '2'
      case CharacterClass.Hunter:
        return e + '3'
    }
    throw 'kekster'
  }
  return `itm${i}_${l + a - 1}_1`
}
const CharacterClass = { Warrior: 1, Mage: 2, Hunter: 3, Assassin: 4, Battlemage: 5, Berserk: 6, None: 0 }
