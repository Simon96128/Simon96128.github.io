# Simon96128.github.io

个人主页与博客，部署于 GitHub Pages：https://Simon96128.github.io

手写的极简 Jekyll 站点（不依赖第三方主题），带「星空」设计：深空背景、常驻星点、金色 ✦ 星图导航，页面间有过渡动画（View Transitions，带降级兜底）。

## 页面

| 路径 | 内容 |
|------|------|
| `/` | 首页 + 最新文章 |
| `/blog/` | 博客归档（按年份） |
| `/cv/` | 简历 |

## 写博客

在 `_posts/` 下新建 `YYYY-MM-DD-文章名.md`：

```yaml
---
title: "文章标题"
date: 2026-09-10
categories: [分类]
---

正文……
```

## 本地预览

需要 Ruby 3.0+ 与 Bundler（macOS 自带 Ruby 较旧，建议 `brew install ruby`）：

    bundle install
    bundle exec jekyll serve

访问 http://localhost:4000。

## 结构

- `_layouts/` 页面模板（default / home / post）
- `assets/css/style.css` 全站样式（星空主题都在这里）
- `_posts/` 博客文章
- `_config.yml` 站点配置
