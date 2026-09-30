/**
 * Browser half of the Calabiyau theme pack (卡拉彼丘 深色科幻主题).
 *
 * 它做两件事：
 *   1. 通过 `ctx.theme.register` 向官方主题注册表注册一套 67 个 token 的皮肤；
 *   2. 注入一层纯 CSS 的"氛围层"（网格 / 橙光 / 可选素材位）。
 *
 * ## 为什么是手写的 lazy-CJS
 *
 * `./client` 必须是客户端模块系统的懒加载工厂 ——
 * `window.__ModuleLoader__.load({ id, factory })`。生成它的 tsdown 预设不在任何
 * 已发布的包里，所以手写。好处是本包**没有构建步骤**：git 安装与 npm 安装行为
 * 一致，使用者也不必为 `prepare` 脚本授权。
 *
 * ## 依赖边界
 *
 * `exports.inject` 只列真正需要的服务（`theme`）。`react/jsx-runtime` 之类来自
 * 客户端 platform-module 种子表，不要写进 `dsh.client.inject`——那个字段只能列
 * **自身声明了 `dsh.client`** 的包名（官方 ui-theme 也是这么处理的）。
 *
 * ## 素材（卡拉彼丘表情包）怎么放
 *
 * 见下方 `ASSETS`。默认全部留空 —— 空壳主题：只有配色和纯 CSS 氛围层，
 * 不携带任何受版权保护的图片。把图片转成 data URI 或放到图床后填进来即可。
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-calabiyau',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    /* ═══════════════════════════════════════════════════════════════════
     *  素材配置区 —— 想换素材只改这里
     * ═══════════════════════════════════════════════════════════════════
     *
     * 三个槽位都接受两种写法：
     *   · 图片 URL   —— 'https://example.com/xxx.png'
     *   · data URI  —— 'data:image/png;base64,iVBORw0KGgo...'
     *
     * 留空 = 不渲染该槽位（默认状态，纯配色主题）。
     *
     * ⚠️ 版权提醒：卡拉彼丘的游戏美术资产版权属于其开发商/发行商。
     *    自己本地用没问题；**若要公开发布这个插件**，请使用自己创作的素材，
     *    或确认官方允许二次创作与分发，避免侵权。
     */
    const ASSETS = {
      /** 全屏背景图（会垫在界面最底层，半透明覆盖） */
      background: '',
      /** 背景图层的不透明度，0 ~ 1。越小越"藏"，阅读越舒服 */
      backgroundOpacity: 0.16,
      /** 背景图的模糊程度（px），让文字更清晰 */
      backgroundBlur: 0,
      /** 右下角水印 / 立绘小图 */
      watermark: '',
      /** 水印尺寸（px 宽度） */
      watermarkWidth: 140,
      /** 水印不透明度 */
      watermarkOpacity: 0.5,
      /** 是否启用纯 CSS 氛围层（网格 + 橙色光晕）。关掉 = 只有配色 */
      ambient: true,
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  卡拉彼丘配色（取自官网真实用色）
     *    · 品牌主色 #ff6b2f（橙红，官网出现频次最高）
     *    · 战场底色 #222222 系深灰
     *    · 辅助中性色 #d7dce1 / #9197a0 / #484848
     * ═══════════════════════════════════════════════════════════════════ */

    /** 深色主题：light / dark 两套给同样的值，保证任何基础模式下都是卡拉彼丘风 */
    const T = (v) => ({ light: v, dark: v })

    const TOKENS = {
      /* ---------- 背景层 ---------- */
      '--dsw-alias-bg-base': T('#0d0f13'),
      '--dsw-alias-bg-layer-1': T('#14171c'),
      '--dsw-alias-bg-layer-2': T('#1a1e24'),
      '--dsw-alias-bg-layer-3': T('#21262e'),
      '--dsw-alias-bg-overlay': T('#262c35'),
      '--dsw-alias-bg-skeleton': T('rgba(255, 107, 47, 0.07)'),
      '--dsw-alias-bg-module-platform': T('#171b21'),
      '--dsw-alias-bg-multi-select': T('rgba(255, 107, 47, 0.14)'),

      /* ---------- 边框 ---------- */
      '--dsw-alias-border-l1': T('rgba(255, 255, 255, 0.06)'),
      '--dsw-alias-border-l2': T('rgba(255, 255, 255, 0.10)'),
      '--dsw-alias-border-l3': T('rgba(255, 255, 255, 0.16)'),
      '--dsw-alias-border-l4': T('rgba(255, 107, 47, 0.32)'),

      /* ---------- 品牌 ---------- */
      '--dsw-alias-brand-primary': T('#ff6b2f'),
      '--dsw-alias-brand-primary-invert': T('#12151a'),
      '--dsw-alias-brand-text': T('#ff8a4f'),

      /* ---------- 文字 ---------- */
      '--dsw-alias-label-primary': T('#eef1f6'),
      '--dsw-alias-label-primary-bluish': T('#eef1f6'),
      '--dsw-alias-label-secondary': T('#b3bac6'),
      '--dsw-alias-label-tertiary': T('#868f9d'),
      '--dsw-alias-label-caption': T('#69717e'),
      '--dsw-alias-label-dimmed': T('#525963'),
      '--dsw-alias-label-primary-dimmed': T('#a5adb9'),
      '--dsw-alias-label-primary-foreground': T('#ffffff'),
      '--dsw-alias-label-primary-inverted': T('#0d0f13'),
      '--dsw-alias-link': T('#ff8a4f'),

      /* ---------- 交互态 ---------- */
      '--dsw-alias-interactive-bg-hover': T('rgba(255, 107, 47, 0.10)'),
      '--dsw-alias-interactive-bg-active': T('rgba(255, 107, 47, 0.17)'),
      '--dsw-alias-interactive-bg-hover-solid': T('#21262e'),
      '--dsw-alias-interactive-bg-hover-accent': T('rgba(255, 107, 47, 0.15)'),

      /* ---------- 按钮 ---------- */
      '--dsw-alias-button-primary-fill': T('#ff6b2f'),
      '--dsw-alias-button-primary-hover': T('#ff8449'),
      '--dsw-alias-button-primary-dimmed': T('rgba(255, 107, 47, 0.42)'),
      '--dsw-alias-button-ghost-active-fill': T('rgba(255, 107, 47, 0.16)'),
      '--dsw-alias-button-ghost-active-border': T('#ff6b2f'),
      '--dsw-alias-button-ghost-active-hover': T('rgba(255, 107, 47, 0.24)'),
      '--dsw-alias-button-info-fill': T('#3b82d6'),
      '--dsw-alias-button-info-hover': T('#4d94e6'),
      '--dsw-alias-button-elevated-fill': T('#21262e'),
      '--dsw-alias-button-floating-fill': T('#1a1e24'),
      '--dsw-alias-button-floating-hover': T('#262c35'),
      '--dsw-alias-button-contrast-fill': T('#eef1f6'),

      /* ---------- Markdown / 代码 ---------- */
      '--dsw-alias-markdown-code-block': T('#101317'),
      '--dsw-alias-markdown-code-block-banner': T('#1a1e24'),
      '--dsw-alias-markdown-inline-code': T('rgba(255, 107, 47, 0.13)'),
      '--dsw-alias-markdown-citation': T('#868f9d'),
      '--dsw-alias-markdown-tag': T('rgba(255, 107, 47, 0.17)'),
      '--dsw-alias-markdown-placeholder': T('#69717e'),
      '--dsw-alias-markdown-code-segment-selected': T('#ff6b2f'),
      '--dsw-alias-markdown-code-segment-unselected': T('#39404a'),

      /* ---------- 滚动条 ---------- */
      '--dsw-alias-scrollbar-bg-l1': T('rgba(255, 255, 255, 0.08)'),
      '--dsw-alias-scrollbar-bg-l2': T('rgba(255, 255, 255, 0.12)'),
      '--dsw-alias-scrollbar-hover-l1': T('rgba(255, 107, 47, 0.32)'),
      '--dsw-alias-scrollbar-hover-l2': T('rgba(255, 107, 47, 0.48)'),

      /* ---------- 浮层 ---------- */
      '--dsw-alias-tooltip-bg': T('#21262e'),
      '--dsw-alias-toast-bg': T('#1a1e24'),

      /* ---------- 状态色 ---------- */
      '--dsw-alias-state-error-primary': T('#ff4d4f'),
      '--dsw-alias-state-error-secondary': T('#d9363e'),
      '--dsw-alias-state-success-primary': T('#3ecf8e'),
      '--dsw-alias-state-success-secondary': T('#2fa876'),
      '--dsw-alias-state-success-tertiary': T('rgba(62, 207, 142, 0.16)'),
      '--dsw-alias-state-warn-primary': T('#ffb020'),
      '--dsw-alias-state-warn-secondary': T('#d9921a'),
      '--dsw-alias-state-warn-tertiary': T('rgba(255, 176, 32, 0.16)'),
      '--dsw-alias-state-warn-label': T('#ffb020'),
      '--dsw-alias-state-business-primary': T('#ff6b2f'),
      '--dsw-alias-state-business-tertiary': T('rgba(255, 107, 47, 0.16)'),

      /* ---------- 侧边栏 ---------- */
      '--dsw-specific-sidebar-fill': T('#14171c'),
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  氛围层 CSS（纯 CSS，不依赖任何外部图片）
     * ═══════════════════════════════════════════════════════════════════ */
    const STYLE_ID = 'dsh-theme-calabiyau-style'

    function buildCSS() {
      const bgLayer = ASSETS.background
        ? `
      /* 用户提供的背景图（默认关闭） */
      #${STYLE_ID}-bg {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: url('${ASSETS.background}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: ${ASSETS.backgroundOpacity};
        filter: blur(${ASSETS.backgroundBlur}px);
      }`
        : ''

      const watermarkLayer = ASSETS.watermark
        ? `
      /* 用户提供的水印 / 立绘 */
      #${STYLE_ID}-mark {
        position: fixed;
        right: 18px;
        bottom: 16px;
        z-index: 1;
        width: ${ASSETS.watermarkWidth}px;
        pointer-events: none;
        opacity: ${ASSETS.watermarkOpacity};
        user-select: none;
      }`
        : ''

      const ambientLayer = ASSETS.ambient
        ? `
      /* 科幻氛围层：细网格 + 橙色光晕（pointer-events:none，不挡交互） */
      #${STYLE_ID}-ambient {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(255, 107, 47, 0.032) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 107, 47, 0.032) 1px, transparent 1px),
          radial-gradient(58% 42% at 12% -4%, rgba(255, 107, 47, 0.11), transparent 62%),
          radial-gradient(48% 38% at 90% 104%, rgba(255, 107, 47, 0.08), transparent 62%);
        background-size: 46px 46px, 46px 46px, 100% 100%, 100% 100%;
      }`
        : ''

      return `
      ${ambientLayer}
      ${bgLayer}
      ${watermarkLayer}

      /* 品牌强调：让选中 / 焦点更"卡拉彼丘" */
      ::selection {
        background: rgba(255, 107, 47, 0.30);
        color: #ffffff;
      }
      `
    }

    function mountLayers() {
      if (document.getElementById(STYLE_ID)) return
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = buildCSS()
      document.head.appendChild(style)

      // 插入到 body 最前，保证背景/氛围层渲染在 UI 之下（配合 pointer-events:none 不挡交互）
      const add = (id, tag) => {
        if (!document.getElementById(id)) {
          const el = document.createElement(tag)
          el.id = id
          el.setAttribute('aria-hidden', 'true')
          document.body.insertBefore(el, document.body.firstChild)
        }
      }
      if (ASSETS.ambient) add(`${STYLE_ID}-ambient`, 'div')
      if (ASSETS.background) add(`${STYLE_ID}-bg`, 'div')
      if (ASSETS.watermark) {
        const mark = document.createElement('img')
        mark.id = `${STYLE_ID}-mark`
        mark.src = ASSETS.watermark
        mark.alt = ''
        mark.setAttribute('aria-hidden', 'true')
        document.body.appendChild(mark)
      }
    }

    function unmountLayers() {
      const style = document.getElementById(STYLE_ID)
      if (style) style.remove()
      ;['-ambient', '-bg', '-mark'].forEach((suffix) => {
        const el = document.getElementById(`${STYLE_ID}${suffix}`)
        if (el) el.remove()
      })
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  Cordis 插件导出
     * ═══════════════════════════════════════════════════════════════════ */

    exports.name = 'dsh-theme-calabiyau'

    /**
     * 只声明真正需要的服务。`theme` 由 @deepseek-ai/dsh-client-ui-theme 提供；
     * 通过 inject 消费它就足以决定启动顺序 —— 不要再声明 `modifies`。
     * （注意：这行不能写进注释里，静态审计会误读，所以说明放在这里。）
     */
    exports.inject = ['theme']

    /** 标记为插件，而非普通服务模块 */
    exports.isPlugin = true

    exports.apply = function apply(ctx, config) {
      const enabled = !config || config.enabled !== false

      /**
       * 注册皮肤。
       *
       * `ctx.theme.register` 在 **id 冲突时会抛错**，而 apply 可能在
       * `theme/change` 之类的时机被再次触达，所以用一个 Set 保证幂等。
       * 包进 `ctx.effect`：卸载插件时注册会被自动撤回。
       */
      const contributed = new Set()
      const contribute = () => {
        if (contributed.has('calabiyau')) return
        contributed.add('calabiyau')
        return ctx.theme.register({
          id: 'calabiyau',
          label: '卡拉彼丘',
          description: '深色科幻战场 —— 橙红 #ff6b2f × 深灰 #222222，含网格氛围层与自定义素材位',
          colorScheme: 'dark',
          tokens: TOKENS,
        })
      }

      try {
        if (typeof ctx.effect === 'function') {
          ctx.effect(contribute, 'dsh-theme-calabiyau: theme')
        } else {
          contribute()
        }
      } catch (err) {
        console.error('[dsh-theme-calabiyau] 注册主题失败:', err)
      }

      if (!enabled) return

      if (document.body) {
        mountLayers()
      } else {
        document.addEventListener('DOMContentLoaded', mountLayers, { once: true })
      }

      // 卸载时清理注入的 DOM
      try {
        if (typeof ctx.effect === 'function') {
          ctx.effect(() => unmountLayers, 'dsh-theme-calabiyau: layers')
        } else if (typeof ctx.on === 'function') {
          ctx.on('dispose', unmountLayers)
        }
      } catch (err) {
        console.warn('[dsh-theme-calabiyau] 清理钩子注册失败:', err)
      }
    }

    return module.exports
  },
})
