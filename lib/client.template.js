/**
 * Browser half of the Calabiyau theme pack (卡拉彼丘 深色科幻主题).
 *
 * 它做三件事：
 *   1. 通过 `ctx.theme.overrideTokens` 把 67 个 token 叠加到当前主题上（双模式配色，跟随系统）；
 *   2. 注入暖琥珀氛围层 + 深浅双壁纸 / 双角标；
 *   3. 覆盖左上角品牌 logo 与空状态大 logo（同一 logo 源，--calabiyau-logo）。
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-calabiyau',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    /* ═══════════════════════════════════════════════════════════════════
     *  素材配置区 —— 想换素材只改这里
     *  壁纸 / 角标均为「浅色 + 深色」两套，通过 body[data-ds-dark-theme] 自动切换。
     * ═══════════════════════════════════════════════════════════════════ */
    const ASSETS = {
      /** 浅色壁纸（萌鲨梦旅） */
      backgroundLight: '@@WP_LIGHT@@',
      /** 深色壁纸（金树的乐章） */
      backgroundDark: '@@WP_DARK@@',
      /** 壁纸不透明度，固定 85% */
      backgroundOpacity: 0.85,
      /** 壁纸全局虚化（高斯模糊 px） */
      backgroundBlur: 0,
      /** 浅色角标（卡丘丘11-16） */
      watermarkLight: '@@STICKER_LIGHT@@',
      /** 深色角标（卡丘丘11-09） */
      watermarkDark: '@@STICKER_DARK@@',
      /** 角标宽 px */
      watermarkWidth: 140,
      /** 角标不透明度 */
      watermarkOpacity: 0.85,
      /** 空状态大 logo：四个宣传车一排 */
      heroRow: '@@XC_ROW@@',
      /** 是否启用纯 CSS 氛围层 */
      ambient: true,
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  卡拉彼丘配色（暖琥珀金，适配萌鲨梦旅浅色 + 金树的乐章深色）
     * ═══════════════════════════════════════════════════════════════════ */
    const T = (v) => ({ light: v, dark: v })
    const P = (light, dark) => ({ light, dark })

    const TOKENS = {
      /* ---------- 背景层（浅色/深色都透明，让壁纸透出） ---------- */
      '--dsw-alias-bg-base': T('rgba(0, 0, 0, 0)'),
      '--dsw-alias-bg-layer-1': P('rgba(255, 250, 243, 0.94)', 'rgba(29, 23, 17, 0.94)'),
      '--dsw-alias-bg-layer-2': P('rgba(250, 241, 231, 0.95)', 'rgba(36, 28, 20, 0.95)'),
      '--dsw-alias-bg-layer-3': P('rgba(243, 232, 220, 0.96)', 'rgba(45, 36, 26, 0.96)'),
      '--dsw-alias-bg-overlay': P('rgba(255, 251, 246, 0.97)', 'rgba(52, 42, 30, 0.97)'),
      '--dsw-alias-bg-skeleton': P('rgba(192, 122, 30, 0.12)', 'rgba(224, 164, 60, 0.08)'),
      '--dsw-alias-bg-module-platform': P('#f6eee4', '#211a13'),
      '--dsw-alias-bg-multi-select': P('rgba(192, 122, 30, 0.16)', 'rgba(224, 164, 60, 0.14)'),

      /* ---------- 边框 ---------- */
      '--dsw-alias-border-l1': P('rgba(90, 70, 50, 0.14)', 'rgba(255, 255, 255, 0.06)'),
      '--dsw-alias-border-l2': P('rgba(90, 70, 50, 0.20)', 'rgba(255, 255, 255, 0.10)'),
      '--dsw-alias-border-l3': P('rgba(90, 70, 50, 0.28)', 'rgba(255, 255, 255, 0.16)'),
      '--dsw-alias-border-l4': P('rgba(192, 122, 30, 0.50)', 'rgba(224, 164, 60, 0.36)'),

      /* ---------- 品牌（暖琥珀金） ---------- */
      '--dsw-alias-brand-primary': P('#c07a1e', '#e0a43c'),
      '--dsw-alias-brand-primary-invert': T('#1a130c'),
      '--dsw-alias-brand-text': P('#a86a1a', '#e8a33d'),

      /* ---------- 文字 ---------- */
      '--dsw-alias-label-primary': P('#33281f', '#f5eee2'),
      '--dsw-alias-label-primary-bluish': P('#33281f', '#f5eee2'),
      '--dsw-alias-label-secondary': P('#5a4a3c', '#d8ccbc'),
      '--dsw-alias-label-tertiary': P('#453728', '#d0c4b2'),
      '--dsw-alias-label-caption': P('#382b1e', '#d9cebd'),
      '--dsw-alias-label-dimmed': P('#483a2b', '#bcaf9c'),
      '--dsw-alias-label-primary-dimmed': P('#7a6856', '#c9bba6'),
      '--dsw-alias-label-primary-foreground': T('#ffffff'),
      '--dsw-alias-label-primary-inverted': T('#1a130c'),
      '--dsw-alias-link': P('#a86a1a', '#e8a33d'),

      /* ---------- 交互态 ---------- */
      '--dsw-alias-interactive-bg-hover': P('rgba(192, 122, 30, 0.10)', 'rgba(224, 164, 60, 0.10)'),
      '--dsw-alias-interactive-bg-active': P('rgba(192, 122, 30, 0.16)', 'rgba(224, 164, 60, 0.16)'),
      '--dsw-alias-interactive-bg-hover-solid': P('#f0e6da', '#2a2118'),
      '--dsw-alias-interactive-bg-hover-accent': P('rgba(192, 122, 30, 0.14)', 'rgba(224, 164, 60, 0.14)'),

      /* ---------- 按钮 ---------- */
      '--dsw-alias-button-primary-fill': P('#c07a1e', '#e0a43c'),
      '--dsw-alias-button-primary-hover': P('#a86a1a', '#f0b45c'),
      '--dsw-alias-button-primary-dimmed': P('rgba(192, 122, 30, 0.40)', 'rgba(224, 164, 60, 0.42)'),
      '--dsw-alias-button-ghost-active-fill': P('rgba(192, 122, 30, 0.16)', 'rgba(224, 164, 60, 0.16)'),
      '--dsw-alias-button-ghost-active-border': P('#c07a1e', '#e0a43c'),
      '--dsw-alias-button-ghost-active-hover': P('rgba(192, 122, 30, 0.22)', 'rgba(224, 164, 60, 0.24)'),
      '--dsw-alias-button-info-fill': T('#3b82d6'),
      '--dsw-alias-button-info-hover': P('#2f72c4', '#4d94e6'),
      '--dsw-alias-button-elevated-fill': P('#ffffff', '#2a2118'),
      '--dsw-alias-button-floating-fill': P('#f8f2ea', '#241c14'),
      '--dsw-alias-button-floating-hover': P('#f0e6da', '#33281e'),
      '--dsw-alias-button-contrast-fill': P('#33281f', '#f5eee2'),

      /* ---------- Markdown / 代码 ---------- */
      '--dsw-alias-markdown-code-block': P('#f8f2ea', '#1d160f'),
      '--dsw-alias-markdown-code-block-banner': P('#f0e6da', '#261e15'),
      '--dsw-alias-markdown-inline-code': P('rgba(192, 122, 30, 0.12)', 'rgba(224, 164, 60, 0.13)'),
      '--dsw-alias-markdown-citation': P('#96846f', '#93866f'),
      '--dsw-alias-markdown-tag': P('rgba(192, 122, 30, 0.16)', 'rgba(224, 164, 60, 0.17)'),
      '--dsw-alias-markdown-placeholder': P('#b3a48f', '#73654f'),
      '--dsw-alias-markdown-code-segment-selected': P('#c07a1e', '#e0a43c'),
      '--dsw-alias-markdown-code-segment-unselected': P('#d8ccc0', '#3a2f24'),

      /* ---------- 滚动条 ---------- */
      '--dsw-alias-scrollbar-bg-l1': P('rgba(90, 70, 50, 0.14)', 'rgba(255, 255, 255, 0.08)'),
      '--dsw-alias-scrollbar-bg-l2': P('rgba(90, 70, 50, 0.22)', 'rgba(255, 255, 255, 0.12)'),
      '--dsw-alias-scrollbar-hover-l1': P('rgba(192, 122, 30, 0.45)', 'rgba(224, 164, 60, 0.36)'),
      '--dsw-alias-scrollbar-hover-l2': P('rgba(192, 122, 30, 0.60)', 'rgba(224, 164, 60, 0.50)'),

      /* ---------- 浮层 ---------- */
      '--dsw-alias-tooltip-bg': P('#33281f', '#2a2118'),
      '--dsw-alias-toast-bg': P('#ffffff', '#241c14'),

      /* ---------- 状态色（浅深通用） ---------- */
      '--dsw-alias-state-error-primary': T('#e5484d'),
      '--dsw-alias-state-error-secondary': T('#d9363e'),
      '--dsw-alias-state-success-primary': T('#2ea576'),
      '--dsw-alias-state-success-secondary': T('#2fa876'),
      '--dsw-alias-state-success-tertiary': T('rgba(46, 165, 118, 0.16)'),
      '--dsw-alias-state-warn-primary': T('#d9860a'),
      '--dsw-alias-state-warn-secondary': T('#d9921a'),
      '--dsw-alias-state-warn-tertiary': T('rgba(217, 134, 10, 0.16)'),
      '--dsw-alias-state-warn-label': T('#d9860a'),
      '--dsw-alias-state-business-primary': T('#c07a1e'),
      '--dsw-alias-state-business-tertiary': T('rgba(192, 122, 30, 0.16)'),

      /* ---------- 文档/代码预览 ---------- */
      '--dsw-alias-bg-document-preview': P('rgba(251, 246, 239, 0.88)', 'rgba(31, 24, 18, 0.88)'),

      /* ---------- 消息气泡 ---------- */
      '--dsw-specific-bubble': P('rgba(255, 250, 243, 0.82)', 'rgba(29, 23, 17, 0.80)'),

      /* ---------- 侧边栏 ---------- */
      '--dsw-specific-sidebar-fill': P('rgba(246, 238, 228, 0.85)', 'rgba(29, 23, 17, 0.85)'),
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  CSS 注入
     * ═══════════════════════════════════════════════════════════════════ */
    const STYLE_ID = 'dsh-theme-calabiyau-style'

    function buildCSS() {
      const ambientLayer = ASSETS.ambient
        ? `
      #${STYLE_ID}-ambient {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(224, 164, 60, 0.030) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224, 164, 60, 0.030) 1px, transparent 1px),
          radial-gradient(58% 42% at 12% -4%, rgba(224, 164, 60, 0.10), transparent 62%),
          radial-gradient(48% 38% at 90% 104%, rgba(224, 164, 60, 0.08), transparent 62%);
        background-size: 46px 46px, 46px 46px, 100% 100%, 100% 100%;
      }`
        : ''

      return `
      ${ambientLayer}

      /* 壁纸：浅色默认，深色切换 */
      #${STYLE_ID}-bg {
        position: fixed;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        background-image: url('${ASSETS.backgroundLight}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: ${ASSETS.backgroundOpacity};
        filter: blur(${ASSETS.backgroundBlur}px);
      }
      body[data-ds-dark-theme] #${STYLE_ID}-bg {
        background-image: url('${ASSETS.backgroundDark}');
      }

      /* 角标：浅色默认，深色切换 */
      #${STYLE_ID}-mark-light,
      #${STYLE_ID}-mark-dark {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 20;
        width: ${ASSETS.watermarkWidth}px;
        pointer-events: none;
        opacity: ${ASSETS.watermarkOpacity};
        user-select: none;
      }
      #${STYLE_ID}-mark-dark { display: none; }
      body[data-ds-dark-theme] #${STYLE_ID}-mark-light { display: none; }
      body[data-ds-dark-theme] #${STYLE_ID}-mark-dark { display: inline; }


      /* AI 回答气泡（实际类名 _markdown_*） */
      [class*="_markdown_"] {
        background: var(--dsw-specific-bubble) !important;
        border-radius: 14px !important;
        padding: 8px 14px !important;
      }

      /* 代码高亮（Shiki）背景改实，避免和壁纸相混 */
      :root {
        --shiki-background: rgba(251, 246, 239, 0.88) !important;
        --shiki-foreground: #33281f !important;
      }
      body[data-ds-dark-theme] {
        --shiki-background: rgba(31, 24, 18, 0.88) !important;
        --shiki-foreground: #e8ddd0 !important;
      }

      /* 左上角品牌：DeepSeek 用主题色（浅色深字/深色浅字），Harness 徽章固定浅字 */
      .hHd-Xa_brandName,
      .hHd-Xa_fallbackBrandName {
        color: var(--dsw-alias-label-primary) !important;
      }
      .hHd-Xa_localBuildTitle,
      .hHd-Xa_buildVersion {
        color: #f5eee2 !important;
      }

      /* 会话统计（缓存/Token/上下文等）加粗 + 淡淡投影，从壁纸浮起来 */
      [class*="cacheHit"],
      [class*="usageTitle"],
      [class*="ttft"],
      [class*="llmTime"],
      [class*="toolTime"],
      [class*="speed"],
      [class*="counts"],
      [class*="contextInjection"],
      [class*="contextRecall"] {
        font-weight: 500 !important;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6) !important;
      }
      body[data-ds-dark-theme] [class*="cacheHit"],
      body[data-ds-dark-theme] [class*="usageTitle"],
      body[data-ds-dark-theme] [class*="ttft"],
      body[data-ds-dark-theme] [class*="llmTime"],
      body[data-ds-dark-theme] [class*="toolTime"],
      body[data-ds-dark-theme] [class*="speed"],
      body[data-ds-dark-theme] [class*="counts"],
      body[data-ds-dark-theme] [class*="contextInjection"],
      body[data-ds-dark-theme] [class*="contextRecall"] {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
      }

      ::selection {
        background: rgba(224, 164, 60, 0.30);
        color: #1a130c;
      }
      `
    }

    function mountLayers() {
      if (document.getElementById(STYLE_ID)) return
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = buildCSS()
      document.head.appendChild(style)

      const add = (id, tag) => {
        if (!document.getElementById(id)) {
          const el = document.createElement(tag)
          el.id = id
          el.setAttribute('aria-hidden', 'true')
          document.body.insertBefore(el, document.body.firstChild)
        }
      }
      if (ASSETS.ambient) add(`${STYLE_ID}-ambient`, 'div')
      add(`${STYLE_ID}-bg`, 'div')

      const addMark = (id, src) => {
        if (!document.getElementById(id)) {
          const img = document.createElement('img')
          img.id = id
          img.src = src
          img.alt = ''
          img.setAttribute('aria-hidden', 'true')
          document.body.appendChild(img)
        }
      }
      addMark(`${STYLE_ID}-mark-light`, ASSETS.watermarkLight)
      addMark(`${STYLE_ID}-mark-dark`, ASSETS.watermarkDark)
    }

    function unmountLayers() {
      const style = document.getElementById(STYLE_ID)
      if (style) style.remove()
      ;['-ambient', '-bg', '-mark-light', '-mark-dark'].forEach((suffix) => {
        const el = document.getElementById(`${STYLE_ID}${suffix}`)
        if (el) el.remove()
      })
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  Cordis 插件导出
     * ═══════════════════════════════════════════════════════════════════ */

    exports.name = 'dsh-theme-calabiyau'
    exports.inject = ['theme']
    exports.isPlugin = true

    exports.apply = function apply(ctx, config) {
      const enabled = !config || config.enabled !== false

      const theme = ctx.theme ?? (typeof ctx.get === 'function' ? ctx.get('theme') : undefined)
      const contributed = new Set()
      const contribute = () => {
        if (theme === undefined) return
        if (contributed.has('calabiyau')) return
        contributed.add('calabiyau')
        return theme.overrideTokens('calabiyau', TOKENS)
      }

      try {
        if (typeof ctx.effect === 'function') {
          ctx.effect(contribute, 'dsh-theme-calabiyau: theme')
        } else {
          contribute()
        }
      } catch (err) {
        console.error('[dsh-theme-calabiyau] 应用配色失败:', err)
      }

      if (!enabled) return

      if (document.body) {
        mountLayers()
      } else {
        document.addEventListener('DOMContentLoaded', mountLayers, { once: true })
      }

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
