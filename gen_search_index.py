# -*- coding: utf-8 -*-
"""生成全站内容搜索索引（slug + 英文标题）→ data/search-index.ts"""
import os, re, glob

def extract(fp):
    txt = open(fp, encoding="utf-8").read()
    m = re.search(r'^title:\s*"(.*?)"', txt, re.M)
    return m.group(1) if m else ""

entries = []
for f in sorted(glob.glob("content/guides/en/*.mdx")):
    slug = os.path.basename(f)[:-4]
    title_en = extract(f)
    entries.append({"slug": slug, "en": title_en})

lines = [
    "// 自动生成：全站内容搜索索引（slug + 英文标题）",
    "export interface SearchEntry { slug: string; en: string; }",
    "export const SEARCH_INDEX: SearchEntry[] = [",
]
for e in entries:
    en = e["en"].replace('"', "'")
    lines.append(f'  {{ slug: "{e["slug"]}", en: "{en}" }},')
lines.append("];")

os.makedirs("data", exist_ok=True)
open("data/search-index.ts", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"搜索索引生成：{len(entries)} 条 → data/search-index.ts")
