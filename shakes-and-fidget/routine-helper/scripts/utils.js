
export function contains(main, sub) {
  return main.includes(sub)
}

export function toPlain(base64) {
  return atob(base64)
}

export function toBase64(plain) {
  return btoa(plain)
}