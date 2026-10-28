/**
 * Host half of the Calabiyau theme pack.
 *
 * 卡拉彼丘主题完全在**浏览器侧**注册（`ctx.theme.register`），host 侧不需要任何逻辑。
 * 这个文件存在的唯一理由是 `package.json` 的 `main` / `exports["."]` 需要一个入口，
 * 而 Cordis 要求这个入口是**插件形状**。
 *
 * ── 为什么必须 `export function apply` ────────────────────────────────────────
 *
 * Cordis 校验插件是「函数」或「带 `apply` 方法的对象」。如果这里导出普通对象，
 * 加载器会抛出：
 *
 *   invalid plugin, expect function or object with an "apply" method, received object
 *
 * 而本包是 profile `bundles` 里的一员，这个错误会**直接让整个 DSH 启动失败**
 * （`Harness entry failed during startup; stopping immediately`），
 * 用户只能靠插件恢复机制把它卸载才能重新打开 DSH。
 * 所以这个空壳也必须是合规的插件形状。
 *
 * ── 不要在这里等待任何服务 ────────────────────────────────────────────────────
 *
 * 参照 dsh-theme-gallery 的记录：host 侧一旦在 deferred 回调里等待
 * `settings` / `settingsScope` 之类的服务，fiber 就会永远 pending，界面卡在
 * "Loading plugins..."。任何将来加到这个文件里的逻辑都必须是**同步**的。
 */

/** Cordis 插件名 */
export const name = 'dsh-theme-strinova'

/** 不依赖任何 host 侧服务（浏览器半的依赖写在 lib/client.js 的 exports.inject） */
export const inject = []

/**
 * host 侧空壳：什么都不做，主题由浏览器半注册。
 *
 * @param ctx - host 上下文；故意不使用。
 */
export function apply(ctx) {
  void ctx
}

export default { name, inject, apply }
