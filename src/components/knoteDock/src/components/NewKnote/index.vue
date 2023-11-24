<template>
  <div class="包裹 m-2">
    <div class="p-2">
      <a-row>
        <a-col :span="12"
          ><div class="cursor-pointer text-3" @click="save">{{ dayjs().format('YYYY-MM-DD hh:mm') }} 保存</div></a-col
        >
        <a-col :span="12" class="text-right"
          ><span class="cursor-pointer text-3" @click="close">关闭不保存</span></a-col
        >
      </a-row>
    </div>
    <!--    <div class="内容"><a-textarea v-model:value="content" :rows="5" :maxRow="5" class="输入区域" @keyup.enter="shrink" /></div>-->
    <div class="内容">
      <v-textarea
        ref="inputRef"
        v-model="knote.content"
        class="输入区域"
        @keydown.enter="handleEnter"
        no-resize
        :base-color="colorMap[knote.type].mainColor"
        bg-color="transparent"
        :hide-details="true"
        :label="knote.type"
        placeholder="按下回车键结束编辑并保存"
      />
    </div>
    <div class="尾部">
      <div class="前面区域">
        <!--        <si-yuan-icon @click="test" />-->
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

const { showNewKnote, sendToSiYuan } = useData()

const knote = ref(new KNoteModel())

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
  sendToSiYuan(knote.value)
  showNewKnote.value = false
}

const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    return
  }
  shrink(e)
}

const save = () => {
  shrink()
}

const close = () => {
  showNewKnote.value = false
}

const changeType = (type: string) => {
  knote.value.type = type
}
const inputRef = ref()
watch(
  () => showNewKnote.value,
  (newVal) => {
    if (newVal) {
      knote.value = new KNoteModel()
      setTimeout(() => {
        inputRef.value!.focus()
      }, 200)
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
