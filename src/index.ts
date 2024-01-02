import { Plugin } from 'siyuan'
import type { ITab } from 'siyuan'
import 'uno.css'
import { knoteIcon } from './assets/icon'
import { initKNoteDock, registerIcon } from '@/utils'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { createApp } from 'vue'
import QuickInputGlobal from './components/QuickInputGlobal/index.vue'
import './assets/index.less'
import Antd from 'ant-design-vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
export default class KnotePlugin extends Plugin {
  // private isMobile!: boolean
  // public menuElement!: HTMLElement
  // public dialogElement!: HTMLElement
  // private tab?: () => IModel
  tabs: Array<{
    name: string
    tab: ITab
  }>

  constructor(options) {
    super(options)
    // this.tab = undefined
    this.tabs = []
  }

  async onload() {
    // 注册图标
    registerIcon('iconKnote', '1024', knoteIcon)

    // const frontEnd = getFrontend()
    // this.isMobile = frontEnd === 'mobile' || frontEnd === 'browser-mobile'

    // 初始化顶栏菜单按钮
    // this.menuElement = this.addTopBar({
    //   icon: 'iconKnote',
    //   title: this.i18n.openKNote,
    //   position: 'right',
    //   callback: () => {
    //     let rect = this.menuElement.getBoundingClientRect()
    //     // 如果被隐藏，则使用更多按钮
    //     if (rect.width === 0) {
    //       rect = document.querySelector('#barMore')!.getBoundingClientRect()
    //     }
    //     this.addMenu(rect)
    //   }
    // })

    // 初始化tab
    // this.tab = initKvideoTab(this)

    // 初始化dock
    const res = await initKNoteDock(this)
    // console.log('xx', res)
    // const { updateRenderer } = useKVideoRenderer()
    // this.eventBus.on('ws-main', updateRenderer)
    // mitt.on('suka', updateRenderer)

    this.eventBus.on('open-siyuan-url-plugin', (e) => {
      console.log(e)
    })
    const { refreshSiyuanKnotes, showQuickInput } = useData()
    this.eventBus.on('ws-main', (e) => {
      if (e.detail.cmd === 'databaseIndexCommit') {
        // console.log(`检测到合法：${e}`)
        refreshSiyuanKnotes()
      }
    })

    // this.addCommand({
    //   langKey: 'openQuickInput',
    //   hotkey: '⇧⌘Q',
    //   globalCallback: () => {
    //     showQuickInput.value = true
    //   }
    // })
    //
    // return

    // 非knote启动的窗口且为主窗口启动的情况下，创建快速输入窗口
    // 观察发现，其它方式启动的窗口都会有window.html后缀，而主窗口启动的窗口没有，window.html后缀的窗口不会创建额外的托盘
    if (
      !window.location.href.includes('window.html') &&
      !window.location.search.includes('knote-quick-input=true') &&
      // 适配网页视图插件打开新窗口误加载的问题
      window.location.href.includes('stage/build/app/')
    ) {
      const { BrowserWindow } = require('@electron/remote')
      // console.log(app)
      const quickInputWin = new BrowserWindow({
        width: 1000,
        height: 128,
        show: false,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        title: 'knote-quick-input',
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true,
          webviewTag: true,
          webSecurity: false,
          autoplayPolicy: 'user-gesture-required' // 桌面端禁止自动播放多媒体 https://github.com/siyuan-note/siyuan/issues/7587
        }
      })
      localStorage.setItem('knote-quick-input-visible', 'false')
      localStorage.setItem('knote-quick-input-close', 'false')
      // quickInputWin.webContents.openDevTools()
      // 失焦隐藏
      quickInputWin.webContents.on('blur', () => {
        if (localStorage.getItem('knote-quick-input-pin') === 'true') {
          return
        }
        quickInputWin.hide()
        localStorage.setItem('knote-quick-input-visible', 'false')
      })

      quickInputWin.webContents.on('show', () => {
        localStorage.setItem('knote-quick-input-visible', 'true')
      })

      quickInputWin.webContents.on('hide', () => {
        localStorage.setItem('knote-quick-input-visible', 'false')
      })
      quickInputWin.loadURL(
        // 不加上window.html后缀会导致额外的托盘被创建
        `${window.location.protocol}//${window.location.host}/stage/build/app/window.html?knote-quick-input=true`
      )
      // console.log(globalShortcut)

      this.addCommand({
        langKey: 'openQuickInput',
        hotkey: '⇧⌘Q',
        globalCallback: () => {
          // console.log('globalCallback')
          localStorage.setItem('knote-quick-input-visible', 'true')
          quickInputWin.show()
          // showQuickInput.value = true
        }
      })

      addEventListener('storage', (e) => {
        if (e.key === 'knote-quick-input-close') {
          if (e.newValue === 'true') {
            quickInputWin.close()
            localStorage.setItem('knote-quick-input-close', 'false')
          }
        }

        if (e.key === 'knote-quick-input-visible') {
          if (e.newValue === 'true') {
            quickInputWin.show()
          } else {
            quickInputWin.hide()
          }
        }

        // knote-quick-input-edit-mode 为simple时候，窗口高度设置为120，为protyle的时候，窗口高度设置为400
        if (e.key === 'knote-quick-input-edit-mode') {
          if (e.newValue === 'simple') {
            quickInputWin.setSize(1000, 128)
          } else {
            quickInputWin.setSize(1000, 400)
          }
        }
      })

      console.log('knote 主窗口加载成功')
      addEventListener('beforeunload', () => {
        console.log('beforeunload')
        quickInputWin.destroy()
      })
    } else if (window.location.search.includes('knote-quick-input=true')) {
      // 将quickInput的dom插入到body中
      console.log('knote-quick-input 窗口加载成功')
      const quickInput = document.createElement('div')
      quickInput.id = 'KnoteQuickInputGlobal'
      quickInput.style.width = '100vw'
      quickInput.style.height = '100vh'
      quickInput.style.position = 'fixed'
      // quickInput.style.backgroundColor = 'white'
      // 必须要设成这么多 不然覆盖不了思源的全局按钮
      // quickInput.style.zIndex = '1000000'
      document.body.appendChild(quickInput)
      const vuetify = createVuetify({
        components,
        directives,
        icons: {
          defaultSet: 'mdi',
          aliases,
          sets: {
            mdi
          }
        }
      })
      // 把plugin传入方便使用，注意这里的作用域是第二个插件的加载的作用域了，要和主窗口的knote通讯，可以通过localStorage
      // 动态引入QuickInputGlobal组件

      // import QuickInputGlobal from './components/QuickInputGlobal/index.vue'
      // const app = createApp(import('./components/QuickInputGlobal/index.vue')).provide('plugin', this)
      const app = createApp(QuickInputGlobal).provide('plugin', this)
      // const app = createApp(require('./components/QuickInputGlobal/index.vue')).provide('plugin', this)
      app.use(vuetify).use(Antd).mount(quickInput)
    }
  }

  onunload() {}
}
