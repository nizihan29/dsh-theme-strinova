import fs from 'node:fs'
const tpl = fs.readFileSync('lib/client.template.js', 'utf8')
const b64 = (p, mime) => mime + ',' + fs.readFileSync(p).toString('base64')
const map = {
  '@@WP_LIGHT@@':      b64('assets/embed/wp-light.jpg', 'data:image/jpeg;base64'),
  '@@WP_DARK@@':       b64('assets/embed/wp-dark.jpg', 'data:image/jpeg;base64'),
  '@@STICKER_LIGHT@@': b64('assets/embed/sticker-light.png', 'data:image/png;base64'),
  '@@STICKER_DARK@@':  b64('assets/embed/sticker-dark.png', 'data:image/png;base64'),
  '@@XC5@@': b64('assets/embed/xc-5.png', 'data:image/png;base64'),
}
let out = tpl
for (const [k, v] of Object.entries(map)) {
  if (out.split(k).length - 1 !== 1) { console.error(`占位符 ${k} 次数异常`); process.exit(1) }
  out = out.replace(k, v)
}
fs.writeFileSync('lib/client.js', out)
console.log('client.js 已生成', fs.statSync('lib/client.js').size, 'bytes')
