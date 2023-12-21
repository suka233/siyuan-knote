快速输入框
<template>
  <a-modal v-model:open="visible" :footer="null" centered width="60rem">
    <template #title>
      <div ref="tagArea">
        <a-tooltip v-for="item in colorMap" :key="item.desc" :title="item.desc" :color="item.mainColor">
          <a-tag
            :color="`${label === item.descEn ? item.mainColor : item.secondaryColor}`"
            :style="{ cursor: 'pointer' }"
            @click="handleChangeType(item.descEn)"
          >
            <template #icon>
              <component :is="item.icon" :style="{ color: label === item.descEn ? 'white' : item.mainColor }" />
            </template>
            <span :style="{ color: label === item.descEn ? 'white' : 'gray' }">{{ item.descEn }}</span>
          </a-tag>
        </a-tooltip>
      </div>
    </template>
    <div class="包裹" :style="computedStyle" ref="inputArea">
      <v-text-field
        @update:model-value="handleChange"
        v-model="text"
        :label="`键盘↑↓方向键可以快速切换类型，当前类型为：${label}`"
        allow-clear
        :placeholder="placeholder"
        @keydown.enter="send"
        ref="inputRef"
        @keydown.esc="esc"
        @keydown.tab="handleTab"
        @keydown.up="handleChangeType"
        @keydown.down="handleChangeType"
        hide-details
        :base-color="colorMap[label].mainColor"
      />
    </div>
    <question-circle-outlined @click="openTour = true" class="cursor-pointer" />
    <a-tour v-model:current="current" :open="openTour" :steps="steps" @close="openTour = false" />
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'

import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import type { TourProps } from 'ant-design-vue'
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
const label = ref('info')
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
  const res = isQuickCommand(label.value)
  const knote = new KNoteModel()
  knote.content = text.value
  knote.type = label.value
  // console.log(knote)
  if (res.command.command) {
    sendToSiYuan(knote)
    // allSiyuanKnotes.value = [knote, ...allSiyuanKnotes.value]
    text.value = ''
    inputRef.value!.blur()
    visible.value = false
  }
}
const esc = () => {
  visible.value = false
  inputRef.value!.blur()
  quickInputStatus.value = ''
  text.value = ''
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
  const res = isQuickCommand(text.value)
  console.log(res)

  if (res.isQuickCommand) {
    switch (res.command.command) {
      default:
        // 匹配其它的快捷命令
        label.value = res.command.command
        text.value = ''
        return
    }
  }

  if (text.value) {
    // 如果文本框中已经存在了内容，就不插入
    return
  }
  text.value = clipboardText.value
}

const handleChange = (value: string) => {
  console.log(value)
}

const computedStyle = computed(() => {
  return {
    backgroundColor: colorMap?.[label.value]?.secondaryColor ?? `white`
  }
})

const handleChangeType = (type: string | KeyboardEvent) => {
  // 如果是键盘事件，则如果是上键，就往上切换，下键就往下切换
  if (type instanceof KeyboardEvent) {
    switch (type.key) {
      case 'ArrowUp':
        // 将label设置为当前label的上一个
        const index = Object.keys(colorMap).findIndex((item) => item === label.value)
        if (index === 0) {
          label.value = Object.keys(colorMap)[Object.keys(colorMap).length - 1]
        } else {
          label.value = Object.keys(colorMap)[index - 1]
        }
        return
      case 'ArrowDown':
        // 将label设置为当前label的下一个
        const index2 = Object.keys(colorMap).findIndex((item) => item === label.value)
        if (index2 === Object.keys(colorMap).length - 1) {
          label.value = Object.keys(colorMap)[0]
        } else {
          label.value = Object.keys(colorMap)[index2 + 1]
        }
        return
    }
  } else {
    // 如果是字符串，则直接设置为该字符串
    label.value = type
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

watch(
  visible,
  (val) => {
    if (val) {
      // 显示时，获取剪贴板内容
      navigator.clipboard.readText().then((res) => {
        clipboardText.value = res
      })

      setTimeout(() => {
        inputRef.value!.focus()
      }, 200)
    }
  },
  {
    immediate: true
  }
)
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
</style>
