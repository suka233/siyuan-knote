import { Plugin } from 'siyuan'
import type { IModel, ITab } from 'siyuan'
import 'uno.css'
import { knoteIcon } from './assets/icon'
import { initKNoteDock, registerIcon } from '@/utils'
import './assets/index.less'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { createApp } from 'vue'
import QuickInputGlobal from './components/QuickInputGlobal/index.vue'
import Antd from 'ant-design-vue'
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

    // 非knote启动的窗口的情况下，加载快速输入窗口
    if (!window.location.search.includes('knote-quick-input=true')) {
      const { BrowserWindow, globalShortcut, app } = require('@electron/remote')
      const remote = require('@electron/remote/main')
      console.log(remote)
      // console.log(app)
      const quickInputWin = new BrowserWindow({
        width: 700,
        height: 400,
        show: false,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true,
          webviewTag: true,
          webSecurity: false,
          autoplayPolicy: 'user-gesture-required' // 桌面端禁止自动播放多媒体 https://github.com/siyuan-note/siyuan/issues/7587
        }
      })
      localStorage.setItem('knote-quick-input-visible', 'false')
      // 失焦隐藏
      quickInputWin.webContents.on('blur', () => {
        quickInputWin.hide()
        localStorage.setItem('knote-quick-input-visible', 'false')
      })

      quickInputWin.webContents.on('show', () => {
        localStorage.setItem('knote-quick-input-visible', 'true')
      })

      quickInputWin.webContents.on('hide', () => {
        localStorage.setItem('knote-quick-input-visible', 'false')
      })

      // 监听快速输入窗口的显示事件

      console.log(quickInputWin.webContents)
      remote.enable(quickInputWin.webContents)
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
    } else {
      // 将quickInput的dom插入到body中
      console.log('quickInput窗口')
      const quickInput = document.createElement('div')
      quickInput.id = 'quickInput'
      quickInput.style.width = '100vw'
      quickInput.style.height = '100vh'
      quickInput.style.position = 'fixed'
      quickInput.style.backgroundColor = 'white'
      // 必须要设成这么多 不然覆盖不了思源的全局按钮
      // quickInput.style.zIndex = '1000000'
      document.body.appendChild(quickInput)
      // 把plugin传入方便使用，注意这里的作用域是第二个插件的加载的作用域了，要和主窗口的knote通讯，可以通过localStorage
      const app = createApp(QuickInputGlobal).provide('plugin', this)
      app.use(Antd).mount(quickInput)
    }
  }

  onunload() {}
}
