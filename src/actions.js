/**
 * Action Handlers - 浏览器操作处理
 */

const browser = require('./browser');

/**
 * 统一响应格式
 */
function response(action, data = {}, error = null) {
  return {
    success: error === null,
    action,
    data,
    error: error ? error.message : null
  };
}

/**
 * 导航到 URL
 */
async function navigate(page, { url }) {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  return response('navigate', {
    url: page.url(),
    title: await page.title()
  });
}

/**
 * 获取页面 HTML
 */
async function getHtml(page) {
  const html = await page.content();
  return response('getHtml', { html });
}

/**
 * 获取页面标题
 */
async function getTitle(page) {
  const title = await page.title();
  return response('getTitle', { title });
}

/**
 * 获取当前 URL
 */
async function getUrl(page) {
  const url = page.url();
  return response('getUrl', { url });
}

/**
 * 截图
 */
async function screenshot(page, { fullPage = false } = {}) {
  const screenshot = await page.screenshot({ 
    encoding: 'base64',
    fullPage 
  });
  return response('screenshot', { image: screenshot });
}

/**
 * 点击元素
 */
async function click(page, { selector }) {
  await page.click(selector);
  return response('click', { selector });
}

/**
 * 输入文本
 */
async function type(page, { selector, text }) {
  await page.type(selector, text);
  return response('type', { selector, text });
}

/**
 * 滚动页面
 */
async function scroll(page, { pixels = 300 }) {
  await page.evaluate((px) => window.scrollBy(0, px), pixels);
  return response('scroll', { pixels });
}

/**
 * 执行 JavaScript
 */
async function evaluate(page, { script }) {
  const result = await page.evaluate(script);
  return response('evaluate', { result });
}

/**
 * 等待元素
 */
async function waitForSelector(page, { selector, timeout = 30000 }) {
  await page.waitForSelector(selector, { timeout });
  return response('waitForSelector', { selector });
}

/**
 * 获取元素文本
 */
async function getText(page, { selector }) {
  const text = await page.$eval(selector, el => el.textContent).catch(() => '');
  return response('getText', { text });
}

/**
 * 后退
 */
async function back(page) {
  await page.goBack();
  return response('back', { url: page.url() });
}

/**
 * 前进
 */
async function forward(page) {
  await page.goForward();
  return response('forward', { url: page.url() });
}

/**
 * 刷新
 */
async function refresh(page) {
  await page.reload();
  return response('refresh', { url: page.url() });
}

/**
 * 获取 Cookies
 */
async function getCookies(page) {
  const cookies = await page.cookies();
  return response('getCookies', { cookies });
}

/**
 * 操作映射
 */
const actions = {
  navigate,
  getHtml,
  getTitle,
  getUrl,
  screenshot,
  click,
  type,
  scroll,
  evaluate,
  waitForSelector,
  getText,
  back,
  forward,
  refresh,
  getCookies
};

/**
 * 执行操作
 */
async function executeAction(actionName, page, params) {
  const handler = actions[actionName];
  if (!handler) {
    return response(actionName, {}, new Error(`Unknown action: ${actionName}`));
  }
  
  try {
    return await handler(page, params);
  } catch (error) {
    return response(actionName, {}, error);
  }
}

module.exports = {
  executeAction,
  actions,
  response
};
