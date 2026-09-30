/**
 * Host half of the Calabiyau theme pack.
 *
 * 卡拉彼丘主题完全在**浏览器侧**注册（`ctx.theme.register`），host 侧不需要
 * 任何逻辑，因此这个文件只是一个合法的 ESM 空壳——`package.json` 的
 * `main` / `exports["."]` 需要一个可解析的入口。
 *
 * 为什么不在这里注册 settings namespace（像某些主题包那样）：
 * 桌面版 profile 的 settings provider 组合为 `path: ':memory:'`，手写的
 * `$DSH_HOME/settings.yaml` 会被归档成 `settings.yaml.imported` 且永不读取。
 * 在这里定义 schema 只会给人"改那个文件就能换主题"的错觉，所以不做。
 *
 * 主题的选择与持久化由 `@deepseek-ai/dsh-client-ui-theme` 自己负责。
 */

export const PACKAGE_NAME = 'dsh-theme-calabiyau'
export const THEME_ID = 'calabiyau'

export default { PACKAGE_NAME, THEME_ID }
