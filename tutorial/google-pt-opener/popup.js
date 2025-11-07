// Open www.google.pt when the popup is clicked
document.getElementById('openButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.google.pt' })
})
