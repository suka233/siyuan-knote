// 拓展 window 对象的属性和方法
import type siyuan, { Plugin } from 'siyuan'
declare interface Window {
  kmindApi: {
    siyuan: siyuan
    Plugin: Plugin
  }
}
