import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getFile } from '/src/components/kmindTab/src/api/public'
import { message } from 'ant-design-vue'
import store from '/src/components/kmindTab/src/store'
import { putFile } from '@/api/public'
import dayjs from 'dayjs'
// import * as process from 'process';

export const useNamedPublicStore = {}
export const creatNamedPublicStore = (name: string) => {
  useNamedPublicStore[name] = defineStore(name, () => {
    // region 环境相关
    const debuggerMode = ref<boolean>(false)
    const isDev = computed(() => {
      // return false;
      // return process?.env?.NODE_ENV === 'development' || debuggerMode.value;
      return debuggerMode.value
    })
    // endregion

    // region map相关
    // const kmind = ref<any>();
    const treeData = ref()
    // 初始化导图的配置
    const localConfig = ref<KmindLocaleConfigType>({
      // 是否开启禅模式
      isZenMode: false,
      // 是否全屏，此项不需要同步存储
      isFullScreen: false
    })

    const backEnd = ref<boolean>(true)
    const forwardEnd = ref<boolean>(true)
    const backForwardLength = ref<number>(0)
    const setBackForwardStatus = (activeHistoryIndex, length) => {
      // 这里是为了修复map本身的bug:当调用FORWARD的时候，length为undefined
      if (length) {
        backForwardLength.value = length
      }
      backEnd.value = activeHistoryIndex <= 0
      forwardEnd.value = activeHistoryIndex >= backForwardLength.value - 1
    }

    // endregion

    // region 节点相关
    const activeNodeList = ref<any[]>([])
    // const node = ref<any>({});
    const node = computed(() => activeNodeList.value[0])
    // 复制的节点
    const copyNode = ref<any>({})
    // 复制的节点的json数据,用于跨导图复制节点信息
    const copyNodeJson = computed(() => JSON.stringify(copyNode.value))

    // 当前节点备注content
    const noteContent = ref<string>()
    // 当前节点备注left
    const noteLeft = ref<string>()
    // 当前节点备注top
    const noteTop = ref<string>()
    // 当前节点备注显示隐藏
    const noteVisible = ref<boolean>(false)
    // 当前节点normal态的style
    const nodeNormalStyle = ref({
      shape: '',
      paddingX: 0,
      paddingY: 0,
      color: '',
      fontFamily: '',
      fontSize: '',
      lineHeight: '',
      textDecoration: '',
      fontWeight: '',
      fontStyle: '',
      borderWidth: '',
      borderColor: '',
      fillColor: '',
      borderDasharray: '',
      borderRadius: '',
      lineColor: '',
      lineDasharray: '',
      lineWidth: ''
    })
    // 当前节点active态的style
    const nodeActiveStyle = ref<Record<string, any>>({})

    // 保存备注相关信息
    const setNoteInfo = ({
      content,
      left,
      top,
      visible
    }: {
      content?: string
      left?: string
      top?: string
      visible: boolean
    }) => {
      if (visible) {
        noteVisible.value = visible
        noteContent.value = content
        noteLeft.value = left
        noteTop.value = top
      } else {
        noteVisible.value = visible
      }
    }

    // 最后一次点击到节点的left
    const lastClickNodeLeft = ref<string>()
    // 最后一次点击到节点的top
    const lastClickNodeTop = ref<string>()
    const setLastClickNodeInfo = ({ left, top }) => {
      lastClickNodeLeft.value = left
      lastClickNodeTop.value = top
    }

    // endregion

    // region 保存与读取本地数据

    // 挂件所在块id
    const blockID = ref<string>('')
    const mindMapData = ref<MapFullDataType>()
    const filePath = ref<string>('')
    // const dataAssets = ref<string>('')
    const fileName = ref<string>('')
    const saveLoading = ref<boolean>(false)
    const lastSaveTime = ref<string>('')
    // 保存mindMap数据到挂件所在块
    // TODO 多Tab页导图
    const saveMindMapData = async ({ data }: { data: MapFullDataType }) => {
      mindMapData.value = data

      // 保存到本地文件
      const kmindData: KmindFullDataType = {
        kmind: {
          saveType: 'file',
          filePath: filePath.value,
          localeConfig: localConfig.value
        },
        ...data
      }
      const json = JSON.stringify(kmindData)
      const blob = new Blob([json], { type: 'application/json' })
      const file = new File([blob], `${fileName.value}.kmind`, {
        type: 'application/json',
        lastModified: Date.now()
      })

      saveLoading.value = true
      await putFile({ file, path: `/data/storage/petal/kmind/${fileName.value}.kmind` })
        .then(() => {
          saveLoading.value = false
          lastSaveTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
        .catch((e) => {
          message.error('导图数据保存失败，请手动导出备份数据！')
          console.log(e)
        })
    }

    const init = async () => {
      const getFileFromSiyuan = async ({ path, tip }) => {
        await getFile({ path })
          .then((res) => {
            mindMapData.value = res || {}
            // 老版本数据没有kmind字段，需要兼容
            // TODO：初始化localConfig为用户已经存储在挂件文件夹下的默认值
            localConfig.value = res?.kmind?.localeConfig ?? {
              isZenMode: false,
              isFullScreen: false
            }
          })
          .catch((e) => {
            message.error(`从本地读取导图数据失败，请检查此挂件的自定义属性的${tip}是否正确!`)
            console.log(e)
          })
      }
      // filePath.value = path
      await getFileFromSiyuan({
        path: filePath.value,
        tip: 'data-assets'
      })
    }

    // endregion

    // region sidebar样式相关
    const activeSidebar = ref<string>('')
    const setActiveSidebar = (name: string) => {
      activeSidebar.value = name
    }

    // endregion

    // region 右键菜单相关
    const ctxMenuLeft = ref<string>()
    const ctxMenuTop = ref<string>()
    const ctxMenuVisible = ref<boolean>(false)
    const ctxMenuType = ref<'map' | 'node'>()

    // endregion

    return {
      copyNode,
      copyNodeJson,
      noteLeft,
      noteTop,
      noteContent,
      noteVisible,
      nodeNormalStyle,
      nodeActiveStyle,
      setNoteInfo,
      lastClickNodeLeft,
      lastClickNodeTop,
      setLastClickNodeInfo,
      saveMindMapData,
      saveLoading,
      lastSaveTime,
      blockID,
      mindMapData,
      filePath,
      fileName,
      isDev,
      node,
      activeNodeList,
      treeData,
      localConfig,
      backEnd,
      forwardEnd,
      setBackForwardStatus,
      activeSidebar,
      setActiveSidebar,
      ctxMenuLeft,
      ctxMenuTop,
      ctxMenuVisible,
      ctxMenuType,
      init
    }
  })
  return useNamedPublicStore[name]
}

export const useNamedPublicStoreWithOut = (name: string) => {
  return creatNamedPublicStore(name)(store)
  // return useNamedPublicStore[name](store)
}
