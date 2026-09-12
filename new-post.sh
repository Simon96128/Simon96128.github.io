#!/usr/bin/env bash
# 一句话新建博客文章
# 用法: ./new-post.sh "文章标题" [分类] [英文slug]
set -euo pipefail
cd "$(dirname "$0")"

title="${1:?用法: ./new-post.sh \"文章标题\" [分类] [slug]}"
category="${2:-}"
slug="${3:-post-$(date +%Y%m%d-%H%M%S)}"
date="$(date +%Y-%m-%d)"
file="_posts/${date}-${slug}.md"

if [ -e "$file" ]; then
  echo "文件已存在: $file"
  exit 1
fi

{
  echo "---"
  echo "title: \"${title}\""
  echo "date: ${date}"
  if [ -n "$category" ]; then echo "categories: [${category}]"; fi
  echo "---"
  echo
  echo "正文从这里开始。"
} > "$file"

echo "已创建 $file"
echo "写完后执行:"
echo "  git add -A && git commit -m \"new post: ${title}\" && git push"
