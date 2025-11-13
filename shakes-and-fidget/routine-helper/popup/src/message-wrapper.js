export class MessageWrapper {
  constructor() {
    this.defaultTimeoutMs = 100
  }

  async SendRequestAsync(message, timeoutMs) {
    if (!message) {
      throw new Error('MessageWrapper :: message is not valid')
      return
    }

    if (!timeoutMs) {
      timeoutMs = this.defaultTimeoutMs
    }

    return new Promise((resolve, reject) => {
      let finished = false

      const timer = setTimeout(() => {
        if (finished) {
          return
        }
        finished = true
        reject(new Error(`MessageWrapper :: promise for ${message.type} :: timeout`))
      }, timeoutMs)

      chrome.runtime.sendMessage(message, (response) => {
        if (finished) {
          return
        }

        finished = true
        clearTimeout(timer)
        if (chrome.runtime.lastError) {
          const error = chrome.runtime.lastError.message || 'unknown runtime error'
          return reject(new Error(`MessageWrapper :: promise for ${message.type} :: ${error}`))
        }
        resolve(response)
      })
    })
  }

  SendRequest(message) {
    chrome.runtime.sendMessage(message)
  }
}
