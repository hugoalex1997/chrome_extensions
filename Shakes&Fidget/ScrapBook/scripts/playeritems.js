const ItemType = {
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
function parseLookat(e) {
  let t = [],
    s = e.split('/')
  return (
    [0, 19, 38, 57, 76, 95, 114, 133, 152, 171].forEach((e) => {
      t.push(parseLookatSection(s, e))
    }),
    t
  )
}
function parseLookatSection(e, t) {
  let s,
    m = 255 & e[t],
    o = (65535 & e[t + 3]) % 1e3,
    n =
      m == ItemType.Helmet ||
      m == ItemType.Belt ||
      m == ItemType.Gloves ||
      m == ItemType.Shoes ||
      m == ItemType.Shield ||
      m == ItemType.Weapon ||
      m == ItemType.Chest
        ? Math.floor((65535 & e[t + 3]) / 1e3)
        : void 0
  if (o <= 49 && m !== ItemType.Talisman) {
    const m = e
      .slice(t + 5, t + 13)
      .map(Number)
      .reduce((e, t) => e + t, 0)
    s = Number.isFinite(m) ? (m % 5) + 1 : 1
  } else s = 1
  return getItemName(m, n, o, s)
}
function getItemName(e, t, s, m) {
  const o = {
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
    },
    n = { 1: 'warrior', 2: 'mage', 3: 'scout' },
    l = null != t && t + 1 == 1,
    i =
      s >= 50 &&
      (e == ItemType.Necklace ||
        e == ItemType.Ring ||
        e == ItemType.Chest ||
        e == ItemType.Belt ||
        (e == ItemType.Weapon && l))
        ? '\\epic'
        : ''
  if (null != t) {
    const l = t + 1
    return `${`items\\${o[e]}\\${n[l]}${i}\\`}itm${e}_${s}_${m}_${l}`
  }
  return `${`items\\${o[e]}${i}\\`}itm${e}_${s}_${m}`
}
