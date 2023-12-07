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
        <div class="操作按钮" @click="newKnote" title="默认会在今天插入一条KNote">新建</div>
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

const { refreshSiyuanKnotes, showNewKnote, panelDisplayMode } = useData()

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
  { value: 'all' },
  ...Object.values(colorMap).map((item) => {
    return {
      value: item.descEn,
      payload: item
    }
  }),
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
      background-color: #dfe0e1;
    }
  }
}
</style>
