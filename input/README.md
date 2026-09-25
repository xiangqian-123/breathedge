# input/ 已废弃（2026-09-25）

这个目录曾是「AI 生成页面的暂存区」，旧的 `scripts/generate-site.cjs` 从这里读 `zh-CN` 源、再写入 `content/guides/zh-CN` 并生成繁体。

根治「content/ 领先 input/ 的双源漂移」后，**deploy 不再读 input/**。当前单一事实源：

| 语言 | 源 | 维护方式 |
|---|---|---|
| zh-CN | `content/guides/zh-CN/` | 直接编辑（中文唯一源） |
| en | `content/guides/en/` | 直接编辑（英文独立源） |
| zh-TW | `content/guides/zh-TW/` | `npm run deploy` 从 zh-CN 自动繁简转换生成，**不要手改** |

本目录保留仅为历史存档，勿再往这里放新文件。
