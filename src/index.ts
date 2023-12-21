import siyuan, { Plugin, getFrontend } from 'siyuan'
import type { IModel, ITab } from 'siyuan'
import 'uno.css'
import { knoteIcon } from './assets/icon'
import { initKNoteDock, registerIcon } from '@/utils'
import mitt from '@/hooks/useMitt'
import './assets/index.less'
import { useData } from '@/components/knoteDock/src/hooks/useData'
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

    // const { BrowserWindow, globalShortcut, app } = require('@electron/remote')
    // console.log(app)
    // const quickInputWin = new BrowserWindow({
    //   width: 800,
    //   height: 600,
    //   show: false
    // })
    // quickInputWin.loadURL('https://github.com')
    // console.log(globalShortcut)

    this.addCommand({
      langKey: 'openQuickInput',
      hotkey: '⇧⌘Q',
      globalCallback: () => {
        // quickInputWin.show()
        showQuickInput.value = true
      }
    })
  }

  onunload() {}
}
