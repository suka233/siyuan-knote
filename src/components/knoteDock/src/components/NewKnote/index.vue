<template>
  <div class="包裹 m-2">
    <div class="头部">
      <div class="前面区域 cursor-pointer" @click="shrink">{{ dayjs().format('YYYY-MM-DD hh:mm') }} 收缩</div>
    </div>
    <!--    <div class="内容"><a-textarea v-model:value="content" :rows="5" :maxRow="5" class="输入区域" @keyup.enter="shrink" /></div>-->
    <div class="内容">
      <v-textarea
        v-model="knote.content"
        class="输入区域"
        @keydown.enter="shrink"
        no-resize
        :base-color="colorMap[knote.type].mainColor"
        bg-color="transparent"
        :hide-details="true"
      />
    </div>
    <div class="尾部">
      <div class="前面区域">
        <si-yuan-icon @click="test" />
      </div>
      <div class="尾部区域">
        <div class="类型切换">
          <v-tooltip v-for="(color, index) in colorMap" :key="color.mainColor" location="top">
            <template #activator="{ props }"
              ><v-btn
                v-bind="props"
                :style="{ backgroundColor: color.mainColor }"
                size="x-small"
                density="compact"
                icon=""
                @click="changeType(index as string)"
            /></template>
            <span>{{ color.desc }}</span>
          </v-tooltip>
          <!--          <v-btn v-for="(color, index) in colorMap" :key="color.mainColor" :style="{ backgroundColor: color.mainColor }" size="x-small" density="compact" icon="" @click="changeType(index as string)" />-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { colorMap } from '@/components/knoteDock/src/config'
import { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { appendBlock, setBlockAttrs } from '@/api/public'
import { message } from 'ant-design-vue'
const { refreshSiyuanKnotes, showNewKnote, dailyNotebookId, selectDateDailyDocId, allSiyuanKnotes, skipTransactions } =
  useData()

const knote = ref(new KNoteModel())
const test = () => {}

const sendToSiYuan = async () => {
  if (dailyNotebookId.value) {
    if (!selectDateDailyDocId.value) {
      return message.error('当天日记不存在，新建失败')
    }
    // 如果存在
    // 先插入到思源
    const res = await appendBlock({
      dataType: 'markdown',
      // parentID: '20231113112300-s2a6pi6',
      parentID: selectDateDailyDocId.value,
      data: `>${knote.value.content}`
    })

    const blockId = res.data[0].doOperations[0].id

    // 设置块属性
    setBlockAttrs({
      id: blockId,
      attrs: {
        'custom-knote-id': `${knote.value.id}`,
        'custom-b': knote.value.type
      }
    })
  } else {
    message.error('请先设置思源笔记本')
  }
}
const shrink = async (e?: KeyboardEvent) => {
  e?.preventDefault()
  if (e?.shiftKey) {
    return
  }

  if (!knote.value.content) {
    showNewKnote.value = false
    return
  }
  // 发送到思源，隐藏此组件，刷新
  sendToSiYuan()
  showNewKnote.value = false
  allSiyuanKnotes.value = [knote.value, ...allSiyuanKnotes.value]
}

const changeType = (type: string) => {
  knote.value.type = type
}

watch(
  () => showNewKnote.value,
  (newVal) => {
    if (newVal) {
      knote.value = new KNoteModel()
    }
  }
)
</script>

<style scoped lang="less">
.包裹 {
  height: 12rem;
  border-radius: 1rem;
  background-color: #cccccc;
  padding: 0.5rem;

  // 子元素flex纵向排列
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: v-bind('colorMap?.[knote.type]?.secondaryColor ?? `white`');
  border-left-width: 0.2rem;
  border-left-style: solid;
  border-left-color: v-bind('colorMap?.[knote.type]?.mainColor ?? `white`');

  .头部 {
    font-size: 0.75rem;
    padding: 0.5rem;
    // 下边框线
    //border-bottom: #eaeaec solid 1px;
    display: flex;
    justify-content: space-between;
  }

  .内容 {
    flex: 1;
    //height: 140px;
    //background-color: #eaeaec;
    //border-radius: 0.5rem;
    //padding: 0.5rem;
    .输入区域 {
      background-color: transparent;
      resize: none;
      border: none;
      :deep(textarea) {
        background-color: transparent;
      }
    }
    .输入区域:focus {
      outline: none !important;
    }
  }

  .尾部 {
    display: flex;
    justify-content: space-between;
  }
}
</style>
