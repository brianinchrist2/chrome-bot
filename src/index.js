/**
 * ChromeBot - Express API Server
 * 
 * 运行: node src/index.js
 * 端口: 8765 (默认)
 */

const express = require('express');
const config = require('./config');
const browser = require('./browser');
const { executeAction, response } = require('./actions');

const app = express();
app.use(express.json());

// 当前页面实例
let currentPage = null;

/**
 * 健康检查
 */
app.get('/health', async (req, res) => {
  const status = browser.getStatus();
  res.json({
    status: 'ok',
    browser: status.connected ? 'connected' : 'disconnected',
    pages: status.pageCount
  });
});

/**
 * 初始化浏览器
 */
app.post('/launch', async (req, res) => {
  try {
    await browser.launchBrowser();
    currentPage = await browser.createPage();
    res.json(response('launch', { status: 'ok' }));
  } catch (error) {
    res.json(response('launch', {}, error));
  }
});

/**
 * 执行浏览器操作
 */
app.post('/execute', async (req, res) => {
  try {
    const { action, params = {} } = req.body;
    
    // 自动启动浏览器
    if (!currentPage || currentPage.isClosed()) {
      await browser.launchBrowser();
      currentPage = await browser.createPage();
    }
    
    const result = await executeAction(action, currentPage, params);
    res.json(result);
  } catch (error) {
    res.json(response(req.body.action, {}, error));
  }
});

/**
 * 关闭浏览器
 */
app.post('/close', async (req, res) => {
  try {
    if (currentPage) {
      await browser.closePage(currentPage);
      currentPage = null;
    }
    await browser.closeBrowser();
    res.json(response('close', { status: 'closed' }));
  } catch (error) {
    res.json(response('close', {}, error));
  }
});

/**
 * 启动服务器
 */
async function start() {
  try {
    await browser.launchBrowser();
    currentPage = await browser.createPage();
    
    app.listen(config.port, () => {
      console.log(`ChromeBot running on http://localhost:${config.port}`);
      console.log('Ready to receive commands from OpenClaw');
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

// 优雅退出
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await browser.closeBrowser();
  process.exit(0);
});

start();
