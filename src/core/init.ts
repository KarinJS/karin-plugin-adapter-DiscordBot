import { AdapterDiscord } from './index'
import { createRequire } from 'module'
import { karinPathBase, existsSync, mkdirSync, requireFileSync } from 'node-karin'
import { CfgType, dirPath } from '@/imports'
import fs from 'fs'
import path from 'path'

// 初始化配置文件
export const pkg = () => requireFileSync(`${dirPath}/package.json`)
const pluginName = pkg().name.replace(/\//g, '-')
const cfgPath = `${karinPathBase}/${pluginName}/config/config.json`
const config = {
  proxy: '',
  reverseproxy: '',
  tokens: [],
}
if (!existsSync(cfgPath)) {
  mkdirSync(path.dirname(cfgPath))
  fs.writeFileSync(cfgPath, JSON.stringify(config, null, 2), 'utf8')
}

async function main () {
  const data = requireFileSync(cfgPath) as CfgType

  if (!Array.isArray(data.tokens)) return

  data.tokens.forEach(v => {
    new AdapterDiscord(v, data).init(v)
  })
}

main()
