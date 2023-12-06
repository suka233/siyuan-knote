// 是否展示抽屉设置栏
import { ref } from 'vue'
import { appendBlock, listFile, querySql, setBlockAttrs, putFile, putKnoteConfigFile, getFile } from '@/api/public'
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
const selectedDay = ref(dayjs().format('YYYY-MM-DD'))

// 选择的日期的日记文档id
const selectDateDailyDocId = ref('')

// 是否展示新建knote组件
const showNewKnote = ref(false)

// 是否展示全局快速输入框
const showQuickInput = ref(false)

// 展示粒度：day,all
const displayMode = ref<'day' | 'all'>('all')

// 使用新版查询
const useNewQuery = ref(false)

export const useData = () => {
  const refreshSiyuanKnotes = async () => {
    // 查出所有的callout
    const daySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${selectedDay.value}' and type = 'b' limit 100000`
    const daySqlNew = `select B.* from blocks as B join attributes as A
on B.root_id = A.root_id
where A.name like 'custom-dailynote-${dayjs(selectedDay.value).format('YYYYMMDD')}'
and B.type = 'b'
order by A.value desc
limit 100000;`

    // 先按日期倒叙排列，再按更新时间倒叙排列
    const allSql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%' and type = 'b' ORDER BY SUBSTR(hpath, -10) DESC,updated DESC limit 100000`
    const allSqlNew = `select B.* from blocks as B join attributes as A
on B.root_id = A.root_id
where A.name like 'custom-dailynote-%'
and B.type = 'b'
order by A.value desc, B.updated desc
limit 100000;`

    querySql(
      displayMode.value === 'day' ? (useNewQuery.value ? daySqlNew : daySql) : useNewQuery.value ? allSqlNew : allSql
    ).then((res) => {
      // 匹配custom-b=""的字符串
      const regex = /custom-b="(.*?)"/

      allSiyuanKnotes.value = res.data.map((item) => {
        const str = item.ial
        const match = str.match(regex)
        // console.log(str.match(regex))
        return {
          id: item.id,
          content: item.content,
          showMode: 'simple',
          type: match?.[1] || 'default',
          hpath: item.hpath
        }
      })
      // console.log(allSiyuanKnotes.value)
    })
  }

  const getTargetDailyDocId = async (date = selectedDay.value) => {
    if (!dailyNotebookId.value) {
      return message.error('KNote: 请先设置思源笔记本')
    }
    const daySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${date}' and type = 'd'`
    const daySqlNew = `select B.* from blocks as B join attributes as A on B.root_id = A.root_id where A.name like 'custom-dailynote-${dayjs(
      date
    ).format('YYYYMMDD')}' and B.type = 'd' order by A.value desc;`
    // const allSql = `select * from blocks where box = "${dailyNotebookId.value}" and hpath like "/daily note/%${date}" and type = 'd'`
    querySql(useNewQuery.value ? daySqlNew : daySql).then((res) => {
      if (res.data.length) {
        if (res.data.length > 1) {
          message.info(`KNote:当前笔记本下存在多个${date}的日记，请检查`)
        }
        selectDateDailyDocId.value = res.data[0].id
        // 存在
        return res.data[0]
      } else {
        message.error(`KNote:不存在${date}的日记，请新建`)
      }
    })
  }

  const sendToSiYuan = async (knote: KNoteModel) => {
    if (!dailyNotebookId.value) {
      return message.error('KNote:请先设置思源笔记本')
    }
    if (!selectDateDailyDocId.value) {
      return message.error('KNote:当天日记不存在，新建失败')
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

    // 构造一个假的hath，适配按日期分组的功能
    knote.hpath = `/daily note/${selectedDay.value}`
    // 优化用户体验，添加的时候直接push进数组，因为如果等待思源更新后再从思源获取，会有延迟
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
        dailyNotebookId: '',
        displayMode: 'day',
        useNewQuery: false
      })
    } else {
      // 获取配置文件内容
      const {
        dailyNotebookId: _dailyNotebookId,
        displayMode: _displayMode,
        useNewQuery: _useNewQuery
      } = await getFile({
        path: '/data/storage/petal/knote/user.knoteconf'
      })
      dailyNotebookId.value = _dailyNotebookId ?? ''
      displayMode.value = _displayMode ?? 'day'
      useNewQuery.value = _useNewQuery ?? false
    }
  }

  const saveConfig = async () => {
    putKnoteConfigFile({
      dailyNotebookId: dailyNotebookId.value,
      displayMode: displayMode.value,
      useNewQuery: useNewQuery.value
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
    saveConfig,
    displayMode,
    useNewQuery
  }
}
