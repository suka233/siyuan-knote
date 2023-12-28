// 是否展示抽屉设置栏
import { ref } from 'vue'
import {
  appendBlock,
  listFile,
  querySql,
  setBlockAttrs,
  putFile,
  putKnoteConfigFile,
  getFile,
  createDailyNote
} from '@/api/public'
import dayjs from 'dayjs'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { message, Button, notification } from 'ant-design-vue'
import { SmileOutlined } from '@ant-design/icons-vue'

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

// 今天的日记文档id
const todayDailyDocId = ref('')

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

// 面板展示维度：all,default,info,light,bell,check,wrong,warn,question,error,bug,note,pen
const panelDisplayMode = ref<
  | 'all'
  | 'default'
  | 'info'
  | 'light'
  | 'bell'
  | 'check'
  | 'wrong'
  | 'warn'
  | 'question'
  | 'error'
  | 'bug'
  | 'note'
  | 'pen'
>('all')

// 滚动到指定位置的方法
const scrollTo = ref<(...args: any[]) => void>()

export const useData = () => {
  const refreshSiyuanKnotes = async () => {
    // 查出所有的callout
    const daySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${selectedDay.value}' and type = 'b' limit 100000`
    const daySqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A
on B.root_id = A.root_id
where B.box = '${dailyNotebookId.value}'
and A.name like 'custom-dailynote-${dayjs(selectedDay.value).format('YYYYMMDD')}'
and B.type = 'b'
order by B.updated desc
limit 100000;`

    // 先按日期倒叙排列，再按更新时间倒叙排列
    const allSql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%' and type = 'b' ORDER BY SUBSTR(hpath, -10) DESC,updated DESC limit 100000`
    const allSqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A
on B.root_id = A.root_id
where B.box = '${dailyNotebookId.value}' 
and A.name like 'custom-dailynote-%'
and B.type = 'b'
order by A.value desc, B.updated desc
limit 100000;`

    return querySql(
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
          // hpath: item.hpath
          // knote_date: custom-dailynote-YYYYMMDD
          hpath: useNewQuery.value ? `/${dayjs(item.knote_date.split('-').pop()).format('YYYY-MM-DD')}` : item.hpath
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
    const daySqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A on B.root_id = A.root_id where B.box = '${
      dailyNotebookId.value
    }' and A.name like 'custom-dailynote-${dayjs(date).format('YYYYMMDD')}' and B.type = 'd' order by A.value desc;`
    // const allSql = `select * from blocks where box = "${dailyNotebookId.value}" and hpath like "/daily note/%${date}" and type = 'd'`
    // 获取指定日期的日记文档id
    await querySql(useNewQuery.value ? daySqlNew : daySql).then((res) => {
      if (res.data.length) {
        if (res.data.length > 1) {
          message.info(`KNote:当前笔记本下存在多个${date}的日记，请检查`)
        }
        selectDateDailyDocId.value = res.data[0].id
        // 存在
        return res.data[0]
      } else {
        return message.error(`KNote:不存在${date}的日记，请新建`)
      }
    })

    const todaySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${today.value}' and type = 'd'`
    const todaySqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A on B.root_id = A.root_id where B.box = '${
      dailyNotebookId.value
    }' and A.name like 'custom-dailynote-${dayjs(today.value).format(
      'YYYYMMDD'
    )}' and B.type = 'd' order by A.value desc;`
    // 获取当天的日记文档id
    return await querySql(useNewQuery.value ? todaySqlNew : todaySql).then((res) => {
      if (res.data.length) {
        if (res.data.length > 1) {
          message.info(`KNote:当前笔记本下存在多个${today.value}的日记，请检查`)
        }
        todayDailyDocId.value = res.data[0].id
        // 存在
        return res.data[0]
      } else {
        return message.error({
          content: () => {
            const handleClick = () => {
              createTodayDailyNote()
            }
            return (
              <span>
                {`KNote:不存在${today.value}的日记，请手动新建或者`}
                <Button type={`link`} onClick={handleClick}>
                  点我一键新建
                </Button>
              </span>
            )
          }
        })
      }
    })
  }

  const getTodayDailyDocId = async () => {
    const todaySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${today.value}' and type = 'd'`
    const todaySqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A on B.root_id = A.root_id where B.box = '${
      dailyNotebookId.value
    }' and A.name like 'custom-dailynote-${dayjs(today.value).format(
      'YYYYMMDD'
    )}' and B.type = 'd' order by A.value desc;`
    // 获取当天的日记文档id
    return await querySql(useNewQuery.value ? todaySqlNew : todaySql).then((res) => {
      if (res.data.length) {
        if (res.data.length > 1) {
          message.info(`KNote:当前笔记本下存在多个${today.value}的日记，请检查`)
        }
        todayDailyDocId.value = res.data[0].id
        // 存在
        return res.data[0]
      } else {
        return message.error({
          content: () => {
            const handleClick = () => {
              createTodayDailyNote()
            }
            return (
              <span>
                {`KNote:不存在${today.value}的日记，请手动新建或者`}
                <Button type={`link`} onClick={handleClick}>
                  点我一键新建
                </Button>
              </span>
            )
          }
        })
      }
    })
  }

  const sendToSiYuan = async (knote: KNoteModel, docId: string = todayDailyDocId.value) => {
    if (!dailyNotebookId.value) {
      return message.error('KNote:请先设置思源笔记本')
    }
    if (!docId) {
      return message.error('KNote:当天日记不存在，新建失败')
    }
    // 如果存在
    // 先插入到思源
    const res = await appendBlock({
      dataType: 'markdown',
      // parentID: '20231113112300-s2a6pi6',
      parentID: docId,
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
    knote.hpath = `/daily note/${docId === todayDailyDocId.value ? today.value : selectedDay.value}`
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

  // 创建今日笔记
  const createTodayDailyNote = async () => {
    createDailyNote(dailyNotebookId.value).then((res) => {
      // 赋值todayDailyDocId
      console.log(res)
      todayDailyDocId.value = res.data.id
      message.success('KNote:今日日记创建成功')
    })
  }

  // 跨天自动提醒并清空todayDailyDocId,递归调用自己
  const newDayNotify = async () => {
    const now = dayjs()
    const tomorrow = now.add(1, 'day').startOf('day')
    const ms = tomorrow.diff(now)
    console.log(`knote:${ms}毫秒后刷新`)
    setTimeout(async () => {
      // 查出todayDailyDocId下有多少条callout数据
      // 查出所有的callout
      const daySql = `select * from blocks where box = '${dailyNotebookId.value}' and hpath like '/daily note/%${today.value}' and type = 'b' limit 100000`
      const daySqlNew = `select B.*,A.name as knote_date from blocks as B join attributes as A
on B.root_id = A.root_id
where B.box = '${dailyNotebookId.value}'
and A.name like 'custom-dailynote-${dayjs(today.value).format('YYYYMMDD')}'
and B.type = 'b'
order by B.updated desc
limit 100000;`
      const res = await querySql(useNewQuery.value ? daySqlNew : daySql)
      // 计数，有多少条callout
      const count = res.data.length
      // 清空todayDailyDocId
      todayDailyDocId.value = ''
      // today加一天
      today.value = dayjs(today.value).add(1, 'day').format('YYYY-MM-DD')
      // 弹出notify
      const notifyKey = `open${Date.now()}`
      notification.open({
        key: notifyKey,
        message: '🎉New Day~',
        description: `昨天您增加了${count}条Callout，记得整理哦`,
        icon: <SmileOutlined style={{ color: '#1677ff' }} />,
        duration: null,
        btn: () => {
          const handleAdd = () => {
            createTodayDailyNote()
            notification.close(notifyKey)
          }
          return (
            <Button type={`primary`} size={`small`} onClick={handleAdd}>
              点我新建今天的日记文档
            </Button>
          )
        }
      })
      // 递归调用
      newDayNotify()
    }, ms)
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
    useNewQuery,
    panelDisplayMode,
    scrollTo,
    todayDailyDocId,
    createTodayDailyNote,
    getTodayDailyDocId,
    newDayNotify
  }
}
