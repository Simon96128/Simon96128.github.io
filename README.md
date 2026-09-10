# Simon96128.github.io

个人主页与博客，部署于 GitHub Pages：https://Simon96128.github.io

基于 Jekyll（Minimal Mistakes 主题），在此之上做了全站「星空」主题定制：深空背景、常驻星点、金色 ✦ 星图导航，以及页面切换过渡动画（View Transitions，带降级兜底）。

## 页面

| 路径 | 内容 |
|------|------|
| `/` | 首页 |
| `/cv/` | 简历 |
| `/year-archive/` | 博客文章 |
| `/portfolio/` `/publications/` `/talks/` `/teaching/` | 作品集 / 论文 / 演讲 / 教学 |

## 写博客

在 `_posts/` 下新建 `YYYY-MM-DD-文章名.md`，头部示例：

```yaml
---
title: "文章标题"
date: 2026-09-10
categories: [分类]
tags: [标签]
---

正文……
```

## 本地预览

需要 Ruby 3.0+ 与 Bundler（macOS 自带 Ruby 版本过旧，建议 `brew install ruby`）：

    bundle install
    bundle exec jekyll serve

访问 http://localhost:4000。

## 主要结构

- `_pages/` 静态页面（首页 `about.md`、简历 `cv.md` 等）
- `_posts/` 博客文章
- `_publications/` `_talks/` `_teaching/` `_portfolio/` 内容板块
- `_layouts/` `_includes/` `_sass/` 模板与样式
- `assets/css/main.scss` 全站样式（文件末尾为星空主题层）
- `_data/navigation.yml` 导航配置
