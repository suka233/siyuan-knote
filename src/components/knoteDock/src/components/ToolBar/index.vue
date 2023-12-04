<template>
  <div id="toolbar" class="toolbar">
    <a-row>
      <a-col :span="4"><span class="title">KNote</span></a-col>
      <a-col :span="12">
        <div class="日期选择器">
          <date-setting />
        </div>
      </a-col>
      <a-col :span="8">
        <div class="操作按钮" @click="newKnote">新建</div>
        <div class="操作按钮" @click="refresh">刷新</div>
        <!--        <setting-pop />-->
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useData } from '@/components/knoteDock/src/hooks/useData'
import DateSetting from '@/components/knoteDock/src/components/DateSetting/index.vue'

const { refreshSiyuanKnotes, showNewKnote } = useData()

const newKnote = () => {
  showNewKnote.value = true
}
const refresh = () => {
  // refreshSiyuanKnotes().then(() => {
  //   console.log(allSiyuanKnotes.value)
  // })
  refreshSiyuanKnotes()
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
