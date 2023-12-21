import { Plugin } from 'siyuan'
import KnoteDock from '@/components/knoteDock/App.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// import { setupStore } from '@/components/kmindTab/src/store'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// 新建kmind tab页

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
      knoteApp = createApp(KnoteDock).provide('plugin', plugin)
      knoteApp.use(Antd).use(vuetify).use(VueVirtualScroller).mount(root)
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
