import fs from 'node:fs'
const tpl = fs.readFileSync('lib/client.template.js', 'utf8')
const b64 = (p, mime) => mime + ',' + fs.readFileSync(p).toString('base64')
const map = {
  '@@WP_LIGHT@@': b64('assets/embed/wp-light.jpg', 'data:image/jpeg;base64'),
  '@@WP_DARK@@':  b64('assets/embed/wp-dark.jpg', 'data:image/jpeg;base64'),
  '@@CHIBI_1@@':  b64('assets/embed/chibi-1.png', 'data:image/png;base64'),
  '@@CHIBI_2@@':  b64('assets/embed/chibi-2.png', 'data:image/png;base64'),
  '@@CHIBI_3@@':  b64('assets/embed/chibi-3.png', 'data:image/png;base64'),
  '@@CHIBI_4@@':  b64('assets/embed/chibi-4.png', 'data:image/png;base64'),
  '@@CHIBI_5@@':  b64('assets/embed/chibi-5.png', 'data:image/png;base64'),
  '@@CHIBI_6@@':  b64('assets/embed/chibi-6.png', 'data:image/png;base64'),
  '@@CHIBI_7@@':  b64('assets/embed/chibi-7.png', 'data:image/png;base64'),
  '@@ILLUST@@':   b64('assets/embed/illust.png', 'data:image/png;base64'),
  '@@LOGO@@':     b64('assets/embed/logo.png', 'data:image/png;base64'),
}
let out = tpl
for (const [k, v] of Object.entries(map)) {
  if (out.split(k).length - 1 !== 1) { console.error(`占位符 ${k} 次数异常`); process.exit(1) }
  out = out.replace(k, v)
}
fs.writeFileSync('lib/client.js', out)
console.log('client.js 已生成', fs.statSync('lib/client.js').size, 'bytes')
