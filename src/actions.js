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
 * 获取元素属性
 */
async function getAttribute(page, { selector, attribute }) {
  const value = await page.$eval(selector, (el, attr) => el.getAttribute(attr), attribute).catch(() => null);
  return response('getAttribute', { selector, attribute, value });
}

/**
 * 检查元素是否可见
 */
async function isVisible(page, { selector }) {
  const visible = await page.$eval(selector, el => {
    const style = window.getComputedStyle(el);
    return el.offsetParent !== null && style.visibility !== 'hidden' && style.display !== 'none';
  }).catch(() => false);
  return response('isVisible', { selector, visible });
}

/**
 * 悬停元素
 */
async function hover(page, { selector }) {
  await page.hover(selector);
  return response('hover', { selector });
}

/**
 * 双击元素
 */
async function doubleClick(page, { selector }) {
  await page.dblclick(selector);
  return response('doubleClick', { selector });
}

/**
 * 等待函数执行结果为真
 */
async function waitForFunction(page, { script, timeout = 30000 }) {
  await page.waitForFunction(script, { timeout });
  return response('waitForFunction', { script });
}

/**
 * 等待导航完成
 */
async function waitForNavigation(page, { timeout = 30000 } = {}) {
  await page.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
  return response('waitForNavigation', { url: page.url() });
}

/**
 * 选择下拉选项
 */
async function selectOption(page, { selector, value }) {
  await page.select(selector, value);
  return response('selectOption', { selector, value });
}

/**
 * 在指定 iframe 中点击元素
 */
async function frameClick(page, { frameSelector, selector }) {
  const frameElement = await page.$(frameSelector);
  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error(`Frame not found: ${frameSelector}`);
  await frame.click(selector);
  return response('frameClick', { frameSelector, selector });
}

/**
 * 在指定 iframe 中输入文本
 */
async function frameType(page, { frameSelector, selector, text }) {
  const frameElement = await page.$(frameSelector);
  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error(`Frame not found: ${frameSelector}`);
  await frame.type(selector, text);
  return response('frameType', { frameSelector, selector, text });
}

/**
 * 在指定 iframe 中执行 JavaScript
 */
async function frameEvaluate(page, { frameSelector, script }) {
  const frameElement = await page.$(frameSelector);
  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error(`Frame not found: ${frameSelector}`);
  const result = await frame.evaluate(script);
  return response('frameEvaluate', { result });
}

/**
 * 获取 iframe HTML
 */
async function frameGetHtml(page, { frameSelector }) {
  const frameElement = await page.$(frameSelector);
  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error(`Frame not found: ${frameSelector}`);
  const html = await frame.content();
  return response('frameGetHtml', { frameSelector, html });
}

/**
 * 等待 iframe 出现
 */
async function waitForFrame(page, { frameSelector, timeout = 30000 }) {
  await page.waitForSelector(frameSelector, { timeout });
  const frameElement = await page.$(frameSelector);
  const frame = await frameElement.contentFrame();
  if (!frame) throw new Error(`Frame appeared but content is inaccessible: ${frameSelector}`);
  return response('waitForFrame', { frameSelector });
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
  waitForFunction,
  waitForNavigation,
  getText,
  getAttribute,
  isVisible,
  hover,
  doubleClick,
  selectOption,
  frameClick,
  frameType,
  frameEvaluate,
  frameGetHtml,
  waitForFrame,
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
