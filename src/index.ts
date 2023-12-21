import { createApp } from 'vue'
import DialogApp from '@/components/kmindDialog/index.vue'
import siyuan, { Plugin, getFrontend, openTab, Dialog, Menu } from 'siyuan'
import type { IModel, ITab } from 'siyuan'
// import './index.sass'
import 'uno.css'
import { knoteIcon } from './assets/icon'
import { initKNoteDock, registerIcon } from '@/utils'
import Antd from 'ant-design-vue'
// import { useKVideoRenderer } from '@/hooks/useKVideoRenderer'
import mitt from '@/hooks/useMitt'
import './assets/index.less'
import { useData } from '@/components/knoteDock/src/hooks/useData'
export default class KvideoPlugin extends Plugin {
  private isMobile!: boolean
  public menuElement!: HTMLElement
  public dialogElement!: HTMLElement
  private static readonly GLOBAL: Record<string, any> = globalThis
  private static readonly PROPERTY_NAME: string = 'kvideoApi'
  private tab?: () => IModel
  tabs: Array<{
    name: string
    tab: ITab
  }>

  constructor(options) {
    super(options)
    this.tab = undefined
    this.tabs = []
  }

  async onload() {
    // 暴露插件api给外部
    KvideoPlugin.GLOBAL[KvideoPlugin.PROPERTY_NAME] = {
      plugin: this,
      siyuan,
      siyuanApp: this.app,
      mitt
    }

    // 注册图标
    registerIcon('iconKnote', '1024', knoteIcon)

    const frontEnd = getFrontend()
    this.isMobile = frontEnd === 'mobile' || frontEnd === 'browser-mobile'

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

  onunload() {
    // this.menuElement?.remove()
    delete KvideoPlugin.GLOBAL[KvideoPlugin.PROPERTY_NAME]
  }

  // 创建菜单
  private addMenu(rect: DOMRect) {
    const menu = new Menu('Kvideo')

    menu.addItem({
      icon: 'iconInfo',
      label: 'KNote全局配置',
      click: () => {
        // this.openConfigDialog('Kmind全局配置', 'GlobalConfig')
        console.log('Kvideo全局配置')
        mitt.emit('suka', 'suka mitt')
      }
    })

    // menu.addItem({
    //   icon: 'iconInfo',
    //   label: 'Kmind文件夹',
    //   click: () => {
    //     this.openConfigDialog('Kmind文件夹', 'KmindDock')
    //   }
    // })

    if (this.isMobile) {
      menu.fullscreen()
    } else {
      menu.open({
        x: rect.left,
        y: rect.bottom
      })
    }
  }

  // 打开tab页
  open(name, videoId?: string, videoUrl?: string) {
    // console.log(name)
    if (this.tabs.find((item) => item.name === name)) {
      // TODO 跳转到已经存在的tab
      // 如果已经存在，则直接返回
      return
    }

    // const tab = this.tab
    const t = openTab({
      app: this.app,
      custom: {
        icon: 'knoteIcon',
        title: name,
        data: {
          name,
          type: 'kvideo',
          videoId,
          videoUrl
        },
        // 这里还不能乱写，不然打开的tab页不能使用之前初始化的类型的tab
        id: 'kvideo-plugin' + 'kvideo'
      }
    })
    this.tabs.push({ name, tab: t })
  }

  // 关闭tab页
  closeTab(name: string) {
    const tab = this.tabs.find((item) => item.name === name)?.tab
    tab?.close()
    this.removeTab(name)
  }

  // 关闭tab页的时候，删除tabs中的tab
  removeTab(name: string) {
    this.tabs = this.tabs.filter((item) => item.name !== name)
  }

  // 刷新tabs
  refreshTabs() {
    globalThis.siyuan.layout.centerLayout.children[0].forEach((item) => {})
  }

  // 打开配置Dialog
  openConfigDialog(title: string, type?: string) {
    new Dialog({
      title,
      content: `<div class="b3-dialog__content"><div id="kmind-plugin-config-dialog"></div></div>`,
      width: '800px',
      height: '500px'
    })
    const root = document.getElementById('kmind-plugin-config-dialog')
    // new Protyle(this.app, root, {
    //   blockId: '20230712105058-fkptf24'
    // })
    // console.log(this.app)
    const configDialogApp = createApp(DialogApp, { type })
    configDialogApp.use(Antd)
    configDialogApp.mount(root!)
  }
}
