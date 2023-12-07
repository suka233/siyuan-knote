<template>
  <a-row>
    <a-col :span="4" style="text-align: right">
      <!--      <span class="向前" @click="handlePre" :disabled="displayMode === 'all'">&lt;</span>-->
      <a-button @click="handlePre" type="text">&lt;</a-button>
    </a-col>
    <a-col :span="16"
      ><a-date-picker
        v-model:value="selected"
        :locale="locale"
        :disabledDate="disabledDate"
        @change="dateChange"
        :bordered="false"
        :allow-clear="false"
        class="时间选择器"
        inputReadOnly
      >
        <template #suffixIcon>
          <SettingOutlined class="cursor-pointer!" />
        </template>
        <template #renderExtraFooter>
          <div class="p-2">
            <a-form>
              <a-form-item label="展示粒度">
                <a-radio-group v-model:value="displayMode" button-style="solid" @change="refreshSiyuanKnotes">
                  <a-radio-button value="day">单日</a-radio-button>
                  <a-radio-button value="all">全部</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="展示笔记本">
                <!--                <a-select-->
                <!--                  :placeholder="`请选择笔记本`"-->
                <!--                  class="w-full!"-->
                <!--                  :options="siYuanNoteItems"-->
                <!--                  v-model:value="dailyNotebookId"-->
                <!--                  @change="handleChangeNotebook"-->
                <!--                />-->
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="handleChangeNotebook">
                      <a-menu-item v-for="item in siYuanNoteItems" :key="item.value">
                        {{ item.label }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button>
                    {{ siYuanNoteItems.find((item) => item.value === dailyNotebookId)?.label ?? '请选择' }}
                    <DownOutlined />
                  </a-button>
                </a-dropdown>
              </a-form-item>
              <a-form-item>
                <template #label>
                  <span>启用新版查询</span>&nbsp;
                  <a-tooltip>
                    <template #title>
                      <p>-支持思源版本(2.11.1+)之后创建的任意路径格式的日记</p>
                      <p>
                        -如果需要能够查询到以前的日记，可以使用'今日笔记'插件的[为过去的 Daily Note 补充文档属性]功能
                      </p>
                      <p>-下载 '今日笔记' 插件，会有详细的指引</p>
                    </template>
                    <QuestionCircleOutlined />
                  </a-tooltip>
                </template>
                <a-switch v-model:checked="useNewQuery" @change="refreshSiyuanKnotes" />
              </a-form-item>
            </a-form>
          </div>
        </template>
      </a-date-picker>
    </a-col>
    <a-col :span="4">
      <!--      <span class="向后" @click="handleNext">&gt;</span>-->
      <a-button @click="handleNext" type="text">&gt;</a-button>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { listNotebook } from '@/api/public'
import { SettingOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
const selected = ref(dayjs())
const { refreshSiyuanKnotes, selectedDay, getTargetDailyDocId, displayMode, dailyNotebookId, useNewQuery, scrollTo } =
  useData()
const dateChange = (value) => {
  // console.log(value)

  if (displayMode.value === 'all') {
    // 跳转到指定日期
    scrollTo.value(dayjs(value).format('YYYY-MM-DD'))
    return
  }
  selectedDay.value = dayjs(value).format('YYYY-MM-DD')
  refreshSiyuanKnotes()
  getTargetDailyDocId(selectedDay.value)
}

// 禁止选择今天之后的时间
const disabledDate = (current) => {
  return current && current > dayjs().endOf('day')
}

const siYuanNoteItems = ref<Array<Record<string, any>>>([])
listNotebook().then((res) => {
  console.log(res)
  siYuanNoteItems.value = res.data.notebooks.map((item: any) => {
    return {
      label: item.name,
      value: item.id
    }
  })
})

const handleChangeNotebook = (e) => {
  // console.log(e)
  dailyNotebookId.value = e.key
  refreshSiyuanKnotes()
  getTargetDailyDocId(selectedDay.value)
}

const handlePre = () => {
  selected.value = selected.value.subtract(1, 'day')
  dateChange(selected.value)
}

const handleNext = () => {
  // 如果是今天，不允许next
  if (selected.value.isSame(dayjs(), 'day')) {
    return
  }
  selected.value = selected.value.add(1, 'day')
  dateChange(selected.value)
}

// 当displayMode变为all的时候，selected.value变为今天，覆写前进，后退，切换日期的行为
watch(
  () => displayMode.value,
  (newVal) => {
    if (newVal === 'all') {
      selected.value = dayjs()
    } else {
      // 当从all变为day的时候，更新当前选择器的时间为缓存的selectedDay
      selected.value = dayjs(selectedDay.value)
    }
  }
)
</script>
<style scoped lang="less">
.向前 {
  cursor: pointer;
}
.向后 {
  cursor: pointer;
}
.日期选择器 {
  :deep(input) {
    cursor: pointer;
  }
}
</style>
