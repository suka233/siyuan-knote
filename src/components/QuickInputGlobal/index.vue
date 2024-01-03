<template>
  <div class="knote-quick-input-global-wrap flex flex-col">
    <a-row>
      <a-col :span="24" class="标题栏">
        <a-row>
          <a-col :span="22">
            <a-tooltip v-for="item in colorMap" :key="item.desc" :title="item.desc" :color="item.mainColor">
              <a-tag
                :color="`${knote.type === item.descEn ? item.mainColor : item.secondaryColor}`"
                :style="{ cursor: 'pointer' }"
                @click="handleChangeType(item.descEn!)"
                class="tags"
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
          <a-col class="操作按钮" :span="2">
            <div class="flex justify-around">
              <a-tooltip title="固定窗口">
                <pushpin-outlined
                  class="cursor-pointer text-center"
                  @click="handlePin"
                  :class="{ 'text-red': isPin }"
                />
              </a-tooltip>
              <close-outlined class="cursor-pointer text-center" @click="handleHide" />
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="包裹 relative" :style="computedStyle" ref="inputArea" v-show="editMode === 'simple'">
      <v-text-field
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
        :color="colorMap[knote.type].mainColor"
        :base-color="colorMap[knote.type].mainColor"
        :theme="theme"
      />
      <a-tooltip title="shift+enter或者点我即可展开为思源编辑器" v-if="editMode === 'simple'">
        <expand-alt-outlined
          class="cursor-pointer text-center absolute right-1rem bottom-1rem"
          @click="handleChangeMode"
        />
      </a-tooltip>
    </div>
    <!--    <question-circle-outlined @click="openTour = true" class="cursor-pointer" />-->
    <!--    <a-tour v-model:current="current" :open="openTour" :steps="steps" @close="openTour = false" />-->
    <div class="knote-protyle-wrap">
      <div
        :style="computedStyle"
        id="knote-protyle"
        class="w-full"
        ref="protyleContainer"
        v-show="editMode === 'protyle' && !protyleLoading"
        @keyup="handleProtyleKeyup"
      ></div>
      <a-skeleton active v-show="protyleLoading" />
    </div>
  </div>
</template>
<script setup lang="ts">
// 获取当日笔记id
// 根据id获取protyle
import { Plugin, Protyle } from 'siyuan'
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import dayjs from 'dayjs'
import { appendBlock, setBlockAttrs } from '@/api/public'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { ExpandAltOutlined, PushpinOutlined, CloseOutlined } from '@ant-design/icons-vue'
const plugin = inject('plugin') as Plugin
/** TODO 移植quickInput到QuickInputGlobal中
 * 需要注意的点：
 * √ 唤出QI的时候，检测一下dock栏是否加载，涉及到send方法的使用
 * √ 编辑区切换为protyle模式的时候，自动pin住此悬浮窗口，失焦不隐藏，esc后取消pin状态并隐藏
 * √ 通过监听localStorage的变化来初始化数据
 * 做一下用户指引
 */
// region 初始化
// 初始化为不同的状态
const init = (mode: 'simple' | 'protyle' = 'simple') => {
  // 初始化一个knote
  knote.value = new KNoteModel()
  // 唤出QI
  editMode.value = mode

  // 销毁
  protyle.value?.destroy()
  protyle.value = undefined
  // 即使销毁了dom节点也还在，所以需要手动清空
  protyleContainer.value && (protyleContainer.value!.innerHTML = '')
  // 显示时，获取剪贴板内容
  navigator.clipboard.readText().then((res) => {
    clipboardText.value = res
  })

  if (mode === 'simple') {
    // 如果是simple模式，就focus到文本框
    setTimeout(() => {
      inputRef.value!.focus()
    }, 200)
  } else {
    // 如果是protyle模式，就渲染protyle
    renderProtyle()
  }
}

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

    // 只有在protyle模式下才动态设置attr，因为simple模式下实际上还没创建块
    if (editMode.value === 'protyle') {
      setBlockAttrs({
        id: wrapId.value,
        attrs: {
          'custom-knote-id': `${knote.value.id}`,
          'custom-b': knote.value.type,
          'custom-knote-date':`${knote.value.createTime.slice(0,19)}`
        }
      })
    }

    // 聚焦编辑器
    if (editMode.value === 'simple') {
      inputRef.value!.focus()
    } else {
      protyleContainer.value!.querySelector(`.protyle-wysiwyg.protyle-wysiwyg--attr`)?.focus()
    }
  }
}

