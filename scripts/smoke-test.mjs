#!/usr/bin/env node
// 冒烟测试：在 Node 里模拟 DSH 客户端模块系统，验证 client.js 能正常加载并正确调用 overrideTokens。
import fs from 'node:fs'

const code = fs.readFileSync('lib/client.js', 'utf8')

// 1) 捕获 window.__ModuleLoader__.load 的注册信息
let captured = null
const window = {
  __ModuleLoader__: {
    load: (spec) => { captured = spec },
  },
}
const mockRequire = (id) => { throw new Error('unexpected require: ' + id) }

new Function('window', code)(window)

if (!captured) {
  console.error('✘ 未捕获到 __ModuleLoader__.load 调用')
  process.exit(1)
}
console.log('✔ 捕获注册 id:', captured.id)
console.log('  factory 类型:', typeof captured.factory)

// 2) 运行 factory，得到 module.exports
const mod = captured.factory(mockRequire)
console.log('✔ module 结构:')
console.log('  name   =', mod.name)
console.log('  inject =', JSON.stringify(mod.inject))
console.log('  isPlugin =', mod.isPlugin)
console.log('  apply 类型 =', typeof mod.apply)

// 3) 校验 TOKENS 都在 apply 闭包内通过 overrideTokens 传入，形状为 {light,dark}
let overrideSource = null
let overrideTokens = null
let disposeCalled = false
const theme = {
  overrideTokens(source, tokens) {
    overrideSource = source
    overrideTokens = tokens
    return () => { disposeCalled = true }
  },
}
const ctx = {
  theme,
  get: (name) => (name === 'theme' ? theme : undefined),
  effect: (fn, label) => { const d = fn(); return d },
  on: () => {},
}

// 模拟 document（body 为空 → 跳过挂载层，只验证 overrideTokens 路径）
global.document = {
  body: null,
  addEventListener: () => {},
  createElement: () => ({}),
  getElementById: () => null,
  head: { appendChild: () => {} },
}

mod.apply(ctx, { enabled: true })

console.log('✔ overrideTokens 调用:')
console.log('  source =', overrideSource)
const names = overrideTokens ? Object.keys(overrideTokens) : []
console.log('  token 数量 =', names.length)

let bad = 0
if (overrideTokens) {
  for (const [k, v] of Object.entries(overrideTokens)) {
    const ok = v && typeof v === 'object' && typeof v.light === 'string' && typeof v.dark === 'string'
    if (!ok) { bad++; console.error('    ✘ 形状错误:', k, JSON.stringify(v)) }
  }
}
console.log(bad === 0 ? '  ✔ 全部 token 均为 {light,dark} 字符串对' : `  ✘ ${bad} 个 token 形状错误`)
console.log('  source 正确 =', overrideSource === 'calabiyau')

const pass = captured && mod && typeof mod.apply === 'function' && overrideSource === 'calabiyau' && names.length >= 60 && bad === 0
console.log('\n' + (pass ? '✅ 冒烟测试通过' : '❌ 冒烟测试失败'))
process.exit(pass ? 0 : 1)
