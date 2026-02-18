# Changelog

All notable changes to ChromeBot will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-18

### Added
- `waitForFunction` - Wait for a JavaScript function to return true
- `waitForNavigation` - Wait for navigation to complete
- `getAttribute` - Get element attribute value
- `isVisible` - Check if element is visible
- `hover` - Hover over element
- `doubleClick` - Double click element
- `selectOption` - Select dropdown option

### Changed
- Improved error handling in action responses
- Enhanced wait mechanisms for dynamic content

## [1.0.0] - 2026-02-15

### Added
- Initial release
- Core actions: navigate, getHtml, getTitle, getUrl, screenshot
- Element actions: click, type, scroll, evaluate, waitForSelector, getText
- Navigation actions: back, forward, refresh
- Cookie management: getCookies
- Express server on port 8765
- RESTful API endpoints: /health, /execute, /launch, /close
