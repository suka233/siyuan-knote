import App from '@/components/kmindTab/src/App.vue'
import { createApp } from 'vue'
import { setupStore } from '@/components/kmindTab/src/store'
import Antd from 'ant-design-vue'
const rendererMap = new Map()
export const useKVideoRenderer = () => {
  const updateRenderer = (e) => {
    console.log(e)
    return
    const videos = document.querySelectorAll(`[data-type='NodeVideo'] video`)
    // console.log(doms)
    videos.forEach((video) => {
      if (rendererMap.has(video)) {
        return
      }

      const kmindApp = createApp(App, { name: 'Test' })
      setupStore(kmindApp)
      kmindApp.use(Antd).mount(video)
      rendererMap.set(video, kmindApp)
    })
  }

  return {
    updateRenderer
  }
}
