/*
 * generate-site.cjs —— 从 content/guides/zh-CN 自动生成 content/guides/zh-TW（繁简转换）。
 *
 * 用法：
 *   npm run deploy   （= node scripts/generate-site.cjs）
 *
 * 单一事实源（2026-09-25 根治双源漂移后）：
 *   - zh-CN 唯一中文源：直接编辑 content/guides/zh-CN/<slug>.mdx
 *   - zh-TW 确定性生成：opencc 简→繁（twp）+ 路径替换，本脚本从 zh-CN 生成
 *   - en 独立源：直接编辑 content/guides/en/<slug>.mdx，本脚本不碰 en
 *   - input/ 已废弃，不再参与部署流程
 *
 * 脚本会：
 *   1. 校验 content/guides/zh-CN 每个 .mdx 的 frontmatter 必填字段（缺字段报错）
 *   2. 用 opencc 简→繁转换 + 内部链接路径替换，写入 content/guides/zh-TW/<slug>.mdx
 *   3. 打印生成报告（成功 / 缺失字段）
 */
const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = [
  'title',
  'description',
  'eyebrow',
  'heroImage',
  'heroAlt',
  'sourceLabel',
  'sourceUrl',
  'order',
  'published',
];

function parseFrontmatter(raw) {
  // 极简 frontmatter 解析：--- 开头到第二个 --- 之间的 YAML。
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function validate(file, fm) {
  if (!fm) return [`${file}: 缺少 frontmatter（--- 包裹的 YAML 头部）`];
  const missing = REQUIRED_FIELDS.filter((f) => !(f in fm));
  return missing.map((f) => `${file}: 缺少必填字段 ${f}`);
}

async function main() {
  const zhCNDir = path.resolve('content/guides/zh-CN');
  const twDir = path.resolve('content/guides/zh-TW');

  if (!fs.existsSync(zhCNDir)) {
    console.error(`zh-CN 目录不存在: ${zhCNDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(zhCNDir).filter((f) => f.endsWith('.mdx'));
  if (files.length === 0) {
    console.error(`zh-CN 目录里没有 .mdx 文件: ${zhCNDir}`);
    process.exit(1);
  }

  const errors = [];
  const deployed = [];

  // 先全部校验，缺字段的文件不参与转换。
  for (const f of files) {
    const raw = fs.readFileSync(path.join(zhCNDir, f), 'utf8');
    const fm = parseFrontmatter(raw);
    const fileErrors = validate(f, fm);
    if (fileErrors.length > 0) {
      errors.push(...fileErrors);
      continue;
    }
    deployed.push(f);
  }

  console.log(`\n校验通过: ${deployed.length}/${files.length} 个文件`);
  if (errors.length) {
    console.log('\n⚠️ 校验失败（以下文件未生成繁体，请补齐字段后重跑）:');
    for (const e of errors) console.log('  -', e);
  }

  if (deployed.length > 0) {
    const OpenCC = require('opencc-js');
    const convert = OpenCC.Converter({ from: 'cn', to: 'twp' });
    fs.mkdirSync(twDir, { recursive: true });
    let tw = 0;
    for (const f of deployed) {
      const raw = fs.readFileSync(path.join(zhCNDir, f), 'utf8');
      let out = raw.replace(/\/zh-CN\/guide(\/|(?=[)\s]|$))/g, '/zh-TW/guide$1');
      out = convert(out);
      fs.writeFileSync(path.join(twDir, f), out, 'utf8');
      tw += 1;
    }
    console.log(`\n繁体版: ${tw} 个文件已生成到 content/guides/zh-TW/`);
  }

  if (errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
