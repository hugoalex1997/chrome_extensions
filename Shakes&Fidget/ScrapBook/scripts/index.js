!(function () {
  const e = './scripts'
  let t = document.createElement('script')
  ;(t.src = chrome.runtime.getURL(`${e}/script.js`)),
    document.getElementsByTagName('body')[0].appendChild(t),
    (t = document.createElement('script')),
    (t.src = chrome.runtime.getURL(`${e}/scrapbook.js`)),
    document.getElementsByTagName('body')[0].appendChild(t),
    (t = document.createElement('script')),
    (t.src = chrome.runtime.getURL(`${e}/playeritems.js`)),
    document.getElementsByTagName('body')[0].appendChild(t)
})()
