export function Contains(main, sub) {
  return main.includes(sub)
}

export function ToPlain(base64) {
  return new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)))
}

export function ToBase64(plain) {
  return btoa(new TextEncoder().encode(plain).reduce((data, byte) => data + String.fromCharCode(byte), ''))
}

export function RandomBetween(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  if (min > max) {
    throw new Error('min must be <= max')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
