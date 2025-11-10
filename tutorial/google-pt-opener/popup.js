// Open www.google.pt when the popup is clicked
document.getElementById('openButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.google.pt' }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error('Error opening tab:', chrome.runtime.lastError)
    }
  })
})
