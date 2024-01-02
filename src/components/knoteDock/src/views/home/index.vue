<template>
  <div class="relative flex flex-col" ref="wrapRef">
    <tool-bar />
    <!--    <control-bar />-->
    <new-knote v-show="showNewKnote" ref="newKnoteRef" />
    <div class="KNote-Container overflow-y-auto" v-show="allSiyuanKnotes.length" ref="knoteContainerRef">
      <!--      <k-note v-for="knote in allSiyuanKnotes" :key="knote.id" :data="knote" />-->
      <RecycleScroller :items="computedKnotes" class="scroller" key-field="id" v-slot="{ item }" ref="scrollerRef">
        <k-note :data="item" :key="item.id" v-if="item.type !== 'group'" />
        <div
          class="h-46px line-height-46px text-center cursor-pointer"
          v-else
          @click="goDailyDoc(item.group)"
          :key="item.group"
          title="点击即可跳转到对应的日记文档"
        >
          {{ item.group }}
        </div>
      </RecycleScroller>
    </div>
    <div v-show="!allSiyuanKnotes.length">暂无可以展示的Knote</div>
    <quick-input v-model:visible="showQuickInput" />
  </div>
</template>

<script setup lang="ts">
import ToolBar from '@/components/knoteDock/src/components/ToolBar/index.vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import KNote from '../../components/KNote/index.vue'
import NewKnote from '@/components/knoteDock/src/components/NewKnote/index.vue'
import QuickInput from '@/components/knoteDock/src/components/QuickInput/index.vue'
import { computed, onMounted, ref } from 'vue'
const { allSiyuanKnotes, showNewKnote, showQuickInput, panelDisplayMode, scrollTo, getDailyDocId } = useData()

// const wrapRef = ref()
// const newKnoteRef = ref()
// const knoteContainerRef = ref()
// // 计算knoteContainerRef的高度
// onMounted(() => {
//   const resizeHandler = () => {
//     nextTick(() => {
//       const toolbarHeight = 48
//       const controlBarHeight = 32
//       const newKnoteHeight = newKnoteRef.value.$el.offsetHeight
//       const wrapHeight = wrapRef.value.parentNode.parentNode.offsetHeight
//       const knoteContainerHeight = wrapHeight - toolbarHeight - controlBarHeight - newKnoteHeight
//       knoteContainerRef.value.style.height = `${knoteContainerHeight}px`
//     })
//   }
//
//   // 监听 resize 事件
//   window.addEventListener('resize', resizeHandler)
//
//   watch(
//     () => showNewKnote.value,
//     () => {
//       resizeHandler()
//     }
//   )
//
//   // 初始设置高度
//   resizeHandler()
//
//   // 在组件卸载时移除事件监听
//   onUnmounted(() => {
//     window.removeEventListener('resize', resizeHandler)
//   })
// })

const computedKnotes = computed(() => {
  if (!allSiyuanKnotes.value.length) {
    return []
  }
  const start = performance.now()

  // 将最后一项作为group
  const group = Object.groupBy(allSiyuanKnotes.value, (item) => {
    return item?.hpath?.split('/')?.pop()
  })

  // console.log('group', group)

  const result = Object.entries(group)
    .reduce((acc, [key, value]) => {
      // 使用group作为id，方便后续的虚拟滚动直接跳转到指定的group
      return [...acc, { group: key, type: 'group', id: key }, ...value]
    }, [])
    // 加上固定高度，方便虚拟滚动计算
    .map((item) => {
      return {
        ...item,
        size: 46
      }
    })
  // 根据panelDisplayMode过滤
  if (panelDisplayMode.value !== 'all') {
    const res = result.filter((item) => {
      return item.type === panelDisplayMode.value
    })

    // region 计算耗时
    const end = performance.now()
    const timeTaken = end - start
    console.log(`${res.length} knotes updated in ${timeTaken} ms`)
    // endregion

    return res
  }

  // region 计算耗时
  const end = performance.now()
  const timeTaken = end - start
  console.log(`${result.length} knotes updated in ${timeTaken} ms`)
  // endregion

  return result
})

const goDailyDoc = async (date) => {
  const id = await getDailyDocId(date)
  if (!id) {
    return
  }
  window.openFileByURL(`siyuan://blocks/${id}`)
}

const scrollerRef = ref(null)
onMounted(() => {
  // 将scrollTo方法暴露出去，使用：scrollTo('2023-12-06')
  scrollTo.value = (id) => {
    const index = computedKnotes.value.findIndex((item) => {
      return item.id === id
    })
    if (index === -1) {
      return
    }
    // @ts-ignore
    scrollerRef.value.scrollToItem(index)
  }
})
</script>

<style scoped lang="less">
.KNote-Container {
  // 视口 减去 toolbar:42, controlBar:32, 思源的底部状态栏：32, 思源的窗口操作栏:32
  height: calc(100vh - 42px - 32px - 32px);
  overflow-y: auto;
  .scroller {
    height: 100%;
  }
}
</style>