const knote = ref<KNoteModel>(new KNoteModel())
const computedStyle = computed(() => {
  return {
    backgroundColor: colorMap?.[knote.value.type]?.secondaryColor ?? `white`
  }
})
const editMode = ref<'simple' | 'protyle'>('simple')

const theme = ref('light')
onMounted(() => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'knote-quick-input-visible') {
      switch (e.newValue) {
        case 'true':
          init()
          break
        case 'false':
          // 隐藏QI
          editMode.value = 'simple'
          protyle.value?.destroy()
          protyle.value = undefined
          // 即使销毁了dom节点也还在，所以需要手动清空
          protyleContainer.value!.innerHTML = ''
          break
      }
    }
  })

  nextTick(() => {
    // mode: 0是浅色，1是深色
    theme.value = globalThis?.siyuan?.config?.appearance?.mode === 0 ? 'light' : 'dark'
  })
})

onUnmounted(() => {
  window.removeEventListener('storage', () => {})
})
const esc = () => {
  localStorage.setItem('knote-quick-input-visible', 'false')
  inputRef.value!.blur()
  quickInputStatus.value = ''
  editMode.value = 'simple'
}

const send = (initMode: 'simple' | 'protyle' = 'simple') => {
  // 只有为合法的type类型才发送（info,error等等）
  const res = isQuickCommand(knote.value.type)
  // const knote = new KNoteModel()
  // knote.value.content = text.value
  // knote.value.type = label.value
  // console.log(knote)
  if (res.command.command) {
    // 只有simple模式才调用接口发送到思源
    if (initMode === 'simple') {
      sendToSiYuan(knote.value!)
    }

    if (isPin.value) {
      // 如果是pin状态，就不隐藏,并且清空内容
      init(initMode)
      return
    }
    // inputRef.value!.blur()
    localStorage.setItem('knote-quick-input-visible', 'false')
    editMode.value = 'simple'
  }
}

const sendToSiYuan = async (knote: KNoteModel) => {
  // 先获取当日笔记id
  await getConfig()
  const data = await getTargetDailyDocId(dayjs().format('YYYY-MM-DD'))
  // 如果存在
  // 先插入到思源
  const res = await appendBlock({
    dataType: 'markdown',
    // parentID: '20231113112300-s2a6pi6',
    parentID: data.id,
    data: `>${knote.content ?? ''}`
  })

  const blockId = res.data[0].doOperations[0].id

  // 设置块属性
  await setBlockAttrs({
    id: blockId,
    attrs: {
      'custom-knote-id': `${knote.id}`,
      'custom-b': knote.type,
      'custom-knote-date':`${knote.createTime.slice(0,19)}`
    }
  })
}
// 编辑器转换为思源原生编辑器
const handleChangeMode = () => {
  editMode.value = 'protyle'
  renderProtyle()
}

const isPin = ref(false)
const handlePin = () => {
  if (isPin.value) {
    localStorage.setItem('knote-quick-input-pin', 'false')
    isPin.value = false
  } else {
    localStorage.setItem('knote-quick-input-pin', 'true')
    isPin.value = true
  }
}

const handleHide = () => {
  isPin.value = false
  localStorage.setItem('knote-quick-input-pin', 'false')
  localStorage.setItem('knote-quick-input-visible', 'false')

  // 开发环境，直接关闭窗口
  // localStorage.setItem('knote-quick-input-close', 'true')
}

