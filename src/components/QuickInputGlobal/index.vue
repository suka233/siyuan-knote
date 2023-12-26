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
        :base-color="colorMap[knote.type].mainColor"
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
  </div>
</template>
<script setup lang="ts">
// 获取当日笔记id
// 根据id获取protyle
import { Plugin, Protyle } from 'siyuan'
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { colorMap, quickCommandMap } from '@/components/knoteDock/src/config'
import dayjs from 'dayjs'
import { appendBlock, setBlockAttrs } from '@/api/public'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { ExpandAltOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
const plugin = inject('plugin') as Plugin

const { getConfig, getTargetDailyDocId } = useData()

// 渲染思源的protyle
const wrapId = ref('')
const targetId = ref('')
const protyle = ref<Protyle>()
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
      'custom-b': knote.value.type
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

onMounted(() => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'knote-quick-input-visible') {
      switch (e.newValue) {
        case 'true':
          // 唤出QI
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
})

onUnmounted(() => {
  window.removeEventListener('storage', () => {})
})

/** TODO 移植quickInput到QuickInputGlobal中
 * 需要注意的点：
 * 唤出QI的时候，检测一下dock栏是否加载，涉及到send方法的使用
 * 编辑区切换为protyle模式的时候，自动pin住此悬浮窗口，失焦不隐藏，esc或者ctrl+enter后取消pin状态并隐藏
 * 通过监听localStorage的变化来初始化数据
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
const computedStyle = computed(() => {
  return {
    backgroundColor: colorMap?.[knote.value.type]?.secondaryColor ?? `white`
  }
})
const editMode = ref<'simple' | 'protyle'>('simple')
const protyleContainer = ref<HTMLElement | null>(null)
const handleProtyleKeyup = () => {}

const protyleLoading = ref(false)
const quickInputStatus = ref('')
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
const esc = () => {
  localStorage.setItem('knote-quick-input-visible', 'false')
  inputRef.value!.blur()
  quickInputStatus.value = ''
  editMode.value = 'simple'
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

const send = () => {
  // 只有为合法的type类型才发送（info,error等等）
  const res = isQuickCommand(knote.value.type)
  // const knote = new KNoteModel()
  // knote.value.content = text.value
  // knote.value.type = label.value
  // console.log(knote)
  if (res.command.command) {
    sendToSiYuan(knote.value!)
    inputRef.value!.blur()
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
    data: `>${knote.content}`
  })

  const blockId = res.data[0].doOperations[0].id

  // 设置块属性
  await setBlockAttrs({
    id: blockId,
    attrs: {
      'custom-knote-id': `${knote.id}`,
      'custom-b': knote.type
    }
  })

  // 构造一个假的hath，适配按日期分组的功能
  // 这里应该要改了，因为通过新方法获取的数据，可能hpath并不准确了
  // 又不用改了，因为我在refreshSiyuanKnotes() 中，当使用新查询的时候，把hpath复写成了日期了： /YYY-MM-DD
  // TODO 利用localstorage通讯，让主窗口刷新数据
}
// 编辑器转换为思源原生编辑器
const handleChangeMode = () => {
  editMode.value = 'protyle'
  renderProtyle()
}
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
