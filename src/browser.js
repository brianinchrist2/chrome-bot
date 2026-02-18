/**
 * Browser Manager - Puppeteer 封装
 */

const puppeteer = require('puppeteer');
const config = require('./config');
const http = require('http');

let browser = null;
let pageCount = 0;

/**
 * 获取第一个页面的 WebSocket 端点
 */
async function getFirstPageWSEndpoint() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const pages = JSON.parse(data);
          // 找到第一个 page 类型的页面
          const page = pages.find(p => p.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            resolve(page.webSocketDebuggerUrl);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * 启动浏览器
 */
async function launchBrowser() {
  if (browser && browser.connected) {
    return browser;
  }
  
  // 如果启用连接已有Chrome
  if (config.existingChrome && config.existingChrome.enabled) {
    console.log('[Browser] Connecting to existing Chrome...');
    try {
      // 获取第一个页面的 WebSocket 端点
      const wsEndpoint = await getFirstPageWSEndpoint();
      console.log('[Browser] WebSocket endpoint:', wsEndpoint);
      
      if (wsEndpoint) {
        browser = await puppeteer.connect({
          browserWSEndpoint: wsEndpoint,
          // 不使用默认 viewport，保持原有窗口大小
          defaultViewport: null
        });
        console.log('[Browser] Connected to existing Chrome');
      } else {
        throw new Error('No WebSocket endpoint found');
      }
    } catch (err) {
      console.log('[Browser] Failed to connect:', err.message);
      console.log('[Browser] Launching new browser instead');
      browser = await puppeteer.launch(config.browser);
    }
  } else {
    browser = await puppeteer.launch(config.browser);
  }
  
  browser.on('disconnected', () => {
    console.log('[Browser] Disconnected');
    browser = null;
  });
  
  console.log('[Browser] Launched');
  return browser;
}

/**
 * 获取浏览器实例
 */
function getBrowser() {
  return browser;
}

/**
 * 创建新页面
 */
async function createPage() {
  if (!browser || !browser.connected) {
    await launchBrowser();
  }
  
  if (pageCount >= config.maxConcurrentPages) {
    throw new Error('Too many concurrent pages');
  }
  
  const page = await browser.newPage();
  pageCount++;
  
  page.on('close', () => {
    pageCount--;
  });
  
  return page;
}

/**
 * 关闭页面
 */
async function closePage(page) {
  if (page && !page.isClosed()) {
    await page.close();
    pageCount--;
  }
}

/**
 * 关闭浏览器
 */
async function closeBrowser() {
  if (browser && browser.connected) {
    await browser.close();
    browser = null;
    pageCount = 0;
    console.log('[Browser] Closed');
  }
}

/**
 * 获取浏览器状态
 */
function getStatus() {
  return {
    connected: !!browser && browser.connected,
    pageCount
  };
}

module.exports = {
  launchBrowser,
  getBrowser,
  createPage,
  closePage,
  closeBrowser,
  getStatus
};
