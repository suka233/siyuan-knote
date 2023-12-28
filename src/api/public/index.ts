import { 向思源请求数据 } from '@/utils/request'
import type { ISetBlockAttrsParam } from '@/api/public/siyaunTypes'
enum Api {
  SQL = '/api/query/sql',
  PutFile = '/api/file/putFile',
  GetFile = '/api/file/getFile',
  ListFile = '/api/file/readDir',
  DeleteFile = '/api/file/removeFile',
  UploadAsset = '/api/asset/upload',
  renameFile = '/api/file/renameFile',
  appendBlock = '/api/block/appendBlock',
  SetBlockAttrs = '/api/attr/setBlockAttrs',
  ListNotebook = '/api/notebook/lsNotebooks',
  '创建日记' = '/api/filetree/createDailyNote'
}

/**
 * 在下级块尾部插入块
 * @see https://docs.siyuan-note.club/zh-Hans/reference/community/siyuan-sdk/kernel/api/block.html#appendblock
 */
export const appendBlock = ({ data, dataType, parentID }: { data: string; dataType: string; parentID: string }) => {
  return 向思源请求数据(Api.appendBlock, {
    data,
    dataType,
    parentID
  })
}

/**
 * 发送sql请求
 */
export const querySql = (params: string) => {
  return 向思源请求数据(Api.SQL, {
    stmt: params
  })
}

/**
 * 上传资源
 * @link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md?utm_source=ld246.com#%E4%B8%8A%E4%BC%A0%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6
 */
export const uploadAsset = ({ path = '/data/storage/petal/kmind/', file }) => {
  const formData = new FormData()
  formData.append('assetsDirPath', path)
  formData.append('file[]', file)
  return 向思源请求数据(Api.UploadAsset, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  // return http.post(Api.UploadAsset, formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  // });
}

/**
 * 写入文件
 */
export const putFile = ({ file = '', path = '/data/storage/petal/kmind/', isDir = false, modeTime = Date.now() }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formData.append('isDir', isDir)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formData.append('modeTime', modeTime)

  return 向思源请求数据(Api.PutFile, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 写入文件，直接将指定对象+名称写入
 */
export const putFileDirect = ({
  target = {},
  fileName = 'knote',
  suffix = 'knote',
  path = '/data/storage/petal/knote/',
  isDir = false,
  modeTime = Date.now()
}) => {
  const json = JSON.stringify(target)
  const blob = new Blob([json], { type: 'application/json' })
  const file = new File([blob], `${fileName}.${suffix}`, {
    type: 'application/json',
    lastModified: modeTime
  })

  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formData.append('isDir', isDir)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formData.append('modeTime', modeTime)

  return 向思源请求数据(Api.PutFile, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 写入插件版kmind文件
 */
export const putKmindFile = ({ target = {}, fileName = 'kmind' }) => {
  return putFileDirect({ target, fileName, suffix: 'kmind', path: '/data/storage/petal/kmind/' })
}
/**
 * 写入插件版kmind temp配置文件
 * 注意，思源的这个putFile接口，path要写全路径，包括文件名+后缀，不然会报错
 */
export const putKmindTempConfigFile = (target: KmindTempConfigType = {}) => {
  return putFileDirect({
    target,
    fileName: 'temp',
    suffix: 'kmindconf',
    path: '/data/storage/petal/kmind/config/temp.kmindconf'
  })
}

/**
 * 写入插件版knote配置文件
 * 注意，思源的这个putFile接口，path要写全路径，包括文件名+后缀，不然会报错
 */
export interface IKnoteConfig {
  dailyNotebookId: string
  displayMode: 'day' | 'all'
  // 思源2.11.1之后更新了给daily note添加默认属性 custom-dailynote-yyyymmdd
  useNewQuery: boolean
}
export const putKnoteConfigFile = (target?: IKnoteConfig) => {
  return putFileDirect({
    target,
    fileName: 'user',
    suffix: 'knoteconf',
    path: '/data/storage/petal/knote/user.knoteconf'
  })
}

/**
 * 列出文件
 */
export const listFile = ({ path = '/assets/' }) => {
  return 向思源请求数据(Api.ListFile, { path })
}

/**
 * 删除文件
 */
export const deleteFile = ({ path }) => {
  return 向思源请求数据(Api.DeleteFile, { path })
}

/**
 * 重命名文件
 */
export const renameFile = ({ path, newPath }) => {
  return 向思源请求数据(Api.renameFile, { path, newPath })
}

/**
 * 获取文件
 */
export const getFile = ({ path }) => {
  return 向思源请求数据(Api.GetFile, { path })
}

/**
 * 获取temp配置文件
 */
export const getKmindTempConfigFile = () => {
  return getFile({ path: '/data/storage/petal/kmind/config/temp.kmindconf' })
}

/**
 * 设置块属性
 */
export const setBlockAttrs = (params: ISetBlockAttrsParam) => {
  return 向思源请求数据(Api.SetBlockAttrs, params)
}
/**
 * 列出笔记本
 */
export const listNotebook = () => {
  return 向思源请求数据(Api.ListNotebook, {})
}

/**
 * 创建日记
 */
export const createDailyNote = (notebook) => {
  return 向思源请求数据(Api['创建日记'], { notebook })
}
