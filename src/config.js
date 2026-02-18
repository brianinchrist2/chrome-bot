module.exports = {
  port: process.env.PORT || 8765,
  browser: {
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
  // 连接已有Chrome设置
  existingChrome: {
    enabled: true,
    browserWSEndpoint: 'http://localhost:9222'
  },
  timeout: 30000,
  maxConcurrentPages: 5
};
