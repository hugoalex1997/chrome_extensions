export function contains(main, sub) {
  return main.includes(sub)
}

export function toPlain(base64) {
  // return atob(base64)
  return new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)))
}

export function toBase64(plain) {
  // return btoa(plain)
  return btoa(new TextEncoder().encode(plain).reduce((data, byte) => data + String.fromCharCode(byte), ''))
}

export function random_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
