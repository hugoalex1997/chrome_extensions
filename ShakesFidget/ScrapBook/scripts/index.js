!(function () {
  const basePath = './scripts';

  const scripts = [
    'ui-panel.js',          // UI module (creates and updates the floating panel)
    'fetch-interceptor.js', // Network interception and data parsing
    // 'fetch-request.js', // Network interception and data parsing
    'scrapbook.js',         // Your existing logic
    'playeritems.js',       // Your existing logic
  ];

  for (const file of scripts) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(`${basePath}/${file}`);
    document.body.appendChild(script);
  }
})();
