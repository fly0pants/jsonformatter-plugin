# JSON 格式化工具

一款功能强大的 Chrome 扩展，提供 JSON 数据的格式化、验证和操作，具有现代直观的界面设计。

## ✨ 主要特性

### 核心功能
- 🚀 **高性能** - 即使处理大型 JSON 文件也能保持快速响应
- 🌗 **明暗主题** - 优雅的主题切换，适应不同环境下的阅读需求
- 🎨 **语法高亮** - 美观的 JSON 元素色彩标注
- 🌳 **树形视图** - 可折叠的 JSON 结构，带有缩进指引
- 🔗 **可点击链接** - 自动检测并激活 URL 链接
- ⚡ **零性能影响** - 对非 JSON 页面几乎无性能影响

### JSON 工具集
- 📝 **格式化** - 美化 JSON，添加适当的缩进和空格
- 📦 **压缩** - 移除空白字符，压缩 JSON 数据
- 🔄 **字符串转换** - 将 JSON 转换为字符串表示
- 📋 **快速复制** - 一键复制格式化或原始 JSON
- 🗑️ **清空内容** - 快速清除编辑器内容
- 📜 **历史记录** - 追踪最近的 JSON 操作记录

### 编辑器特性
- 🔍 **实时验证** - 即时反馈 JSON 语法错误
- ✨ **简洁界面** - 现代化、无干扰的编辑体验
- 🎯 **错误提示** - 清晰标注 JSON 语法错误位置
- 📱 **响应式设计** - 完美适配各种屏幕尺寸

## 🚀 安装方法

### Chrome 应用商店安装（推荐）
1. 访问 [Chrome 网上应用店](https://chrome.google.com/webstore/detail/json-formatter/your-extension-id)
2. 点击"添加至 Chrome"
3. 确认安装

### 手动安装（开发版）
1. 克隆仓库
```bash
git clone https://github.com/yourusername/json-formatter.git
cd json-formatter
```

2. 安装依赖
```bash
pnpm install
```

3. 构建扩展
```bash
deno task build
```

4. 在 Chrome 中加载
- 打开 Chrome，访问 `chrome://extensions`
- 启用"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择构建生成的 `dist` 文件夹

## 🛠️ 开发指南

### 环境要求
- [Deno](https://deno.land/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)（推荐）或 npm

### 开发命令
- `deno task build` - 构建扩展
- `deno task dev` - 开发模式（监听文件变化）
- `pnpm test` - 运行测试

## 🤝 参与贡献

欢迎提交 Pull Request 来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m '添加某个特性'`)
4. 推送到远程分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📝 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 图标来自 [Feather Icons](https://feathericons.com/)
- 使用 [React](https://reactjs.org/) 和 [TypeScript](https://www.typescriptlang.org/) 构建
