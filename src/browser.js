/**
 * Browser Manager - Puppeteer 封装
 */

const puppeteer = require('puppeteer');
const config = require('./config');

let browser = null;
let pageCount = 0;

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
      browser = await puppeteer.connect({
        browserURL: config.existingChrome.browserWSEndpoint
      });
    } catch (err) {
      console.log('[Browser] Failed to connect, launching new browser');
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
