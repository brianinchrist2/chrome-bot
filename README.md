# ChromeBot

> Node.js + Puppeteer 浏览器自动化 for OpenClaw

## 概述

ChromeBot 是一个基于 Puppeteer 的 HTTP API 服务，允许 OpenClaw 通过发送指令来控制浏览器执行各种操作。

## 快速开始

### 1. 安装依赖

```bash
cd chrome-bot
npm install
```

### 2. 启动服务

```bash
npm start
```

服务启动后会打开 Chrome 浏览器并运行在 `http://localhost:8765`

## API 接口

### 健康检查

```bash
GET http://localhost:8765/health
```

响应：
```json
{
  "status": "ok",
  "browser": "connected",
  "pages": 1
}
```

### 执行操作

```bash
POST http://localhost:8765/execute
Content-Type: application/json
```

## 支持的操作

### 1. 导航到网址

```json
{
  "action": "navigate",
  "params": { "url": "https://www.google.com" }
}
```

### 2. 获取页面 HTML

```json
{
  "action": "getHtml"
}
```

### 3. 获取页面标题

```json
{
  "action": "getTitle"
}
```

### 4. 获取当前网址

```json
{
  "action": "getUrl"
}
```

### 5. 截图

```json
{
  "action": "screenshot",
  "params": { "fullPage": false }
}
```

### 6. 点击元素

```json
{
  "action": "click",
  "params": { "selector": "#submit-button" }
}
```

### 7. 输入文本

```json
{
  "action": "type",
  "params": { "selector": "#search-input", "text": "hello world" }
}
```

### 8. 滚动页面

```json
{
  "action": "scroll",
  "params": { "pixels": 500 }
}
```

### 9. 执行 JavaScript

```json
{
  "action": "evaluate",
  "params": { "script": "return document.title" }
}
```

### 10. 等待元素

```json
{
  "action": "waitForSelector",
  "params": { "selector": ".result", "timeout": 10000 }
}
```

### 11. 获取元素文本

```json
{
  "action": "getText",
  "params": { "selector": "h1" }
}
```

### 12. 前进/后退/刷新

```json
{ "action": "back" }
```
```json
{ "action": "forward" }
```
```json
{ "action": "refresh" }
```

### 13. 获取 Cookies

```json
{
  "action": "getCookies"
}
```

### 14. 关闭浏览器

```bash
POST http://localhost:8765/close
```

## OpenClaw 集成

```javascript
// 在 OpenClaw 中使用 exec 工具
const response = await fetch('http://localhost:8765/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'navigate',
    params: { url: 'https://example.com' }
  })
});

const result = await response.json();
console.log(result.data.title);
```

## 配置

修改 `src/config.js` 自定义配置：

```javascript
module.exports = {
  port: 8765,           // 服务端口
  browser: {
    headless: false,    // 是否无头模式
    defaultViewport: { width: 1280, height: 720 }
  },
  timeout: 30000,       // 操作超时
  maxConcurrentPages: 5 // 最大并发页面数
};
```

## 响应格式

所有操作返回统一格式：

```json
{
  "success": true,
  "action": "navigate",
  "data": {
    "url": "https://example.com",
    "title": "Example"
  },
  "error": null
}
```

## 许可证

MIT
