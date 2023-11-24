// 是否展示抽屉设置栏
import { ref } from 'vue'
import {
  appendBlock,
  listFile,
  querySql,
  setBlockAttrs,
  putFile,
  putKnoteTempConfigFile,
  putKnoteConfigFile,
  putFileDirect,
  getFile
} from '@/api/public'
import dayjs from 'dayjs'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { message } from 'ant-design-vue'

const showDrawer = ref(false)
// 发送到思源笔记的方式: 插入到当天的dailyNote中，或者是插入到指定的笔记中
const sendToSiYuanMode = ref('')

// 指定的特定笔记的文档id
// const specifyNoteId = ref('20230911113320-nde1ict')
const specifyNoteId = ref('')

// 指定的dailyNote的笔记本id
// const dailyNotebookId = ref('20230911113320-nde1ict')
const dailyNotebookId = ref('')

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

// 是否展示全局快速输入框
const showQuickInput = ref(false)

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
    if (!dailyNotebookId.value) {
      return message.error('KNote: 请先设置思源笔记本')
    }
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

  const sendToSiYuan = async (knote: KNoteModel) => {
    if (!dailyNotebookId.value) {
      return message.error('请先设置思源笔记本')
    }
    if (!selectDateDailyDocId.value) {
      return message.error('当天日记不存在，新建失败')
    }
    // 如果存在
    // 先插入到思源
    const res = await appendBlock({
      dataType: 'markdown',
      // parentID: '20231113112300-s2a6pi6',
      parentID: selectDateDailyDocId.value,
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

    allSiyuanKnotes.value = [knote, ...allSiyuanKnotes.value]
  }
  const getConfig = async () => {
    const { data } = await listFile({ path: '/data/storage/petal' })

    // 如果不存在knote配置数据，则新建
    if (!(data as Array<Record<any, any>>).find((item) => item.name === 'knote' && item.isDir === true)) {
      // 创建knote目录
      await putFile({ path: '/data/storage/petal/knote', isDir: true })

      // 创建knote配置文件
      await putKnoteConfigFile({
        dailyNotebookId: ''
      })
    } else {
      // 获取配置文件内容
      const { dailyNotebookId: _dailyNotebookId } = await getFile({ path: '/data/storage/petal/knote/user.knoteconf' })
      dailyNotebookId.value = _dailyNotebookId
    }
  }

  const saveConfig = async () => {
    putKnoteConfigFile({
      dailyNotebookId: dailyNotebookId.value
    })
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
    getTargetDailyDocId,
    showQuickInput,
    sendToSiYuan,
    getConfig,
    saveConfig
  }
}
