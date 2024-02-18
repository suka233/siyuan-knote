// 拓展 window 对象的属性和方法
import type siyuan, { Plugin } from 'siyuan'
declare interface Window {
  kmindApi: {
    siyuan: siyuan
    Plugin: Plugin
  }
  openFileByURL: (url: string) => void
}
declare global {
  interface Window {
    openFileByURL: (url: string) => void
    kmindApi: {
      siyuan: siyuan
      Plugin: Plugin
    }
  }
}
