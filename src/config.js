module.exports = {
  port: process.env.PORT || 8765,
  browser: {
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    userDataDir: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-extensions',
      '--disable-popup-blocking'
    ]
  },
  timeout: 30000,
  maxConcurrentPages: 5
};
