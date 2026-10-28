# dsh-theme-strinova · 卡拉彼丘主题

给 **DeepSeek Harness (DSH)** 的一套深色科幻皮肤 —— 橙红 `#ff6b2f` × 战场深灰 `#222222`，
附一层纯 CSS 的网格氛围光，以及三个**自定义素材位**（背景 / 水印 / 立绘）。

> A dark sci-fi skin for DeepSeek Harness, themed after **Calabiyau / Strinova**:
> orange-red `#ff6b2f` on battlefield grey, with a pure-CSS ambient grid layer
> and three optional custom-asset slots.

---

## 特性

- **67 个语义 token 全覆盖** —— 背景、边框、文字、按钮、Markdown、滚动条、状态色、侧边栏一次到位
- **零构建** —— `lib/client.js` 是手写的客户端懒加载工厂，npm / git 安装行为一致，安装时**不需要 `prepare` 脚本授权**
- **纯 CSS 氛围层** —— 细网格 + 橙色光晕用 `pointer-events: none` 铺底，不挡任何交互
- **内置默认素材** —— 已内嵌一张官方赛季剧情壁纸（背景）+ 一枚官方表情包（右下角标），配色装上即叠加生效
- **可随时关闭** —— `cordis.patch.yml` 里 `config.enabled: false` 即停用样式层，主题注册保留

## 安装

三种方式任选，装完在**设置 → 插件**里启用即可——配色通过 `overrideTokens` 自动叠加到当前主题，**无需手动选择主题**（DSH 的「外观」选择器只提供浅色/深色/跟随系统，不列出第三方主题）。

### 1. npm（推荐）

```sh
# 在你的 dsh profile 目录下
cd ~/.dsh/profiles/web
pnpm add dsh-theme-strinova
```

### 2. tarball

```sh
# 在本仓库
pnpm pack            # 产出 dsh-theme-strinova-0.1.0.tgz
# 然后在 profile 目录
pnpm add /path/to/dsh-theme-strinova-0.1.0.tgz
```

### 3. git 源码

```sh
cd ~/.dsh/profiles/web
pnpm add github:nizihan29/dsh-theme-strinova
```

> 因为本包**没有构建步骤**，git 安装不会触发 `prepare`，也就不用额外授权。

## 放你自己的素材

插件默认**已内置**一张官方壁纸 + 一枚官方表情包（数据以 data URI 内嵌在 `lib/client.js` 里，离线可用）。要换成你自己的素材：

1. 打开 `lib/client.js`，找到顶部的 **`ASSETS`** 配置区
2. 填入图片，支持 **URL** 或 **data URI**（base64）：

```js
const ASSETS = {
  // 全屏背景图
  background: 'data:image/png;base64,iVBORw0KGgo...',
  backgroundOpacity: 0.16,   // 越小越"藏"，阅读越舒服
  backgroundBlur: 0,         // 背景模糊 px，文字更清晰

  // 右下角水印 / 立绘
  watermark: 'https://example.com/pic.png',
  watermarkWidth: 140,
  watermarkOpacity: 0.5,

  // 纯 CSS 氛围层（网格 + 橙光），设 false 则只要配色
  ambient: true,
}
```

改完重载 DSH 即可生效（无构建步骤）。

> **data URI 怎么生成**：macOS 上 `base64 -i your.png | pbcopy`，然后粘进配置。
> 或者用任意「图片转 base64」在线工具。

### ⚠️ 关于版权

卡拉彼丘的游戏美术资产（表情包、立绘、logo）版权属于其开发商 / 发行商。

- **自己本地用**：没问题
- **公开发布这个插件**（含素材）：请使用**自己创作**的素材，或确认官方允许二次创作与分发

> ⚠️ 本仓库当前**为本地自用而内嵌了官方壁纸/表情包**（data URI）。这部分素材版权属于开发商，
> **只能自己本地用，不能公开发布**。要上架 npm / 插件市场，请先把 `lib/client.js` 里 `ASSETS`
> 的 `background` / `watermark` 清空或换成自己创作 / 免费授权的素材。

## 配色

取自卡拉彼丘官网的真实用色：

| 用途 | 色值 | 说明 |
|---|---|---|
| 品牌主色 | `#ff6b2f` | 官网出现频次最高的橙红 |
| 次级橙 | `#ff8449` | hover / 链接 |
| 战场底色 | `#0d0f13` → `#262c35` | 五级背景层，由深到浅 |
| 主文字 | `#eef1f6` | |
| 次级文字 | `#b3bac6` / `#868f9d` | |
| 辅助中性 | `#d7dce1` / `#9197a0` / `#484848` | 取自官网 |
| 状态色 | 成功 `#3ecf8e` / 警告 `#ffb020` / 错误 `#ff4d4f` | |

## 项目结构

```
dsh-theme-strinova/
├── package.json          # dsh.bundle.patch + dsh.client 声明
├── cordis.patch.yml      # 插件注册行（一行一个包名）
├── lib/
│   ├── index.js          # host 侧（空壳，主题在浏览器侧注册）
│   └── client.js         # ★ 主题定义 + 素材配置区 + CSS 注入
├── LICENSE
└── README.md
```

## 开发笔记（踩过的坑）

1. **绝不要在 `cordis.patch.yml` 里声明 `modifies: [ui-theme]`**
   通过 `exports.inject` 消费服务已经足够决定启动顺序。再加 `modifies` 等于同时告诉
   加载器"本行必须先于 ui-theme 启动"，形成循环依赖 —— 两个 fiber 永远 pending，
   桌面版停在 `Loading plugins...`，**没有任何异常和崩溃日志**。

2. **`dsh.client.inject` 只能列自身声明了 `dsh.client` 的包**
   `react/jsx-runtime` 之类来自 platform-module 种子表，不要写进去。

3. **`exports.inject = [...]` 不要出现在注释里** —— 静态审计会把它当成真代码读。

4. **手写 client.js 换取"零构建"**
   生成 lazy-CJS 的 tsdown 预设不在已发布的包里，手写反而让安装体验最好
   （npm 与 git 行为一致，无需 `prepare` 授权）。

## 发布到插件市场

DSH 官方**不接受外部 PR**（`CONTRIBUTING.zh.md` 原文），生态方式是：

1. 建独立仓库（本仓库）
2. 给仓库加 **`dsh-plugin`** 话题 —— 让其他人/工具能发现你的插件
3. 发布到 npm：`npm publish --access public`

## License

MIT

## 致谢

- 插件结构参考了 [renjie2026/dsh-theme-gallery](https://github.com/renjie2026/dsh-theme-gallery)
  的实践与踩坑记录（循环依赖、手写懒加载工厂、"零构建"取舍），特此致谢
- 配色取自卡拉彼丘官方网站公开页面
