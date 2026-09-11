# Simon96128.github.io

个人主页与博客，部署于 GitHub Pages：https://Simon96128.github.io

手写的极简 Jekyll 站点（不依赖第三方主题）。

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

需要 Ruby 3.0+ 与 Bundler：

    bundle install
    bundle exec jekyll serve

访问 http://localhost:4000。

## 结构

- `_layouts/` 页面模板
- `assets/` 样式与脚本
- `_posts/` 博客文章
- `_config.yml` 站点配置
