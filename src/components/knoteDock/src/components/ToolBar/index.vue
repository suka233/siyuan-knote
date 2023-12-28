<template>
  <div id="toolbar" class="toolbar">
    <a-row v-show="!isShowFilterPanel">
      <a-col :span="4"><span class="title">KNote</span></a-col>
      <a-col :span="12">
        <div class="日期选择器">
          <date-setting />
        </div>
      </a-col>
      <a-col :span="8">
        <a-popconfirm
          v-if="!todayDailyDocId"
          title="检测到今日日记还没有创建，是否创建？"
          cancel-text="不创建"
          ok-text="创建"
          @confirm="handleAddConfirm"
        >
          <div class="操作按钮" title="默认会在今天插入一条KNote">新建</div>
        </a-popconfirm>
        <div class="操作按钮" @click="newKnote" title="默认会在今天插入一条KNote" v-else>新建</div>
        <div class="操作按钮" @click="refresh">刷新</div>
        <div class="操作按钮" @click="filterPanel">筛选</div>
        <!--        <setting-pop />-->
      </a-col>
    </a-row>
    <div v-show="isShowFilterPanel" class="flex">
      <div class="切换面板 flex flex-1">
        <div
          v-for="item in segmentedOptions"
          :key="item.value"
          :title="item?.payload?.descEn"
          :style="{
            backgroundColor: item.value === panelDisplayMode ? item?.payload?.mainColor : item?.payload?.secondaryColor
          }"
          @click="handleSwitchPanel(item)"
          class="flex-1 cursor-pointer text-center"
        >
          <component
            v-if="item?.payload?.icon"
            :is="item?.payload?.icon"
            :style="{ color: item.value === panelDisplayMode ? 'white' : item?.payload?.mainColor }"
          />
          <span v-else>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from '@/components/knoteDock/src/hooks/useData'
import DateSetting from '@/components/knoteDock/src/components/DateSetting/index.vue'
import { ref } from 'vue'
import { colorMap } from '@/components/knoteDock/src/config'
import { LeftCircleFilled } from '@ant-design/icons-vue'

const { refreshSiyuanKnotes, showNewKnote, panelDisplayMode, todayDailyDocId, createTodayDailyNote } = useData()

const newKnote = () => {
  showNewKnote.value = true
}
const refresh = () => {
  // refreshSiyuanKnotes().then(() => {
  //   console.log(allSiyuanKnotes.value)
  // })
  refreshSiyuanKnotes()
}

const isShowFilterPanel = ref(false)
const filterPanel = () => {
  isShowFilterPanel.value = !isShowFilterPanel.value
}

const segmentedOptions = ref<Array<Record<string, any>>>([
  // 插入一个全部按钮
  { value: 'all' },
  ...Object.values(colorMap).map((item) => {
    return {
      value: item.descEn,
      payload: item
    }
  }),
  // 插入一个返回按钮
  {
    value: '<',
    payload: {
      icon: LeftCircleFilled,
      descEn: '返回'
    }
  }
])
const handleSwitchPanel = (item) => {
  if (item.value === '<') {
    return filterPanel()
  }
  panelDisplayMode.value = item.value
}

const handleAddConfirm = async () => {
  // 先新建今日日记
  await createTodayDailyNote()
  // 再显示KNote输入框
  newKnote()
}
</script>

<style scoped lang="less">
#toolbar {
  height: 42px;
  line-height: 42px;
}

.toolbar {
  .title {
    font-size: 1.25rem;
  }

  .日期选择器 {
    line-height: 46px;
  }

  .操作按钮 {
    display: inline-block;
    width: 42px;
    height: 42px;
    cursor: pointer;
    text-align: center;

    &:hover {
      background-color: #5c5c5c0a;
    }
  }
}
</style>
