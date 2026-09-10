# -*- coding: utf-8 -*-
"""生成全站内容搜索索引（slug + 中英标题）→ data/search-index.ts"""
import os, re, glob

def extract(fp):
    txt = open(fp, encoding="utf-8").read()
    m = re.search(r'^title:\s*"(.*?)"', txt, re.M)
    return m.group(1) if m else ""

entries = []
for f in sorted(glob.glob("content/guides/zh-CN/*.mdx")):
    slug = os.path.basename(f)[:-4]
    title_zh = extract(f)
    en_fp = f"content/guides/en/{slug}.mdx"
    title_en = extract(en_fp) if os.path.exists(en_fp) else ""
    entries.append({"slug": slug, "zh": title_zh, "en": title_en})

lines = [
    "// 自动生成：全站内容搜索索引（slug + 中英标题）",
    "export interface SearchEntry { slug: string; zh: string; en: string; }",
    "export const SEARCH_INDEX: SearchEntry[] = [",
]
for e in entries:
    zh = e["zh"].replace('"', "'")
    en = e["en"].replace('"', "'")
    lines.append(f'  {{ slug: "{e["slug"]}", zh: "{zh}", en: "{en}" }},')
lines.append("];")

os.makedirs("data", exist_ok=True)
open("data/search-index.ts", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"搜索索引生成：{len(entries)} 条 → data/search-index.ts")
