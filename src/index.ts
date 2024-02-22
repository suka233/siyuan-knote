import { Dialog, getFrontend, Menu, Plugin, type Protyle } from 'siyuan'
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
import KnoteDialog from './components/knoteDialog/index.vue'
import { useTheme } from '@/hooks/useTheme'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import { setBlockAttrs } from '@/api/public'
export default class KnotePlugin extends Plugin {
  // private isMobile!: boolean
  // public menuElement!: HTMLElement
  // public dialogElement!: HTMLElement
  // private tab?: () => IModel
  tabs: Array<{
    name: string
    tab: ITab
  }>
  private menuElement: HTMLElement
  private isMobile: boolean
  private blockIconEventBindThis = this.blockIconEvent.bind(this)
  private databaseIndexCommitPromise: Promise<void>
  private resolveDatabaseIndexCommitPromise: () => void
  // 使用斜杠命令插入的callout的id
  private calloutId: string
  // 检测到了合法的databaseIndexCommit事件时，才解决Promise
  private validDatabaseIndexCommit: boolean
  constructor(options) {
    super(options)
    // this.tab = undefined
    this.tabs = []

    // 初始化Promise
    this.resetDatabaseIndexCommitPromise()
  }

  resetDatabaseIndexCommitPromise() {
    this.databaseIndexCommitPromise = new Promise<void>((resolve) => {
      this.resolveDatabaseIndexCommitPromise = resolve
    })
  }
  async onload() {
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
    await initKNoteDock(this)
    // console.log('xx', res)
    // const { updateRenderer } = useKVideoRenderer()
    // this.eventBus.on('ws-main', updateRenderer)
    // mitt.on('suka', updateRenderer)

    this.eventBus.on('open-siyuan-url-plugin', (e) => {
      console.log(e)
    })
    const { refreshSiyuanKnotes } = useData()
    this.eventBus.on('ws-main', (e) => {
      // console.log(e)
      if (e.detail.cmd === 'databaseIndexCommit') {
        console.log(`检测到合法：${e}`)
        refreshSiyuanKnotes()

        if (this.validDatabaseIndexCommit) {
          // 当事件发生时，解决Promise
          this.resolveDatabaseIndexCommitPromise()
          // 重置Promise以便下一次使用
          this.resetDatabaseIndexCommitPromise()
          this.validDatabaseIndexCommit = false
        }
      }

      if (e.detail.cmd === 'transactions') {
        // 当这次transactions包括了calloutId的时候，说明是合法的
        if (e.detail?.data?.[0]?.doOperations?.some((item) => item.id === this.calloutId)) {
          this.validDatabaseIndexCommit = true
        }
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

    // 插入自定义css
    useTheme()

    // 插入自定义菜单
    this.eventBus.on('click-blockicon', this.blockIconEventBindThis)

    // 插入斜杠菜单
    this.protyleSlash = quickCommandMap.map((item) => ({
      filter: item.key.split('|'),
      html: `
      <div
  style="justify-content: space-between; width:100%;border-left: 0.2rem solid ${
    colorMap[item.description].mainColor
  };background-color: ${colorMap[item.description].secondaryColor};border-radius: 0.2rem;margin: 0.2rem 0;"
>
    <span
    style="
      background-color: ${colorMap[item.description].mainColor};
      mask: url(/plugins/knote-plugin/img/${colorMap[item.description].descEn}.svg) no-repeat center / contain;
      display: inline-block;
      width: 0.8rem;
      margin-left: 0.2rem;
    "
    >&nbsp;
    </span>
    <span>
    ${colorMap[item.description].desc}
    </span>
    <span style="float:right;font-size: 0.8rem;color:darkgray">
    可以使用的快捷指令${item.key.split('|').join('、')}
</span>
</div>
      `,
      id: `knote-slash-${item.command}`,
      callback: async (protyle: Protyle) => {
        // console.log(this)
        protyle.insert('>')
        // 获取当前的id
        this.calloutId = protyle
          .getRange(protyle.protyle.element)!
          .commonAncestorContainer!.parentElement!.parentElement!.getAttribute('data-node-id')!
        // 用户体验优化，由于以下操作会有延迟，所以这里直接前端设置一下属性即可
        document.querySelector(`[data-node-id="${this.calloutId}"]`)!.setAttribute('custom-b', item.command)
        // 等待databaseIndexCommit事件
        await this.databaseIndexCommitPromise
        // console.log('开始设置属性')
        setBlockAttrs({
          id: this.calloutId,
          attrs: {
            'custom-b': item.command
          }
        })
      }
    }))
  }

  onunload() {}

  // 创建菜单
  private addMenu(rect: DOMRect) {
    const menu = new Menu('Kmind')

    menu.addItem({
      icon: 'iconInfo',
      label: 'KNote全局配置',
      click: () => {
        this.openConfigDialog('KNote全局配置', 'GlobalConfig')
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

  // 打开配置Dialog
  private openConfigDialog(title: string, type?: string) {
    new Dialog({
      title,
      content: `<div class="b3-dialog__content"><div id="knote-plugin-config-dialog"></div></div>`,
      width: '800px',
      height: '500px'
    })
    const root = document.getElementById('knote-plugin-config-dialog')
    // new Protyle(this.app, root, {
    //   blockId: '20230712105058-fkptf24'
    // })
    // console.log(this.app)
    const configDialogApp = createApp(KnoteDialog, { type })
    configDialogApp.use(Antd)
    configDialogApp.mount(root!)
  }

  private blockIconEvent({ detail }: any) {
    // console.log(detail)
    if (detail.blockElements.length > 1) {
      return
    }
    const ele: HTMLDivElement = detail.blockElements[0]
    if (!ele.classList.contains('bq')) {
      return
    }
    const menu: Menu = detail.menu
    const submenus: any[] = []
    const selectId = ele.getAttribute('data-node-id')!

    Object.keys(colorMap).forEach((key) => {
      const button = document.createElement('button')
      button.className = 'b3-menu__item'
      button.style.borderLeft = `0.2rem solid ${colorMap[key].mainColor}`
      button.style.backgroundColor = colorMap[key].secondaryColor
      button.innerHTML = `
<div
  style="display: flex; justify-content: space-between; width:100%"
>
    <span
    style="
      background-color: ${colorMap[key].mainColor};
      mask: url(/plugins/knote-plugin/img/${colorMap[key].descEn}.svg) no-repeat center / contain;
      display: inline-block;
      width: 0.8rem;
      margin-right: 0.2rem;
    "
    >&nbsp;
    </span>
    <span>
    ${colorMap[key].desc}
    </span>
</div>
      `
      button.onclick = () => {
        setBlockAttrs({
          id: selectId,
          attrs: {
            'custom-b': key
          }
        })
      }
      submenus.push({
        element: button
      })
    })

    // 分割线
    submenus.push({
      type: 'separator'
    })
    const defaultBtn = document.createElement('button')
    defaultBtn.className = 'b3-menu__item'
    defaultBtn.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconRefresh"></use></svg><span class="b3-menu__label">恢复默认设置</span>`
    defaultBtn.onclick = () => {
      setBlockAttrs({
        id: selectId,
        attrs: {
          'custom-b': ''
        }
      })
    }
    submenus.push({
      element: defaultBtn
    })
    // console.log(submenus)
    menu.addItem({
      icon: 'iconKnote',
      label: 'KNote',
      type: 'submenu',
      submenu: submenus
    })
  }
}
