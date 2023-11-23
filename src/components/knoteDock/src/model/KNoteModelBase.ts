// import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

export class ModelBase {
  /**
   * 时间戳+uuid
   */
  id: string
  /**
   * 创建的时间戳
   */
  createTime: string
  /**
   * 展示模式
   * 胶囊模式：simple
   * 查看模式：detail
   * 编辑模式：edit
   * 标签编辑模式：sticky
   * 思源中读取的数据的胶囊模式：siyuanSimple
   * 思源中读取的数据的查看模式：siyuanDetail
   */
  showMode: string
  /**
   * 类型
   * 信息：info
   * 灵感：inspiration
   * 提醒：remind
   * 正确：correct
   * 错误：error
   * 警告：warning
   * 问题：question
   * 禁止：prohibit
   * BUG：bug
   * 注记：note
   * 记录：record
   * 默认：default
   */
  type: string
  constructor() {
    this.id = `${dayjs().valueOf()}-${uuidv4().split('-')[0]}`
    this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
    this.showMode = 'simple'
    // 默认为info
    // TODO 可以通过配置更改默认设置
    this.type = 'info'
  }
}
