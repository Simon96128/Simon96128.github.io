# Simon96128.github.io

个人主页与博客，部署于 GitHub Pages：https://Simon96128.github.io

手写的极简 Jekyll 站点（不依赖第三方主题）。

## 写博客

**方式一：网页直接发（最方便，无需任何本地工具）**

1. 打开 GitHub 仓库页面，进入 `_posts/` 目录
2. 点 **Add file → Create new file**，文件名输入 `2026-09-12-我的文章.md`（必须是 `YYYY-MM-DD-名字.md` 格式）
3. 粘贴内容，点 **Commit changes**，一两分钟后文章自动上线

文件开头需要这段头部：

```yaml
---
title: "文章标题"
date: 2026-09-10
categories: [分类]
---

正文……
```

**方式二：本地命令行**

```bash
./new-post.sh "文章标题" [分类] [slug]   # 自动创建带日期前缀的文章文件
# 编辑 _posts/ 下刚生成的文件，然后：
git add -A && git commit -m "new post" && git push
```

本地想先看效果：`bundle exec jekyll serve` 后访问 http://localhost:4000（需要 Ruby 3.0+；不装也行，直接 push 看线上效果）。

## 结构

- `_layouts/` 页面模板
- `assets/` 样式与脚本
- `_posts/` 博客文章
- `_config.yml` 站点配置
