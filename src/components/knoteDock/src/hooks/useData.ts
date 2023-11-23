// 是否展示抽屉设置栏
import { ref } from 'vue'
import { querySql } from '@/api/public'
import dayjs from 'dayjs'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { message } from 'ant-design-vue'

const showDrawer = ref(false)
// 发送到思源笔记的方式: 插入到当天的dailyNote中，或者是插入到指定的笔记中
const sendToSiYuanMode = ref('')

// 指定的特定笔记的文档id
const specifyNoteId = ref('20230911113320-nde1ict')

// 指定的dailyNote的笔记本id
const dailyNotebookId = ref('20230911113320-nde1ict')

// 思源所有的knotes
const allSiyuanKnotes = ref<KNoteModel[]>([])

// 当天的日期
const today = ref(dayjs().format('YYYY-MM-DD'))

// 选择的日期
const selectedDay = ref('')

// 选择的日期的日记文档id
const selectDateDailyDocId = ref('')

// 是否展示新建knote组件
const showNewKnote = ref(false)

export const useData = () => {
  const refreshSiyuanKnotes = async () => {
    querySql(
      `select * from blocks where box = "${dailyNotebookId.value}" and hpath like "/daily note/%${selectedDay.value}" and type = 'b' `
    ).then((res) => {
      // 匹配custom-b=""的字符串
      const regex = /custom-b="(.*?)"/

      allSiyuanKnotes.value = res.data
        .map((item) => {
          const str = item.ial
          const match = str.match(regex)
          // console.log(str.match(regex))
          return {
            id: item.id,
            content: item.content,
            showMode: 'simple',
            type: match?.[1] || 'default'
          }
        })
        .reverse()
      // console.log(allSiyuanKnotes.value)
    })
  }

  const getTargetDailyDocId = async (date = selectedDay.value) => {
    const sql = `select * from blocks where box = "${dailyNotebookId.value}" and hpath like "/daily note/%${date}" and type = 'd'`
    querySql(sql).then((res) => {
      if (res.data.length) {
        selectDateDailyDocId.value = res.data[0].id
        // 存在
        return res.data[0]
      } else {
        message.error(`不存在${date}的日记，请新建`)
      }
    })
  }
  const getConfig = async () => {
    // TODO 读取配置
  }

  const saveConfig = async () => {
    // TODO 保存配置
  }
  return {
    showDrawer,
    sendToSiYuanMode,
    specifyNoteId,
    dailyNotebookId,
    allSiyuanKnotes,
    refreshSiyuanKnotes,
    today,
    selectedDay,
    showNewKnote,
    selectDateDailyDocId,
    getTargetDailyDocId
  }
}
