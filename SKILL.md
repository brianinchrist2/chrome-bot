# ChromeBot Skill

> Node.js Puppeteer browser automation for OpenClaw

## Tools

Use these tools to control a headless Chrome instance via the ChromeBot service (running on port 8765).

- `chromebot_navigate(url)` - Navigate to a URL.
- `chromebot_screenshot()` - Capture a screenshot of the current page.
- `chromebot_get_html()` - Get the current page's HTML.
- `chromebot_get_title()` - Get the current page's title.
- `chromebot_click(selector)` - Click an element by selector.
- `chromebot_type(selector, text)` - Type text into an element.
- `chromebot_evaluate(script)` - Execute custom JavaScript in the page.
- `chromebot_wait_for(selector, timeout)` - Wait for a selector to appear.
- `chromebot_frame_click(frameSelector, selector)` - Click an element inside an iframe.
- `chromebot_frame_type(frameSelector, selector, text)` - Type text into an element inside an iframe.
- `chromebot_frame_evaluate(frameSelector, script)` - Execute custom JavaScript inside an iframe.
- `chromebot_frame_get_html(frameSelector)` - Get the HTML content of an iframe.
- `chromebot_wait_for_frame(frameSelector, timeout)` - Wait for an iframe to appear and be accessible.

## Implementation Notes

All tools are implemented as shell commands using `curl` to interact with the local ChromeBot API.

---

### chromebot_navigate

Navigate to the specified URL and wait for the page to load.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"navigate\",\"params\":{\"url\":\"$1\"}}"
```

### chromebot_screenshot

Capture a screenshot of the current page and return it.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"screenshot\",\"params\":{}}"
```

### chromebot_get_html

Get the full HTML source of the current page.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"getHtml\",\"params\":{}}"
```

### chromebot_get_title

Get the title of the current page.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"getTitle\",\"params\":{}}"
```

### chromebot_click

Click on the element matched by the specified CSS selector.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"click\",\"params\":{\"selector\":\"$1\"}}"
```

### chromebot_type

Type the specified text into the element matched by the CSS selector.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"type\",\"params\":{\"selector\":\"$1\",\"text\":\"$2\"}}"
```

### chromebot_evaluate

Execute the provided JavaScript snippet in the context of the page.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"evaluate\",\"params\":{\"script\":\"$1\"}}"
```

### chromebot_wait_for

Wait for the element matched by the specified CSS selector to appear in the page.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"waitForSelector\",\"params\":{\"selector\":\"$1\",\"timeout\":$2}}"
```

### chromebot_frame_click

Click on the element matched by the selector inside the specified iframe.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"frameClick\",\"params\":{\"frameSelector\":\"$1\",\"selector\":\"$2\"}}"
```

### chromebot_frame_type

Type the specified text into the element matched by the selector inside the specified iframe.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"frameType\",\"params\":{\"frameSelector\":\"$1\",\"selector\":\"$2\",\"text\":\"$3\"}}"
```

### chromebot_frame_evaluate

Execute the provided JavaScript snippet in the context of the specified iframe.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"frameEvaluate\",\"params\":{\"frameSelector\":\"$1\",\"script\":\"$2\"}}"
```

### chromebot_frame_get_html

Get the full HTML source of the specified iframe.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"frameGetHtml\",\"params\":{\"frameSelector\":\"$1\"}}"
```

### chromebot_wait_for_frame

Wait for the specified iframe to appear and be accessible.

```bash
curl -X POST http://localhost:8765/execute \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"waitForFrame\",\"params\":{\"frameSelector\":\"$1\",\"timeout\":$2}}"
```
