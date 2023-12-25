快速输入框
<template>
  <a-modal v-model:open="visible" :footer="null" centered width="60rem" :forceRender="true">
    <template #title>
      <div ref="tagArea">
        <a-tooltip v-for="item in colorMap" :key="item.desc" :title="item.desc" :color="item.mainColor">
          <a-tag
            :color="`${knote.type === item.descEn ? item.mainColor : item.secondaryColor}`"
            :style="{ cursor: 'pointer' }"
            @click="handleChangeType(item.descEn!)"
          >
            <template #icon>
              <component :is="item.icon" :style="{ color: knote.type === item.descEn ? 'white' : item.mainColor }" />
            </template>
            <span :style="{ color: knote.type === item.descEn ? 'white' : 'gray' }">{{ item.descEn }}</span>
          </a-tag>
        </a-tooltip>
      </div>
    </template>
    <div class="包裹 relative" :style="computedStyle" ref="inputArea" v-show="editMode === 'simple'">
      <v-text-field
        @update:model-value="handleChange"
        v-model="knote.content"
        :label="`键盘↑↓方向键可以快速切换类型，当前类型为：${knote.type}`"
        allow-clear
        :placeholder="placeholder"
        @keyup="handleKeyup"
        ref="inputRef"
        @keydown.esc="esc"
        @keydown.tab="handleTab"
        @keydown.up="handleChangeType"
        @keydown.down="handleChangeType"
        hide-details
        :base-color="colorMap[knote.type].mainColor"
      />
      <a-tooltip title="shift+enter或者点我即可展开为思源编辑器" v-if="editMode === 'simple'">
        <expand-alt-outlined
          class="cursor-pointer text-center absolute right-1rem bottom-1rem"
          @click="handleChangeMode"
        />
      </a-tooltip>
    </div>
    <question-circle-outlined @click="openTour = true" class="cursor-pointer" />
    <a-tour v-model:current="current" :open="openTour" :steps="steps" @close="openTour = false" />
    <div>
      <div
        :style="computedStyle"
        id="knote-protyle"
        class="w-full h-15rem"
        ref="protyleContainer"
        v-show="editMode === 'protyle' && !protyleLoading"
        @keyup="handleProtyleKeyup"
      ></div>
      <a-skeleton active v-show="protyleLoading" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'

import { QuestionCircleOutlined, ExpandAltOutlined } from '@ant-design/icons-vue'
import type { TourProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import { appendBlock, setBlockAttrs } from '@/api/public'
import { Protyle, Plugin } from 'siyuan'
const { sendToSiYuan } = useData()
const props = defineProps<{
  visible: boolean
}>()
const emits = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (val) => {
    emits('update:visible', val)
  }
})

const text = ref('')
const clipboardText = ref('')
const inputRef = ref<HTMLElement | null>(null)
const placeholder = computed(() => {
  switch (quickInputStatus.value) {
    case 'setMainWinPosition':
      return '方向键调整主窗口位置,esc退出，按住shift加速'
  }

  if (clipboardText.value) {
    return `按下Tab快捷插入剪贴版内容：${clipboardText.value}`
  } else {
    return 'Hi,尝试输入一些文字然后回车吧~'
  }
})

const send = () => {
  // 只有为合法的type类型才发送（info,error等等）
  const res = isQuickCommand(knote.value.type)
  // const knote = new KNoteModel()
  // knote.value.content = text.value
  // knote.value.type = label.value
  // console.log(knote)
  if (res.command.command) {
    sendToSiYuan(knote.value!)
    // allSiyuanKnotes.value = [knote, ...allSiyuanKnotes.value]
    // text.value = ''
    inputRef.value!.blur()
    visible.value = false
    editMode.value = 'simple'
  }
}
const esc = () => {
  visible.value = false
  inputRef.value!.blur()
  quickInputStatus.value = ''
  text.value = ''
  editMode.value = 'simple'
}

const quickInputStatus = ref('')

// 判断传入值是否为快捷指令
const isQuickCommand = (value: string) => {
  const res = {
    isQuickCommand: false,
    command: {} as (typeof quickCommandMap)[0],
    value
  }

  quickCommandMap.forEach((item) => {
    if (item.key.split('|').includes(value)) {
      res.isQuickCommand = true
      res.command = item
    }
  })

  return res
}

