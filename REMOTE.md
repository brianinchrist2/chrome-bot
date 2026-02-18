# ChromeBot 远程调用指南

## 启动 ChromeBot（支持远程）

```bash
# 方式1: 环境变量
HOST=0.0.0.0 PORT=8765 npm start

# 方式2: 修改 config.js
host: '0.0.0.0'  // 允许远程连接
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 检查状态 |
| `/launch` | POST | 启动浏览器 |
| `/execute` | POST | 执行操作 |
| `/close` | POST | 关闭浏览器 |

## 调用示例

### 1. 健康检查
```bash
curl http://<IP>:8765/health
```

响应：
```json
{"status":"ok","browser":"connected","pages":1}
```

### 2. 导航到 URL
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"navigate","params":{"url":"https://google.com"}}'
```

### 3. 截图
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"screenshot","params":{}}'
```

### 4. 获取页面标题
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"getTitle","params":{}}'
```

### 5. 点击元素
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"click","params":{"selector":"#submit"}}'
```

### 6. 输入文本
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"type","params":{"selector":"#email","text":"test@example.com"}}'
```

### 7. 执行 JavaScript
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"evaluate","params":{"script":"document.title"}}'
```

### 8. 等待元素
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"waitForSelector","params":{"selector":".result","timeout":5000}}'
```

### 9. 获取 Cookies
```bash
curl -X POST http://<IP>:8765/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"getCookies","params":{}}'
```

## 响应格式

```json
{
  "success": true,
  "action": "navigate",
  "data": {
    "url": "https://google.com",
    "title": "Google"
  },
  "error": null
}
```

## 可用 Actions

| Action | 参数 | 说明 |
|--------|------|------|
| `navigate` | `{url: string}` | 导航到 URL |
| `getHtml` | - | 获取页面 HTML |
| `getTitle` | - | 获取页面标题 |
| `getUrl` | - | 获取当前 URL |
| `screenshot` | `{fullPage?: boolean}` | 截图 |
| `click` | `{selector: string}` | 点击元素 |
| `type` | `{selector: string, text: string}` | 输入文本 |
| `scroll` | `{pixels?: number}` | 滚动页面 |
| `evaluate` | `{script: string}` | 执行 JS |
| `waitForSelector` | `{selector: string, timeout?: number}` | 等待元素 |
| `waitForFunction` | `{script: string, timeout?: number}` | 等待函数 |
| `waitForNavigation` | `{timeout?: number}` | 等待导航 |
| `getText` | `{selector: string}` | 获取元素文本 |
| `getAttribute` | `{selector: string, attribute: string}` | 获取属性 |
| `isVisible` | `{selector: string}` | 检查可见性 |
| `hover` | `{selector: string}` | 悬停 |
| `doubleClick` | `{selector: string}` | 双击 |
| `selectOption` | `{selector: string, value: string}` | 选择下拉 |
| `back` | - | 后退 |
| `forward` | - | 前进 |
| `refresh` | - | 刷新 |
| `getCookies` | - | 获取 Cookies |

## PowerShell 调用示例

```powershell
$body = @{
    action = "navigate"
    params = @{
        url = "https://www.google.com"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8765/execute" -Method POST -Body $body -ContentType "application/json"
```

## Node.js 调用示例

```javascript
const fetch = require('node-fetch');

async function execute(action, params) {
  const res = await fetch('http://localhost:8765/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, params })
  });
  return res.json();
}

// 使用
execute('navigate', { url: 'https://google.com' })
  .then(console.log);
```
