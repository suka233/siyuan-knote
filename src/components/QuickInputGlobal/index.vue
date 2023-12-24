<template>
  <div>
    <a-row>
      <a-col :span="24" class="标题栏">
        <a-col class="tags" :span="20" />
        <a-col class="操作按钮" :span="4" />
      </a-col>
    </a-row>
    <div>
      <a-button @click="renderProtyle">整一个</a-button>
    </div>
    <div class="w-full h-full" ref="protyle"></div>
  </div>
</template>
<script setup lang="ts">
// 获取当日笔记id
// 根据id获取protyle
import { Protyle } from 'siyuan'
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import dayjs from 'dayjs'
import { appendBlock } from '@/api/public'
const plugin = inject('plugin')
const protyle = ref(null)

const { getConfig, getTargetDailyDocId } = useData()

// 渲染思源的protyle
const renderProtyle = async () => {
  // 先获取当日笔记id
  await getConfig()
  const data = await getTargetDailyDocId(dayjs().format('YYYY-MM-DD'))
  // 根据id在文档末尾插入块
  const res = await appendBlock({
    dataType: 'markdown',
    parentID: data.id,
    data: `>`
  })
  // 获取包裹id和目标id
  // 包裹id即这个callout的id，用来设置attr
  const wrapId = res.data[0].doOperations[0].id
  let targetId = ''
  const contentStr = res.data[0].doOperations[0].data
  const regex = /data-node-id="([^"]*)"/g
  const match = contentStr.match(regex)
  // data-node-id="20231222154716-u5xhdjf"
  targetId = match[1].split('"')[1]
  // 根据目标id渲染protyle
  new Protyle(plugin.app, protyle.value, {
    blockId: targetId,
    typewriterMode: true
  })
}
onMounted(() => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'knote-quick-input-visible') {
      if (e.newValue === 'true') {
        renderProtyle()
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('storage', () => {})
})
</script>

<style lang="less">
body {
  .toolbar__window {
    visibility: hidden;
  }
  #status {
    visibility: hidden;
  }
  .protyle-breadcrumb {
    display: none;
  }
}
</style>
