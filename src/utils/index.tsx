import { Plugin } from 'siyuan'
import type { IModel } from 'siyuan'
import App from '@/components/kvideoTab/src/App.vue'

import KmindDock from '@/components/kmindDock/index.vue'
import KnoteDock from '@/components/knoteDock/App.vue'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { useFile } from '@/hooks/useFile'
import { useNotify } from '@/hooks/useNotify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// import { setupStore } from '@/components/kmindTab/src/store'
import KvideoPlugin from '@/index'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// 新建kmind tab页
export const initKmindTab = (plugin: Plugin): (() => IModel) => {
  return plugin.addTab({
    type: 'kmind',
    async init() {
      // console.log(this.element)
      // this.element.innerHTML = `<div class="fn__flex fn__flex-1 fn__flex-column"><div style="border: none" class="kmind kmind-tab-wrapper fn__flex fn__flex-1"></div></div>`
      const { isExistKmindWidget } = useFile()
      const isExistWidget = await isExistKmindWidget()
      if (!isExistWidget) {
        this.element.innerHTML = `<div class="fn__flex fn__flex-1 fn__flex-column"><div style="border: none" class="kmind kmind-tab-wrapper fn__flex fn__flex-1">啊哦，好像还没有安装kmind挂件哦，目前kmind插件需要kmind挂件的支持，请去 设置-集市-挂件 下载安装kmind挂件后再新建吧~</div></div>`
        useNotify()
        this.data.destroy = () => {
          plugin.removeTab(this.data.name)
        }
        return
      }
      const iframe = document.createElement('iframe')
      iframe.src = '/widgets/Kmind'
      iframe.style.border = 'none'
      iframe.classList.add('w-full', 'h-full')
      iframe.dataset.name = this.data.name
      // const root = this.element.querySelector('.kmind-tab-wrapper')
      const root = document.createElement('div')
      root.classList.add('fn__flex', 'fn__flex-1', 'fn__flex-column', 'w-full', 'h-full')
      const wrapper = document.createElement('div')
      wrapper.classList.add('kmind', 'kmind-tab-wrapper', 'fn__flex', 'fn__flex-1', 'w-full', 'h-full')
      root.appendChild(wrapper)
      wrapper.appendChild(iframe)
      this.element.appendChild(root)
      // const kmindTabApp = createApp(App, { name: this.data.name })
      // setupStore(kmindTabApp)
      // kmindTabApp.use(Antd).mount(root!)
      this.data.destroy = () => {
        // root && kmindTabApp.unmount()
        plugin.removeTab(this.data.name)
      }
    },
    beforeDestroy() {
      this.data.destroy && this.data.destroy()
    }
  })
}

// 新建kvideo tab页
export const initKvideoTab = (plugin: KvideoPlugin): (() => IModel) => {
  return plugin.addTab({
    type: 'kvideo',
    async init() {
      // console.log(this.element)
      this.element.innerHTML = `<div class="fn__flex fn__flex-1 fn__flex-column"><div style="border: none" class="kvideo kvideo-tab-wrapper fn__flex fn__flex-1"></div></div>`
      const root = this.element.querySelector('.kvideo-tab-wrapper')
      const kvideoTabApp = createApp(App)
      kvideoTabApp.provide('plugin', plugin)
      kvideoTabApp.provide('name', this.data.name)
      kvideoTabApp.provide('videoId', this.data.videoId)
      kvideoTabApp.provide('videoUrl', this.data.videoUrl)
      kvideoTabApp.use(Antd).mount(root!)
      this.data.destroy = () => {
        // root && kmindTabApp.unmount()
        plugin.removeTab(this.data.name)
      }
    },
    beforeDestroy() {
      this.data.destroy && this.data.destroy()
    }
  })
}

// 注册icon
export const registerIcon = (name, size, svg) => {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" xmlns="http://www.w3.org/2000/svg">
      <defs>
          <symbol id="${name}" viewBox="0 0 ${size} ${size}">
              ${svg}
          </symbol>
      </defs>
  </svg>`
  )
}

// 初始化kmind dock
export const initKmindDock = async (plugin: Plugin) => {
  plugin.addDock({
    config: {
      position: 'LeftBottom',
      size: {
        width: 200,
        height: 0
      },
      icon: 'iconKmind',
      title: 'Kmind'
    },
    type: 'KmindDock',
    init() {
      const root = this.element
      const kmindDockApp = createApp(KmindDock, { plugin })
      kmindDockApp.use(Antd).mount(root)
      this.data.destroy = () => {
        root && kmindDockApp.unmount()
      }
    },
    data: {},
    beforeDestroy() {
      this.data.destroy && this.data.destroy()
    }
  })
}

export const initKNoteDock = async (plugin: Plugin) => {
  let knoteApp
  plugin.addDock({
    config: {
      position: 'RightTop',
      size: {
        width: 200,
        height: 0
      },
      icon: 'iconKnote',
      title: 'Knote'
    },
    type: 'KnoteDock',
    init() {
      const root = this.element
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
      knoteApp = createApp(KnoteDock, { plugin })
      knoteApp.use(Antd).use(vuetify).mount(root)
      this.data.destroy = () => {
        root && knoteApp.unmount()
      }
    },
    data: {},
    beforeDestroy() {
      this.data.destroy && this.data.destroy()
    }
  })
  return knoteApp
}
