import { ModelBase } from './KNoteModelBase';
export class KNoteModel extends ModelBase {
  title?: string;
  content?: string;
  updateTime?: string;
  archiveTime?: string;
  remindTime?: string;
  customColor?: string;
  /**
   * 状态
   * 正常：normal
   * 存档：archive
   * 删除：delete
   */
  status?: string;
  /**
   * 是否置顶
   * 默认按照更新时间排序
   */
  isTop?: boolean;
  /**
   * 标签名
   * 标签颜色
   */
  tags?: Record<any, any>;
  /**
   * 创建设备，记录设备信息
   */
  createDevice?: string;
}