// 当editMode变化的时候，自动设置knote-quick-input-edit-mode
watch(
  () => editMode.value,
  (newVal) => {
    localStorage.setItem('knote-quick-input-edit-mode', newVal)
  },
  {
    immediate: true
  }
)

// endregion

// region simple输入模式
const quickInputStatus = ref('')
const clipboardText = ref('')
const inputRef = ref<HTMLElement | null>(null)
const placeholder = computed(() => {
  if (clipboardText.value) {
    return `按下Tab快捷插入剪贴版内容：${clipboardText.value}`
  } else {
    return 'Hi,尝试输入一些文字然后回车吧~'
  }
})
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    send()
  }
  // 如果按下了shift+enter键，就切换到protyle模式
  if (e.key === 'Enter' && e.shiftKey) {
    editMode.value = 'protyle'
    // 自动pin住
    isPin.value = true
    localStorage.setItem('knote-quick-input-pin', 'true')
    renderProtyle()
  }
}
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
// endregion

// region protyle输入模式
const { getConfig, getTargetDailyDocId } = useData()
// 渲染思源的protyle
const wrapId = ref('')
const targetId = ref('')
const protyle = ref<Protyle>()
const protyleLoading = ref(false)
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
      'custom-b': knote.value.type,
      'custom-knote-date':`${knote.value.createTime.slice(0,19)}`
    }
  })
  // 根据目标id渲染protyle
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
const protyleContainer = ref<HTMLElement | null>(null)
const handleProtyleKeyup = (e: KeyboardEvent) => {
  // 如果是alt+enter，就发送并隐藏
  if (e.key === 'Enter' && e.altKey) {
    send('protyle')
  }

  // 如果是esc，就取消pin状态并隐藏
  if (e.key === 'Escape') {
    isPin.value = false
    localStorage.setItem('knote-quick-input-pin', 'false')
    localStorage.setItem('knote-quick-input-visible', 'false')
    editMode.value = 'simple'
  }
}
// endregion
</script>

<style lang="less">
//body {
//  .toolbar__window {
//    visibility: hidden;
//  }
//
//  //  为什么在quickInputGlobal中设置的css会影响到主渲染进程的样式啊？！
//  //#status {
//  //  visibility: hidden;
//  //}
//  .protyle-breadcrumb {
//    display: none;
//  }
//  background-color: transparent;
//}

body:has(#KnoteQuickInputGlobal) {
  .toolbar__window {
    visibility: hidden;
  }

  #status {
    visibility: hidden;
  }
  .protyle-breadcrumb {
    display: none;
  }
  //background-color: transparent;
}
//html[data-theme-mode='dark'] {
//  body:has(#KnoteQuickInputGlobal) {
//    .v-text-field .v-field--no-label input,
//    .v-text-field .v-field--active input {
//      opacity: 0.3 !important;
//      color: white !important;
//    }
//  }
//}

#KnoteQuickInputGlobal {
  box-sizing: border-box;
  background-color: transparent;
  .knote-quick-input-global-wrap {
    //border: 1px solid red;
    border-radius: 0 0 8px 8px;
    //background-color: white;
    height: 100%;
    .标题栏 {
      padding: 0.5rem;
      -webkit-app-region: drag;
      -webkit-user-select: none;
      .tags {
        -webkit-app-region: no-drag;
      }
      .操作按钮 {
        -webkit-app-region: no-drag;
      }
    }

    .knote-protyle-wrap {
      padding: 0.5rem;
      box-sizing: border-box;
      // 视口减去标题栏的高度：38px 这里要注意，如果标题栏高度变了，这里也要变，而缩小宽度，标题栏的按钮会因为挤压而使标题栏高度变大
      height: calc(100% - 38px);
      #knote-protyle {
        height: 100%;
      }
    }
  }
}
</style>
