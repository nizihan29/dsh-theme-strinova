/**
 * Browser half of the Calabiyau theme pack (卡拉彼丘 深色科幻主题).
 *
 * 它做三件事：
 *   1. 通过 `ctx.theme.overrideTokens` 把 70 个 token 叠加到当前主题上（双模式配色，跟随系统）；
 *   2. 注入暖琥珀氛围层 + 深浅双壁纸 + 随机角色角标与占位符台词；
 *   3. 覆盖左上角品牌名 / 本地构建徽章的文字配色。
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-strinova',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    /* ═══════════════════════════════════════════════════════════════════
     *  素材配置区 —— 想换素材只改这里
     *  壁纸为浅色/深色两套；角色卡（文案 + q 版）刷新时随机抽一个。
     * ═══════════════════════════════════════════════════════════════════ */
    const ASSETS = {
      /** 浅色壁纸（萌鲨梦旅） */
      backgroundLight: '@@WP_LIGHT@@',
      /** 深色壁纸（金树的乐章） */
      backgroundDark: '@@WP_DARK@@',
      /** 壁纸不透明度（浅色/深色统一） */
      backgroundOpacity: 0.7,
      /** 壁纸全局虚化（高斯模糊 px） */
      backgroundBlur: 0,
      /** 新会话页（hero）大立绘 */
      illust: '@@ILLUST@@',
      /** 左上角 logo（替换原 DeepSeek 鲸鱼 logo） */
      logo: '@@LOGO@@',
      /** 角标宽 px */
      watermarkWidth: 140,
      /** 角标不透明度 */
      watermarkOpacity: 0.85,
      /** 是否启用纯 CSS 氛围层（背景网格+光晕） */
      ambient: true,
      /** 是否启用空气中漂浮的粒子（浮在界面上方） */
      particles: true,
    }

    /* 角色卡：刷新时随机抽一个，占位符文案 + 右下角 q 版一起绑定 */
    const CHARACTERS = [
      { name: '洗大锅', line: '诶嘿、洗大锅……(*꒦ິ⌓꒦ີ)', watermark: '@@CHIBI_1@@' },
      { name: '就地复原', line: '来咯，就地复原！✧₍^˶- ˕ -˵^₎✧', watermark: '@@CHIBI_2@@' },
      { name: '你好呀', line: '你你你你你你你好呀！❍⩊❍', watermark: '@@CHIBI_3@@' },
      { name: '香奈美', line: '不要阻拦香奈美！', watermark: '@@CHIBI_4@@' },
      { name: '饱饱', line: '饱饱我绘一直看着你(ᗜ ˰ ᗜ)', watermark: '@@CHIBI_5@@' },
      { name: '没门', line: '哼😤想干掉我？没门！', watermark: '@@CHIBI_6@@' },
      { name: '对不对', line: '对的对的……不对不对！？', watermark: '@@CHIBI_7@@' },
    ]

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
      '--dsw-alias-markdown-inline-code': P('rgba(192, 122, 30, 0.24)', 'rgba(224, 164, 60, 0.24)'),
      '--dsw-alias-markdown-citation': P('rgba(192, 122, 30, 0.20)', 'rgba(224, 164, 60, 0.22)'),
      '--dsw-alias-markdown-tag': P('rgba(192, 122, 30, 0.28)', 'rgba(224, 164, 60, 0.28)'),
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
      '--dsw-alias-state-idle-primary': P('#9aa0a6', '#7d838a'),

      /* ---------- 文档/代码预览 ---------- */
      '--dsw-alias-bg-document-preview': P('rgba(251, 246, 239, 0.78)', 'rgba(31, 24, 18, 0.78)'),

      /* ---------- 消息气泡 ---------- */
      '--dsw-specific-bubble': P('rgba(255, 232, 200, 0.78)', 'rgba(224, 164, 60, 0.24)'),

      /* ---------- 侧边栏 ---------- */
      '--dsw-specific-sidebar-fill': P('rgba(246, 238, 228, 0.75)', 'rgba(29, 23, 17, 0.75)'),
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  CSS 注入
     * ═══════════════════════════════════════════════════════════════════ */
    const STYLE_ID = 'dsh-theme-strinova-style'

    function buildCSS() {
      const ambientLayer = ASSETS.ambient
        ? `
      #${STYLE_ID}-ambient {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
        background-image:
          linear-gradient(rgba(224, 164, 60, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224, 164, 60, 0.05) 1px, transparent 1px),
          radial-gradient(58% 42% at 12% -4%, rgba(224, 164, 60, 0.18), transparent 62%),
          radial-gradient(48% 38% at 90% 104%, rgba(224, 164, 60, 0.14), transparent 62%);
        background-size: 46px 46px, 46px 46px, 100% 100%, 100% 100%;
        animation: ${STYLE_ID}-breathe 9s ease-in-out infinite;
      }
      #${STYLE_ID}-ambient::after {
        content: '';
        position: absolute;
        top: -25%;
        left: -35%;
        width: 55%;
        height: 150%;
        background: linear-gradient(90deg, transparent, rgba(224, 164, 60, 0.10), transparent);
        transform: translateX(-130%) rotate(14deg);
        animation: ${STYLE_ID}-sweep 17s ease-in-out infinite;
      }
      @keyframes ${STYLE_ID}-breathe {
        0%, 100% { opacity: 0.72; }
        50% { opacity: 1; }
      }
      @keyframes ${STYLE_ID}-sweep {
        0% { transform: translateX(-130%) rotate(14deg); }
        55%, 100% { transform: translateX(320%) rotate(14deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        #${STYLE_ID}-ambient,
        #${STYLE_ID}-ambient::after {
          animation: none;
        }
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

      /* 新会话页（hero）：换成简约暖琥珀渐变底，遮掉照片壁纸 */
      body[data-strinova-hero] #${STYLE_ID}-bg {
        background-image: linear-gradient(160deg, #f7efe3 0%, #f0e2cd 45%, #e8d3b0 100%);
        opacity: 1;
      }
      body[data-strinova-hero][data-ds-dark-theme] #${STYLE_ID}-bg {
        background-image: linear-gradient(160deg, #241d15 0%, #1e1811 50%, #16120c 100%);
        opacity: 1;
      }

      /* 左侧大立绘：默认隐藏，hero 态显示 */
      #${STYLE_ID}-illust {
        display: none;
        position: fixed;
        left: 2vw;
        bottom: 0;
        height: 62vh;
        width: auto;
        z-index: -1;
        pointer-events: none;
        user-select: none;
        filter: drop-shadow(0 14px 34px rgba(110, 80, 35, 0.28));
      }
      body[data-strinova-hero] #${STYLE_ID}-illust {
        display: block;
      }
      @media (max-width: 860px) {
        #${STYLE_ID}-illust {
          left: -8vw;
          opacity: 0.45;
        }
      }

      /* 角标：跟随当前角色 */
      #${STYLE_ID}-mark {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 20;
        width: ${ASSETS.watermarkWidth}px;
        pointer-events: none;
        opacity: ${ASSETS.watermarkOpacity};
        user-select: none;
      }


      /* 会话区：低模糊 + 局部渐变护底。壁纸只吃掉最细纹理、四周保持清晰，
       * 中间文字区用一层 scrim 兜底，文字可读又不挡壁纸。 */
      [data-chat-flow] {
        backdrop-filter: blur(2.5px) saturate(140%);
        -webkit-backdrop-filter: blur(2.5px) saturate(140%);
        background:
          linear-gradient(180deg,
            rgba(246, 238, 228, 0.60) 0%,
            rgba(246, 238, 228, 0.70) 10%,
            rgba(246, 238, 228, 0.90) 90%,
            rgba(246, 238, 228, 0.60) 100%);
        border: 1px solid rgba(160, 120, 70, 0.14);
        border-radius: 20px;
        padding: 12px 14px 20px;
      }
      body[data-ds-dark-theme] [data-chat-flow] {
        backdrop-filter: blur(2.5px) saturate(140%);
        -webkit-backdrop-filter: blur(2.5px) saturate(140%);
        background:
          linear-gradient(180deg,
            rgba(20, 16, 12, 0.55) 0%,
            rgba(20, 16, 12, 0.65) 10%,
            rgba(20, 16, 12, 0.80) 90%,
            rgba(20, 16, 12, 0.55) 100%);
        border-color: rgba(224, 164, 60, 0.14);
      }

      /* 用户气泡：只有用户说的话有气泡，AI 回答浮在毛玻璃透明底上 */
      .Sixlwa_userRow .Sixlwa_bubble {
        background: rgba(255, 232, 200, 0.78) !important;
        border: 1px solid rgba(160, 120, 70, 0.28) !important;
        border-radius: 14px !important;
      }
      body[data-ds-dark-theme] .Sixlwa_userRow .Sixlwa_bubble {
        background: rgba(224, 164, 60, 0.24) !important;
        border-color: rgba(224, 164, 60, 0.38) !important;
      }

      /* 代码高亮（Shiki）背景改实，避免和壁纸相混 */
      :root {
        --shiki-background: rgba(251, 246, 239, 0.78) !important;
        --shiki-foreground: #33281f !important;
      }
      body[data-ds-dark-theme] {
        --shiki-background: rgba(31, 24, 18, 0.78) !important;
        --shiki-foreground: #e8ddd0 !important;
      }

      /* 左上角品牌：藏掉原 svg logo，换成自己的 Strinova logo */
      .hHd-Xa_brand {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
      }
      .hHd-Xa_brand svg,
      .hHd-Xa_brand::after,
      .hHd-Xa_localBuildTitle,
      .hHd-Xa_localBuildBrand,
      .hHd-Xa_buildVersion {
        display: none !important;
      }
      .hHd-Xa_brand::before {
        content: '';
        display: inline-block;
        width: 130px;
        height: 73px;
        background-image: url('${ASSETS.logo}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
      }

      /* 会话统计：胶囊用品牌琥珀色，文字高对比 */
      .bOPqQW_pill,
      .JObwrW_trigger {
        color: #33281f !important;
        background-color: rgba(242, 228, 204, 0.8) !important;
        border: 1px solid rgba(160, 120, 70, 0.28) !important;
      }
      body[data-ds-dark-theme] .bOPqQW_pill,
      body[data-ds-dark-theme] .JObwrW_trigger {
        color: #f8f0e4 !important;
        background-color: rgba(74, 52, 32, 0.88) !important;
        border-color: rgba(224, 164, 60, 0.4) !important;
      }
      .bOPqQW_label,
      .JObwrW_trigger span {
        font-weight: 600 !important;
      }

      /* 空气漂浮粒子：浮在界面上方，不挡交互 */
      #${STYLE_ID}-particles {
        position: fixed;
        inset: 0;
        z-index: 30;
        pointer-events: none;
        overflow: hidden;
      }
      #${STYLE_ID}-particles span {
        position: absolute;
        top: 100%;
        left: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 214, 150, 0.9), rgba(224, 164, 60, 0.30) 55%, transparent 75%);
        opacity: 0;
        animation-name: ${STYLE_ID}-float;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      @keyframes ${STYLE_ID}-float {
        0%   { transform: translate3d(0, 0, 0); opacity: 0; }
        8%   { opacity: 0.8; }
        85%  { opacity: 0.4; }
        100% { transform: translate3d(var(--px, 0px), -115vh, 0); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        #${STYLE_ID}-particles { display: none; }
      }

      /* 输入框占位符：比真实输入更淡，便于区分 */
      [data-composer-placeholder],
      [data-composer-card] ::placeholder,
      textarea::placeholder {
        color: rgba(150, 136, 116, 0.55) !important;
        -webkit-text-fill-color: rgba(150, 136, 116, 0.55) !important;
        opacity: 1 !important;
      }
      body[data-ds-dark-theme] [data-composer-placeholder],
      body[data-ds-dark-theme] [data-composer-card] ::placeholder,
      body[data-ds-dark-theme] textarea::placeholder {
        color: rgba(205, 190, 170, 0.5) !important;
        -webkit-text-fill-color: rgba(205, 190, 170, 0.5) !important;
      }

      ::selection {
        background: rgba(224, 164, 60, 0.30);
        color: #1a130c;
      }
      `
    }

    let onReady = null
    let placeholderDispose = null
    let heroStateDispose = null
    let heroBadgeDispose = null

    /* 把输入框占位符换成当前角色的台词（MutationObserver 兜底 React 重挂） */
    function patchPlaceholder(line) {
      const map = {
        '给智能体发消息': line,
        'Message the agent': line,
        '描述你想要构建的内容': line,
        'Describe what you want to build': line,
        '发消息或创建任务, / 调用指令, @ 文件或对话': line,
        'Message or run a task, / commands, @ files or sessions': line,
        '描述你想要构建的内容, / 调用指令, @ 文件或对话': line,
        'Describe what you want to build, / commands, @ files or sessions': line,
      }
      const walk = () => {
        document.querySelectorAll('textarea, [data-placeholder], [data-composer-placeholder]').forEach((el) => {
          if (el.hasAttribute('data-composer-placeholder')) {
            const text = el.textContent
            if (text && map[text] !== undefined && el.textContent !== map[text]) {
              el.textContent = map[text]
            }
            return
          }
          const attr = el.hasAttribute('data-placeholder') ? 'data-placeholder' : 'placeholder'
          const current = el.getAttribute(attr)
          if (current && map[current] !== undefined && el.getAttribute(attr) !== map[current]) {
            el.setAttribute(attr, map[current])
          }
        })
      }
      walk()
      const observer = new MutationObserver(walk)
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['placeholder', 'data-placeholder'] })
      placeholderDispose = () => observer.disconnect()
    }

    /* 监听 [data-phase] 切到 hero 时，给 body 挂标记，驱动新会话页样式 */
    function patchHeroState() {
      const sync = () => {
        if (document.querySelector('[data-phase="hero"]')) {
          document.body.setAttribute('data-strinova-hero', '')
        } else {
          document.body.removeAttribute('data-strinova-hero')
        }
      }
      sync()
      const observer = new MutationObserver(sync)
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-phase'] })
      heroStateDispose = () => {
        observer.disconnect()
        document.body.removeAttribute('data-strinova-hero')
      }
    }

    /* 把新会话页大标题里的「预览版」徽章文字换成自定义文案 */
    function patchHeroBadge() {
      const walk = () => {
        document.querySelectorAll('[class*="previewBadge"]').forEach((el) => {
          if (el.textContent && el.textContent.includes('预览版')) {
            el.textContent = el.textContent.replace('预览版', '惊天大卡奴版')
          }
        })
      }
      walk()
      const observer = new MutationObserver(walk)
      observer.observe(document.body, { subtree: true, childList: true })
      heroBadgeDispose = () => observer.disconnect()
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

      const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]

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
      addMark(`${STYLE_ID}-mark`, character.watermark)
      addMark(`${STYLE_ID}-illust`, ASSETS.illust)

      if (ASSETS.particles) mountParticles()

      if (character.line) patchPlaceholder(character.line)
      patchHeroState()
      patchHeroBadge()
    }

    function mountParticles() {
      if (!ASSETS.particles || document.getElementById(`${STYLE_ID}-particles`)) return
      const layer = document.createElement('div')
      layer.id = `${STYLE_ID}-particles`
      layer.setAttribute('aria-hidden', 'true')
      const N = 26
      for (let i = 0; i < N; i++) {
        const p = document.createElement('span')
        const size = (2 + Math.random() * 4).toFixed(1)
        p.style.width = size + 'px'
        p.style.height = size + 'px'
        p.style.left = (Math.random() * 100).toFixed(2) + '%'
        p.style.setProperty('--px', ((Math.random() - 0.5) * 90).toFixed(0) + 'px')
        p.style.animationDelay = (Math.random() * 18).toFixed(2) + 's'
        p.style.animationDuration = (18 + Math.random() * 24).toFixed(2) + 's'
        layer.appendChild(p)
      }
      document.body.appendChild(layer)
    }

    function unmountLayers() {
      if (onReady) document.removeEventListener('DOMContentLoaded', onReady)
      onReady = null
      if (placeholderDispose) { placeholderDispose(); placeholderDispose = null }
      if (heroStateDispose) { heroStateDispose(); heroStateDispose = null }
      if (heroBadgeDispose) { heroBadgeDispose(); heroBadgeDispose = null }
      const style = document.getElementById(STYLE_ID)
      if (style) style.remove()
      ;['-ambient', '-bg', '-mark', '-illust', '-particles'].forEach((suffix) => {
        const el = document.getElementById(`${STYLE_ID}${suffix}`)
        if (el) el.remove()
      })
    }

    /* ═══════════════════════════════════════════════════════════════════
     *  Cordis 插件导出
     * ═══════════════════════════════════════════════════════════════════ */

    exports.name = 'dsh-theme-strinova'
    exports.inject = ['theme']
    exports.isPlugin = true

    exports.apply = function apply(ctx, config) {
      const enabled = !config || config.enabled !== false

      const theme = ctx.theme ?? (typeof ctx.get === 'function' ? ctx.get('theme') : undefined)
      const contributed = new Set()
      const contribute = () => {
        if (theme === undefined) return
        if (contributed.has('strinova')) return
        contributed.add('strinova')
        return theme.overrideTokens('strinova', TOKENS)
      }

      try {
        if (typeof ctx.effect === 'function') {
          ctx.effect(contribute, 'dsh-theme-strinova: theme')
        } else {
          contribute()
        }
      } catch (err) {
        console.error('[dsh-theme-strinova] 应用配色失败:', err)
      }

      if (!enabled) return

      if (document.body) {
        mountLayers()
      } else {
        onReady = () => mountLayers()
        document.addEventListener('DOMContentLoaded', onReady, { once: true })
      }

      try {
        if (typeof ctx.effect === 'function') {
          ctx.effect(() => unmountLayers, 'dsh-theme-strinova: layers')
        } else if (typeof ctx.on === 'function') {
          ctx.on('dispose', unmountLayers)
        }
      } catch (err) {
        console.warn('[dsh-theme-strinova] 清理钩子注册失败:', err)
      }
    }

    return module.exports
  },
})