const handleTab = (e: KeyboardEvent) => {
  e.preventDefault()
  const res = isQuickCommand(knote.value.content ?? '')
  console.log(res)

  if (res.isQuickCommand) {
    switch (res.command.command) {
      default:
        // 匹配其它的快捷命令
        // label.value = res.command.command
        knote.value.type = res.command.command
        // text.value = ''
        knote.value.content = ''
        return
    }
  }

  if (knote.value.content) {
    // 如果文本框中已经存在了内容，就不插入
    return
  }
  knote.value.content = clipboardText.value
}

const handleChange = (value: string) => {
  console.log(value)
}

const computedStyle = computed(() => {
  return {
    backgroundColor: colorMap?.[knote.value.type]?.secondaryColor ?? `white`
  }
})

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

// region 漫游指导
const current = ref(0)
const openTour = ref(false)
const tagArea = ref<HTMLElement | null>(null)
const inputArea = ref<HTMLElement | null>(null)
const steps: TourProps['steps'] = [
  {
    title: 'Callout类型选择',
    description: '这里可以快速点选Callout类型，并且在输入框聚焦的情况下，按下键盘的↑↓方向键可以快速切换类型',
    target: () => tagArea.value!,
    placement: 'bottom'
  },
  {
    title: '多功能输入框',
    description: `按下Enter键可以发送到思源；
      按下Esc键可以退出；
      当剪贴板有内容的时候，按下Tab键可以快捷插入剪贴板内容；
      输入Callout的类型，并按下Tab键，可以快速切换类型哦`,
    target: () => inputArea.value!,
    placement: 'bottom'
  }
]
// endregion
const knote = ref<KNoteModel>(new KNoteModel())
watch(visible, (val) => {
  if (val) {
    editMode.value = 'simple'
    // 显示时，获取剪贴板内容
    navigator.clipboard.readText().then((res) => {
      clipboardText.value = res
    })

    setTimeout(() => {
      inputRef.value!.focus()
    }, 200)

    // 初始化一个knote
    knote.value = new KNoteModel()
  } else {
    editMode.value = 'simple'
    protyle.value?.destroy()
    protyle.value = undefined
    // 即使销毁了dom节点也还在，所以需要手动清空
    protyleContainer.value!.innerHTML = ''
  }
})
// region 高级编辑模式
const editMode = ref<'simple' | 'protyle'>('simple')
const protyleContainer = ref<HTMLElement | null>(null)
const plugin = inject('plugin') as Plugin
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    send()
  }
  // 如果按下了shift+enter键，就切换到protyle模式
  if (e.key === 'Enter' && e.shiftKey) {
    editMode.value = 'protyle'
    renderProtyle()
  }
}

const { getConfig, getTargetDailyDocId } = useData()
const wrapId = ref('')
const targetId = ref('')
const protyle = ref<Protyle>()
const renderProtyle = async () => {
  protyleLoading.value = true
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
  wrapId.value = res.data[0].doOperations[0].id
  const contentStr = res.data[0].doOperations[0].data
  const regex = /data-node-id="([^"]*)"/g
  const match = contentStr.match(regex)
  // data-node-id="20231222154716-u5xhdjf"
  targetId.value = match[1].split('"')[1]
  // 设置包裹的attr
  await setBlockAttrs({
    id: wrapId.value,
    attrs: {
      'custom-knote-id': `${knote.value.id}`,
      'custom-b': knote.value.type
    }
  })
  // 根据目标id渲染protyle
  protyle.value = new Protyle(plugin.app, protyleContainer.value!, {
    blockId: targetId.value,
    action: ['cb-get-focus'],
    after(protyle) {
      protyleLoading.value = false
      protyle.insert(knote.value.content ?? '')
      setTimeout(() => {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })
        const target = protyleContainer.value!.querySelector(`.protyle-wysiwyg.protyle-wysiwyg--attr`) as HTMLElement
        // 直接focus不行，需要先dispatchEvent
        target.dispatchEvent(clickEvent)
        target.focus()
      })
    }
  })
}

// 编辑器转换为思源原生编辑器
const handleChangeMode = () => {
  editMode.value = 'protyle'
  renderProtyle()
}

const handleProtyleKeyup = () => {}

const protyleLoading = ref(false)
// endregion
</script>

<style lang="less">
html[data-theme-mode='dark'] {
  .ant-modal .ant-modal-content {
    background-color: #1e1e1e !important;
  }

  .ant-modal .ant-modal-header {
    background-color: #1e1e1e !important;
  }

  .v-text-field .v-field--no-label input,
  .v-text-field .v-field--active input {
    opacity: 0.3;
  }
}
#knote-protyle {
  .protyle-wysiwyg.protyle-wysiwyg--attr {
    padding: 1rem !important; // 覆盖思源默认给protyle添加的padding
  }
}
</style>
