# ChromeBot 开发规范

> Node.js + Puppeteer 浏览器自动化方案

## 项目概述

- **项目名称**: ChromeBot
- **技术栈**: Node.js + Puppeteer + Express
- **目标**: 为 OpenClaw 提供高性能浏览器自动化能力

## 分支管理

```
main (生产分支)
  ↑
develop (开发分支) ← 当前工作区
  ↑
feature/* (功能分支)
```

---

# 方案迭代 1: 基础架构设计

## 1.1 核心架构

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   OpenClaw     │────▶│  Express API     │────▶│  Puppeteer  │
│   (HTTP请求)    │     │  (localhost:8765)│     │  (Chrome)   │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

## 1.2 API 端点设计

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /health | 健康检查 |
| POST | /execute | 执行浏览器操作 |
| POST | /close | 关闭浏览器 |

## 1.3 支持的操作 (Action)

- `navigate` - 导航到 URL
- `getHtml` - 获取页面 HTML
- `getTitle` - 获取页面标题
- `getUrl` - 获取当前 URL
- `screenshot` - 截图 (Base64)
- `click` - 点击元素
- `type` - 输入文本
- `scroll` - 滚动页面
- `evaluate` - 执行 JavaScript
- `back/forward/refresh` - 浏览器操作

## 1.4 初步代码结构

```
chrome-bot/
├── src/
│   ├── index.js        # 主入口
│   ├── browser.js      # Puppeteer 封装
│   ├── actions.js      # 操作处理
│   └── router.js       # 路由定义
├── package.json
└── README.md
```

---

# 方案迭代 2: 增强功能设计

## 2.1 错误处理增强

- 全局异常捕获
- 操作超时控制 (默认 30s)
- 浏览器崩溃自动重启

## 2.2 配置管理

```javascript
// config.js
module.exports = {
  port: process.env.PORT || 8765,
  browser: {
    headless: false,
    defaultViewport: { width: 1280,720 },
    userDataDir: null,  // 可配置持久化
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  },
  timeout: 30000
};
```

## 2.3 响应格式统一化

```json
{
  "success": true,
  "action": "navigate",
  "data": { },
  "error": null
}
```

## 2.4 高级操作支持

- `waitForSelector` - 等待元素出现
- `waitForNavigation` - 等待导航完成
- `uploadFile` - 文件上传
- `getCookies` / `setCookies` - Cookie 管理

---

# 方案迭代 3: 生产环境优化

## 3.1 性能优化

- 浏览器实例池 (Browser Pool)
- 页面缓存机制
- 并发控制 (最多 5 个并发页面)

## 3.2 安全增强

- 请求频率限制
- 操作白名单
- 敏感信息脱敏日志

## 3.3 监控与日志

- 结构化日志 (winston/pino)
- 操作耗时统计
- 内存使用监控

## 3.4 OpenClaw 集成

```javascript
// 使用示例
const response = await fetch('http://localhost:8765/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'navigate',
    url: 'https://example.com'
  })
});
```

## 3.5 Docker 支持 (可选)

```dockerfile
FROM node:18-alpine
RUN npm install -g puppeteer
COPY . /app
WORKDIR /app
EXPOSE 8765
CMD ["node", "src/index.js"]
```

---

# 开发步骤

## Step 1: 初始化项目
- [ ] 创建 package.json
- [ ] 安装依赖 (puppeteer, express)
- [ ] 创建基础目录结构

## Step 2: 核心浏览器控制
- [ ] 实现 Puppeteer 封装
- [ ] 实现基础操作 (navigate, getHtml, screenshot)
- [ ] 单元测试: 浏览器启动/关闭

## Step 3: Express API 层
- [ ] 创建 Express 服务器
- [ ] 实现 /health 端点
- [ ] 实现 /execute 端点
- [ ] 单元测试: API 响应

## Step 4: 完整操作支持
- [ ] 实现所有基础操作
- [ ] 实现等待机制
- [ ] 单元测试: 各操作功能

## Step 5: 错误处理与配置
- [ ] 统一错误处理
- [ ] 配置文件支持
- [ ] 单元测试: 错误场景

## Step 6: 集成测试
- [ ] 端到端测试
- [ ] 性能测试
- [ ] 压力测试

## Step 7: 提交与发布
- [ ] 清理测试代码
- [ ] 提交到 develop 分支
- [ ] 创建 PR 合并到 main

---

# 验收标准

1. ✅ 所有基础操作正常工作
2. ✅ API 响应时间 < 100ms (不含页面加载)
3. ✅ 错误处理完善，无崩溃
4. ✅ 代码覆盖核心功能
5. ✅ 文档完整

---

*方案版本: 3.0*
*最后更新: 2026-02-18*
