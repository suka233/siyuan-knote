<template>
  <div>
    <a-row>
      <a-col :span="24" class="标题栏">
        <a-row>
          <a-col class="tags" :span="22">
            <a-tooltip v-for="item in colorMap" :key="item.desc" :title="item.desc" :color="item.mainColor">
              <a-tag
                :color="`${knote.type === item.descEn ? item.mainColor : item.secondaryColor}`"
                :style="{ cursor: 'pointer' }"
                @click="handleChangeType(item.descEn!)"
              >
                <template #icon>
                  <component
                    :is="item.icon"
                    :style="{ color: knote.type === item.descEn ? 'white' : item.mainColor }"
                  />
                </template>
                <span :style="{ color: knote.type === item.descEn ? 'white' : 'gray' }">{{ item.descEn }}</span>
              </a-tag>
            </a-tooltip>
          </a-col>
          <a-col class="操作按钮" :span="2"> 操作按钮 </a-col>
        </a-row>
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
import { appendBlock, setBlockAttrs } from '@/api/public'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
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

/** TODO 移植quickInput到QuickInputGlobal中
 * 需要注意的点：
 * 唤出QI的时候，检测一下dock栏是否加载，涉及到send方法的使用
 * 编辑区切换为protyle模式的时候，自动pin住此悬浮窗口，失焦不隐藏，esc或者ctrl+enter后取消pin状态并隐藏
 */

// 更改tags
const handleChangeType = (type: string | KeyboardEvent) => {
  // 如果是键盘事件，则如果是上键，就往上切换，下键就往下切换
  if (type instanceof KeyboardEvent) {
    switch (type.key) {
      case 'ArrowUp':
        // 将label设置为当前label的上一个
        const index = Object.keys(colorMap).findIndex((item) => item === knote.value.type)
        if (index === 0) {
          knote.value.type = Object.keys(colorMap)[Object.keys(colorMap).length - 1]
        } else {
          knote.value.type = Object.keys(colorMap)[index - 1]
        }
        return
      case 'ArrowDown':
        // 将label设置为当前label的下一个
        const index2 = Object.keys(colorMap).findIndex((item) => item === knote.value.type)
        if (index2 === Object.keys(colorMap).length - 1) {
          knote.value.type = Object.keys(colorMap)[0]
        } else {
          knote.value.type = Object.keys(colorMap)[index2 + 1]
        }
        return
    }
  } else {
    // 如果是字符串，说明是直接点击，则直接设置为该字符串
    knote.value.type = type
    setBlockAttrs({
      id: wrapId.value,
      attrs: {
        'custom-knote-id': `${knote.value.id}`,
        'custom-b': knote.value.type
      }
    })
  }
}

const knote = ref<KNoteModel>(new KNoteModel())
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
