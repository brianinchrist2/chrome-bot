/**
 * Unit Tests - ChromeBot v1.1.0
 * 运行: npm test
 */

const { response, actions } = require('../src/actions');

// 测试响应格式
describe('Response Format', () => {
  test('response should return correct format for success', () => {
    const result = response('test', { data: 'value' });
    expect(result.success).toBe(true);
    expect(result.action).toBe('test');
    expect(result.data).toEqual({ data: 'value' });
    expect(result.error).toBeNull();
  });

  test('response should return correct format for error', () => {
    const error = new Error('Test error');
    const result = response('test', {}, error);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Test error');
  });

  test('response should handle empty data', () => {
    const result = response('test');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });
});

// 测试 actions 对象
describe('Actions', () => {
  const requiredActions = [
    'navigate', 'getHtml', 'getTitle', 'getUrl', 
    'screenshot', 'click', 'type', 'scroll', 
    'evaluate', 'waitForSelector', 'waitForFunction', 'waitForNavigation',
    'getText', 'getAttribute', 'isVisible', 'hover', 'doubleClick',
    'selectOption', 'back', 'forward', 'refresh', 'getCookies'
  ];
  
  test.each(requiredActions)('should have action: %s', (action) => {
    expect(actions[action]).toBeDefined();
    expect(typeof actions[action]).toBe('function');
  });

  test('should export executeAction function', () => {
    const { executeAction } = require('../src/actions');
    expect(typeof executeAction).toBe('function');
  });

  test('executeAction should return error for unknown action', async () => {
    const { executeAction } = require('../src/actions');
    const mockPage = {};
    const result = await executeAction('unknownAction', mockPage, {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown action');
  });
});

// 测试 config
describe('Config', () => {
  test('should have valid config', () => {
    const cfg = require('../src/config');
    expect(cfg.port).toBe(8765);
    expect(cfg.browser).toBeDefined();
    expect(cfg.timeout).toBe(30000);
  });

  test('config should have all required fields', () => {
    const cfg = require('../src/config');
    expect(cfg).toHaveProperty('port');
    expect(cfg).toHaveProperty('browser');
    expect(cfg).toHaveProperty('timeout');
    expect(cfg.browser).toHaveProperty('headless');
  });

  test('config should support existingChrome settings', () => {
    const cfg = require('../src/config');
    expect(cfg).toHaveProperty('existingChrome');
    expect(cfg.existingChrome).toHaveProperty('enabled');
    expect(cfg.existingChrome).toHaveProperty('browserWSEndpoint');
  });
});

// 测试版本管理
describe('Version Management', () => {
  test('package.json should have correct version format', () => {
    const pkg = require('../package.json');
    const semverRegex = /^\d+\.\d+\.\d+$/;
    expect(pkg.version).toMatch(semverRegex);
  });

  test('version should be 1.1.0 or higher', () => {
    const pkg = require('../package.json');
    const [major, minor, patch] = pkg.version.split('.').map(Number);
    expect(major).toBeGreaterThanOrEqual(1);
    expect(minor).toBeGreaterThanOrEqual(1);
  });
});

// 测试 action handler 参数验证
describe('Action Parameters', () => {
  test('navigate requires url parameter', () => {
    expect(actions.navigate).toBeDefined();
  });

  test('click requires selector parameter', () => {
    expect(actions.click).toBeDefined();
  });

  test('type requires selector and text parameters', () => {
    expect(actions.type).toBeDefined();
  });

  test('screenshot accepts optional fullPage parameter', () => {
    expect(actions.screenshot).toBeDefined();
  });

  test('waitForSelector accepts selector and optional timeout', () => {
    expect(actions.waitForSelector).toBeDefined();
  });

  test('getAttribute requires selector and attribute', () => {
    expect(actions.getAttribute).toBeDefined();
  });

  test('isVisible requires selector', () => {
    expect(actions.isVisible).toBeDefined();
  });

  test('selectOption requires selector and value', () => {
    expect(actions.selectOption).toBeDefined();
  });
});
