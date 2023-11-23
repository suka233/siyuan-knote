import {
  listFile,
  putFile,
  deleteFile as delFile,
  renameFile as rename,
  getFile,
  putKmindTempConfigFile,
  getKmindTempConfigFile
} from '@/api/public'
import { ref } from 'vue'
import { message } from 'ant-design-vue'

export const useFile = () => {
  const kmindFiles = ref<Record<any, any>[]>([])

  // 初始化kmind目录
  const initKmindDir = async () => {
    const { data } = await listFile({ path: '/data/storage/petal' })

    // 如果不存在kmind目录，则创建
    if (!(data as Array<Record<any, any>>).find((item) => item.name === 'kmind' && item.isDir === true)) {
      // 创建kmind目录
      await putFile({ path: '/data/storage/petal/kmind', isDir: true })

      // 创建kmind/config目录
      await putFile({ path: '/data/storage/petal/kmind/config', isDir: true })
      // 创建kmind/config/temp.kmindconf文件
      await putKmindTempConfigFile({
        newFeatNotify: {}
      })
    } else {
      // 如果存在kmind目录，则检查是否存在kmind/config目录
      const { data } = await listFile({ path: '/data/storage/petal/kmind' })

      // 如果不存在config目录，则创建
      if (!(data as Array<Record<any, any>>).find((item) => item.name === 'config' && item.isDir === true)) {
        // 创建kmind/config目录
        await putFile({ path: '/data/storage/petal/kmind/config', isDir: true })
        // 创建kmind/config/temp.kmindconf文件
        await putKmindTempConfigFile({
          newFeatNotify: {}
        })
      } else {
        // 如果存在config目录，则检查是否存在temp.kmindconf文件
        const { data } = await listFile({ path: '/data/storage/petal/kmind/config' })

        // 如果不存在temp.kmindconf文件，则创建
        if (!(data as Array<Record<any, any>>).find((item) => item.name === 'temp.kmindconf' && item.isDir === false)) {
          // 创建kmind/config/temp.kmindconf文件
          await putKmindTempConfigFile({
            newFeatNotify: {}
          })
        }
      }
    }
  }

  // 列出文件夹下的所有文件
  const listKmindFiles = async () => {
    await initKmindDir()

    await listFile({ path: '/data/storage/petal/kmind' }).then(({ data }) => {
      const temp: Record<any, any>[] = []
      data.forEach((item) => {
        if (item.name.endsWith('.kmind')) {
          temp.push({
            label: item.name.replace('.kmind', ''),
            value: item.name,
            path: `/data/storage/petal/kmind/${item.name}`
          })
        }
      })
      kmindFiles.value = temp
    })
  }

  // 删除文件
  const deleteFile = async (name: string) => {
    await delFile({ path: `/data/storage/petal/kmind/${name}.kmind` })
      .then(() => {})
      .catch((err) => {
        console.log(err)
        message.error('删除失败')
      })
  }

  // 重命名
  const renameFile = async (oldName: string, newName: string) => {
    await rename({
      path: `/data/storage/petal/kmind/${oldName}.kmind`,
      newPath: `/data/storage/petal/kmind/${newName}.kmind`
    })
      .then(() => {})
      .catch((err) => {
        console.log(err)
        message.error('重命名失败')
      })
  }

  // 是否存在kmind挂件
  const isExistKmindWidget = async () => {
    return await listFile({ path: '/data/widgets' }).then(async ({ data }) => {
      // 如果不存在Kmind目录，则说明没安装Kmind挂件
      return (data as Array<Record<any, any>>).find((item) => item.name === 'Kmind' && item.isDir === true)
    })
  }

  // 获取本地文件的配置:当前版本号
  const getLocalVersion = async (target = 'plugin') => {
    if (target === 'plugin') {
      const { version } = await getFile({ path: '/data/plugins/kmind-plugin/plugin.json' })
      return version
    } else {
      // 获取的是挂件版本
      const { version } = await getFile({ path: '/data/widgets/Kmind/widget.json' })
      return version
    }
  }

  // 获取本地文件的配置:是否展示过新功能通知
  const isShowNewFeatNotify = async (version?: string) => {
    if (!version) {
      // 没传入version，则使用本地版本
      const version = await getLocalVersion()
      const tempConf = await getKmindTempConfigFile()
      return tempConf?.newFeatNotify?.[version]
    } else {
      // 传入了version，则使用传入的version
      const tempConf = await getKmindTempConfigFile()
      return tempConf?.newFeatNotify?.[version]
    }
  }

  // 设置本地文件的配置:是否展示过新功能通知
  const setShowNewFeatNotify = async (version?: string) => {
    if (!version) {
      const version = await getLocalVersion()
      const tempConf = await getKmindTempConfigFile()
      tempConf.newFeatNotify[version] = true
      await putKmindTempConfigFile(tempConf)
    } else {
      const tempConf = await getKmindTempConfigFile()
      tempConf.newFeatNotify[version] = true
      await putKmindTempConfigFile(tempConf)
    }
  }

  return {
    listKmindFiles,
    kmindFiles,
    deleteFile,
    renameFile,
    isExistKmindWidget,
    isShowNewFeatNotify,
    setShowNewFeatNotify
  }
}
